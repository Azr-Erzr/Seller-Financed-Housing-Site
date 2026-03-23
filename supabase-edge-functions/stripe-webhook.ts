// supabase/functions/stripe-webhook/index.ts
// Mega-Batch D (Batch 21b) — Stripe Webhook handler.
// Deploy via Supabase Dashboard → Edge Functions → New Function.
// Required secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY
//
// After deploying, set the webhook URL in Stripe Dashboard:
// Stripe → Webhooks → Add endpoint → URL: https://[project].supabase.co/functions/v1/stripe-webhook
// Events to listen for: checkout.session.completed, customer.subscription.deleted

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Simple Stripe signature verification (production should use stripe-node)
async function verifySignature(payload: string, sigHeader: string): Promise<boolean> {
  if (!STRIPE_WEBHOOK_SECRET) return true; // Skip verification in dev
  try {
    const parts = sigHeader.split(",").reduce((acc: Record<string, string>, part) => {
      const [key, val] = part.split("=");
      acc[key] = val;
      return acc;
    }, {});
    const timestamp = parts["t"];
    const signature = parts["v1"];
    if (!timestamp || !signature) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(STRIPE_WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
    const expected = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return expected === signature;
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const payload = await req.text();
  const sigHeader = req.headers.get("stripe-signature") || "";

  // Verify webhook signature
  const valid = await verifySignature(payload, sigHeader);
  if (!valid) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(payload);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { plan_type, plan_id, user_id, listing_id } = session.metadata || {};

        // Record payment
        await supabase.from("payments").insert({
          user_id: user_id || null,
          email: session.customer_email || session.customer_details?.email || null,
          plan_type,
          plan_id,
          stripe_session_id: session.id,
          stripe_customer_id: session.customer || null,
          amount_cents: session.amount_total || 0,
          currency: session.currency || "cad",
          status: "completed",
        });

        // Apply the plan
        if (plan_type === "listing" && listing_id) {
          const featuredUntil = new Date();
          featuredUntil.setDate(featuredUntil.getDate() + 30);

          // Try residential first, then commercial
          const { error: err1 } = await supabase
            .from("listings")
            .update({ featured_plan: plan_id, featured_until: featuredUntil.toISOString() })
            .eq("id", listing_id);

          if (err1) {
            await supabase
              .from("commercial_listings")
              .update({ featured_plan: plan_id, featured_until: featuredUntil.toISOString() })
              .eq("id", listing_id);
          }
        }

        if (plan_type === "partner" && user_id) {
          await supabase
            .from("partners")
            .update({ premium_plan: plan_id, premium_active: true })
            .eq("user_id", user_id);
        }

        if (plan_type === "verification" && user_id) {
          // Mark expedited — actual verification still manual
          await supabase
            .from("profiles")
            .update({ verification_expedited: true })
            .eq("user_id", user_id);

          await supabase
            .from("commercial_profiles")
            .update({ verification_expedited: true })
            .eq("user_id", user_id);
        }

        break;
      }

      case "customer.subscription.deleted": {
        // Partner subscription cancelled — downgrade to free
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Find user by Stripe customer ID in payments table
        const { data: paymentRows } = await supabase
          .from("payments")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .eq("plan_type", "partner")
          .limit(1);

        if (paymentRows?.[0]?.user_id) {
          await supabase
            .from("partners")
            .update({ premium_plan: "free", premium_active: false })
            .eq("user_id", paymentRows[0].user_id);
        }

        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// supabase/functions/create-checkout-session/index.ts
// Mega-Batch D (Batch 21b) — Stripe Checkout Session creation.
// Deploy via Supabase Dashboard → Edge Functions → New Function.
// Required secrets: STRIPE_SECRET_KEY, SITE_URL
//
// This edge function receives a plan type + plan ID from the frontend,
// maps it to a Stripe Price ID, creates a Checkout Session, and returns
// the session URL for redirect.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const SITE_URL = Deno.env.get("SITE_URL") || "https://sel-fi.ca";

// ── Stripe Price ID mapping ─────────────────────────────────────────
// Set these after creating Products + Prices in Stripe Dashboard.
// Format: Stripe Dashboard → Products → Create Product → Add Price → Copy price ID
const PRICE_MAP: Record<string, Record<string, string>> = {
  listing: {
    featured: "", // → "price_xxxx" after Stripe setup
    premium: "",  // → "price_yyyy" after Stripe setup
  },
  partner: {
    premium: "",  // → "price_zzzz" (recurring monthly)
  },
  verification: {
    expedited: "", // → "price_wwww" (one-time)
  },
};

// ── Mode mapping for recurring vs one-time ──────────────────────────
const RECURRING_PLANS: Record<string, boolean> = {
  "listing:featured": false,   // one-time 30-day
  "listing:premium": false,    // one-time 30-day
  "partner:premium": true,     // monthly subscription
  "verification:expedited": false, // one-time
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { planType, planId, userId, userEmail, listingId, returnUrl } = await req.json();

    // Validate inputs
    if (!planType || !planId) {
      return new Response(
        JSON.stringify({ error: "Missing planType or planId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const priceId = PRICE_MAP[planType]?.[planId];
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: `No Stripe price configured for ${planType}:${planId}. Set up Stripe Products first.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: "Stripe not configured. Set STRIPE_SECRET_KEY in Edge Function secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isRecurring = RECURRING_PLANS[`${planType}:${planId}`] || false;
    const successUrl = returnUrl || `${SITE_URL}/account?payment=success`;
    const cancelUrl = `${SITE_URL}/pricing?payment=cancelled`;

    // Build Stripe Checkout Session params
    const params = new URLSearchParams();
    params.append("mode", isRecurring ? "subscription" : "payment");
    params.append("success_url", successUrl);
    params.append("cancel_url", cancelUrl);
    params.append("line_items[0][price]", priceId);
    params.append("line_items[0][quantity]", "1");

    if (userEmail) {
      params.append("customer_email", userEmail);
    }

    // Metadata for webhook processing
    params.append("metadata[plan_type]", planType);
    params.append("metadata[plan_id]", planId);
    if (userId) params.append("metadata[user_id]", userId);
    if (listingId) params.append("metadata[listing_id]", listingId);

    // Create Checkout Session via Stripe API
    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();

    if (session.error) {
      return new Response(
        JSON.stringify({ error: session.error.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

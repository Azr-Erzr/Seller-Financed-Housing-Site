// src/components/ListingUpgrade.jsx
// Mega-Batch D (Batch 21c) — Post-listing upsell panel.
// Shown after listing creation, or accessible from listing detail page.
// Renders plan comparison cards with "Upgrade" buttons that call Stripe checkout.

import React, { useState } from "react";
import { useSite } from "../context/SiteContext";
import { useAuth } from "../context/AuthContext";
import { LISTING_PLANS, createCheckoutSession } from "../lib/pricing";
import { Check, X as XIcon, Sparkles, Star, Zap, Loader2 } from "lucide-react";

export default function ListingUpgrade({ listingId, onClose }) {
  const { mode, MODES } = useSite();
  const { user } = useAuth();
  const isBusiness = mode === MODES.business;
  const [loading, setLoading] = useState(null); // plan id being processed

  const accent = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-600" : "bg-blue-600";
  const accentHover = isBusiness ? "hover:bg-emerald-700" : "hover:bg-blue-700";

  const plans = [
    { ...LISTING_PLANS.free, highlight: false },
    { ...LISTING_PLANS.featured, highlight: true },
    { ...LISTING_PLANS.premium, highlight: false },
  ];

  const handleUpgrade = async (planId) => {
    if (planId === "free" || !user) return;
    setLoading(planId);
    try {
      await createCheckoutSession({
        planType: "listing",
        planId,
        userId: user.id,
        userEmail: user.email,
        listingId,
        returnUrl: `${window.location.origin}/listings/${listingId}?upgraded=true`,
      });
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
          <Sparkles className="w-4 h-4" /> Boost Your Listing
        </div>
        <h2 className="text-xl font-bold text-gray-900">Get more eyes on your property</h2>
        <p className="text-sm text-gray-500 mt-1">Featured and Premium listings get significantly more views and inquiries.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border-2 p-5 transition-all ${
              plan.highlight
                ? `${isBusiness ? "border-emerald-500 shadow-lg shadow-emerald-100" : "border-blue-500 shadow-lg shadow-blue-100"}`
                : "border-gray-200"
            }`}
          >
            {plan.highlight && (
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${accentBg} text-white text-[10px] font-bold px-3 py-0.5 rounded-full`}>
                MOST POPULAR
              </div>
            )}

            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                {plan.id === "free" && <Star className="w-5 h-5 text-gray-400" />}
                {plan.id === "featured" && <Sparkles className={`w-5 h-5 ${accent}`} />}
                {plan.id === "premium" && <Zap className="w-5 h-5 text-amber-500" />}
                <h3 className="font-bold text-gray-900">{plan.name}</h3>
              </div>
              <div className="flex items-baseline justify-center gap-1">
                {plan.price === 0 ? (
                  <span className="text-2xl font-extrabold text-gray-900">Free</span>
                ) : (
                  <>
                    <span className="text-2xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="text-sm text-gray-500">{plan.pricePer}</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
            </div>

            <div className="space-y-2 mb-5">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  {f.included ? (
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <XIcon className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                  )}
                  <span className={`text-xs leading-relaxed ${f.included ? "text-gray-700" : "text-gray-400"}`}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            {plan.id === "free" ? (
              <div className="text-center">
                <span className="text-xs text-gray-400 font-medium">Current Plan</span>
              </div>
            ) : (
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                  plan.highlight
                    ? `${accentBg} ${accentHover} text-white`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {loading === plan.id ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">
        All payments are processed securely via Stripe. No commissions — flat fee only.
        Cancel anytime. Prices in CAD.
      </p>

      {onClose && (
        <div className="text-center">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Skip for now — keep my free listing
          </button>
        </div>
      )}
    </div>
  );
}

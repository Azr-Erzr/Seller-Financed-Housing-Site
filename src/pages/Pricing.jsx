// src/pages/Pricing.jsx
// Batch 12 — Public pricing page for all Sel-Fi monetization tiers.

import React from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { useRequireAuth } from "../context/AuthContext";
import {
  Check, X, Star, Sparkles, Award, Home, Building2, Shield,
  ArrowRight, HelpCircle, Clock
} from "lucide-react";
import { LISTING_PLANS, PARTNER_PLANS, VERIFICATION_PRICING } from "../lib/pricing";

function PlanCard({ plan, highlight, ctaLabel, ctaAction, accentColor }) {
  const border = highlight ? `border-2 ${accentColor === "emerald" ? "border-emerald-500" : "border-blue-500"}` : "border border-gray-200";
  const btnCls = highlight
    ? `${accentColor === "emerald" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"} text-white`
    : "bg-gray-100 text-gray-700 hover:bg-gray-200";

  return (
    <div className={`bg-white rounded-2xl ${border} p-6 flex flex-col relative`}>
      {highlight && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white ${
          accentColor === "emerald" ? "bg-emerald-600" : "bg-blue-600"
        }`}>
          Most Popular
        </div>
      )}
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
      </div>
      <div className="mb-5">
        <span className="text-3xl font-extrabold text-gray-900">
          {plan.price === 0 ? "Free" : `$${plan.price}`}
        </span>
        {plan.price > 0 && <span className="text-sm text-gray-500 ml-1">{plan.pricePer}</span>}
      </div>
      <div className="flex-1 space-y-2.5 mb-6">
        {plan.features.map(({ label, included }) => (
          <div key={label} className="flex items-start gap-2">
            {included
              ? <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              : <X className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />}
            <span className={`text-sm ${included ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
          </div>
        ))}
      </div>
      <button onClick={ctaAction}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${btnCls}`}>
        {ctaLabel}
      </button>
    </div>
  );
}

export default function Pricing() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  const requireAuth = useRequireAuth();
  usePageMeta("Pricing — Sel-Fi", "Sel-Fi listing plans, partner profiles, and verification pricing. Flat fees — no commissions.", {
    canonical: "/pricing",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Why flat fees instead of commissions?", "acceptedAnswer": { "@type": "Answer", "text": "Sel-Fi is a marketplace, not a brokerage. We connect parties — we don't broker deals. Flat fees keep our business model clearly separated from the transaction, which is both simpler for you and keeps us on the right side of Ontario's mortgage brokerage regulations." } },
        { "@type": "Question", "name": "When will paid plans be available?", "acceptedAnswer": { "@type": "Answer", "text": "Featured and Premium listing plans, Premium partner profiles, and Expedited verification are coming soon. Free tiers are available now. We'll email registered users when paid plans launch." } },
        { "@type": "Question", "name": "Can I cancel anytime?", "acceptedAnswer": { "@type": "Answer", "text": "Featured and Premium listings are 30-day periods — no recurring commitment unless you renew. Partner Premium is month-to-month and can be cancelled anytime." } },
        { "@type": "Question", "name": "Is verification really free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Standard verification (Identity, Funds, Income) is free and always will be. Expedited verification is a paid convenience for buyers who want faster review." } },
      ],
    },
  });

  const accent = isBusiness ? "emerald" : "blue";
  const heroBg = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const heroSub = isBusiness ? "#a7f3d0" : "#bfdbfe";

  const listingPlans = Object.values(LISTING_PLANS);
  const partnerPlans = Object.values(PARTNER_PLANS);
  const verifyPlans  = Object.values(VERIFICATION_PRICING);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className={`bg-gradient-to-br ${heroBg} py-14`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-extrabold mb-3" style={{ color: "#fff" }}>
            Simple, Flat Pricing
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: heroSub }}>
            No commissions. No hidden fees. Pay a flat fee to feature your listing or
            enhance your partner profile. Free tier available for everything.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* Listing Plans */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isBusiness ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
              {isBusiness ? <Building2 className="w-5 h-5" /> : <Home className="w-5 h-5" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Listing Plans</h2>
          </div>
          <p className="text-sm text-gray-500 mb-8 ml-13">
            {isBusiness ? "For commercial vendors listing properties on Sel-Fi Business." : "For home sellers listing on Sel-Fi Homes."}
          </p>

          <div className="grid sm:grid-cols-3 gap-5">
            {listingPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                highlight={plan.id === "featured"}
                accentColor={accent}
                ctaLabel={plan.price === 0 ? "List for Free" : "Coming Soon"}
                ctaAction={() => {
                  if (plan.price === 0) {
                    requireAuth(isBusiness ? "/business/list-property" : "/list-home");
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Partner Plans */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isBusiness ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Partner Directory</h2>
          </div>
          <p className="text-sm text-gray-500 mb-8 ml-13">
            For lawyers, inspectors, appraisers, and other professionals.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
            {partnerPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                highlight={plan.id === "premium"}
                accentColor={accent}
                ctaLabel={plan.price === 0 ? "Apply to Join" : "Coming Soon"}
                ctaAction={() => {
                  if (plan.price === 0) window.location.href = "/partner-apply";
                }}
              />
            ))}
          </div>
        </div>

        {/* Verification */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isBusiness ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Buyer Verification</h2>
          </div>
          <p className="text-sm text-gray-500 mb-8 ml-13">
            Earn trust badges on your profile. Standard verification is always free.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
            {verifyPlans.map((plan) => (
              <div key={plan.id} className={`bg-white rounded-2xl border p-6 ${plan.id === "expedited" ? "border-2 border-amber-400" : "border-gray-200"}`}>
                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-sm text-gray-500 ml-1">{plan.pricePer}</span>}
                </div>
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Review: {plan.turnaround}
                </div>
                <div className="space-y-2">
                  {plan.features.map(({ label, included }) => (
                    <div key={label} className="flex items-start gap-2">
                      {included
                        ? <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        : <X className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />}
                      <span className={`text-sm ${included ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Questions</h2>
          <div className="space-y-5 text-sm">
            {[
              { q: "Why flat fees instead of commissions?", a: "Sel-Fi is a marketplace, not a brokerage. We connect parties — we don't broker deals. Flat fees keep our business model clearly separated from the transaction, which is both simpler for you and keeps us on the right side of Ontario's mortgage brokerage regulations." },
              { q: "When will paid plans be available?", a: "Featured and Premium listing plans, Premium partner profiles, and Expedited verification are coming soon. Free tiers are available now. We'll email registered users when paid plans launch." },
              { q: "Can I cancel anytime?", a: "Featured and Premium listings are 30-day periods — no recurring commitment unless you renew. Partner Premium is month-to-month and can be cancelled anytime." },
              { q: "Is verification really free?", a: "Yes. Standard verification (Identity, Funds, Income) is free and always will be. Expedited verification is a paid convenience for buyers who want faster review." },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="font-semibold text-gray-900 mb-1 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" /> {q}
                </p>
                <p className="text-gray-600 leading-relaxed ml-6">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`rounded-2xl p-8 text-center ${isBusiness ? "bg-emerald-50" : "bg-blue-50"}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to get started?</h3>
          <p className="text-sm text-gray-600 mb-5">List your property for free. Upgrade when you're ready for more visibility.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => requireAuth(isBusiness ? "/business/list-property" : "/list-home")}
              className={`inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold text-sm transition-colors ${
                isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
              }`}>
              {isBusiness ? "List a Property" : "List Your Home"} <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/partner-apply" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors">
              Apply as Partner
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed text-center">
            All prices in CAD. Sel-Fi charges flat fees for listing visibility and partner placement.
            Sel-Fi does not charge commissions, referral fees, or transaction-based fees.
            Sel-Fi is not a real estate brokerage, mortgage broker, or lender.
          </p>
        </div>
      </div>
    </div>
  );
}

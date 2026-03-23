// src/pages/tools/InvestorOnboarding.jsx
// Batch 11 — Commercial investor onboarding with VTB structuring education.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import { usePageMeta } from "../../hooks/usePageMeta";
import {
  TrendingUp, DollarSign, Shield, Clock, Building2, ArrowRight,
  ChevronDown, ChevronUp, Scale, BarChart3, Landmark
} from "lucide-react";

function Accordion({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <span className="flex-1 font-semibold text-gray-900 text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{children}</div>}
    </div>
  );
}

export default function InvestorOnboarding() {
  const { mode, MODES } = useSite();
  usePageMeta("Commercial Investor Guide — Sel-Fi Business", "VTB structuring, capital gains deferral, and due diligence for commercial real estate investors.");

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Building2 className="w-4 h-4" /> For Commercial Investors
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#fff" }}>
            VTB Structuring for Commercial Deals
          </h1>
          <p className="text-lg" style={{ color: "#a7f3d0" }}>
            Capital gains deferral, deal structures, and what to know before listing or buying.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Why VTB for commercial */}
        <div className="bg-emerald-50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Why VTB works for commercial real estate</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { Icon: Clock, title: "Faster closing", body: "No bank underwriting timeline. Motivated parties can close in weeks, not months." },
              { Icon: DollarSign, title: "Tax-efficient", body: "Capital gains reserve may allow spreading recognition over the payment term. Consult your accountant." },
              { Icon: TrendingUp, title: "Yield-generating", body: "The vendor earns interest income secured against property they know well." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="bg-white rounded-xl p-4 border border-emerald-100">
                <Icon className="w-5 h-5 text-emerald-600 mb-2" />
                <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Structuring topics */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Deal structuring essentials</h2>

          <Accordion title="Capital Gains Reserve (CRA)" icon={BarChart3} defaultOpen={true}>
            <p className="mb-3">
              When selling property at a gain, the CRA allows vendors to claim a capital gains reserve
              if proceeds are received over time (as in a VTB). This can spread the taxable gain over
              up to 5 years (10 years for qualifying farm property or small business shares).
            </p>
            <p className="mb-3">
              The reserve is calculated based on the portion of proceeds not yet received. Each year,
              you include a minimum of 1/5 (or 1/10 for farms) of the gain in income, plus any amounts
              received that year beyond the minimum.
            </p>
            <p className="text-amber-600 font-medium">
              This is a significant tax planning opportunity. The exact structure and timing should be
              designed with your accountant before the deal closes — not after.
            </p>
          </Accordion>

          <Accordion title="First vs. Second Position" icon={Shield}>
            <p className="mb-3">
              If the buyer has a bank mortgage AND a VTB, the bank's mortgage is typically in first position
              (senior claim). The VTB would be in second position, meaning in a default scenario, the bank
              gets paid first.
            </p>
            <p className="mb-3">
              For vendors: second position carries more risk. You may want to require a larger down payment,
              charge a higher rate, or negotiate terms that improve your security (e.g., shorter term,
              personal guarantee, cross-collateralization).
            </p>
            <p>
              For buyers: a first-position VTB (where no bank is involved) is simpler and gives the vendor
              more comfort — which may translate to better terms for you.
            </p>
          </Accordion>

          <Accordion title="Balloon Payments and Term Structure" icon={Clock}>
            <p className="mb-3">
              Commercial VTBs often include a balloon payment — a large lump sum due at the end of a shorter
              term (e.g., 3–5 years), even if the amortization period is longer (e.g., 20–25 years).
            </p>
            <p className="mb-3">
              Buyers must plan for refinancing or full repayment at balloon maturity. If market conditions
              or your financial situation change, refinancing may not be straightforward.
            </p>
            <p>
              Vendors should consider what happens if the buyer cannot refinance at balloon maturity —
              your lawyer can help structure remedies and extension options into the agreement.
            </p>
          </Accordion>

          <Accordion title="Due Diligence — Vendor Side" icon={Scale}>
            <p className="mb-3">
              As the vendor-lender, you should evaluate the buyer's capacity to make payments. While Sel-Fi
              does not assess creditworthiness (and you should not rely on Sel-Fi badges for this purpose),
              you can request documentation directly from the buyer.
            </p>
            <p>
              Common requests: proof of funds for down payment, income documentation (personal or corporate),
              business plan (for development land), references from previous real estate transactions.
              Your lawyer can advise on what to request and how to evaluate it.
            </p>
          </Accordion>

          <Accordion title="Due Diligence — Buyer Side" icon={Landmark}>
            <p className="mb-3">
              In a VTB deal, there's no bank requiring environmental assessments, surveys, or title insurance.
              That means you must drive your own due diligence.
            </p>
            <p>
              Essential checks: Phase 1 Environmental Site Assessment (commercial/industrial),
              survey and boundary verification, title search (your lawyer does this), zoning confirmation,
              property tax status, municipal compliance, access and easement review.
            </p>
            <p className="mt-2">
              <Link to="/guide/commercial-due-diligence" className="text-emerald-600 font-medium hover:underline">
                Read our full commercial due diligence guide →
              </Link>
            </p>
          </Accordion>
        </div>

        {/* CTAs */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center space-y-4">
          <h3 className="font-bold text-gray-900">Ready to explore commercial VTB deals?</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/business/listings" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors">
              Browse Properties <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/business/list-property" className="px-5 py-2.5 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-600 transition-colors">
              List a Property
            </Link>
            <Link to="/tools/seller-assessment" className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
              Seller Assessment
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            This guide is for educational purposes only. It does not constitute tax, legal, or financial advice.
            Capital gains reserve eligibility and amounts depend on your specific situation. Consult a licensed
            accountant and real estate lawyer before structuring any VTB transaction.
          </p>
        </div>
      </div>
    </div>
  );
}

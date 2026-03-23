// src/pages/tools/NewcomerGuide.jsx
// Batch 11 — Newcomer-specific onboarding with document checklist.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import { usePageMeta } from "../../hooks/usePageMeta";
import {
  Globe, CheckCircle, FileText, Shield, AlertTriangle, ArrowRight,
  CreditCard, Building, Users, Scale, Landmark, Clock
} from "lucide-react";

const CHECKLIST = [
  { id: "pr",     label: "Permanent residency or citizenship status confirmed", category: "Status", hint: "PR card, Canadian citizenship certificate, or work permit. Your immigration status affects property ownership rights and financing options." },
  { id: "sin",    label: "Social Insurance Number (SIN) obtained",              category: "Status", hint: "Required for tax reporting on any property you own. Apply through Service Canada." },
  { id: "bank",   label: "Canadian bank account opened",                        category: "Financial", hint: "Needed for down payment transfer, mortgage payments, and property tax payments." },
  { id: "credit", label: "Started building Canadian credit history",            category: "Financial", hint: "A secured credit card is the fastest way to start. 6+ months of history helps with any financing." },
  { id: "income", label: "Canadian income documentation available",             category: "Financial", hint: "Pay stubs, employment letter, or CRA Notice of Assessment. Self-employed: business registration + bank statements." },
  { id: "down",   label: "Down payment funds accessible in Canada",             category: "Financial", hint: "Funds should be in a Canadian account. If transferring from abroad, document the source and transfer trail." },
  { id: "lawyer", label: "Real estate lawyer identified",                       category: "Professional", hint: "Essential. Look for one with experience serving newcomer clients. Our Partner Directory can help." },
  { id: "tax",    label: "Understand your tax obligations as a property owner",  category: "Professional", hint: "Property taxes, capital gains, rental income (if applicable). Speak to an accountant." },
];

const CATEGORIES = ["Status", "Financial", "Professional"];

export default function NewcomerGuide() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  usePageMeta("Newcomer's Guide to Seller Financing — Sel-Fi", "A step-by-step guide for newcomers to Canada exploring seller-financed real estate.");

  const [checked, setChecked] = useState(new Set());

  const toggle = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const accent   = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-50" : "bg-blue-50";
  const heroBg   = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const primary  = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const progress = Math.round((checked.size / CHECKLIST.length) * 100);

  return (
    <div className="bg-white min-h-screen">
      <section className={`bg-gradient-to-br ${heroBg} py-12`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Globe className="w-4 h-4" /> For Newcomers to Canada
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#fff" }}>
            Your Path to Property Ownership
          </h1>
          <p className="text-lg" style={{ color: isBusiness ? "#a7f3d0" : "#bfdbfe" }}>
            A practical guide for newcomers exploring seller-financed real estate in Ontario.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

        {/* Why seller financing may help */}
        <div className={`${accentBg} rounded-2xl p-6 space-y-4`}>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Globe className={`w-5 h-5 ${accent}`} /> Why newcomers consider seller financing
          </h2>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              Canadian banks typically require 2+ years of Canadian credit history, documented T4 employment income,
              and a stress test that uses standard Canadian income metrics. While newcomer mortgage programs do exist
              at some banks, not every situation fits their criteria.
            </p>
            <p>
              Seller financing can offer an alternative path because the seller evaluates your situation individually.
              If you have genuine income, a real down payment, and stability — but your documentation doesn't fit the
              bank's standard format — a VTB deal may be worth exploring.
            </p>
            <p className="font-medium text-gray-900">
              Important: seller financing is not automatic or guaranteed. Rates are typically higher than bank rates (5–12%),
              and you still need to demonstrate genuine affordability. It's an alternative path, not an easier one.
            </p>
          </div>
        </div>

        {/* Key things newcomers should know */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Key things to understand</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { Icon: Landmark, title: "Title transfers to you at closing", body: "In a VTB deal, you own the property. The seller holds a registered mortgage — same as a bank would — until you pay it off." },
              { Icon: Shield, title: "Default has real consequences", body: "If you miss payments, the seller can pursue Power of Sale. Only commit if you're confident in your ability to pay consistently." },
              { Icon: Scale, title: "A lawyer is required", body: "Every VTB deal must be documented by a licensed Ontario real estate lawyer. This protects both parties. Budget $2,000–$5,000 for legal fees." },
              { Icon: CreditCard, title: "Building credit helps long-term", body: "Even with a VTB, start building Canadian credit now. You may want to refinance to a bank mortgage later at a lower rate." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className={`w-8 h-8 rounded-lg ${accentBg} ${accent} flex items-center justify-center mb-2`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive checklist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Readiness checklist</h2>
            <span className={`text-sm font-medium ${progress === 100 ? "text-green-600" : "text-gray-500"}`}>
              {checked.size} / {CHECKLIST.length} complete
            </span>
          </div>

          <div className="bg-gray-200 rounded-full h-2 mb-6">
            <div className={`h-2 rounded-full transition-all duration-300 ${progress === 100 ? "bg-green-500" : isBusiness ? "bg-emerald-500" : "bg-blue-500"}`}
              style={{ width: `${progress}%` }} />
          </div>

          {CATEGORIES.map((cat) => (
            <div key={cat} className="space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{cat}</p>
              {CHECKLIST.filter((c) => c.category === cat).map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all ${
                    checked.has(item.id) ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    checked.has(item.id) ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}>
                    {checked.has(item.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${checked.has(item.id) ? "text-green-700 line-through" : "text-gray-800"}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.hint}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}

          {progress === 100 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-green-700 mb-1">Checklist complete</p>
              <p className="text-sm text-gray-600 mb-4">You've covered the key readiness items. Time to explore listings and connect with professionals.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to={isBusiness ? "/business/listings" : "/listings"} className={`inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-lg font-medium text-sm transition-colors ${primary}`}>
                  Browse Listings <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/tools/buyer-readiness" className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
                  Take Readiness Diagnostic
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Foreign buyer note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1">Note on non-resident / foreign buyer restrictions</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Canada's Prohibition on the Purchase of Residential Property by Non-Canadians Act may restrict
                residential property purchases by non-citizens and non-permanent residents in certain areas.
                Exceptions exist for specific situations. This does not apply to commercial or agricultural land.
                Consult a lawyer about your specific eligibility before proceeding.
                <Link to="/tools/foreign-buyer-guide" className={`${accent} font-medium hover:underline ml-1`}>
                  Learn more →
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            This guide is for educational purposes only. Sel-Fi does not provide immigration, legal, or financial advice.
            Property ownership eligibility depends on your specific immigration status and circumstances.
            Always consult a licensed Ontario real estate lawyer and immigration advisor.
          </p>
        </div>
      </div>
    </div>
  );
}

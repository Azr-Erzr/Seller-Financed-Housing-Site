// src/pages/tools/ForeignBuyerGuide.jsx
// Batch 11 — Foreign buyer eligibility explainer.

import React from "react";
import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import { usePageMeta } from "../../hooks/usePageMeta";
import { Globe, CheckCircle, XCircle, AlertTriangle, ArrowRight, Building2, Home, Scale } from "lucide-react";

export default function ForeignBuyerGuide() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  usePageMeta("Foreign Buyer Eligibility — Sel-Fi", "Understand how Canada's foreign buyer restrictions affect residential and commercial property purchases.");

  const accent  = isBusiness ? "text-emerald-600" : "text-blue-600";
  const heroBg  = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const primary = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="bg-white min-h-screen">
      <section className={`bg-gradient-to-br ${heroBg} py-12`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#fff" }}>
            Foreign Buyer Eligibility in Ontario
          </h1>
          <p className="text-lg" style={{ color: isBusiness ? "#a7f3d0" : "#bfdbfe" }}>
            Understanding who can buy what — and how seller financing fits in.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Overview */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-gray-900 mb-2">Important: This is a general overview, not legal advice</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Foreign buyer restrictions in Canada are complex and change periodically. The information below
                reflects general principles as of the time of writing. Your specific eligibility depends on your
                immigration status, the property type, location, and current legislation. Always consult a licensed
                Ontario real estate lawyer before making any purchasing decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Residential */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Residential Property</h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Canada's Prohibition on the Purchase of Residential Property by Non-Canadians Act restricts
              the purchase of residential property by non-citizens and non-permanent residents in certain areas.
              This legislation has been extended and amended since its initial introduction.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">Generally CAN buy residential property:</p>
              {["Canadian citizens", "Permanent residents", "Temporary residents meeting specific criteria (consult a lawyer)", "Protected persons / refugees"].map((t) => (
                <p key={t} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {t}</p>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">Generally CANNOT buy residential property:</p>
              {["Non-Canadian individuals without PR status (with limited exceptions)", "Foreign-controlled corporations", "Entities formed outside Canada"].map((t) => (
                <p key={t} className="flex items-center gap-2 text-sm text-gray-700"><XCircle className="w-4 h-4 text-red-500 shrink-0" /> {t}</p>
              ))}
            </div>

            <p className="text-xs text-gray-500">
              Exceptions, exemptions, and specific criteria change over time. The law may have been extended,
              amended, or allowed to expire by the time you read this. Verify current status with a lawyer.
            </p>
          </div>
        </div>

        {/* Commercial */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Commercial & Agricultural Land</h2>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              The foreign buyer prohibition generally applies to residential property. Commercial buildings,
              industrial properties, vacant land zoned for non-residential use, and agricultural land are
              typically not subject to the same restrictions.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              This makes Sel-Fi Business a potentially strong option for non-resident investors interested in
              Canadian commercial real estate, development land, or agricultural properties — especially when
              combined with vendor financing that doesn't require Canadian bank qualification.
            </p>
            <p className="text-xs text-gray-500">
              Some provinces have separate rules for agricultural land ownership by non-residents.
              Ontario does not currently restrict foreign ownership of farmland, but this could change.
              Verify with a lawyer.
            </p>
          </div>
        </div>

        {/* How VTB fits */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${isBusiness ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"} flex items-center justify-center`}>
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">How Seller Financing Fits In</h2>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              Seller financing (VTB) is a deal structure — it doesn't change who is legally allowed to purchase
              property. If foreign buyer restrictions prohibit you from buying a specific type of property,
              a VTB arrangement doesn't create an exemption.
            </p>
            <p>
              However, for purchases that are permitted (commercial property, or residential property for eligible
              buyers), VTB offers an advantage: you don't need to qualify through a Canadian bank. The seller
              evaluates your situation directly, which can be especially helpful for newcomers and non-residents
              who have strong financial positions but limited Canadian banking history.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link to={isBusiness ? "/business/listings" : "/listings"} className={`inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-lg font-medium text-sm transition-colors ${primary}`}>
            Browse {isBusiness ? "Properties" : "Listings"} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/tools/newcomer-guide" className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
            Newcomer Guide
          </Link>
          <Link to="/partners?category=lawyer" className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
            Find a Lawyer
          </Link>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            This guide is for general educational purposes only. Foreign buyer restrictions are subject to change.
            Sel-Fi does not provide immigration or legal advice. Always consult a licensed Ontario real estate lawyer
            to confirm your specific eligibility before making any property purchase decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

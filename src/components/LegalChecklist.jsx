// src/components/LegalChecklist.jsx
// Mega-Batch C (Batch 17e) — Per-deal-type legal checklist.
// Displayed on ListingDetail and BusinessListingDetail sidebar.
// Shows what both parties need (lawyer, inspection, title search, etc.)
// Always includes "Consult a licensed Ontario real estate lawyer" disclaimer.

import React, { useState } from "react";
import { Scale, FileText, Search, Shield, Landmark, ClipboardCheck, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

const CHECKLIST_DATA = {
  "Seller-Finance": {
    title: "Seller-Financed Deal Checklist",
    forBuyer: [
      { icon: Scale, label: "Independent real estate lawyer", critical: true },
      { icon: Search, label: "Title search and insurance" },
      { icon: ClipboardCheck, label: "Home inspection (strongly recommended)" },
      { icon: FileText, label: "Review VTB mortgage terms with lawyer" },
      { icon: Landmark, label: "Confirm mortgage registration on title" },
      { icon: Shield, label: "Property insurance (required)" },
    ],
    forSeller: [
      { icon: Scale, label: "Independent real estate lawyer", critical: true },
      { icon: FileText, label: "Draft VTB mortgage agreement" },
      { icon: Landmark, label: "Register charge on title at Land Registry" },
      { icon: ClipboardCheck, label: "Verify buyer's down payment source" },
      { icon: Shield, label: "Require property insurance naming seller" },
    ],
  },
  "Rent-to-Own": {
    title: "Rent-to-Own Deal Checklist",
    forBuyer: [
      { icon: Scale, label: "Independent real estate lawyer", critical: true },
      { icon: FileText, label: "Review lease + option agreement" },
      { icon: ClipboardCheck, label: "Home inspection before signing" },
      { icon: Search, label: "Title search — confirm clear title" },
      { icon: Landmark, label: "Understand option fee terms (refundable?)" },
      { icon: Shield, label: "Plan for mortgage qualification at term end" },
    ],
    forSeller: [
      { icon: Scale, label: "Independent real estate lawyer", critical: true },
      { icon: FileText, label: "Draft lease-to-own agreement" },
      { icon: ClipboardCheck, label: "Define rent credit terms clearly" },
      { icon: Landmark, label: "Register option on title (recommended)" },
      { icon: Shield, label: "Maintain property insurance" },
    ],
  },
  "Lease Option": {
    title: "Lease Option Deal Checklist",
    forBuyer: [
      { icon: Scale, label: "Independent real estate lawyer", critical: true },
      { icon: FileText, label: "Review option agreement + lease separately" },
      { icon: ClipboardCheck, label: "Home inspection" },
      { icon: Search, label: "Title search and confirm encumbrances" },
      { icon: Landmark, label: "Understand option fee is typically non-refundable" },
    ],
    forSeller: [
      { icon: Scale, label: "Independent real estate lawyer", critical: true },
      { icon: FileText, label: "Draft option agreement" },
      { icon: ClipboardCheck, label: "Set option price and term clearly" },
      { icon: Shield, label: "Require tenant insurance" },
    ],
  },
  "Private Sale": {
    title: "Private Sale Checklist",
    forBuyer: [
      { icon: Scale, label: "Independent real estate lawyer", critical: true },
      { icon: Search, label: "Title search and title insurance" },
      { icon: ClipboardCheck, label: "Home inspection" },
      { icon: FileText, label: "Agreement of Purchase and Sale (via lawyer)" },
      { icon: Shield, label: "Arrange financing (bank or private)" },
    ],
    forSeller: [
      { icon: Scale, label: "Independent real estate lawyer", critical: true },
      { icon: FileText, label: "Prepare property disclosure statement" },
      { icon: ClipboardCheck, label: "Clear title of any liens/encumbrances" },
      { icon: Landmark, label: "Arrange closing through lawyer trust account" },
    ],
  },
  "Direct Private Sale": {
    title: "FSBO / Direct Sale Checklist",
    forBuyer: [
      { icon: Scale, label: "Independent real estate lawyer", critical: true },
      { icon: Search, label: "Title search and title insurance" },
      { icon: ClipboardCheck, label: "Home inspection (mandatory recommendation)" },
      { icon: FileText, label: "Agreement of Purchase and Sale" },
      { icon: Shield, label: "Arrange your own financing" },
    ],
    forSeller: [
      { icon: Scale, label: "Independent real estate lawyer", critical: true },
      { icon: FileText, label: "Property disclosure statement" },
      { icon: ClipboardCheck, label: "Accurate property information (MPAC, OnLand.ca)" },
      { icon: Landmark, label: "Engage lawyer for Agreement of Purchase and Sale" },
      { icon: Search, label: "Clear title and discharge existing mortgages" },
    ],
  },
};

// Commercial VTB checklist
const COMMERCIAL_CHECKLIST = {
  title: "Commercial VTB Deal Checklist",
  forBuyer: [
    { icon: Scale, label: "Independent real estate lawyer", critical: true },
    { icon: Search, label: "Phase 1 Environmental Site Assessment" },
    { icon: ClipboardCheck, label: "Zoning verification with municipality" },
    { icon: FileText, label: "Title search — check easements, liens, encumbrances" },
    { icon: Landmark, label: "Independent property appraisal" },
    { icon: Shield, label: "Commercial property insurance" },
  ],
  forSeller: [
    { icon: Scale, label: "Independent real estate lawyer", critical: true },
    { icon: FileText, label: "Draft VTB mortgage with balloon terms" },
    { icon: Landmark, label: "Register charge on title" },
    { icon: ClipboardCheck, label: "Environmental indemnification clause" },
    { icon: Shield, label: "Require comprehensive insurance" },
  ],
};

export default function LegalChecklist({ dealType, isBusiness = false }) {
  const [expanded, setExpanded] = useState(false);

  const checklist = isBusiness
    ? COMMERCIAL_CHECKLIST
    : CHECKLIST_DATA[dealType] || CHECKLIST_DATA["Private Sale"];

  const accent = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-50" : "bg-blue-50";
  const borderColor = isBusiness ? "border-emerald-200" : "border-blue-200";

  return (
    <div className={`${accentBg} border ${borderColor} rounded-xl overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <ClipboardCheck className={`w-4 h-4 ${accent}`} />
          <span className="text-sm font-semibold text-gray-900">{checklist.title}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* For Buyer */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              {isBusiness ? "For Buyer / Purchaser" : "For Buyer"}
            </p>
            <div className="space-y-1.5">
              {checklist.forBuyer.map(({ icon: Icon, label, critical }, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${critical ? "text-red-500" : "text-gray-400"}`} />
                  <span className={`text-xs leading-relaxed ${critical ? "text-gray-900 font-semibold" : "text-gray-600"}`}>
                    {label}
                    {critical && <span className="text-red-500 ml-1">*</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* For Seller */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              {isBusiness ? "For Vendor / Seller" : "For Seller"}
            </p>
            <div className="space-y-1.5">
              {checklist.forSeller.map(({ icon: Icon, label, critical }, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${critical ? "text-red-500" : "text-gray-400"}`} />
                  <span className={`text-xs leading-relaxed ${critical ? "text-gray-900 font-semibold" : "text-gray-600"}`}>
                    {label}
                    {critical && <span className="text-red-500 ml-1">*</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>Both parties should engage independent legal counsel.</strong> Consult a licensed
              Ontario real estate lawyer before entering any agreement. This checklist is
              educational — not legal advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// src/components/VerificationBadges.jsx
// Displays verification tier badges for a profile.
// Used on ProfileCard, CommProfileCard, ProfileDetail, BusinessProfileDetail.

import React, { useState } from "react";
import { ShieldCheck, Banknote, Briefcase, Info, CheckCircle, Clock, X } from "lucide-react";
import { VERIFICATION_TIERS, TIER_ORDER, getVerificationLevel, getVerifiedTiers, getPendingTiers } from "../lib/verification-tiers";

const ICONS = { identity: ShieldCheck, funds: Banknote, income: Briefcase };

// ── Compact inline badges (for cards) ────────────────────────────────
export function VerificationPills({ status, size = "sm" }) {
  const verified = getVerifiedTiers(status);
  const pending = getPendingTiers(status);
  if (verified.length === 0 && pending.length === 0) return null;

  const pillCls = size === "sm"
    ? "text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5"
    : "text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1";
  const iconCls = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <div className="flex flex-wrap gap-1">
      {verified.map((key) => {
        const tier = VERIFICATION_TIERS[key];
        const Icon = ICONS[key];
        return (
          <span key={key} className={`${pillCls} ${tier.bgClass}`}>
            <Icon className={iconCls} /> {tier.shortLabel}
          </span>
        );
      })}
      {pending.map((key) => {
        const tier = VERIFICATION_TIERS[key];
        return (
          <span key={key} className={`${pillCls} bg-gray-100 text-gray-500`}>
            <Clock className={iconCls} /> {tier.shortLabel}
          </span>
        );
      })}
    </div>
  );
}

// ── Verification level badge (for detail pages) ──────────────────────
export function VerificationLevelBadge({ status }) {
  const level = getVerificationLevel(status);
  if (!level) return null;

  const verified = getVerifiedTiers(status);
  const colorMap = {
    "Basic Verified": "bg-blue-100 text-blue-700 border-blue-200",
    "Verified":       "bg-green-100 text-green-700 border-green-200",
    "Fully Verified": "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1 ${colorMap[level] || "bg-gray-100 text-gray-600"}`}>
      <CheckCircle className="w-3 h-3" /> {level}
    </span>
  );
}

// ── Detailed verification panel (for detail pages) ───────────────────
export function VerificationDetailPanel({ status, isBusiness = false }) {
  const [expanded, setExpanded] = useState(null);
  const verified = getVerifiedTiers(status);
  const pending = getPendingTiers(status);
  const level = getVerificationLevel(status);

  if (verified.length === 0 && pending.length === 0) return null;

  const accent = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100";

  return (
    <div className={`${accentBg} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${accent}`} />
          <h3 className="text-sm font-semibold text-gray-900">Verification Status</h3>
        </div>
        {level && <VerificationLevelBadge status={status} />}
      </div>

      <div className="space-y-2">
        {TIER_ORDER.map((key) => {
          const tier = VERIFICATION_TIERS[key];
          const Icon = ICONS[key];
          const state = status?.[key] || "none";
          const isVerified = state === "verified";
          const isPending = state === "pending";
          const isExpanded = expanded === key;

          return (
            <div key={key}>
              <button
                onClick={() => setExpanded(isExpanded ? null : key)}
                className="w-full flex items-center gap-3 py-2 text-left"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isVerified ? tier.bgClass : isPending ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-400"
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isVerified ? "text-gray-900" : isPending ? "text-amber-700" : "text-gray-400"}`}>
                    {tier.label}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {isVerified ? "Verified" : isPending ? "Review in progress" : "Not yet submitted"}
                  </p>
                </div>
                {isVerified && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                {isPending && <Clock className="w-4 h-4 text-amber-500 shrink-0" />}
                <Info className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              </button>

              {isExpanded && (
                <div className="ml-10 mb-2 p-3 bg-white rounded-lg border border-gray-100 text-xs text-gray-500 space-y-2">
                  <p><strong className="text-gray-700">What this means:</strong> {tier.whatItMeans}</p>
                  <p><strong className="text-gray-700">What this does not mean:</strong> {tier.whatItDoesNot}</p>
                  <p><strong className="text-gray-700">Accepted documents:</strong> {tier.documents.join("; ")}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
        Verification badges confirm that documentation was submitted and appeared legitimate.
        They do not constitute an assessment of creditworthiness, financial capacity, or suitability for any transaction.
        Always conduct your own due diligence.
      </p>
    </div>
  );
}

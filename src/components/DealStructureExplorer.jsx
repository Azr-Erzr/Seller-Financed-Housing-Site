// src/components/DealStructureExplorer.jsx
// Selector-driven Deal Structure Explorer — shared between Homes and Business.
// Manual pill tabs (no autoplay). Estimate mode or workflow mode per scenario.
// Assumptions shown above every financial card. Included vs not-included separation.

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useRequireAuth } from "../context/AuthContext";
import {
  DollarSign, TrendingUp, Users, Shield, Settings, Briefcase, CheckCircle,
  UserCheck, Sliders, Banknote, Home, UserPlus, Building2, Globe,
  ArrowRightLeft, HeartHandshake, FileText, MessageSquare, Landmark,
  Check, X, ChevronRight, AlertTriangle, Info,
} from "lucide-react";
import {
  sellerFinanceEstimate, privateSaleEstimate, rentToOwnEstimate,
  hybridFinanceEstimate, fmtDeal,
} from "../lib/dealScenarioMath";

// Icon lookup — scenarios reference icons by string key
const ICON_MAP = {
  DollarSign, TrendingUp, Users, Shield, Settings, Briefcase, CheckCircle,
  UserCheck, Sliders, Banknote, Home, UserPlus, Building2, Globe,
  ArrowRightLeft, HeartHandshake, FileText, MessageSquare, Landmark,
};

// Math function lookup
const MATH_MAP = {
  sellerFinanceEstimate,
  privateSaleEstimate,
  rentToOwnEstimate,
  hybridFinanceEstimate,
};

export default function DealStructureExplorer({ scenarios, isBusiness = false, sectionTitle, sectionSubtitle }) {
  const [activeId, setActiveId] = useState(scenarios[0]?.id);
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();

  const active = scenarios.find((s) => s.id === activeId) || scenarios[0];

  // Compute estimate if applicable
  const estimate = useMemo(() => {
    if (active.cardMode !== "estimate" || !active.mathFn) return null;
    const fn = MATH_MAP[active.mathFn];
    return fn ? fn(active.defaults) : null;
  }, [active]);

  // Colors
  const pillActive = isBusiness ? "bg-emerald-600 text-white" : "bg-blue-600 text-white";
  const pillInactive = "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200";
  const accentText = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const accentLight = isBusiness ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700";
  const accentBorder = isBusiness ? "border-emerald-200" : "border-blue-200";
  const iconBg = isBusiness ? "bg-emerald-50" : "bg-blue-50";
  const iconColor = isBusiness ? "text-emerald-600" : "text-blue-600";
  const ctaPrimary = isBusiness ? "bg-amber-500 hover:bg-amber-600" : "bg-orange-500 hover:bg-orange-600";

  const handleCta = (path, authGated = true) => {
    if (authGated && path.includes("list")) {
      requireAuth(path);
    } else {
      navigate(path);
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-5">

        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {sectionTitle || (isBusiness ? "Compare vendor deal structures" : "Choose the structure that fits your sale")}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            {sectionSubtitle || (isBusiness
              ? "Compare vendor financing, direct private sale, and brokerage-assisted paths before you list."
              : "Compare direct sale, seller-financing, rent-to-own, and optional brokerage-assisted paths before you browse listings."
            )}
          </p>
        </div>

        {/* Selector pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeId === s.id ? pillActive : pillInactive
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* Left: copy + icon cards + CTAs */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{active.headline}</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{active.body}</p>

            {/* Icon cards */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {active.iconCards.map((card, i) => {
                const Icon = ICON_MAP[card.icon] || CheckCircle;
                return (
                  <div key={i} className="flex gap-3 p-3.5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-9 h-9 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">{card.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {active.primaryCta && (
                <button
                  onClick={() => handleCta(active.primaryCta.path, true)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${ctaPrimary}`}
                >
                  {active.primaryCta.label}
                </button>
              )}
              {active.secondaryCta && (
                <button
                  onClick={() => handleCta(active.secondaryCta.path, false)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold border-2 ${accentBorder} ${accentText} hover:bg-gray-50 transition-colors`}
                >
                  {active.secondaryCta.label}
                </button>
              )}
            </div>
          </div>

          {/* Right: estimate card or workflow card */}
          <div className="lg:w-[380px] shrink-0">
            {active.cardMode === "estimate" && estimate ? (
              <EstimateCard
                scenario={active}
                estimate={estimate}
                isBusiness={isBusiness}
                accentText={accentText}
                accentLight={accentLight}
                accentBg={accentBg}
              />
            ) : active.cardMode === "workflow" ? (
              <WorkflowCard
                scenario={active}
                isBusiness={isBusiness}
                accentText={accentText}
                accentLight={accentLight}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Estimate Card ───────────────────────────────────────────────────
function EstimateCard({ scenario, estimate, isBusiness, accentText, accentLight, accentBg }) {
  const totalColor = isBusiness ? "text-emerald-600" : "text-blue-600";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Title */}
      <div className="px-5 pt-5 pb-3">
        <h4 className="text-sm font-bold text-gray-900 mb-2">{scenario.estimateTitle}</h4>

        {/* Assumptions */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {scenario.assumptions.map((a, i) => (
            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Included rows */}
      <div className="px-5 space-y-2 pb-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Included in estimate</p>
        {scenario.includedRows.map((row, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
              {row.label}
            </span>
            <span className="text-sm font-semibold text-gray-900">{fmtDeal(estimate[row.key])}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className={`mx-5 mb-3 mt-1 py-3 px-4 rounded-xl ${isBusiness ? "bg-emerald-50" : "bg-blue-50"}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">{scenario.totalLabel}</span>
          <span className={`text-lg font-extrabold ${totalColor}`}>{fmtDeal(estimate[scenario.totalKey])}</span>
        </div>
      </div>

      {/* Not included */}
      <div className="px-5 pb-5 pt-2 border-t border-gray-100">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Not included</p>
        {scenario.notIncluded.map((item, i) => (
          <div key={i} className="flex items-start gap-1.5 mb-1 last:mb-0">
            <Info className="w-3 h-3 text-gray-300 shrink-0 mt-0.5" />
            <span className="text-xs text-gray-400 leading-relaxed">{item}</span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="px-5 pb-4">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Illustrative example only. Actual outcomes depend on deal terms, professional fees, and market conditions.
          Consult a licensed real estate lawyer and accountant.
        </p>
      </div>
    </div>
  );
}

// ── Workflow Card ────────────────────────────────────────────────────
function WorkflowCard({ scenario, isBusiness, accentText, accentLight }) {
  const dotColor = isBusiness ? "bg-emerald-500" : "bg-blue-500";
  const lineColor = isBusiness ? "bg-emerald-200" : "bg-blue-200";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-5">
      <h4 className="text-sm font-bold text-gray-900 mb-5">{scenario.workflowTitle}</h4>

      <div className="space-y-0">
        {scenario.workflowSteps.map((step, i) => (
          <div key={i} className="flex gap-3">
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${dotColor} shrink-0 mt-1`} />
              {i < scenario.workflowSteps.length - 1 && (
                <div className={`w-0.5 flex-1 ${lineColor} my-1`} />
              )}
            </div>
            <p className={`text-sm text-gray-700 leading-relaxed ${i < scenario.workflowSteps.length - 1 ? "pb-4" : ""}`}>
              {step}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          {isBusiness
            ? "Broker-assisted listings require a licensed brokerage relationship. Sel-Fi does not act as a broker or agent."
            : "MLS-assisted listings require a licensed brokerage or agent. Sel-Fi does not enter listings into MLS directly."
          }
        </p>
      </div>
    </div>
  );
}

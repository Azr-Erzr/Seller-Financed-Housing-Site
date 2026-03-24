// src/components/SavingsCalculator.jsx
// Mega-Batch A — Mobile stacked cards for financial results.
// Uses fmtCurrency from finance.js for consistent number formatting.

import React, { useState } from "react";
import { useSite } from "../context/SiteContext";
import { Check, X as XIcon } from "lucide-react";
import { fmtCurrency } from "../lib/finance";

const fmt = (n) => fmtCurrency(n);

function monthlyPayment(principal, annualRate, years) {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
  const r = annualRate / 12;
  const n = years * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ── Homes: Seller Calculator ──────────────────────────────────────────
function HomeSellerCalc({ accent, accentBg, ring }) {
  const [price, setPrice] = useState(650000);
  const [downPct, setDownPct] = useState(20);
  const [vtbRate, setVtbRate] = useState(7);
  const [vtbYears, setVtbYears] = useState(5);

  // Listing-side commission only — buyer-side is the buyer's arrangement
  const listingComm = price * 0.025;
  const hst = listingComm * 0.13;
  const commSavings = listingComm + hst;

  const vtbPrincipal = price * (1 - downPct / 100);
  const monthly = monthlyPayment(vtbPrincipal, vtbRate / 100, 25);

  let balance = vtbPrincipal, totalInterest = 0;
  const r = (vtbRate / 100) / 12;
  for (let m = 0; m < vtbYears * 12; m++) {
    const int = balance * r;
    totalInterest += int;
    balance -= (monthly - int);
  }

  const totalWin = commSavings + totalInterest;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Adjust to see what you save — and earn — vs. a traditional agent sale.</p>

      <div className="grid sm:grid-cols-2 gap-5">
        {[
          { id: "price", label: "Sale Price", disp: fmt(price), min: 200000, max: 2000000, step: 25000, set: setPrice, current: price },
          { id: "down", label: "Down Payment", disp: `${downPct}%`, min: 10, max: 50, step: 5, set: setDownPct, current: downPct },
          { id: "rate", label: "VTB Rate", disp: `${vtbRate}%`, min: 5, max: 12, step: 0.25, set: setVtbRate, current: vtbRate },
          { id: "term", label: "VTB Term", disp: `${vtbYears} yrs`, min: 1, max: 10, step: 1, set: setVtbYears, current: vtbYears },
        ].map(({ id, label, disp, min, max, step, set, current }) => (
          <div key={id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} <span className={`font-bold ${accent}`}>{disp}</span>
            </label>
            <input type="range" min={min} max={max} step={step}
              value={current}
              onChange={(e) => set(Number(e.target.value))}
              className={`w-full ${ring}`} />
          </div>
        ))}
      </div>

      {/* Results — stacked on mobile, 3-col on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-xs text-orange-500 font-medium uppercase tracking-wide mb-1">Listing-Side Savings</p>
          <p className="text-xl sm:text-2xl font-extrabold text-orange-700">{fmt(commSavings)}</p>
          <p className="text-xs text-orange-400 mt-1">2.5% + HST · listing side only</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-xs text-green-500 font-medium uppercase tracking-wide mb-1">Modeled Interest</p>
          <p className="text-xl sm:text-2xl font-extrabold text-green-700">{fmt(totalInterest)}</p>
          <p className="text-xs text-green-400 mt-1">{vtbYears} yr{vtbYears > 1 ? "s" : ""} at {vtbRate}%</p>
        </div>
        <div className={`border rounded-xl p-4 text-center ${accentBg === "bg-blue-600" ? "bg-blue-50 border-blue-200" : "bg-emerald-50 border-emerald-200"}`}>
          <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${accent}`}>Combined Estimate</p>
          <p className={`text-xl sm:text-2xl font-extrabold ${accent}`}>{fmt(totalWin)}</p>
          <p className={`text-xs mt-1 ${accent} opacity-70`}>savings + interest</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Included in estimate</p>
        {[
          { l: "Listing-side commission (2.5%)", v: fmt(listingComm), c: "text-green-600" },
          { l: "HST on listing commission", v: fmt(hst), c: "text-green-600" },
          { l: `Modeled interest on ${fmt(vtbPrincipal)} VTB (${vtbYears} yrs)`, v: fmt(totalInterest), c: "text-blue-600" },
          { l: "Est. monthly payment from buyer", v: `${fmt(monthly)}/mo`, c: "text-gray-700" },
        ].map(({ l, v, c }) => (
          <div key={l} className="flex justify-between items-center gap-2">
            <span className="text-gray-500 text-xs sm:text-sm">{l}</span>
            <span className={`font-semibold ${c} shrink-0`}>{v}</span>
          </div>
        ))}
        <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
          <span className="font-semibold text-gray-800 text-sm">Combined estimate</span>
          <span className={`font-extrabold text-lg sm:text-xl ${accent}`}>{fmt(totalWin)}</span>
        </div>
        <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-100">Not included: buyer-side commission · legal fees · taxes · closing costs</p>
      </div>
      <p className="text-xs text-gray-400">Illustrative only. 25-year amortization assumed. Consult a real estate lawyer and accountant.</p>
    </div>
  );
}

// ── Business: Seller Calculator ───────────────────────────────────────
function CommercialSellerCalc({ accent, ring }) {
  const [price, setPrice] = useState(1500000);
  const [downPct, setDownPct] = useState(25);
  const [vtbRate, setVtbRate] = useState(8);
  const [vtbYears, setVtbYears] = useState(3);
  const [amort, setAmort] = useState(20);
  const [commPct, setCommPct] = useState(3);

  const commSaved = price * (commPct / 100) * 1.13;
  const vtbPrin = price * (1 - downPct / 100);
  const monthly = monthlyPayment(vtbPrin, vtbRate / 100, amort);

  let balance = vtbPrin, totalInterest = 0;
  const r = (vtbRate / 100) / 12;
  for (let m = 0; m < vtbYears * 12; m++) {
    const int = balance * r;
    totalInterest += int;
    balance -= (monthly - int);
  }

  const totalWin = commSaved + totalInterest;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Commercial VTB deal math — seller/vendor perspective. Adjust for your transaction.</p>

      <div className="grid sm:grid-cols-2 gap-5">
        {[
          { label: "Sale Price", min: 300000, max: 10000000, step: 50000, val: price, set: setPrice, disp: fmt(price) },
          { label: "Down Payment", min: 15, max: 60, step: 5, val: downPct, set: setDownPct, disp: `${downPct}% (${fmt(price * downPct / 100)})` },
          { label: "VTB Rate", min: 6, max: 15, step: 0.25, val: vtbRate, set: setVtbRate, disp: `${vtbRate}%` },
          { label: "VTB Term", min: 1, max: 10, step: 1, val: vtbYears, set: setVtbYears, disp: `${vtbYears} yr${vtbYears > 1 ? "s" : ""} (balloon)` },
          { label: "Amortization", min: 5, max: 25, step: 5, val: amort, set: setAmort, disp: `${amort} years` },
          { label: "Agent Commission %", min: 2, max: 6, step: 0.5, val: commPct, set: setCommPct, disp: `${commPct}% = ${fmt(price * commPct / 100)}` },
        ].map(({ label, min, max, step, val, set, disp }) => (
          <div key={label}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} — <span className={`font-bold ${accent}`}>{disp}</span>
            </label>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(Number(e.target.value))} className={`w-full ${ring}`} />
          </div>
        ))}
      </div>

      {/* Results — stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-xs text-amber-600 font-medium uppercase mb-1">Commission Avoided</p>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-700">{fmt(commSaved)}</p>
          <p className="text-xs text-amber-400 mt-1">incl. HST on {commPct}%</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-xs text-green-500 font-medium uppercase mb-1">Modeled Interest</p>
          <p className="text-xl sm:text-2xl font-extrabold text-green-700">{fmt(totalInterest)}</p>
          <p className="text-xs text-green-400 mt-1">{vtbYears} yr balloon @ {vtbRate}%</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-xs text-emerald-500 font-medium uppercase mb-1">Combined Estimate</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700">{fmt(totalWin)}</p>
          <p className="text-xs text-emerald-400 mt-1">commission + interest</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
        {[
          { l: `Agent commission avoided (${commPct}% + HST)`, v: fmt(commSaved), c: "text-green-600" },
          { l: `VTB principal (${fmt(vtbPrin)})`, v: "", c: "" },
          { l: `Interest earned over ${vtbYears}-yr term`, v: fmt(totalInterest), c: "text-emerald-600" },
          { l: "Monthly principal + interest", v: `${fmt(monthly)}/mo`, c: "text-gray-700" },
          { l: `Balloon balance at end of ${vtbYears}-yr term`, v: fmt(Math.max(balance, 0)), c: "text-orange-600" },
        ].map(({ l, v, c }) => v ? (
          <div key={l} className="flex justify-between items-center gap-2">
            <span className="text-gray-500 text-xs sm:text-sm">{l}</span>
            <span className={`font-semibold ${c} shrink-0`}>{v}</span>
          </div>
        ) : (
          <div key={l} className="text-xs text-gray-400 pt-1 border-t border-gray-200">{l}</div>
        ))}
        <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
          <span className="font-semibold text-gray-800 text-sm">Total vendor advantage</span>
          <span className="font-extrabold text-lg sm:text-xl text-emerald-700">{fmt(totalWin)}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400">*Estimates only. Balloon/interest-only structures available — model shown is P+I. Always obtain independent legal and tax advice.</p>
    </div>
  );
}

// ── Buyer/Borrower Comparison ─────────────────────────────────────────
function BuyerCalc({ accent, accentBg, ring, isBusiness }) {
  const defaultPrice = isBusiness ? 1500000 : 600000;
  const [price, setPrice] = useState(defaultPrice);
  const [down, setDown] = useState(25);
  const [vtbRate, setVtbRate] = useState(isBusiness ? 8.5 : 7.5);
  const [bankRate, setBankRate] = useState(isBusiness ? 7.2 : 6.8);
  const [years, setYears] = useState(isBusiness ? 20 : 25);

  const downAmt = price * (down / 100);
  const loan = price - downAmt;
  const vtbMonthly = monthlyPayment(loan, vtbRate / 100, years);
  const bnkMonthly = monthlyPayment(loan, bankRate / 100, years);
  const diff = vtbMonthly - bnkMonthly;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        {isBusiness
          ? "Compare a seller-financed VTB against conventional commercial financing."
          : "Compare VTB mortgage cost vs. a traditional bank mortgage side by side."}
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        {[
          { l: `${isBusiness ? "Property" : "Home"} Price`, min: isBusiness ? 300000 : 200000, max: isBusiness ? 10000000 : 2000000, step: isBusiness ? 100000 : 25000, val: price, set: setPrice, d: fmt(price) },
          { l: "Down Payment", min: 15, max: 50, step: 5, val: down, set: setDown, d: `${down}% (${fmt(downAmt)})` },
          { l: "VTB Rate", min: 5, max: 15, step: 0.25, val: vtbRate, set: setVtbRate, d: `${vtbRate}%` },
          { l: isBusiness ? "Conv. Commercial Rate" : "Bank Rate", min: 4, max: 12, step: 0.25, val: bankRate, set: setBankRate, d: `${bankRate}%` },
        ].map(({ l, min, max, step, val, set, d }) => (
          <div key={l}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{l} — <span className={`font-bold ${accent}`}>{d}</span></label>
            <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(Number(e.target.value))} className={`w-full ${ring}`} />
          </div>
        ))}
      </div>

      {/* Comparison cards — stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`border-2 rounded-xl p-4 sm:p-5 text-center ${isBusiness ? "bg-emerald-50 border-emerald-200" : "bg-purple-50 border-purple-200"}`}>
          <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${isBusiness ? "text-emerald-500" : "text-purple-500"}`}>VTB / Seller Finance</p>
          <p className={`text-2xl sm:text-3xl font-extrabold ${isBusiness ? "text-emerald-700" : "text-purple-700"}`}>{fmt(vtbMonthly)}</p>
          <p className={`text-xs mt-1 ${isBusiness ? "text-emerald-400" : "text-purple-400"}`}>/month at {vtbRate}%</p>
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-left sm:text-center">
            <p className="text-xs text-green-600 font-semibold flex items-center gap-1"><Check className="w-3 h-3" /> No bank approval</p>
            {isBusiness
              ? <><p className="text-xs text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> Faster closing</p><p className="text-xs text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> Flexible balloon / terms</p></>
              : <><p className="text-xs text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> Self-employed welcome</p><p className="text-xs text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> Flexible qualification</p></>
            }
          </div>
        </div>
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 sm:p-5 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{isBusiness ? "Conv. Commercial" : "Bank Mortgage"}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-700">{fmt(bnkMonthly)}</p>
          <p className="text-xs text-gray-400 mt-1">/month at {bankRate}%</p>
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-left sm:text-center">
            <p className="text-xs text-red-500 flex items-center gap-1"><XIcon className="w-3 h-3" /> Environmental reports required</p>
            {isBusiness
              ? <><p className="text-xs text-red-500 flex items-center gap-1"><XIcon className="w-3 h-3" /> 60–90 day approval process</p><p className="text-xs text-red-500 flex items-center gap-1"><XIcon className="w-3 h-3" /> Rigid covenant requirements</p></>
              : <><p className="text-xs text-red-500 flex items-center gap-1"><XIcon className="w-3 h-3" /> Stress test required</p><p className="text-xs text-red-500 flex items-center gap-1"><XIcon className="w-3 h-3" /> T4 income only</p></>
            }
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-sm">
        <div className="flex justify-between mb-1 gap-2">
          <span className="text-gray-600 text-xs sm:text-sm">Monthly cost difference</span>
          <span className={`font-semibold shrink-0 ${diff > 0 ? "text-orange-600" : "text-green-600"}`}>
            {diff > 0 ? "+" : ""}{fmt(diff)}/mo
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          {diff > 0
            ? `A VTB at ${vtbRate}% costs ~${fmt(diff)}/month more than conventional financing at ${bankRate}%. For ${isBusiness ? "commercial deals, this premium is often worth it to avoid lender delays" : "many buyers, this is worth it to avoid bank rejection and get into homeownership now"}.`
            : "At these rates, the VTB is actually cheaper. You get flexibility and save money."}
        </p>
      </div>
      <p className="text-xs text-gray-400">*Illustration only. Consult a mortgage professional and real estate lawyer for your specific situation.</p>
    </div>
  );
}

// ── Capital Gains Deferral (Business only) ────────────────────────────
function CapGainsDeferral({ accent }) {
  const [price, setPrice] = useState(2000000);
  const [acb, setAcb] = useState(500000);
  const [vtbYears, setVtbYears] = useState(5);

  const gain = Math.max(price - acb, 0);
  const taxableGain = gain * 0.5;
  const estimatedTax = taxableGain * 0.27;
  const annualReceipt = price / vtbYears;
  const annualGain = (gain / price) * annualReceipt;
  const deferredTaxPerYear = (annualGain * 0.5) * 0.27;
  const totalTaxDeferral = estimatedTax - deferredTaxPerYear;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        A VTB lets you spread capital gains recognition over the payment term — potentially deferring
        a significant tax liability. Model your situation below (always confirm with your accountant).
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        {[
          { l: "Sale Price", min: 500000, max: 15000000, step: 100000, val: price, set: setPrice, d: fmt(price) },
          { l: "Adjusted Cost Base (ACB)", min: 100000, max: price, step: 50000, val: acb, set: setAcb, d: fmt(acb) },
          { l: "VTB Term (years)", min: 1, max: 10, step: 1, val: vtbYears, set: setVtbYears, d: `${vtbYears} years` },
        ].map(({ l, min, max, step, val, set, d }) => (
          <div key={l}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{l} — <span className={`font-bold ${accent}`}>{d}</span></label>
            <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(Number(e.target.value))} className="w-full accent-emerald-600" />
          </div>
        ))}
      </div>

      {/* Capital gains results — 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: "Total Capital Gain", v: fmt(gain), note: "Sale price minus ACB", c: "text-gray-900" },
          { l: "Taxable Gain (50%)", v: fmt(taxableGain), note: "At current inclusion rate", c: "text-orange-600" },
          { l: "Est. Tax if Lump Sum", v: fmt(estimatedTax), note: "~27% on taxable gain", c: "text-red-600" },
          { l: "Tax Deferred — Yr 1", v: fmt(totalTaxDeferral), note: "By spreading over term", c: "text-emerald-700" },
        ].map(({ l, v, note, c }) => (
          <div key={l} className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center">
            <p className="text-[10px] sm:text-xs text-gray-400 mb-1">{l}</p>
            <p className={`text-lg sm:text-xl font-extrabold ${c}`}>{v}</p>
            <p className="text-[10px] text-gray-400 mt-1">{note}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
        <strong>Important:</strong> Capital gains tax deferral via VTB is a real but complex provision under
        the Income Tax Act. This calculator is illustrative only — always consult a CPA before structuring
        any VTB for tax purposes.
      </div>
    </div>
  );
}

// ── Main exported component ───────────────────────────────────────────
export default function SavingsCalculator({ defaultTab, compact = false }) {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;

  const tabs = isBusiness
    ? [
        { id: "seller", label: "Vendor Advantage" },
        { id: "buyer", label: "Compare Financing" },
        { id: "capgains", label: "Cap Gains" },
      ]
    : [
        { id: "seller", label: "For Sellers" },
        { id: "buyer", label: "Compare Mortgages" },
      ];

  const [tab, setTab] = useState(defaultTab || tabs[0].id);

  const accent = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-600" : "bg-blue-600";
  const ring = isBusiness ? "accent-emerald-600" : "accent-blue-600";
  const tabActive = isBusiness ? "bg-emerald-600 text-white" : "bg-blue-600 text-white";
  const tabInactive = "text-gray-500 hover:bg-gray-50";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tabs — scrollable on mobile */}
      <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap px-2 ${tab === t.id ? tabActive : tabInactive}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">
        {tab === "seller" && (
          isBusiness
            ? <CommercialSellerCalc accent={accent} ring={ring} />
            : <HomeSellerCalc accent={accent} accentBg={accentBg} ring={ring} />
        )}
        {tab === "buyer" && <BuyerCalc accent={accent} accentBg={accentBg} ring={ring} isBusiness={isBusiness} />}
        {tab === "capgains" && <CapGainsDeferral accent={accent} />}
      </div>
    </div>
  );
}

// src/components/SavingsCalculator.jsx
// Shows sellers what they save by using LandMatch vs traditional agent sale.
// Shows buyers what a VTB mortgage costs vs bank equivalent.
// Reusable across Home, ListingDetail, and Guide pages.

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const fmt = (n) => `$${Math.round(n).toLocaleString("en-CA")}`;
const pct = (n) => `${(n * 100).toFixed(1)}%`;

function monthlyPayment(principal, annualRate, years) {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
  const r = annualRate / 12;
  const n = years * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ── Seller Tab ─────────────────────────────────────────────────────────
function SellerCalc() {
  const [price,    setPrice]    = useState(650000);
  const [downPct,  setDownPct]  = useState(20);
  const [vtbRate,  setVtbRate]  = useState(7);
  const [vtbYears, setVtbYears] = useState(5);
  const [amort,    setAmort]    = useState(25);

  const listingCommission = price * 0.025;
  const buyerCommission   = price * 0.025;
  const totalCommission   = listingCommission + buyerCommission;
  const hstOnCommission   = totalCommission * 0.13;
  const totalCommSavings  = totalCommission + hstOnCommission;

  const downPayment = price * (downPct / 100);
  const vtbPrincipal = price - downPayment;
  const monthly      = monthlyPayment(vtbPrincipal, vtbRate / 100, amort);
  const totalPaid    = monthly * vtbYears * 12;
  const principalPaid = vtbPrincipal - monthlyPayment(vtbPrincipal, vtbRate / 100, amort - vtbYears) * ((amort - vtbYears) * 12) / 1; // approximate
  const interestEarned = totalPaid - (vtbPrincipal * (vtbYears / amort)); // simplified estimate

  // Better interest calculation
  let balance = vtbPrincipal;
  let totalInterest = 0;
  const monthlyR = (vtbRate / 100) / 12;
  for (let m = 0; m < vtbYears * 12; m++) {
    const interestThisMonth = balance * monthlyR;
    const principalThisMonth = monthly - interestThisMonth;
    totalInterest += interestThisMonth;
    balance -= principalThisMonth;
  }

  const totalWin = totalCommSavings + totalInterest;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        Adjust the sliders to see exactly what you save — and earn — by selling on LandMatch instead of through a traditional agent.
      </p>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sale Price — <span className="text-blue-600 font-bold">{fmt(price)}</span>
          </label>
          <input type="range" min={200000} max={2000000} step={25000} value={price}
            onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-blue-600"/>
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$200K</span><span>$2M</span></div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Down Payment — <span className="text-blue-600 font-bold">{downPct}%</span>
          </label>
          <input type="range" min={10} max={50} step={5} value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))} className="w-full accent-blue-600"/>
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10%</span><span>50%</span></div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VTB Interest Rate — <span className="text-blue-600 font-bold">{vtbRate}%</span>
          </label>
          <input type="range" min={5} max={12} step={0.25} value={vtbRate}
            onChange={(e) => setVtbRate(Number(e.target.value))} className="w-full accent-blue-600"/>
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5%</span><span>12%</span></div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VTB Term — <span className="text-blue-600 font-bold">{vtbYears} years</span>
          </label>
          <input type="range" min={1} max={10} step={1} value={vtbYears}
            onChange={(e) => setVtbYears(Number(e.target.value))} className="w-full accent-blue-600"/>
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 yr</span><span>10 yrs</span></div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-xs text-orange-500 font-medium uppercase tracking-wide mb-1">Commission Saved</p>
          <p className="text-2xl font-extrabold text-orange-700">{fmt(totalCommSavings)}</p>
          <p className="text-xs text-orange-400 mt-1">vs. traditional 5% + HST</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-xs text-green-500 font-medium uppercase tracking-wide mb-1">Interest Earned</p>
          <p className="text-2xl font-extrabold text-green-700">{fmt(totalInterest)}</p>
          <p className="text-xs text-green-400 mt-1">in {vtbYears} yr{vtbYears>1?"s":""} at {vtbRate}%</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-1">Total Advantage</p>
          <p className="text-2xl font-extrabold text-blue-700">{fmt(totalWin)}</p>
          <p className="text-xs text-blue-400 mt-1">commission savings + interest income</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm">
        <p className="font-semibold text-gray-800 mb-3">How this breaks down</p>
        <div className="space-y-2">
          {[
            { label: "Listing agent commission saved", value: fmt(listingCommission), color: "text-green-600" },
            { label: "Buyer's agent commission saved", value: fmt(buyerCommission), color: "text-green-600" },
            { label: "HST on commissions saved", value: fmt(hstOnCommission), color: "text-green-600" },
            { label: `Interest earned on ${fmt(vtbPrincipal)} VTB over ${vtbYears} yrs`, value: fmt(totalInterest), color: "text-blue-600" },
            { label: "Monthly payment from buyer", value: `${fmt(monthly)}/mo`, color: "text-gray-700" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-gray-500">{label}</span>
              <span className={`font-semibold ${color}`}>{value}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Total benefit vs. traditional sale</span>
            <span className="font-extrabold text-xl text-blue-700">{fmt(totalWin)}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">
        * Estimates only. Commission rates vary. Interest calculations assume principal + interest, monthly compounding, {amort}-year amortization.
        Consult a real estate lawyer and accountant for advice specific to your situation.
      </p>
    </div>
  );
}

// ── Buyer Tab ─────────────────────────────────────────────────────────
function BuyerCalc() {
  const [price,    setPrice]    = useState(600000);
  const [down,     setDown]     = useState(20);
  const [vtbRate,  setVtbRate]  = useState(7.5);
  const [bankRate, setBankRate] = useState(6.8);
  const [years,    setYears]    = useState(25);

  const downAmount = price * (down / 100);
  const loan       = price - downAmount;
  const vtbMonthly = monthlyPayment(loan, vtbRate / 100, years);
  const bnkMonthly = monthlyPayment(loan, bankRate / 100, years);
  const diffMonthly = vtbMonthly - bnkMonthly;
  const diffAnnual  = diffMonthly * 12;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 leading-relaxed">
        Compare a seller-financed VTB mortgage to a traditional bank mortgage side by side.
        See what flexibility costs — and whether it's worth it to you.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Home Price — <span className="text-blue-600 font-bold">{fmt(price)}</span>
          </label>
          <input type="range" min={200000} max={2000000} step={25000} value={price}
            onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-blue-600"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Down Payment — <span className="text-blue-600 font-bold">{down}% ({fmt(downAmount)})</span>
          </label>
          <input type="range" min={10} max={50} step={5} value={down}
            onChange={(e) => setDown(Number(e.target.value))} className="w-full accent-blue-600"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VTB Rate — <span className="text-purple-600 font-bold">{vtbRate}%</span>
          </label>
          <input type="range" min={5} max={12} step={0.25} value={vtbRate}
            onChange={(e) => setVtbRate(Number(e.target.value))} className="w-full accent-purple-600"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Rate — <span className="text-gray-600 font-bold">{bankRate}%</span>
          </label>
          <input type="range" min={4} max={10} step={0.25} value={bankRate}
            onChange={(e) => setBankRate(Number(e.target.value))} className="w-full accent-gray-600"/>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5 text-center">
          <p className="text-xs font-bold text-purple-500 uppercase tracking-wide mb-1">VTB Mortgage</p>
          <p className="text-3xl font-extrabold text-purple-700">{fmt(vtbMonthly)}</p>
          <p className="text-xs text-purple-400 mt-1">/month at {vtbRate}%</p>
          <div className="mt-3 pt-3 border-t border-purple-200">
            <p className="text-xs text-green-600 font-semibold">✓ No bank approval required</p>
            <p className="text-xs text-green-600">✓ Seller can consider your full situation</p>
            <p className="text-xs text-green-600">✓ Flexible terms, negotiable</p>
          </div>
        </div>
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Bank Mortgage</p>
          <p className="text-3xl font-extrabold text-gray-700">{fmt(bnkMonthly)}</p>
          <p className="text-xs text-gray-400 mt-1">/month at {bankRate}%</p>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-red-500">✗ Stress test required</p>
            <p className="text-xs text-red-500">✗ T4 income only</p>
            <p className="text-xs text-red-500">✗ Months of approval process</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 text-sm">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Monthly difference</span>
          <span className={`font-semibold ${diffMonthly > 0 ? "text-orange-600" : "text-green-600"}`}>
            {diffMonthly > 0 ? "+" : ""}{fmt(diffMonthly)}/mo
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Annual difference</span>
          <span className={`font-semibold ${diffAnnual > 0 ? "text-orange-600" : "text-green-600"}`}>
            {diffAnnual > 0 ? "+" : ""}{fmt(diffAnnual)}/yr
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
          {diffMonthly > 0
            ? `A VTB mortgage at ${vtbRate}% costs approximately ${fmt(diffMonthly)} more per month than a bank mortgage at ${bankRate}%. For many buyers, this premium is worth it to avoid rejection and get into homeownership now.`
            : `At these rates, the VTB mortgage is actually cheaper than the bank rate. You get flexibility and save money.`
          }
        </p>
      </div>

      <p className="text-xs text-gray-400">
        * For illustration purposes only. Assumes {years}-year amortization, monthly compounding. Actual rates vary. Consult a mortgage professional.
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
export default function SavingsCalculator({ defaultTab = "seller", compact = false }) {
  const [tab, setTab] = useState(defaultTab);

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${compact ? "" : ""}`}>
      {/* Tab header */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setTab("seller")}
          className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
            tab === "seller"
              ? "bg-blue-600 text-white"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          For Sellers — What You Keep
        </button>
        <button
          onClick={() => setTab("buyer")}
          className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
            tab === "buyer"
              ? "bg-blue-600 text-white"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          For Buyers — Compare Mortgages
        </button>
      </div>

      <div className="p-6">
        {tab === "seller" ? <SellerCalc /> : <BuyerCalc />}
      </div>
    </div>
  );
}

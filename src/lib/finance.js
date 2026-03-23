// src/lib/finance.js
// Batch 13e — Standardized number formatting added.
// All existing functions unchanged; new formatters at bottom.

// Monthly mortgage payment (principal + interest only)
export function monthlyPayment({ price, down, rateAnnual, termYears }) {
  const P = Math.max(0, Number(price || 0) - Number(down || 0));
  const r = Number(rateAnnual || 0) / 12;
  const n = Number(termYears || 30) * 12;
  if (r === 0 || n === 0) return P / Math.max(1, n);
  return (P * r) / (1 - Math.pow(1 + r, -n));
}

// Simple amortization preview (first N months)
export function amortizationPreview({ price, down, rateAnnual, termYears }, months = 6) {
  let balance = Math.max(0, Number(price || 0) - Number(down || 0));
  const r = Number(rateAnnual || 0) / 12;
  const pay = monthlyPayment({ price, down, rateAnnual, termYears });
  const out = [];
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const principal = Math.max(0, pay - interest);
    balance = Math.max(0, balance - principal);
    out.push({ month: m, payment: pay, principal, interest, balance });
  }
  return out;
}

// Loan-to-Value
export const ltv = ({ price, down }) => {
  const principal = Math.max(0, Number(price) - Number(down));
  return principal / Math.max(1, Number(price));
};

// Debt-to-Income (rough; monthly)
export const dti = ({ monthlyDebt, monthlyIncome }) =>
  Number(monthlyDebt || 0) / Math.max(1, Number(monthlyIncome || 1));

// Rent-to-own sketch
export function rentToOwn({ price, optionFee = 0, monthlyRent = 0, creditPct = 0.2, termMonths = 24 }) {
  const credits = [];
  for (let i = 1; i <= termMonths; i++) credits.push({ month: i, credit: monthlyRent * creditPct });
  const totalCredit = credits.reduce((a, c) => a + c.credit, 0);
  return {
    optionFee,
    monthlyRent,
    creditPct,
    termMonths,
    credits,
    totalCredit,
    netPriceAtClose: Math.max(0, Number(price || 0) - optionFee - totalCredit),
  };
}

// ── Batch 13e — Standardized Formatters ─────────────────────────────
// No false precision: $489,000 not $489,000.00
// Consistent everywhere: map pins, cards, calculators, detail pages.

/**
 * Format currency — whole dollars, no decimals.
 * $489,000 — not $489,000.00
 */
export function fmtCurrency(n) {
  if (n == null || isNaN(n)) return "—";
  return `$${Math.round(Number(n)).toLocaleString("en-CA")}`;
}

/**
 * Format currency with cents — only for monthly payments where cents matter.
 * $2,847.33
 */
export function fmtCurrencyExact(n) {
  if (n == null || isNaN(n)) return "—";
  return `$${Number(n).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Compact price for map pins and tight spaces.
 * ≥1M → $1.3M (with .0 cleanup)
 * <1M → $480K
 */
export function fmtPinPrice(price) {
  if (!price) return "—";
  const n = Number(price);
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  return `$${Math.round(n / 1000)}K`;
}

/**
 * Format percentage — no false precision.
 * 7% not 7.00%, but 7.5% keeps the decimal.
 */
export function fmtPct(n, maxDecimals = 1) {
  if (n == null || isNaN(n)) return "—";
  const val = Number(n);
  // If it's a whole number, show no decimals
  if (val === Math.round(val)) return `${val}%`;
  return `${val.toFixed(maxDecimals)}%`;
}

/**
 * Compact number for stats (e.g. sqft).
 * 1,800 sqft
 */
export function fmtNum(n) {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-CA");
}

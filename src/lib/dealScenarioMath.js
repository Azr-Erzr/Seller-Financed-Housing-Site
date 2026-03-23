// src/lib/dealScenarioMath.js
// Centralized math for Deal Structure Explorer.
// Used by DealStructureExplorer to compute estimate cards.
// All outputs are rounded to whole dollars. No false precision.

/**
 * Commission savings — listing-side only.
 * @param {number} price - sale price
 * @param {number} commPct - listing-side commission rate (e.g. 0.025 for 2.5%)
 * @param {number} hstPct - HST rate (e.g. 0.13)
 */
export function commissionSavings(price, commPct = 0.025, hstPct = 0.13) {
  const comm = price * commPct;
  const hst = comm * hstPct;
  return { commission: Math.round(comm), hst: Math.round(hst), total: Math.round(comm + hst) };
}

/**
 * Modeled interest income over a VTB term (simplified).
 * Uses straight-line interest on declining balance with annual payments.
 * This is illustrative, not a precise amortization.
 * @param {number} financed - amount financed (price - down payment)
 * @param {number} rateAnnual - annual interest rate (e.g. 0.07)
 * @param {number} termYears - term in years
 */
export function modeledInterestIncome(financed, rateAnnual, termYears) {
  if (!financed || !rateAnnual || !termYears) return 0;
  // Monthly payment (standard amortization)
  const r = rateAnnual / 12;
  const n = termYears * 12;
  const monthly = financed * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  // Total interest = total paid - principal
  const totalPaid = monthly * n;
  return Math.round(totalPaid - financed);
}

/**
 * Full seller-finance estimate.
 */
export function sellerFinanceEstimate({ price = 600000, downPct = 20, ratePct = 7, termYears = 5, commPct = 0.025, hstPct = 0.13 } = {}) {
  const downPayment = Math.round(price * (downPct / 100));
  const financed = price - downPayment;
  const savings = commissionSavings(price, commPct, hstPct);
  const interest = modeledInterestIncome(financed, ratePct / 100, termYears);
  return {
    price,
    downPayment,
    financed,
    ratePct,
    termYears,
    commissionSaved: savings.total,
    commissionBase: savings.commission,
    commissionHST: savings.hst,
    interestIncome: interest,
    grossUpside: savings.total + interest,
  };
}

/**
 * Private sale estimate (no interest income).
 */
export function privateSaleEstimate({ price = 600000, commPct = 0.025, hstPct = 0.13 } = {}) {
  const savings = commissionSavings(price, commPct, hstPct);
  return {
    price,
    commissionSaved: savings.total,
    commissionBase: savings.commission,
    commissionHST: savings.hst,
  };
}

/**
 * Rent-to-own illustrative estimate.
 */
export function rentToOwnEstimate({ price = 600000, optionPct = 3, monthlyPremium = 400, termMonths = 24 } = {}) {
  const optionPayment = Math.round(price * (optionPct / 100));
  const totalPremium = monthlyPremium * termMonths;
  return {
    price,
    optionPayment,
    monthlyPremium,
    termMonths,
    totalPremium,
    totalUpfront: optionPayment + totalPremium,
  };
}

/**
 * Hybrid financing estimate (partial VTB).
 */
export function hybridFinanceEstimate({ price = 1200000, bankPct = 65, vtbPct = 15, downPct = 20, vtbRatePct = 7, vtbTermYears = 5, commPct = 0.02, hstPct = 0.13 } = {}) {
  const vtbAmount = Math.round(price * (vtbPct / 100));
  const interest = modeledInterestIncome(vtbAmount, vtbRatePct / 100, vtbTermYears);
  const savings = commissionSavings(price, commPct, hstPct);
  return {
    price,
    bankAmount: Math.round(price * (bankPct / 100)),
    vtbAmount,
    downPayment: Math.round(price * (downPct / 100)),
    vtbRatePct,
    vtbTermYears,
    commissionSaved: savings.total,
    interestIncome: interest,
    grossUpside: savings.total + interest,
  };
}

/** Format currency — whole dollars, abbreviated for large values */
export function fmtDeal(n) {
  if (n == null) return "—";
  return `$${Math.round(n).toLocaleString("en-CA")}`;
}

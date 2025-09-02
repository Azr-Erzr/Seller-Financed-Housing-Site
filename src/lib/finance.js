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
    netPriceAtClose: Math.max(0, Number(price || 0) - optionFee - totalCredit)
  };
}
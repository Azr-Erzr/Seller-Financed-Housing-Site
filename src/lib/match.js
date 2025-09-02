// naive similarity score 0..100 for buyer-pref vs listing
export function scoreMatch({ listing, profile }) {
  if (!listing || !profile) return 0;

  let score = 0;
  const wantRentToOwn = profile.dealPreference?.includes("rent-to-own");
  const isRTO = listing.dealTypes?.includes("rent-to-own");
  if (wantRentToOwn && isRTO) score += 20;

  // interest tolerance
  if (profile.interestMax && listing.interestRange) {
    const [min, max] = listing.interestRange;
    if (min <= profile.interestMax) score += 20;
  }

  // down budget vs min down
  if (profile.downBudget && listing.downMinPct && listing.price) {
    const minDown = listing.price * listing.downMinPct;
    if (profile.downBudget >= minDown) score += 25;
  }

  // payment budget vs computed payment (estimate at mid of interest range)
  if (profile.paymentBudget && listing.price && listing.termYears) {
    const midRate = ((listing.interestRange?.[0] || 0.05) + (listing.interestRange?.[1] || 0.09)) / 2;
    const down = Math.max(profile.downBudget || 0, listing.price * (listing.downMinPct || 0));
    const P = listing.price - down;
    const r = midRate / 12;
    const n = (listing.termYears || 30) * 12;
    const pay = (P * r) / (1 - Math.pow(1 + r, -n));
    if (pay <= profile.paymentBudget) score += 25;
  }

  // location rough preference
  if (profile.location && listing.city) {
    if (listing.city.toLowerCase().includes(profile.location.toLowerCase())) score += 10;
  }

  return Math.min(100, Math.round(score));
}
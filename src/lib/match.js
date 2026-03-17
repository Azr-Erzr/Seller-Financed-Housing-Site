// src/lib/match.js
// Graduated scoring — partial credit instead of binary yes/no
// Max possible score: 100

export function scoreMatch({ listing, profile }) {
  if (!listing || !profile) return 0;
  let score = 0;

  // ── 1. Deal type compatibility (0–25) ──────────────────────────────
  const buyerPrefs = profile.dealPreferences || [];
  const listingDeals = listing.dealTypes || [];
  const exactMatch = buyerPrefs.some((p) => listingDeals.includes(p));
  const looseMatch =
    buyerPrefs.includes("any") ||
    (buyerPrefs.includes("seller-finance") && listingDeals.includes("rent-to-own")) ||
    (buyerPrefs.includes("rent-to-own") && listingDeals.includes("seller-finance"));

  if (exactMatch) score += 25;
  else if (looseMatch) score += 10;

  // ── 2. Interest rate fit (0–20) ────────────────────────────────────
  if (profile.interestMax && listing.interestRange) {
    const [minRate, maxRate] = listing.interestRange;
    const buyerMax = profile.interestMax;
    if (buyerMax >= maxRate) {
      // Buyer is comfortable with the full range — great fit
      score += 20;
    } else if (buyerMax >= minRate) {
      // Buyer can meet the minimum — partial fit
      const overlap = (buyerMax - minRate) / (maxRate - minRate);
      score += Math.round(overlap * 15);
    }
    // If buyerMax < minRate: buyer can't afford the cheapest rate — 0 pts
  }

  // ── 3. Down payment capacity (0–25) ───────────────────────────────
  if (profile.downPayment && listing.downPayment && listing.price) {
    const required = listing.downPayment;
    const available = profile.downPayment;
    if (available >= required * 1.3) {
      // Comfortably above — full points
      score += 25;
    } else if (available >= required) {
      // Just makes it — good
      score += 20;
    } else if (available >= required * 0.85) {
      // Close but short — partial credit (might negotiate)
      score += 10;
    }
    // More than 15% short — 0 pts
  }

  // ── 4. Monthly payment affordability (0–20) ────────────────────────
  if (profile.paymentBudget && listing.price && listing.term) {
    const midRate =
      ((listing.interestRange?.[0] || 0.065) +
        (listing.interestRange?.[1] || 0.085)) /
      2;
    const down = Math.max(
      profile.downPayment || 0,
      listing.downPayment || 0
    );
    const P = listing.price - down;
    const r = midRate / 12;
    const n = (listing.term || 25) * 12;
    const pay = r > 0 ? (P * r) / (1 - Math.pow(1 + r, -n)) : P / n;

    const budget = profile.paymentBudget;
    if (pay <= budget * 0.85) {
      // Payment is well within budget
      score += 20;
    } else if (pay <= budget) {
      // Payment fits but tight
      score += 12;
    } else if (pay <= budget * 1.1) {
      // Slightly over — close enough to negotiate
      score += 5;
    }
  }

  // ── 5. Location match (0–10) ───────────────────────────────────────
  const buyerCity = (profile.city || profile.location || "").toLowerCase();
  const listingCity = (listing.city || "").toLowerCase();
  const REGION = ["whitby", "oshawa", "ajax", "pickering", "clarington"];

  if (buyerCity && listingCity) {
    if (listingCity === buyerCity) {
      score += 10;
    } else if (
      REGION.includes(buyerCity) &&
      REGION.includes(listingCity)
    ) {
      // Same Durham Region — partial credit
      score += 5;
    }
  }

  return Math.min(100, Math.round(score));
}

// Convenience: score all listings against one profile, sorted best first
export function rankListingsForProfile(listings, profile) {
  return listings
    .map((listing) => ({ listing, score: scoreMatch({ listing, profile }) }))
    .sort((a, b) => b.score - a.score);
}

// Convenience: score all profiles against one listing, sorted best first
export function rankProfilesForListing(profiles, listing) {
  return profiles
    .map((profile) => ({ profile, score: scoreMatch({ listing, profile }) }))
    .sort((a, b) => b.score - a.score);
}

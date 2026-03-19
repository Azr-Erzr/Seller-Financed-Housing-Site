// src/lib/smart-match.js
// Smart matching — analyzes saved items to detect patterns,
// then scores ALL listings/profiles against those preferences.
// Supports two directions:
//   1. Buyer flow:  saved listings → recommend more listings
//   2. Seller flow: saved listings → recommend matching buyer profiles

const DURHAM_CITIES = ["whitby", "oshawa", "ajax", "pickering", "clarington", "bowmanville", "courtice", "brooklin"];

// ═══════════════════════════════════════════════════════════════════
// LISTING RECOMMENDATIONS (buyer saves listings → see more listings)
// ═══════════════════════════════════════════════════════════════════

export function deriveListingPreferences(savedListings) {
  if (!savedListings || savedListings.length === 0) return null;

  const prices = savedListings.map((l) => l.price).filter(Boolean);
  const cities = savedListings.map((l) => (l.city || "").toLowerCase()).filter(Boolean);
  const beds   = savedListings.map((l) => l.bedrooms).filter((b) => b > 0);
  const sqfts  = savedListings.map((l) => l.sqft).filter(Boolean);
  const types  = savedListings.flatMap((l) => l.dealTypes || []);
  const propTypes = savedListings.map((l) => l.propertyType || l.propertyCategory).filter(Boolean);
  const downPayments = savedListings.map((l) => l.downPayment).filter(Boolean);
  const acreages = savedListings.map((l) => l.acreage).filter(Boolean);

  return {
    priceMin:    prices.length ? Math.min(...prices) * 0.75 : null,
    priceMax:    prices.length ? Math.max(...prices) * 1.25 : null,
    priceAvg:    prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null,
    cities,
    uniqueCities: [...new Set(cities)],
    bedsMin:     beds.length ? Math.min(...beds) : null,
    bedsAvg:     beds.length ? Math.round(beds.reduce((a, b) => a + b, 0) / beds.length) : null,
    sqftMin:     sqfts.length ? Math.min(...sqfts) * 0.8 : null,
    sqftAvg:     sqfts.length ? Math.round(sqfts.reduce((a, b) => a + b, 0) / sqfts.length) : null,
    dealTypes:   [...new Set(types)],
    propertyTypes: [...new Set(propTypes)],
    downPaymentAvg: downPayments.length ? Math.round(downPayments.reduce((a, b) => a + b, 0) / downPayments.length) : null,
    acreageAvg:  acreages.length ? acreages.reduce((a, b) => a + b, 0) / acreages.length : null,
    count:       savedListings.length,
  };
}

export function softScoreListing(listing, prefs) {
  if (!listing || !prefs) return 0;
  let score = 0, maxScore = 0;

  // Price proximity (0-30)
  if (prefs.priceAvg && listing.price) {
    maxScore += 30;
    const diff = Math.abs(listing.price - prefs.priceAvg) / prefs.priceAvg;
    if (diff <= 0.05) score += 30;
    else if (diff <= 0.10) score += 25;
    else if (diff <= 0.20) score += 18;
    else if (diff <= 0.35) score += 10;
    else if (diff <= 0.50) score += 5;
  }

  // Location (0-25)
  if (prefs.uniqueCities.length > 0 && listing.city) {
    maxScore += 25;
    const lc = listing.city.toLowerCase();
    if (prefs.uniqueCities.includes(lc)) score += 25;
    else if (DURHAM_CITIES.includes(lc) && prefs.uniqueCities.some((c) => DURHAM_CITIES.includes(c))) score += 15;
    else score += 3;
  }

  // Deal type (0-20)
  if (prefs.dealTypes.length > 0 && listing.dealTypes?.length > 0) {
    maxScore += 20;
    const overlap = listing.dealTypes.filter((d) => prefs.dealTypes.includes(d)).length;
    if (overlap > 0) score += Math.min(20, overlap * 10);
    else {
      const hasSf = prefs.dealTypes.some((d) => d.includes("seller") || d.includes("finance"));
      const hasRto = prefs.dealTypes.some((d) => d.includes("rent"));
      const listHasSf = listing.dealTypes.some((d) => d.includes("seller") || d.includes("finance"));
      const listHasRto = listing.dealTypes.some((d) => d.includes("rent"));
      if ((hasSf && listHasRto) || (hasRto && listHasSf)) score += 8;
    }
  }

  // Bedrooms (0-10, residential)
  if (prefs.bedsAvg && listing.bedrooms) {
    maxScore += 10;
    const diff = Math.abs(listing.bedrooms - prefs.bedsAvg);
    if (diff === 0) score += 10;
    else if (diff === 1) score += 7;
    else if (diff === 2) score += 3;
  }

  // Property type (0-10)
  if (prefs.propertyTypes.length > 0) {
    maxScore += 10;
    const t = listing.propertyType || listing.propertyCategory || "";
    if (prefs.propertyTypes.includes(t)) score += 10;
    else score += 2;
  }

  // Down payment (0-5)
  if (prefs.downPaymentAvg && listing.downPayment) {
    maxScore += 5;
    if (listing.downPayment <= prefs.downPaymentAvg * 1.1) score += 5;
    else if (listing.downPayment <= prefs.downPaymentAvg * 1.3) score += 3;
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

export function getListingRecommendations(allListings, savedListings, maxResults = 6) {
  const prefs = deriveListingPreferences(savedListings);
  if (!prefs) return { recommendations: [], preferences: null };
  const savedIds = new Set(savedListings.map((l) => String(l.id)));

  const scored = allListings
    .filter((l) => !savedIds.has(String(l.id)))
    .map((listing) => ({ listing, score: softScoreListing(listing, prefs) }))
    .filter((r) => r.score > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return { recommendations: scored, preferences: prefs };
}

// ═══════════════════════════════════════════════════════════════════
// PROFILE RECOMMENDATIONS (seller has listings → find matching buyers)
// ═══════════════════════════════════════════════════════════════════

// Score how well a buyer profile matches a specific listing
export function scoreProfileForListing(profile, listing) {
  if (!profile || !listing) return 0;
  let score = 0, maxScore = 0;

  // Budget covers the price (0-30)
  if (profile.budget && listing.price) {
    maxScore += 30;
    const ratio = profile.budget / listing.price;
    if (ratio >= 1.0) score += 30;       // budget fully covers
    else if (ratio >= 0.90) score += 22;  // within 10% — might negotiate
    else if (ratio >= 0.80) score += 12;  // within 20% — stretch
    else if (ratio >= 0.70) score += 5;   // 30% short — unlikely but possible
  }

  // Down payment meets requirement (0-20)
  if (profile.downPayment && listing.downPayment) {
    maxScore += 20;
    if (profile.downPayment >= listing.downPayment * 1.2) score += 20;
    else if (profile.downPayment >= listing.downPayment) score += 15;
    else if (profile.downPayment >= listing.downPayment * 0.85) score += 8;
  }

  // Location match (0-20)
  if (profile.city && listing.city) {
    maxScore += 20;
    const pc = profile.city.toLowerCase();
    const lc = listing.city.toLowerCase();
    if (pc === lc) score += 20;
    else if (DURHAM_CITIES.includes(pc) && DURHAM_CITIES.includes(lc)) score += 12;
    else score += 2;
  }

  // Deal type compatibility (0-15)
  if (profile.dealPreferences?.length > 0 && listing.dealTypes?.length > 0) {
    maxScore += 15;
    const overlap = profile.dealPreferences.filter((d) => listing.dealTypes.includes(d)).length;
    if (overlap > 0) score += 15;
    else {
      // Loose match: seller-finance ↔ rent-to-own
      const pHasSf = profile.dealPreferences.some((d) => d.includes("seller") || d.includes("finance"));
      const pHasRto = profile.dealPreferences.some((d) => d.includes("rent"));
      const lHasSf = listing.dealTypes.some((d) => d.includes("seller") || d.includes("finance"));
      const lHasRto = listing.dealTypes.some((d) => d.includes("rent"));
      if ((pHasSf && lHasRto) || (pHasRto && lHasSf)) score += 7;
    }
  }

  // Interest rate compatibility (0-10)
  if (profile.interestMax && listing.interestRange) {
    maxScore += 10;
    const [minRate] = listing.interestRange;
    if (profile.interestMax >= minRate) score += 10;
    else if (profile.interestMax >= minRate * 0.9) score += 5;
  }

  // Monthly payment affordability (0-5)
  if (profile.paymentBudget && listing.price && listing.term) {
    maxScore += 5;
    const midRate = ((listing.interestRange?.[0] || 0.065) + (listing.interestRange?.[1] || 0.085)) / 2;
    const down = Math.max(profile.downPayment || 0, listing.downPayment || 0);
    const P = listing.price - down;
    const r = midRate / 12;
    const n = (listing.term || 25) * 12;
    const payment = r > 0 ? (P * r) / (1 - Math.pow(1 + r, -n)) : P / n;
    if (payment <= profile.paymentBudget) score += 5;
    else if (payment <= profile.paymentBudget * 1.1) score += 3;
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

// Get buyer profiles that match the user's saved listings
export function getProfileRecommendations(allProfiles, savedListings, maxResults = 6) {
  if (!savedListings?.length || !allProfiles?.length) return { recommendations: [], bestListing: null };

  // Score each profile against ALL saved listings, take the best match per profile
  const scored = allProfiles.map((profile) => {
    let bestScore = 0;
    let bestListing = null;
    savedListings.forEach((listing) => {
      const s = scoreProfileForListing(profile, listing);
      if (s > bestScore) { bestScore = s; bestListing = listing; }
    });
    return { profile, score: bestScore, matchedListing: bestListing };
  })
  .filter((r) => r.score > 25)
  .sort((a, b) => b.score - a.score)
  .slice(0, maxResults);

  return { recommendations: scored };
}

// ═══════════════════════════════════════════════════════════════════
// SUMMARIES & CONTEXT
// ═══════════════════════════════════════════════════════════════════

export function preferenceSummary(prefs, isBusiness = false) {
  if (!prefs) return "";
  const parts = [];
  if (prefs.priceAvg) {
    const avg = prefs.priceAvg >= 1000000
      ? `$${(prefs.priceAvg / 1000000).toFixed(1)}M`
      : `$${Math.round(prefs.priceAvg / 1000)}K`;
    parts.push(`~${avg} price range`);
  }
  if (prefs.uniqueCities.length > 0) {
    const list = prefs.uniqueCities.map((c) => c.charAt(0).toUpperCase() + c.slice(1));
    parts.push(list.length <= 2 ? list.join(" & ") : `${list.length} cities in Durham`);
  }
  if (prefs.dealTypes.length > 0) parts.push(prefs.dealTypes.slice(0, 2).join(", "));
  if (!isBusiness && prefs.bedsAvg) parts.push(`${prefs.bedsAvg}+ beds`);
  if (isBusiness && prefs.acreageAvg) parts.push(`~${prefs.acreageAvg.toFixed(0)} acres`);
  if (prefs.propertyTypes.length > 0) parts.push(prefs.propertyTypes.slice(0, 2).join(", "));
  return parts.join(" · ");
}

export function buildRecommendationContext(listingRecs, profileRecs, prefs, isBusiness = false) {
  let ctx = "";
  const summary = preferenceSummary(prefs, isBusiness);

  if (prefs && summary) {
    ctx += `\n\nUser's detected preferences (from ${prefs.count} saved items): ${summary}`;
  }

  if (listingRecs?.length > 0) {
    const list = listingRecs.map((r) =>
      `• ${r.listing.title} in ${r.listing.city} — $${r.listing.price?.toLocaleString()} (${r.score}% match) | ID:${r.listing.id}`
    ).join("\n");
    ctx += `\n\nRecommended listings:\n${list}`;
  }

  if (profileRecs?.length > 0) {
    const list = profileRecs.map((r) =>
      `• ${r.profile.useAlias ? r.profile.alias : r.profile.name} in ${r.profile.city} — budget $${r.profile.budget?.toLocaleString()}, ${r.score}% match for "${r.matchedListing?.title || "your listing"}" | ID:${r.profile.id}`
    ).join("\n");
    ctx += `\n\nMatching buyers:\n${list}`;
  }

  return ctx;
}

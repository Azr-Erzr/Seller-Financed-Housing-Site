// src/lib/smart-match.js
// AI-powered soft matching — analyzes saved listings to detect user patterns,
// then scores ALL listings against those derived preferences.
// Unlike hard filters that exclude, this finds "close but not quite" matches.

const DURHAM_CITIES = ["whitby", "oshawa", "ajax", "pickering", "clarington", "bowmanville", "courtice", "brooklin"];

// ── Extract user preferences from saved listings ────────────────────
export function derivePreferences(savedListings) {
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
    priceMin:    prices.length ? Math.min(...prices) * 0.75 : null,  // 25% below lowest saved
    priceMax:    prices.length ? Math.max(...prices) * 1.25 : null,  // 25% above highest saved
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

// ── Soft-score a single listing against derived preferences ─────────
// Returns 0-100. Higher = better match. Uses gradual scoring, not binary.
export function softScore(listing, prefs) {
  if (!listing || !prefs) return 0;
  let score = 0;
  let maxScore = 0;

  // ── Price proximity (0-30 pts) ────────────────────────────────────
  if (prefs.priceAvg && listing.price) {
    maxScore += 30;
    const diff = Math.abs(listing.price - prefs.priceAvg) / prefs.priceAvg;
    if (diff <= 0.05)      score += 30;  // within 5%
    else if (diff <= 0.10) score += 25;  // within 10%
    else if (diff <= 0.20) score += 18;  // within 20%
    else if (diff <= 0.35) score += 10;  // within 35% — "close enough, stretch budget"
    else if (diff <= 0.50) score += 5;   // within 50% — still worth seeing
  }

  // ── Location (0-25 pts) ───────────────────────────────────────────
  if (prefs.uniqueCities.length > 0 && listing.city) {
    maxScore += 25;
    const listingCity = listing.city.toLowerCase();
    if (prefs.uniqueCities.includes(listingCity)) {
      score += 25;  // exact city match
    } else if (
      DURHAM_CITIES.includes(listingCity) &&
      prefs.uniqueCities.some((c) => DURHAM_CITIES.includes(c))
    ) {
      score += 15;  // same region — "5 km further but worth it"
    } else {
      score += 3;   // different area entirely — small credit for being a listing at all
    }
  }

  // ── Deal type overlap (0-20 pts) ──────────────────────────────────
  if (prefs.dealTypes.length > 0 && listing.dealTypes?.length > 0) {
    maxScore += 20;
    const overlap = listing.dealTypes.filter((d) => prefs.dealTypes.includes(d)).length;
    if (overlap > 0) {
      score += Math.min(20, overlap * 10);
    } else {
      // No exact match but same category — partial credit
      const hasSf = prefs.dealTypes.some((d) => d.includes("seller") || d.includes("finance"));
      const hasRto = prefs.dealTypes.some((d) => d.includes("rent"));
      const listHasSf = listing.dealTypes.some((d) => d.includes("seller") || d.includes("finance"));
      const listHasRto = listing.dealTypes.some((d) => d.includes("rent"));
      if ((hasSf && listHasRto) || (hasRto && listHasSf)) score += 8;
    }
  }

  // ── Bedrooms (0-10 pts, residential only) ─────────────────────────
  if (prefs.bedsAvg && listing.bedrooms) {
    maxScore += 10;
    const diff = Math.abs(listing.bedrooms - prefs.bedsAvg);
    if (diff === 0) score += 10;
    else if (diff === 1) score += 7;  // one bedroom off — still great
    else if (diff === 2) score += 3;
  }

  // ── Property type (0-10 pts) ──────────────────────────────────────
  if (prefs.propertyTypes.length > 0) {
    maxScore += 10;
    const listingType = listing.propertyType || listing.propertyCategory || "";
    if (prefs.propertyTypes.includes(listingType)) {
      score += 10;
    } else {
      score += 2;  // different type but still on the platform
    }
  }

  // ── Down payment accessibility (0-5 pts) ──────────────────────────
  if (prefs.downPaymentAvg && listing.downPayment) {
    maxScore += 5;
    if (listing.downPayment <= prefs.downPaymentAvg * 1.1) {
      score += 5;  // affordable down payment
    } else if (listing.downPayment <= prefs.downPaymentAvg * 1.3) {
      score += 3;  // stretch but possible
    }
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

// ── Get recommendations — top N listings sorted by soft score ───────
// Excludes already-saved listings
export function getRecommendations(allListings, savedListings, maxResults = 6) {
  const prefs = derivePreferences(savedListings);
  if (!prefs) return { recommendations: [], preferences: null };

  const savedIds = new Set(savedListings.map((l) => String(l.id)));

  const scored = allListings
    .filter((l) => !savedIds.has(String(l.id)))  // exclude already saved
    .map((listing) => ({
      listing,
      score: softScore(listing, prefs),
    }))
    .filter((r) => r.score > 20)  // minimum threshold — below 20 is noise
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return { recommendations: scored, preferences: prefs };
}

// ── Build a natural-language summary of detected preferences ────────
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
    const cityList = prefs.uniqueCities.map((c) => c.charAt(0).toUpperCase() + c.slice(1));
    parts.push(cityList.length <= 2 ? cityList.join(" & ") : `${cityList.length} cities in Durham`);
  }

  if (prefs.dealTypes.length > 0) {
    parts.push(prefs.dealTypes.slice(0, 2).join(", "));
  }

  if (!isBusiness && prefs.bedsAvg) {
    parts.push(`${prefs.bedsAvg}+ beds`);
  }

  if (isBusiness && prefs.acreageAvg) {
    parts.push(`~${prefs.acreageAvg.toFixed(0)} acres`);
  }

  if (prefs.propertyTypes.length > 0) {
    parts.push(prefs.propertyTypes.slice(0, 2).join(", "));
  }

  return parts.join(" · ");
}

// ── Build context string for AI chat about recommendations ──────────
export function buildRecommendationContext(recommendations, prefs, isBusiness = false) {
  if (!recommendations.length || !prefs) return "";

  const summary = preferenceSummary(prefs, isBusiness);
  const recList = recommendations.map((r) =>
    `• ${r.listing.title} in ${r.listing.city} — $${r.listing.price?.toLocaleString()} (${r.score}% match) | ID:${r.listing.id}`
  ).join("\n");

  return `\n\nUser's detected preferences (from ${prefs.count} saved items): ${summary}\n\nAI recommendations:\n${recList}`;
}

// src/lib/pricing.js
// Batch 12 — Monetization plan definitions and pricing constants.
// All pricing is flat-fee (not commission-based) to stay on the
// "simple referral" side of Ontario's MBLAA.

export const LISTING_PLANS = {
  free: {
    id: "free",
    name: "Basic Listing",
    price: 0,
    pricePer: "free",
    description: "List your property and connect with buyers.",
    features: [
      { label: "Property listing on Sel-Fi", included: true },
      { label: "Appear in search results", included: true },
      { label: "Map pin visibility", included: true },
      { label: "Receive buyer inquiries", included: true },
      { label: "Match scoring with buyer profiles", included: true },
      { label: "Featured badge & priority placement", included: false },
      { label: "Highlighted map pin", included: false },
      { label: "Social media promotion", included: false },
    ],
    badge: null,
    sortBoost: 0,
    mapHighlight: false,
    stripePriceId: null,
  },
  featured: {
    id: "featured",
    name: "Featured Listing",
    price: 49,
    pricePer: "/ 30 days",
    description: "Stand out with priority placement and a featured badge.",
    features: [
      { label: "Everything in Basic", included: true },
      { label: "\"Featured\" badge on listing card", included: true },
      { label: "Priority placement in search results", included: true },
      { label: "Highlighted pin on map (larger, branded)", included: true },
      { label: "Shown in \"Featured\" section on homepage", included: true },
      { label: "Social media promotion", included: false },
    ],
    badge: "Featured",
    sortBoost: 100,
    mapHighlight: true,
    stripePriceId: null, // Set after Stripe setup: "price_xxxx"
  },
  premium: {
    id: "premium",
    name: "Premium Listing",
    price: 99,
    pricePer: "/ 30 days",
    description: "Maximum visibility with social promotion and premium placement.",
    features: [
      { label: "Everything in Featured", included: true },
      { label: "\"Premium\" badge with gold accent", included: true },
      { label: "Top of all search results", included: true },
      { label: "Featured on homepage carousel (when built)", included: true },
      { label: "Shared on Sel-Fi social media channels", included: true },
      { label: "Priority in AI recommendations", included: true },
    ],
    badge: "Premium",
    sortBoost: 200,
    mapHighlight: true,
    stripePriceId: null, // Set after Stripe setup: "price_yyyy"
  },
};

export const PARTNER_PLANS = {
  free: {
    id: "free",
    name: "Basic Partner Profile",
    price: 0,
    pricePer: "free",
    description: "Be listed in the Sel-Fi partner directory.",
    features: [
      { label: "Directory listing with contact info", included: true },
      { label: "Category tagging (lawyer, inspector, etc.)", included: true },
      { label: "Receive referral inquiries", included: true },
      { label: "Priority placement", included: false },
      { label: "\"Recommended\" badge", included: false },
      { label: "Extended profile with bio and credentials", included: false },
    ],
    badge: null,
    sortBoost: 0,
    stripePriceId: null,
  },
  premium: {
    id: "premium",
    name: "Premium Partner",
    price: 29,
    pricePer: "/ month",
    description: "Priority placement and enhanced profile in the directory.",
    features: [
      { label: "Everything in Basic", included: true },
      { label: "\"Recommended\" badge on profile", included: true },
      { label: "Priority placement in directory", included: true },
      { label: "Extended profile: bio, credentials, testimonials", included: true },
      { label: "Shown in relevant listing sidebars", included: true },
      { label: "Monthly analytics on profile views", included: true },
    ],
    badge: "Recommended",
    sortBoost: 100,
    stripePriceId: null,
  },
};

export const VERIFICATION_PRICING = {
  basic: {
    id: "basic",
    name: "Standard Verification",
    price: 0,
    pricePer: "free",
    description: "Upload documents and earn trust badges at your own pace.",
    turnaround: "5–7 business days",
    features: [
      { label: "Identity verification", included: true },
      { label: "Funds verification", included: true },
      { label: "Income verification", included: true },
      { label: "Expedited review", included: false },
    ],
  },
  expedited: {
    id: "expedited",
    name: "Expedited Verification",
    price: 19,
    pricePer: "one-time",
    description: "Same verification, faster review — ideal for active buyers.",
    turnaround: "1–2 business days",
    features: [
      { label: "Identity verification", included: true },
      { label: "Funds verification", included: true },
      { label: "Income verification", included: true },
      { label: "Expedited review (1–2 business days)", included: true },
    ],
    stripePriceId: null,
  },
};

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Sort listings with featured/premium boosted to top.
 * Preserves relative order within the same tier.
 */
export function sortWithFeatured(listings) {
  return [...listings].sort((a, b) => {
    const boostA = getPlanBoost(a.featuredPlan);
    const boostB = getPlanBoost(b.featuredPlan);
    return boostB - boostA; // Higher boost first
  });
}

/**
 * Check if a listing's featured status is still active.
 */
export function isFeaturedActive(listing) {
  if (!listing.featuredUntil) return false;
  return new Date(listing.featuredUntil) > new Date();
}

/**
 * Get sort boost for a plan ID.
 */
export function getPlanBoost(planId) {
  return LISTING_PLANS[planId]?.sortBoost || 0;
}

/**
 * Get badge label for a plan ID (or null for free).
 */
export function getPlanBadge(planId) {
  return LISTING_PLANS[planId]?.badge || null;
}

/**
 * Filter only currently-featured listings (for homepage section).
 */
export function getFeaturedListings(listings) {
  return listings.filter((l) => isFeaturedActive(l) && l.featuredPlan !== "free");
}

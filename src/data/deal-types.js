// src/data/deal-types.js
// Mega-Batch C — Centralized deal type definitions.
// Single source of truth for deal types, colors, descriptions, and filter values.
// Used by: MapSearch, BusinessMapSearch, Listings, BusinessListings, ListHome,
// BusinessListHome, ListingCard, CommListingCard, seed.js, commercial-seed.js

export const DEAL_TYPES = [
  {
    value: "seller-finance",
    label: "Seller-Finance",
    desc: "Seller holds the mortgage directly",
    color: "#2563EB",       // blue
    bgClass: "bg-blue-600",
    textClass: "text-blue-600",
    pillActive: "bg-blue-600 text-white border-blue-600",
  },
  {
    value: "rent-to-own",
    label: "Rent-to-Own",
    desc: "Rent with option to buy at a preset price",
    color: "#7C3AED",       // purple
    bgClass: "bg-purple-600",
    textClass: "text-purple-600",
    pillActive: "bg-purple-600 text-white border-purple-600",
  },
  {
    value: "lease-option",
    label: "Lease Option",
    desc: "Upfront option fee secures future purchase",
    color: "#D97706",       // amber
    bgClass: "bg-amber-600",
    textClass: "text-amber-600",
    pillActive: "bg-amber-600 text-white border-amber-600",
  },
  {
    value: "private-sale",
    label: "Private Sale",
    desc: "Standard sale, no bank or agent required",
    color: "#059669",       // emerald
    bgClass: "bg-emerald-600",
    textClass: "text-emerald-600",
    pillActive: "bg-emerald-600 text-white border-emerald-600",
  },
  {
    value: "direct-private-sale",
    label: "Direct Private Sale",
    desc: "FSBO — seller handles everything, engage your own professionals",
    color: "#0D9488",       // teal
    bgClass: "bg-teal-600",
    textClass: "text-teal-600",
    pillActive: "bg-teal-600 text-white border-teal-600",
  },
];

// Legacy-compatible label array for filter UIs
export const DEAL_TYPE_LABELS = DEAL_TYPES.map((d) => d.label);

// Quick lookup: label → color hex
export function getDealColor(label) {
  if (!label) return "#2563EB";
  const d = label.toLowerCase();
  if (d.includes("direct private") || d === "direct-private-sale") return "#0D9488";
  if (d.includes("rent")) return "#7C3AED";
  if (d.includes("lease")) return "#D97706";
  if (d.includes("private")) return "#059669";
  return "#2563EB"; // seller-finance default
}

// Quick lookup: value → full deal type object
export function getDealType(value) {
  return DEAL_TYPES.find((d) => d.value === value) || DEAL_TYPES[0];
}

// Pin legend items (for map filter sidebars)
export const DEAL_TYPE_LEGEND = DEAL_TYPES.map(({ label, color }) => ({ label, color }));

// ── Seller listing lane choices (Batch 17b) ──────────────────────────
// These are shown on ListHome and BusinessListHome to let the seller
// declare how they want to sell. MLS request is an intake form, not auto-publish.
export const SELLER_CHOICES = [
  {
    value: "private-only",
    label: "Private Sale Only",
    desc: "I want to sell directly — no MLS, no agent.",
    icon: "Home",
  },
  {
    value: "mls-request",
    label: "Request MLS Reach",
    desc: "I'd like to explore getting on MLS through a partner brokerage.",
    icon: "Globe",
  },
  {
    value: "need-buyer-agent",
    label: "Open to Buyer Agents",
    desc: "Buyers can bring their own agent. I remain unrepresented.",
    icon: "Users",
  },
  {
    value: "need-lawyer",
    label: "Need a Lawyer",
    desc: "Connect me with a real estate lawyer from the Sel-Fi Partner Directory.",
    icon: "Scale",
  },
];

// ── Seller motivation tags (Batch 17d) ───────────────────────────────
// Optional field on listing form. Filterable on browse pages.
export const MOTIVATION_TAGS = [
  "Downsizing",
  "Inherited Property",
  "Investment Exit",
  "Retirement",
  "Relocation",
  "Estate Sale",
  "Divorce / Separation",
  "Second Home / Cottage",
  "Portfolio Rebalancing",
];

// ── Co-purchase fields (Batch 17c) ──────────────────────────────────
// Added as boolean + number to listing data model.
// coPurchaseEligible: boolean (default false)
// maxGroupSize: number (2-6)
// corporatePurchaseAllowed: boolean (default false)

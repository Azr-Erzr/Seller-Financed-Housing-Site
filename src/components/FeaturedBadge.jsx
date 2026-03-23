// src/components/FeaturedBadge.jsx
// Batch 12 — Badge component for featured/premium listings and recommended partners.

import React from "react";
import { Star, Sparkles, Award } from "lucide-react";
import { isFeaturedActive } from "../lib/pricing";

const BADGE_STYLES = {
  Featured: {
    bg: "bg-amber-100 border-amber-300",
    text: "text-amber-700",
    Icon: Star,
  },
  Premium: {
    bg: "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-400",
    text: "text-amber-800",
    Icon: Sparkles,
  },
  Recommended: {
    bg: "bg-blue-100 border-blue-300",
    text: "text-blue-700",
    Icon: Award,
  },
};

/**
 * Inline badge — for use on listing cards, map popups, etc.
 * Props: badge (string: "Featured" | "Premium" | "Recommended")
 */
export function FeaturedPill({ badge }) {
  if (!badge) return null;
  const style = BADGE_STYLES[badge];
  if (!style) return null;
  const { bg, text, Icon } = style;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {badge}
    </span>
  );
}

/**
 * Card overlay badge — positioned absolute on listing card image.
 * Shows only if listing is actively featured.
 */
export function FeaturedOverlay({ listing }) {
  if (!isFeaturedActive(listing)) return null;
  const badge = listing.featuredPlan === "premium" ? "Premium" : "Featured";
  const style = BADGE_STYLES[badge];
  if (!style) return null;
  const { Icon } = style;

  const isPremium = badge === "Premium";

  return (
    <div className={`absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
      isPremium
        ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900"
        : "bg-amber-400 text-amber-900"
    }`}>
      <Icon className="w-3.5 h-3.5" />
      {badge}
    </div>
  );
}

/**
 * Partner badge — for partner directory cards.
 */
export function PartnerBadge({ plan }) {
  if (!plan || plan === "free") return null;
  return <FeaturedPill badge="Recommended" />;
}

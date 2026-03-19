// src/components/AIRecommendations.jsx
// Shows AI-powered listing recommendations when the user has 2+ saved items.
// Analyzes saved items to detect preferences, then soft-scores all listings.
// Mode-reactive (blue for Homes, emerald for Business).

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, MapPin, ChevronRight, Eye, Lightbulb } from "lucide-react";
import { getRecommendations, preferenceSummary } from "../lib/smart-match";

// ── Score badge color ───────────────────────────────────────────────
function scoreBadge(score) {
  if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
  if (score >= 60) return "bg-blue-100 text-blue-700 border-blue-200";
  if (score >= 40) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

function scoreLabel(score) {
  if (score >= 80) return "Strong match";
  if (score >= 60) return "Good match";
  if (score >= 40) return "Worth a look";
  return "Possible fit";
}

// ── Recommendation card (compact) ───────────────────────────────────
function RecCard({ listing, score, isBusiness, detailPath }) {
  const price = listing.price >= 1000000
    ? `$${(listing.price / 1000000).toFixed(1).replace(/\.0$/, "")}M`
    : `$${Math.round(listing.price / 1000)}K`;

  return (
    <Link to={detailPath}
      className="group flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all">
      {/* Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {listing.image ? (
          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Eye className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreBadge(score)}`}>
            {score}% — {scoreLabel(score)}
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {listing.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span className="font-bold text-gray-800">{price}</span>
          <span className="flex items-center gap-0.5">
            <MapPin className="w-3 h-3" />{listing.city}
          </span>
          {!isBusiness && listing.bedrooms && (
            <span>{listing.bedrooms} bed</span>
          )}
          {isBusiness && listing.acreage && (
            <span>{listing.acreage} acres</span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
    </Link>
  );
}

// ── Main component ──────────────────────────────────────────────────
export default function AIRecommendations({ savedListings, allListings, isBusiness = false }) {
  const [recs, setRecs] = useState([]);
  const [prefs, setPrefs] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (savedListings.length < 2 || allListings.length === 0) {
      setRecs([]);
      setPrefs(null);
      return;
    }
    const { recommendations, preferences } = getRecommendations(allListings, savedListings, 6);
    setRecs(recommendations);
    setPrefs(preferences);
  }, [savedListings, allListings]);

  // Don't render if fewer than 2 saved or no recommendations found
  if (savedListings.length < 2 || recs.length === 0) return null;

  const accentBg = isBusiness ? "from-emerald-50 to-green-50" : "from-blue-50 to-indigo-50";
  const accentBorder = isBusiness ? "border-emerald-200" : "border-blue-200";
  const accentText = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentIcon = isBusiness ? "text-emerald-500" : "text-blue-500";
  const pillBg = isBusiness ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700";
  const detailBase = isBusiness ? "/business/listings" : "/listings";

  const summary = preferenceSummary(prefs, isBusiness);
  const shown = expanded ? recs : recs.slice(0, 3);

  return (
    <div className={`mb-8 rounded-2xl border ${accentBorder} bg-gradient-to-br ${accentBg} p-6`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0`}>
          <Sparkles className={`w-5 h-5 ${accentIcon}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base">Recommended for You</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pillBg}`}>
              AI-Powered
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Based on your {savedListings.length} saved {isBusiness ? "properties" : "listings"}, we think you'd like these.
          </p>
        </div>
      </div>

      {/* Detected preferences */}
      {summary && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-white/60 rounded-lg">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-gray-700">Your pattern:</span> {summary}
          </p>
        </div>
      )}

      {/* Recommendation cards */}
      <div className="space-y-2.5">
        {shown.map(({ listing, score }) => (
          <RecCard
            key={listing.id}
            listing={listing}
            score={score}
            isBusiness={isBusiness}
            detailPath={`${detailBase}/${listing.id}`}
          />
        ))}
      </div>

      {/* Show more / less */}
      {recs.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`mt-3 text-sm font-medium ${accentText} hover:underline flex items-center gap-1`}
        >
          {expanded ? "Show fewer" : `Show ${recs.length - 3} more recommendations`}
          <TrendingUp className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-gray-400 mt-3">
        Recommendations are based on patterns in your saved items. Scores reflect similarity, not endorsement.
        Always do your own due diligence and consult a real estate lawyer.
      </p>
    </div>
  );
}

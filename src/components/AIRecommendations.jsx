// src/components/AIRecommendations.jsx
// Shows AI-powered recommendations on the Saved page.
// Two types:
//   type="listings" — recommend more listings based on saved listings (buyer flow)
//   type="profiles" — recommend buyer profiles that match saved listings (seller flow)
// Mode-reactive (blue for Homes, emerald for Business).

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, TrendingUp, MapPin, ChevronRight, Eye, Lightbulb,
  Users, DollarSign, Target,
} from "lucide-react";
import {
  getListingRecommendations, getProfileRecommendations,
  deriveListingPreferences, preferenceSummary,
} from "../lib/smart-match";

// ── Score badge ─────────────────────────────────────────────────────
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

// ── Listing recommendation card ─────────────────────────────────────
function ListingRecCard({ listing, score, detailPath }) {
  const price = listing.price >= 1000000
    ? `$${(listing.price / 1000000).toFixed(1).replace(/\.0$/, "")}M`
    : `$${Math.round(listing.price / 1000)}K`;

  return (
    <Link to={detailPath}
      className="group flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {listing.image ? (
          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300"><Eye className="w-6 h-6" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreBadge(score)}`}>
            {score}% — {scoreLabel(score)}
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{listing.title}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span className="font-bold text-gray-800">{price}</span>
          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{listing.city}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
    </Link>
  );
}

// ── Profile / buyer recommendation card ─────────────────────────────
function ProfileRecCard({ profile, score, matchedListing, detailPath, isBusiness }) {
  const budget = profile.budget >= 1000000
    ? `$${(profile.budget / 1000000).toFixed(1).replace(/\.0$/, "")}M`
    : `$${Math.round(profile.budget / 1000)}K`;
  const displayName = profile.useAlias ? profile.alias : profile.name;

  return (
    <Link to={detailPath}
      className="group flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
        isBusiness ? "bg-emerald-100" : "bg-blue-100"
      }`}>
        <Users className={`w-5 h-5 ${isBusiness ? "text-emerald-600" : "text-blue-600"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreBadge(score)}`}>
            {score}% — {scoreLabel(score)}
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {displayName || "Buyer"}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span className="flex items-center gap-0.5"><DollarSign className="w-3 h-3" />Budget: {budget}</span>
          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{profile.city}</span>
        </div>
        {matchedListing && (
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">
            Best match for: {matchedListing.title}
          </p>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LISTING RECOMMENDATIONS PANEL
// ═══════════════════════════════════════════════════════════════════

export function ListingRecommendations({ savedListings, allListings, isBusiness = false }) {
  const [recs, setRecs] = useState([]);
  const [prefs, setPrefs] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (savedListings.length < 2 || allListings.length === 0) { setRecs([]); setPrefs(null); return; }
    const { recommendations, preferences } = getListingRecommendations(allListings, savedListings, 6);
    setRecs(recommendations);
    setPrefs(preferences);
  }, [savedListings, allListings]);

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
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
          <Sparkles className={`w-5 h-5 ${accentIcon}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base">
              Recommended {isBusiness ? "Properties" : "Listings"}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pillBg}`}>AI-Powered</span>
          </div>
          <p className="text-sm text-gray-500">
            Based on your {savedListings.length} saved {isBusiness ? "properties" : "listings"}, we think you'd like these.
          </p>
        </div>
      </div>

      {summary && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-white/60 rounded-lg">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-xs text-gray-600"><span className="font-semibold text-gray-700">Your pattern:</span> {summary}</p>
        </div>
      )}

      <div className="space-y-2.5">
        {shown.map(({ listing, score }) => (
          <ListingRecCard key={listing.id} listing={listing} score={score} detailPath={`${detailBase}/${listing.id}`} />
        ))}
      </div>

      {recs.length > 3 && (
        <button onClick={() => setExpanded(!expanded)}
          className={`mt-3 text-sm font-medium ${accentText} hover:underline flex items-center gap-1`}>
          {expanded ? "Show fewer" : `Show ${recs.length - 3} more`} <TrendingUp className="w-3.5 h-3.5" />
        </button>
      )}

      <p className="text-[10px] text-gray-400 mt-3">
        Recommendations based on patterns in your saved items. Always do your own due diligence.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BUYER / PROFILE RECOMMENDATIONS PANEL (seller flow)
// ═══════════════════════════════════════════════════════════════════

export function BuyerRecommendations({ savedListings, allProfiles, isBusiness = false }) {
  const [recs, setRecs] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (savedListings.length === 0 || allProfiles.length === 0) { setRecs([]); return; }
    const { recommendations } = getProfileRecommendations(allProfiles, savedListings, 6);
    setRecs(recommendations);
  }, [savedListings, allProfiles]);

  if (recs.length === 0) return null;

  const accentBg = isBusiness ? "from-emerald-50 to-teal-50" : "from-blue-50 to-cyan-50";
  const accentBorder = isBusiness ? "border-emerald-200" : "border-blue-200";
  const accentText = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentIcon = isBusiness ? "text-emerald-500" : "text-blue-500";
  const pillBg = isBusiness ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700";
  const detailBase = isBusiness ? "/business/profiles" : "/profiles";
  const shown = expanded ? recs : recs.slice(0, 3);

  return (
    <div className={`mb-8 rounded-2xl border ${accentBorder} bg-gradient-to-br ${accentBg} p-6`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
          <Target className={`w-5 h-5 ${accentIcon}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base">Buyers Who Match Your {isBusiness ? "Properties" : "Listings"}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pillBg}`}>AI-Powered</span>
          </div>
          <p className="text-sm text-gray-500">
            These {isBusiness ? "buyers" : "buyers"} are looking for {isBusiness ? "properties" : "homes"} similar to what you've saved.
            {savedListings.length >= 2
              ? " Scores are based on the best match across your saved items."
              : " Save more listings to improve recommendations."}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {shown.map(({ profile, score, matchedListing }) => (
          <ProfileRecCard
            key={profile.id}
            profile={profile}
            score={score}
            matchedListing={matchedListing}
            detailPath={`${detailBase}/${profile.id}`}
            isBusiness={isBusiness}
          />
        ))}
      </div>

      {recs.length > 3 && (
        <button onClick={() => setExpanded(!expanded)}
          className={`mt-3 text-sm font-medium ${accentText} hover:underline flex items-center gap-1`}>
          {expanded ? "Show fewer" : `Show ${recs.length - 3} more`} <TrendingUp className="w-3.5 h-3.5" />
        </button>
      )}

      <p className="text-[10px] text-gray-400 mt-3">
        Match scores indicate how well a buyer's criteria align with your saved {isBusiness ? "properties" : "listings"}.
        Always consult a real estate lawyer before entering any agreement.
      </p>
    </div>
  );
}

// Default export for backwards compat
export default ListingRecommendations;

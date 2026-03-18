// src/components/ProfileCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { DollarSign, TrendingUp, Shield } from "lucide-react";

const getDisplayName = (profile) =>
  profile.useAlias && profile.alias ? profile.alias : profile.name;

const getInitials = (name) =>
  name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

const getRiskStyle = (risk) => {
  if (risk === "Low") return "bg-green-100 text-green-700";
  if (risk === "Moderate") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

const getDealStyle = (pref) => {
  if (!pref) return "bg-gray-100 text-gray-600";
  if (pref.toLowerCase().includes("rent")) return "bg-purple-100 text-purple-700";
  return "bg-blue-100 text-blue-700";
};

const getMatchColor = (score) => {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-green-400";
  if (score >= 55) return "bg-yellow-400";
  return "bg-orange-400";
};

const StarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function ProfileCard({ profile, matchScore }) {
  const score = matchScore ?? profile.matchScore ?? null;
  const displayName = getDisplayName(profile);
  const isAliased = profile.useAlias && profile.alias;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start gap-4">

        {/* Avatar */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0 ${
          isAliased ? "bg-gradient-to-br from-gray-500 to-gray-700" : "bg-gradient-to-br from-blue-500 to-blue-800"
        }`}>
          {isAliased ? <Shield className="w-6 h-6" /> : getInitials(profile.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="font-semibold text-gray-900">{displayName}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">{profile.city}</p>
                {isAliased && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">Identity protected</span>}
              </div>
            </div>
            {score !== null && (
              <div className={`${getMatchColor(score)} text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shrink-0`}>
                <StarIcon />
                <span>{score}%</span>
              </div>
            )}
          </div>

          {/* Financials */}
          <div className="space-y-1.5 mt-2 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Budget:</span>
              <span className="font-semibold text-gray-800">${profile.budget?.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Down Payment:</span>
              <span className="font-semibold text-gray-800">${profile.downPayment?.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Interest Tolerance:</span>
              <span className="font-semibold text-gray-800">{profile.interestRange}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getDealStyle(profile.dealPreference)}`}>
              {profile.dealPreference}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getRiskStyle(profile.riskTolerance)}`}>
              Risk: {profile.riskTolerance}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              to={`/profiles/${profile.id}`}
              className="flex-1 text-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Profile
            </Link>
            <button className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

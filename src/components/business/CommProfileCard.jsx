// src/components/business/CommProfileCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { DollarSign, Ruler, Target, Shield } from "lucide-react";
import { VerificationPills } from "../VerificationBadges";

const getInitials = (name) =>
  name?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

const getDisplayName = (profile) =>
  profile.useAlias && profile.alias ? profile.alias : profile.name;

const getRiskStyle = (risk) => {
  if (risk === "Low")      return "bg-green-100 text-green-700";
  if (risk === "Moderate") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

export default function CommProfileCard({ profile }) {
  const displayName = getDisplayName(profile);
  const isAliased = profile.useAlias && profile.alias;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start gap-4">

        {/* Avatar */}
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 ${
          isAliased ? "bg-gradient-to-br from-gray-500 to-gray-700" : "bg-gradient-to-br from-emerald-500 to-emerald-700"
        }`}>
          {profile.avatar && !isAliased
            ? <img src={profile.avatar} alt={displayName} className="w-full h-full object-cover rounded-xl" />
            : isAliased ? <Shield className="w-6 h-6" /> : getInitials(profile.name)
          }
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{displayName}</h3>
          {!isAliased && profile.contact && <p className="text-xs text-gray-400">{profile.contact}</p>}
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 mt-0.5">{profile.city}</p>
            {isAliased && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">Identity protected</span>}
          </div>

          <div className="space-y-1.5 mt-3 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Budget:</span>
              <span className="font-semibold text-gray-800">${profile.budget?.toLocaleString()}</span>
            </div>
            {profile.minAcreage && (
              <div className="flex items-center gap-2 text-sm">
                <Ruler className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-500">Acreage:</span>
                <span className="font-semibold text-gray-800">
                  {profile.minAcreage}–{profile.maxAcreage || "any"} acres
                </span>
              </div>
            )}
            {profile.intendedUses?.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-500">Use:</span>
                <span className="font-semibold text-gray-800 truncate">{profile.intendedUses[0]}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {profile.propertyCategories?.slice(0, 2).map((c) => (
              <span key={c} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{c}</span>
            ))}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRiskStyle(profile.riskTolerance)}`}>
              {profile.riskTolerance} risk
            </span>
            <VerificationPills status={profile.verificationStatus} />
          </div>

          <div className="flex gap-2">
            <Link to={`/business/profiles/${profile.id}`}
              className="flex-1 text-center px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
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

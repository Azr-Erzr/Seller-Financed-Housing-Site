// src/pages/ProfileDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { getProfileById, getAllListings } from "../lib/storage";
import { rankListingsForProfile } from "../lib/match";
import { dti } from "../lib/finance";
import { money, Badge, Stat } from "../ui/UIComponents";

const StarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const getMatchColor = (score) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-green-400";
  if (score >= 40) return "bg-yellow-400";
  return "bg-orange-400";
};

export default function ProfileDetail() {
  const { id } = useParams();
  const profile = getProfileById(id);

  if (!profile) return (
    <div className="p-12 text-center text-gray-500">
      Profile not found. <Link to="/profiles" className="text-blue-600 underline">Back to profiles</Link>
    </div>
  );

  const allListings = getAllListings();
  const matchedListings = rankListingsForProfile(allListings, profile);

  const dtiRatio = dti({ monthlyDebt: profile.monthlyDebt, monthlyIncome: profile.monthlyIncome });
  const dtiColor = dtiRatio < 0.35 ? "text-green-600" : dtiRatio < 0.45 ? "text-yellow-600" : "text-red-600";
  const dtiLabel = dtiRatio < 0.35 ? "✓ Strong" : dtiRatio < 0.45 ? "⚠ Moderate" : "✗ High";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">

      <Link to="/profiles" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
        ← Back to Buyers
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 text-white text-3xl font-extrabold flex items-center justify-center shrink-0">
            {profile.name?.charAt(0)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-gray-500">{profile.city}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              {profile.badges?.map((b) => <Badge key={b} tone="success">{b}</Badge>)}
              <Badge tone="info">{profile.dealPreference}</Badge>
              <Badge tone={profile.riskTolerance === "Low" ? "success" : profile.riskTolerance === "Moderate" ? "warning" : "danger"}>
                {profile.riskTolerance} risk
              </Badge>
            </div>
          </div>
        </div>
        {profile.bio && <p className="mt-4 text-gray-600 leading-relaxed border-t pt-4">{profile.bio}</p>}
      </div>

      {/* Financial Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-lg mb-4">Financial Profile</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          <Stat label="Max Budget"          value={money(profile.budget)} />
          <Stat label="Available Down"      value={money(profile.downPayment)} />
          <Stat label="Max Monthly Payment" value={money(profile.paymentBudget)} />
          <Stat label="Monthly Income"      value={money(profile.monthlyIncome)} />
          <Stat label="Monthly Debt"        value={money(profile.monthlyDebt)} />
          <Stat label="Interest Tolerance"  value={profile.interestRange} />
        </div>
        {profile.monthlyIncome > 0 && (
          <div className="mt-5 pt-4 border-t">
            <p className="text-sm text-gray-500 mb-1">
              Debt-to-Income Ratio
              <span className={`ml-2 font-bold ${dtiColor}`}>{(dtiRatio * 100).toFixed(1)}%</span>
              <span className="text-xs text-gray-400 ml-2">{dtiLabel}</span>
            </p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${dtiRatio < 0.35 ? "bg-green-400" : dtiRatio < 0.45 ? "bg-yellow-400" : "bg-red-400"}`}
                style={{ width: `${Math.min(100, (dtiRatio / 0.6) * 100)}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Existing monthly debt / gross monthly income. Below 35% is ideal for seller-finance deals.</p>
          </div>
        )}
      </div>

      {/* Listing Matches */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-lg mb-1">Listing Matches</h2>
        <p className="text-sm text-gray-500 mb-4">Homes whose terms, price, and deal type align with this buyer's profile.</p>
        <div className="space-y-3">
          {matchedListings.map(({ listing, score }) => (
            <div key={listing.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
              <div>
                <p className="font-medium text-sm">{listing.title}</p>
                <p className="text-xs text-gray-400">{listing.city} · {money(listing.price)} · {listing.dealType}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`${getMatchColor(score)} text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-semibold`}>
                  <StarIcon />{score}% match
                </span>
                <Link to={`/listings/${listing.id}`} className="text-xs text-blue-600 hover:underline">View →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">Invite to Deal</button>
        <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition">Save Profile</button>
        <Link to="/profiles" className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition">← Back</Link>
      </div>
    </div>
  );
}

// src/pages/business/BusinessProfileDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCommProfileById, getAllCommListings, toggleSavedProfile, isProfileSaved } from "../../lib/commercial-storage";
import { useToast } from "../../components/Toast";
import { MapPin, DollarSign, Ruler, Target, Clock, Bookmark, BookmarkCheck, Send, ArrowLeft, ShieldCheck } from "lucide-react";

const money = (n) => n ? `$${Number(n).toLocaleString("en-CA")}` : "—";

const getRiskStyle = (risk) => {
  if (risk === "Low")      return "bg-green-100 text-green-700";
  if (risk === "Moderate") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

const getInitials = (name) =>
  name?.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="font-semibold text-gray-900">{value ?? "—"}</span>
    </div>
  );
}

export default function BusinessProfileDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    getCommProfileById(id).then((p) => {
      setProfile(p);
      setSaved(isProfileSaved(`comm_${id}`));
      setLoading(false);
    });
  }, [id]);

  const handleSave = () => {
    const nowSaved = toggleSavedProfile(`comm_${id}`);
    setSaved(nowSaved);
    toast[nowSaved ? "success" : "info"](
      nowSaved ? "Buyer profile saved." : "Profile removed from bookmarks."
    );
  };

  const handleInvite = () => {
    toast.info("Messaging feature coming soon. Create a profile to be notified when it launches.");
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>;
  if (!profile) return (
    <div className="p-12 text-center text-gray-500">
      Profile not found.{" "}
      <Link to="/business/profiles" className="text-emerald-600 underline">Back to buyers</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <Link to="/business/profiles" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Buyers
        </Link>

        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-3xl font-extrabold flex items-center justify-center shrink-0">
              {profile.avatar
                ? <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-2xl" />
                : getInitials(profile.name)
              }
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              {profile.contact && profile.contact !== profile.name && (
                <p className="text-gray-500 text-sm">{profile.contact}</p>
              )}
              <p className="text-gray-400 text-sm flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />{profile.city}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                {profile.badges?.map((b) => (
                  <span key={b} className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">{b}</span>
                ))}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getRiskStyle(profile.riskTolerance)}`}>
                  {profile.riskTolerance} risk
                </span>
                {profile.dealPreference && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                    {profile.dealPreference}
                  </span>
                )}
              </div>
            </div>
          </div>
          {profile.bio && (
            <p className="mt-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{profile.bio}</p>
          )}
        </div>

        {/* Financial Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-lg text-gray-900 mb-4">Financial Profile</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            <Stat label="Max Budget"         value={money(profile.budget)} />
            <Stat label="Available Down"     value={money(profile.downPayment)} />
            <Stat label="Interest Tolerance" value={profile.interestRange} />
            <Stat label="Monthly Income"     value={money(profile.monthlyIncome)} />
            <Stat label="Monthly Debt"       value={money(profile.monthlyDebt)} />
            {profile.timelineMonths > 0 && (
              <Stat label="Timeline" value={`${profile.timelineMonths} months`} />
            )}
          </div>
        </div>

        {/* What They're Looking For */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-lg text-gray-900">What They're Looking For</h2>

          {profile.propertyCategories?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Property Categories</p>
              <div className="flex flex-wrap gap-2">
                {profile.propertyCategories.map((c) => (
                  <span key={c} className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-medium">{c}</span>
                ))}
              </div>
            </div>
          )}

          {profile.intendedUses?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Intended Uses</p>
              <div className="flex flex-wrap gap-2">
                {profile.intendedUses.map((u) => (
                  <span key={u} className="text-sm bg-amber-50 text-amber-700 px-3 py-1 rounded-lg font-medium">{u}</span>
                ))}
              </div>
            </div>
          )}

          {profile.zoningPreferences?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Acceptable Zoning</p>
              <div className="flex flex-wrap gap-2">
                {profile.zoningPreferences.map((z) => (
                  <span key={z} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">{z}</span>
                ))}
              </div>
            </div>
          )}

          {(profile.minAcreage || profile.maxAcreage) && (
            <div className="flex items-center gap-3 text-sm">
              <Ruler className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Acreage range:</span>
              <span className="font-semibold text-gray-900">
                {profile.minAcreage || "any"} — {profile.maxAcreage || "any"} acres
              </span>
            </div>
          )}

          {profile.utilitiesRequired?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Required Utilities</p>
              <div className="flex flex-wrap gap-2">
                {profile.utilitiesRequired.map((u) => (
                  <span key={u} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">{u}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <button onClick={handleInvite}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition">
            <Send className="w-4 h-4" /> Invite to Deal
          </button>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
              saved
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {saved ? "Saved" : "Save Profile"}
          </button>
          <Link to="/business/profiles" className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition">
            ← Back
          </Link>
        </div>

      </div>
    </div>
  );
}

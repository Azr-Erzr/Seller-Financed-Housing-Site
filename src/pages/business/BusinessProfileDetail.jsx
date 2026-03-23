// src/pages/business/BusinessProfileDetail.jsx
// Auth-gated: requires sign-in to view buyer profile details.
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCommProfileById, toggleSavedProfile, isProfileSaved } from "../../lib/commercial-storage";
import { useToast } from "../../components/Toast";
import ContactModal from "../../components/ContactModal";
import AuthGate from "../../components/AuthGate";
import { MapPin, Ruler, Bookmark, BookmarkCheck, Send, ArrowLeft, Shield, Users } from "lucide-react";
import { VerificationDetailPanel, VerificationLevelBadge } from "../../components/VerificationBadges";

const money = (n) => n ? `$${Number(n).toLocaleString("en-CA")}` : "—";
const getInitials = (name) => name?.split(" ").slice(0,2).map((w) => w[0]).join("").toUpperCase() || "?";

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="font-semibold text-gray-900">{value ?? "—"}</span>
    </div>
  );
}

const getRisk = (risk) => {
  if (risk === "Low")      return "bg-green-100 text-green-700";
  if (risk === "Moderate") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

function BusinessProfileDetailContent() {
  const { id } = useParams();
  const { toast } = useToast();

  const [profile,     setProfile]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [saved,       setSaved]       = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

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
    toast[nowSaved ? "success" : "info"](nowSaved ? "Buyer profile saved." : "Profile removed from saved.");
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>;
  if (!profile) return (
    <div className="p-12 text-center text-gray-500">
      Profile not found. <Link to="/business/profiles" className="text-emerald-600 underline">Back to buyers</Link>
    </div>
  );

  const isAliased = profile.useAlias && profile.alias;
  const displayName = isAliased ? profile.alias : profile.name;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/business/profiles" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Buyers
        </Link>

        {isAliased && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-500 shrink-0" />
            <p className="text-sm text-gray-600">This buyer's identity is protected. Their real name and contact details will be shared when you reach out through Sel-Fi.</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className={`w-24 h-24 rounded-2xl text-white text-3xl font-extrabold flex items-center justify-center shrink-0 ${
              isAliased ? "bg-gradient-to-br from-gray-500 to-gray-700" : "bg-gradient-to-br from-emerald-500 to-emerald-700"
            }`}>
              {isAliased ? <Shield className="w-10 h-10" /> : profile.avatar ? <img src={profile.avatar} alt={displayName} className="w-full h-full object-cover rounded-2xl" /> : getInitials(profile.name)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
              {!isAliased && profile.contact && profile.contact !== profile.name && <p className="text-gray-500 text-sm">{profile.contact}</p>}
              <p className="text-gray-400 text-sm flex items-center justify-center sm:justify-start gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5" /> {profile.city}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                {isAliased && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><Shield className="w-3 h-3" /> Identity protected</span>}
                {profile.badges?.map((b) => <span key={b} className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">{b}</span>)}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getRisk(profile.riskTolerance)}`}>{profile.riskTolerance} risk</span>
                {profile.dealPreference && <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">{profile.dealPreference}</span>}
                <VerificationLevelBadge status={profile.verificationStatus} />
              </div>
            </div>
          </div>
          {profile.bio && <p className="mt-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{profile.bio}</p>}
        </div>

        <VerificationDetailPanel status={profile.verificationStatus} isBusiness={true} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-lg text-gray-900 mb-4">Financial Profile</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            <Stat label="Max Budget" value={money(profile.budget)} />
            <Stat label="Available Down" value={money(profile.downPayment)} />
            <Stat label="Interest Tolerance" value={profile.interestRange} />
            {profile.show_income && profile.monthlyIncome && <Stat label="Monthly Income" value={money(profile.monthlyIncome)} />}
            {profile.monthlyDebt > 0 && <Stat label="Monthly Debt" value={money(profile.monthlyDebt)} />}
            {profile.timelineMonths > 0 && <Stat label="Timeline" value={`${profile.timelineMonths} months`} />}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-lg text-gray-900">What They're Looking For</h2>
          {profile.propertyCategories?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Property Categories</p>
              <div className="flex flex-wrap gap-2">{profile.propertyCategories.map((c) => <span key={c} className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-medium">{c}</span>)}</div>
            </div>
          )}
          {profile.intendedUses?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Intended Uses</p>
              <div className="flex flex-wrap gap-2">{profile.intendedUses.map((u) => <span key={u} className="text-sm bg-amber-50 text-amber-700 px-3 py-1 rounded-lg font-medium">{u}</span>)}</div>
            </div>
          )}
          {profile.zoningPreferences?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Acceptable Zoning</p>
              <div className="flex flex-wrap gap-2">{profile.zoningPreferences.map((z) => <span key={z} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">{z}</span>)}</div>
            </div>
          )}
          {(profile.minAcreage || profile.maxAcreage) && (
            <div className="flex items-center gap-3 text-sm">
              <Ruler className="w-4 h-4 text-gray-400" /><span className="text-gray-600">Acreage range:</span>
              <span className="font-semibold text-gray-900">{profile.minAcreage || "any"} — {profile.maxAcreage || "any"} acres</span>
            </div>
          )}
          {profile.utilitiesRequired?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Required Utilities</p>
              <div className="flex flex-wrap gap-2">{profile.utilitiesRequired.map((u) => <span key={u} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">{u}</span>)}</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pb-4">
          <button onClick={() => setContactOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"><Send className="w-4 h-4" /> Invite to Deal</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${saved ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}{saved ? "Saved" : "Save Profile"}
          </button>
          <Link to="/business/profiles" className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition-colors">← Back</Link>
        </div>

        <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} recipientName={displayName} recipientType="buyer" refType="comm_profile" refId={profile.id} refTitle={`Buyer Profile — ${displayName}`} isAliased={isAliased} />
      </div>
    </div>
  );
}

export default function BusinessProfileDetail() {
  return (
    <AuthGate title="Sign in to view buyer details" message="Buyer profiles contain financial details and deal preferences. Create a free account to view and connect." icon={Users}>
      <BusinessProfileDetailContent />
    </AuthGate>
  );
}

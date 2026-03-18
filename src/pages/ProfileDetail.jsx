// src/pages/ProfileDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfileById, getAllListings, toggleSavedProfile, isProfileSaved } from "../lib/storage";
import { useToast } from "../components/Toast";
import ContactModal from "../components/ContactModal";
import { MapPin, DollarSign, TrendingUp, Bookmark, BookmarkCheck, Send, ArrowLeft, Shield } from "lucide-react";

const money = (n) => n ? `$${Number(n).toLocaleString("en-CA")}` : "—";
const pct   = (n) => n ? `${(Number(n)*100).toFixed(1)}%` : "—";

function Stat({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="font-semibold text-gray-900">{value ?? "—"}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

function DTIBar({ income, debt, payment }) {
  const total = (debt + payment);
  const pct   = income > 0 ? Math.min((total / income) * 100, 100) : 0;
  const color  = pct < 33 ? "bg-green-500" : pct < 43 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Debt-to-Income Ratio</span>
        <span className={pct >= 43 ? "text-red-500 font-semibold" : pct >= 33 ? "text-yellow-600 font-semibold" : "text-green-600 font-semibold"}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>Good &lt;33%</span><span>Caution 33–43%</span><span>High &gt;43%</span>
      </div>
    </div>
  );
}

const getRisk = (risk) => {
  if (risk === "Low")      return "bg-green-100 text-green-700";
  if (risk === "Moderate") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

export default function ProfileDetail() {
  const { id } = useParams();
  const { toast } = useToast();

  const [profile,      setProfile]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [saved,        setSaved]        = useState(false);
  const [contactOpen,  setContactOpen]  = useState(false);

  useEffect(() => {
    getProfileById(id).then((p) => {
      setProfile(p);
      setSaved(isProfileSaved(id));
      setLoading(false);
    });
  }, [id]);

  const handleSave = () => {
    const nowSaved = toggleSavedProfile(id);
    setSaved(nowSaved);
    toast[nowSaved ? "success" : "info"](nowSaved ? "Buyer profile saved." : "Profile removed from saved.");
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>;
  if (!profile) return (
    <div className="p-12 text-center text-gray-500">
      Profile not found. <Link to="/profiles" className="text-blue-600 underline">Back to buyers</Link>
    </div>
  );

  const dti = profile.monthlyIncome > 0
    ? ((profile.monthlyDebt + profile.paymentBudget) / profile.monthlyIncome) * 100
    : null;

  const isAliased = profile.useAlias && profile.alias;
  const displayName = isAliased ? profile.alias : profile.name;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <Link to="/profiles" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Buyers
        </Link>

        {/* Privacy notice for aliased profiles */}
        {isAliased && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-500 shrink-0" />
            <p className="text-sm text-gray-600">
              This buyer's identity is protected. Their real name will be shared when you contact them through Sel-Fi.
            </p>
          </div>
        )}

        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className={`w-24 h-24 rounded-2xl text-white text-3xl font-extrabold flex items-center justify-center shrink-0 ${
              isAliased ? "bg-gradient-to-br from-gray-500 to-gray-700" : "bg-gradient-to-br from-blue-500 to-blue-700"
            }`}>
              {isAliased
                ? <Shield className="w-10 h-10" />
                : profile.avatar
                  ? <img src={profile.avatar} alt={displayName} className="w-full h-full object-cover rounded-2xl" />
                  : profile.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0,2)
              }
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
              <p className="text-gray-400 text-sm flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" /> {profile.city}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                {isAliased && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Identity protected
                  </span>
                )}
                {profile.badges?.map((b) => (
                  <span key={b} className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">{b}</span>
                ))}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getRisk(profile.riskTolerance)}`}>
                  {profile.riskTolerance} risk
                </span>
                {profile.dealPreference && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-medium">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-5">
            <Stat label="Max Budget"       value={money(profile.budget)} />
            <Stat label="Down Payment"     value={money(profile.downPayment)} />
            <Stat label="Max Monthly"      value={money(profile.paymentBudget)} />
            <Stat label="Max Rate"         value={pct(profile.interestMax)} />
            {profile.show_income && profile.monthlyIncome && (
              <Stat label="Monthly Income" value={money(profile.monthlyIncome)} />
            )}
            {profile.monthlyDebt > 0 && (
              <Stat label="Monthly Debt"   value={money(profile.monthlyDebt)} />
            )}
          </div>

          {/* DTI bar */}
          {profile.monthlyIncome > 0 && (
            <DTIBar
              income={profile.monthlyIncome}
              debt={profile.monthlyDebt || 0}
              payment={profile.paymentBudget || 0}
            />
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setContactOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            <Send className="w-4 h-4" /> Invite to Deal
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
              saved
                ? "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {saved ? "Saved" : "Save Profile"}
          </button>
          <Link to="/profiles" className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition-colors">
            ← Back
          </Link>
        </div>

        <ContactModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          recipientName={displayName}
          recipientType="buyer"
          refType="profile"
          refId={profile.id}
          refTitle={`Buyer Profile — ${displayName}`}
          isAliased={isAliased}
        />
      </div>
    </div>
  );
}

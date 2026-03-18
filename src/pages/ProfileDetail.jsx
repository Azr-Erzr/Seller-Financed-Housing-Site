// src/pages/ProfileDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfileById, getAllListings, toggleSavedProfile, isProfileSaved } from "../lib/storage";
import { useToast } from "../components/Toast";
import ContactModal from "../components/ContactModal";
import { MapPin, DollarSign, TrendingUp, Bookmark, BookmarkCheck, Send, ArrowLeft } from "lucide-react";

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
  const ratio = income > 0 ? Math.min((total / income) * 100, 100) : 0;
  const color  = ratio < 33 ? "bg-green-500" : ratio < 43 ? "bg-yellow-500" : "bg-red-500";
  const textColor = ratio < 33 ? "text-green-600" : ratio < 43 ? "text-yellow-600" : "text-red-500";

  return (
    <div className="space-y-4">
      {/* Calculation breakdown */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">DTI Calculation</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Monthly debt payments</span>
            <span className="font-medium text-gray-800">${debt.toLocaleString("en-CA")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">+ Proposed housing payment</span>
            <span className="font-medium text-gray-800">${payment.toLocaleString("en-CA")}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between">
            <span className="text-gray-700 font-medium">Total monthly obligations</span>
            <span className="font-bold text-gray-900">${total.toLocaleString("en-CA")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">÷ Gross monthly income</span>
            <span className="font-medium text-gray-800">${income.toLocaleString("en-CA")}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Debt-to-Income Ratio</span>
            <span className={`text-lg font-extrabold ${textColor}`}>{ratio.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Visual bar */}
      <div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
          {/* Zone indicators */}
          <div className="absolute inset-0 flex">
            <div className="w-[33%] bg-green-100" />
            <div className="w-[10%] bg-yellow-100" />
            <div className="flex-1 bg-red-100" />
          </div>
          {/* Actual value */}
          <div className={`h-full rounded-full transition-all relative z-10 ${color}`} style={{ width: `${ratio}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
          <span className="text-green-600 font-medium">Good &lt;33%</span>
          <span className="text-yellow-600 font-medium">Caution 33–43%</span>
          <span className="text-red-500 font-medium">High &gt;43%</span>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`rounded-lg px-4 py-3 text-sm ${
        ratio < 33 ? "bg-green-50 text-green-700" : ratio < 43 ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"
      }`}>
        {ratio < 33
          ? "Strong financial position. Most sellers would be comfortable with this buyer's debt load."
          : ratio < 43
          ? "Moderate debt load. Sellers should consider the buyer's income stability and down payment size."
          : "High debt-to-income ratio. A larger down payment or lower purchase price may be needed to offset risk."
        }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <Link to="/profiles" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Buyers
        </Link>

        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white text-3xl font-extrabold flex items-center justify-center shrink-0">
              {profile.avatar
                ? <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-2xl" />
                : profile.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0,2)
              }
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-400 text-sm flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" /> {profile.city}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
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
          recipientName={profile.name}
          recipientType="buyer"
          refType="profile"
          refId={profile.id}
          refTitle={`Buyer Profile — ${profile.name}`}
        />
      </div>
    </div>
  );
}

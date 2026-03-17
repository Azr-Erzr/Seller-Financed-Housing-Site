// src/pages/CreateProfile.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { saveProfile } from "../lib/storage";
import { useToast } from "../components/Toast";
import { Users, CheckCircle } from "lucide-react";

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-900 placeholder-gray-400";

const DEAL_OPTIONS = [
  { value: "seller-finance", label: "Seller-Finance", desc: "Direct financing from seller" },
  { value: "rent-to-own",    label: "Rent-to-Own",    desc: "Rent with option to buy" },
  { value: "lease-option",   label: "Lease Option",   desc: "Option fee to lock in purchase" },
  { value: "private-sale",   label: "Private Sale",   desc: "Standard sale, no bank" },
];

// ── Currency input ────────────────────────────────────────────────────
function CurrencyInput({ label, hint, error, value, onChange, placeholder }) {
  const format = (n) => {
    const raw = String(n).replace(/[^0-9]/g, "");
    if (!raw) return "";
    return Number(raw).toLocaleString("en-CA");
  };
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    onChange(raw ? Number(raw) : "");
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">$</span>
        <input type="text" inputMode="numeric" value={format(value)} onChange={handleChange}
          placeholder={placeholder} className={`${inputCls} pl-7`} />
      </div>
      {hint  && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      {children}
      {hint  && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function CreateProfile() {
  const { toast } = useToast();
  const [submitted, setSubmitted]   = useState(false);
  const [newId, setNewId]           = useState(null);
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", city: "", bio: "",
    budget: "", downPayment: "", paymentBudget: "",
    monthlyIncome: "", monthlyDebt: "",
    interestMax: "",
    dealPreferences: [],
    riskTolerance: "Moderate",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const toggleDeal = (val) => {
    const curr = form.dealPreferences;
    set("dealPreferences", curr.includes(val) ? curr.filter((v) => v !== val) : [...curr, val]);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.city.trim())    e.city    = "City is required";
    if (!form.budget)         e.budget  = "Required";
    if (!form.downPayment)    e.downPayment  = "Required";
    if (!form.paymentBudget)  e.paymentBudget = "Required";
    if (!form.monthlyIncome)  e.monthlyIncome = "Required";
    if (!form.interestMax)    e.interestMax = "Required";
    if (form.dealPreferences.length === 0) e.dealPreferences = "Select at least one";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Please fix the errors above before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const primaryPref = form.dealPreferences[0] || "seller-finance";
      const dealLabel = DEAL_OPTIONS.find((d) => d.value === primaryPref)?.label || "Seller-Finance";

      const profile = {
        ...form,
        budget:         Number(form.budget),
        downPayment:    Number(form.downPayment),
        paymentBudget:  Number(form.paymentBudget),
        monthlyIncome:  Number(form.monthlyIncome),
        monthlyDebt:    Number(form.monthlyDebt) || 0,
        interestMax:    Number(form.interestMax) / 100,
        interestRange:  `Up to ${form.interestMax}%`,
        dealPreference: dealLabel,
        badges:         ["New"],
        avatar:         "",
      };

      const saved = await saveProfile(profile);
      if (saved) {
        setNewId(saved.id);
        setSubmitted(true);
        toast.success("Your buyer profile is now live!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 px-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Created!</h1>
        <p className="text-gray-500 mb-8">
          Your buyer profile is live on HomeMatch. Sellers whose listings match your terms can find you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/profiles/${newId}`} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            View My Profile
          </Link>
          <Link to="/listings" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Browse Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Buyer Profile</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Tell sellers who you are and what you're looking for. The more detail you provide, the better your matches will be.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── About You ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-base">About You</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Your Name" error={errors.name} hint="First name and last initial is fine for privacy.">
                <input className={inputCls} value={form.name}
                  onChange={(e) => set("name", e.target.value)} placeholder="e.g. Alyssa T." />
              </Field>
              <Field label="City / Area" error={errors.city} hint="Where are you looking to buy?">
                <input className={inputCls} value={form.city}
                  onChange={(e) => set("city", e.target.value)} placeholder="Whitby, ON" />
              </Field>
            </div>

            <Field label="About You" hint="Tell sellers about your situation and what you're looking for.">
              <textarea className={`${inputCls} h-28 resize-none`} value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="Young family looking for a 3-bed near schools. We've been saving for 3 years and are ready to move..." />
            </Field>
          </div>

          {/* ── Financial Profile ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-base">Financial Profile</h2>
            <p className="text-sm text-gray-500">
              Used for matching — be as accurate as you can. This helps surface listings where the numbers actually work for you.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <CurrencyInput label="Max Purchase Budget" value={form.budget}
                onChange={(v) => set("budget", v)} placeholder="600,000" error={errors.budget} />
              <CurrencyInput label="Available Down Payment" value={form.downPayment}
                onChange={(v) => set("downPayment", v)} placeholder="60,000" error={errors.downPayment} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <CurrencyInput label="Max Monthly Payment" value={form.paymentBudget}
                onChange={(v) => set("paymentBudget", v)} placeholder="3,400"
                hint="How much can you comfortably pay per month?" error={errors.paymentBudget} />
              <Field label="Max Interest Rate You'd Accept (%)" error={errors.interestMax} hint="e.g. 8.5 for 8.5%">
                <div className="relative">
                  <input type="text" inputMode="decimal" value={form.interestMax}
                    onChange={(e) => set("interestMax", e.target.value)}
                    placeholder="8.5" className={`${inputCls} pr-7`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">%</span>
                </div>
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <CurrencyInput label="Gross Monthly Income" value={form.monthlyIncome}
                onChange={(v) => set("monthlyIncome", v)} placeholder="9,200"
                hint="Before taxes. Used for DTI calculation." error={errors.monthlyIncome} />
              <CurrencyInput label="Existing Monthly Debt" value={form.monthlyDebt}
                onChange={(v) => set("monthlyDebt", v)} placeholder="0"
                hint="Car payments, credit cards, etc. Enter 0 if none." />
            </div>
          </div>

          {/* ── Deal Preferences ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-base">Deal Preferences</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Deal Types You're Open To <span className="text-gray-400 font-normal">(select all that apply)</span>
              </label>
              {errors.dealPreferences && <p className="text-xs text-red-500 mb-2">{errors.dealPreferences}</p>}
              <div className="grid sm:grid-cols-2 gap-3">
                {DEAL_OPTIONS.map(({ value, label, desc }) => {
                  const checked = form.dealPreferences.includes(value);
                  return (
                    <label key={value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      checked ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleDeal(value)}
                        className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
                      <div>
                        <p className={`text-sm font-semibold ${checked ? "text-blue-700" : "text-gray-800"}`}>{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Risk Tolerance</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: "Low",      color: "border-green-400 bg-green-50",  text: "text-green-700",  desc: "Clean title, standard terms only" },
                  { val: "Moderate", color: "border-yellow-400 bg-yellow-50", text: "text-yellow-700", desc: "Flexible on some conditions" },
                  { val: "High",     color: "border-red-400 bg-red-50",      text: "text-red-700",    desc: "Open to complex arrangements" },
                ].map(({ val, color, text, desc }) => {
                  const active = form.riskTolerance === val;
                  return (
                    <label key={val} className={`flex flex-col gap-1 p-3.5 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      active ? color : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input type="radio" name="risk" checked={active}
                        onChange={() => set("riskTolerance", val)} className="hidden" />
                      <span className={`text-sm font-semibold ${active ? text : "text-gray-700"}`}>{val}</span>
                      <span className="text-xs text-gray-400 leading-tight">{desc}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Privacy note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <strong>Privacy Note:</strong> Your financial details are only used for matching purposes.
            Full financial figures are visible to sellers only when you choose to engage with a listing.
            HomeMatch does not share your information with third parties.
          </div>

          <div className="flex gap-3 pb-8">
            <button type="submit" disabled={submitting}
              className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? "Creating..." : "Create My Profile"}
            </button>
            <Link to="/" className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

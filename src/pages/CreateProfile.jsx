// src/pages/CreateProfile.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { saveProfile } from "../lib/storage";
import { useToast } from "../components/Toast";
import { Users, CheckCircle } from "lucide-react";

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

const Field = ({ label, hint, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {hint  && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const DEAL_OPTIONS = [
  { value: "seller-finance", label: "Seller-Finance" },
  { value: "rent-to-own",    label: "Rent-to-Own" },
  { value: "lease-option",   label: "Lease Option" },
];

export default function CreateProfile() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [newId, setNewId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", city: "", bio: "",
    budget: "", downPayment: "", paymentBudget: "",
    monthlyIncome: "", monthlyDebt: "", interestMax: "",
    dealPreferences: [], dealPreference: "Seller-Finance",
    riskTolerance: "Moderate",
  });

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
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
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const profile = {
        ...form,
        budget:        Number(form.budget),
        downPayment:   Number(form.downPayment),
        paymentBudget: Number(form.paymentBudget),
        monthlyIncome: Number(form.monthlyIncome),
        monthlyDebt:   Number(form.monthlyDebt) || 0,
        interestMax:   Number(form.interestMax) / 100,
        interestRange: `Up to ${form.interestMax}%`,
        dealPreference: form.dealPreferences[0]
          ?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Seller-Finance",
        badges: ["New"],
        avatar: "",
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
        <p className="text-gray-500 mb-8">Your buyer profile is live on HomeMatch. Sellers whose listings match your terms can find you.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/profiles/${newId}`} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">View My Profile</Link>
          <Link to="/listings" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Browse Listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Buyer Profile</h1>
        </div>
        <p className="text-gray-500 text-sm">Tell sellers who you are and what you're looking for. The more detail you provide, the better your matches will be.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">About You</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your Name" error={errors.name} hint="First name and last initial is fine for privacy.">
              <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Alyssa T." />
            </Field>
            <Field label="City / Area" error={errors.city} hint="Where are you looking to buy?">
              <input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Whitby, ON" />
            </Field>
          </div>
          <Field label="About You" hint="Tell sellers about your situation and what you're looking for.">
            <textarea className={`${inputCls} h-28 resize-none`} value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Young family looking for a 3-bed near schools. We've been saving for 3 years..." />
          </Field>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Financial Profile</h2>
          <p className="text-sm text-gray-500">Used for matching — be as accurate as you can.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Max Purchase Budget ($)" error={errors.budget}>
              <input className={inputCls} type="number" value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="600000" />
            </Field>
            <Field label="Available Down Payment ($)" error={errors.downPayment}>
              <input className={inputCls} type="number" value={form.downPayment} onChange={(e) => set("downPayment", e.target.value)} placeholder="60000" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Max Monthly Payment ($)" error={errors.paymentBudget} hint="How much can you comfortably pay per month?">
              <input className={inputCls} type="number" value={form.paymentBudget} onChange={(e) => set("paymentBudget", e.target.value)} placeholder="3400" />
            </Field>
            <Field label="Max Interest Rate You'd Accept (%)" error={errors.interestMax} hint="e.g. 8.5 for 8.5%">
              <input className={inputCls} type="number" step="0.1" value={form.interestMax} onChange={(e) => set("interestMax", e.target.value)} placeholder="8.5" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Gross Monthly Income ($)" error={errors.monthlyIncome} hint="Before taxes. Used for DTI calculation.">
              <input className={inputCls} type="number" value={form.monthlyIncome} onChange={(e) => set("monthlyIncome", e.target.value)} placeholder="9200" />
            </Field>
            <Field label="Existing Monthly Debt ($)" hint="Car payments, credit cards, etc. Enter 0 if none.">
              <input className={inputCls} type="number" value={form.monthlyDebt} onChange={(e) => set("monthlyDebt", e.target.value)} placeholder="0" />
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Deal Preferences</h2>
          <Field label="Deal Types You're Open To" error={errors.dealPreferences} hint="Select all that apply.">
            <div className="flex flex-wrap gap-4 mt-2">
              {DEAL_OPTIONS.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.dealPreferences.includes(value)}
                    onChange={() => toggleDeal(value)} className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </Field>
          <Field label="Risk Tolerance" hint="How flexible are you on deal terms or property condition?">
            <div className="flex gap-4 mt-1">
              {["Low", "Moderate", "High"].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="risk" checked={form.riskTolerance === r}
                    onChange={() => set("riskTolerance", r)} className="accent-blue-600" />
                  <span className="text-sm text-gray-700">{r}</span>
                </label>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-400 space-y-0.5">
              <p><strong>Low</strong> — Want everything straightforward, clean title, standard terms.</p>
              <p><strong>Moderate</strong> — Flexible on some terms, open to negotiation.</p>
              <p><strong>High</strong> — Comfortable with complex arrangements for the right deal.</p>
            </div>
          </Field>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
          <strong>Privacy Note:</strong> Your financial details are only used for matching purposes.
          Full financial figures are visible to sellers only when you choose to engage with a listing.
          HomeMatch does not share your information with third parties.
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
            {submitting ? "Creating..." : "Create My Profile"}
          </button>
          <Link to="/" className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

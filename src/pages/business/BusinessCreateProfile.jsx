// src/pages/business/BusinessCreateProfile.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { saveCommProfile } from "../../lib/commercial-storage";
import { useToast } from "../../components/Toast";
import { Users, CheckCircle } from "lucide-react";
import {
  PROPERTY_CATEGORIES, ZONING_TYPES, UTILITY_OPTIONS, INTENDED_USES,
} from "../../data/commercial-seed";

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white text-gray-900 placeholder-gray-400";

function CurrencyInput({ label, hint, error, value, onChange, placeholder }) {
  const format = (n) => { const r = String(n).replace(/[^0-9]/g,""); return r ? Number(r).toLocaleString("en-CA") : ""; };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">$</span>
        <input type="text" inputMode="numeric" value={format(value)}
          onChange={(e) => { const r = e.target.value.replace(/[^0-9]/g,""); onChange(r ? Number(r) : ""); }}
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

function TagGrid({ options, state, setState, colorClass = "emerald" }) {
  const toggle = (val) => setState(state.includes(val) ? state.filter((v) => v !== val) : [...state, val]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const checked = state.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
              checked
                ? `border-${colorClass}-500 bg-${colorClass}-50 text-${colorClass}-700`
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
            style={checked ? { borderColor: "#10b981", background: "#ecfdf5", color: "#065f46" } : {}}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function BusinessCreateProfile() {
  const { toast } = useToast();
  const [submitted, setSubmitted]   = useState(false);
  const [newId, setNewId]           = useState(null);
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", contact: "", city: "", bio: "",
    budget: "", downPayment: "", paymentBudget: "",
    monthlyIncome: "", monthlyDebt: "", interestMax: "",
    dealPreferences: [], riskTolerance: "Moderate",
    intendedUses: [], propertyCategories: [],
    zoningPreferences: [], utilitiesRequired: [],
    minAcreage: "", maxAcreage: "", timelineMonths: "12",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name   = "Name is required";
    if (!form.city.trim())   e.city   = "City is required";
    if (!form.budget)        e.budget = "Required";
    if (!form.downPayment)   e.downPayment = "Required";
    if (!form.interestMax)   e.interestMax = "Required";
    if (form.propertyCategories.length === 0) e.propertyCategories = "Select at least one";
    if (form.intendedUses.length === 0) e.intendedUses = "Select at least one";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const profile = {
        ...form,
        budget:         Number(form.budget),
        downPayment:    Number(form.downPayment),
        paymentBudget:  Number(form.paymentBudget) || 0,
        monthlyIncome:  Number(form.monthlyIncome) || 0,
        monthlyDebt:    Number(form.monthlyDebt) || 0,
        interestMax:    Number(form.interestMax) / 100,
        interestRange:  `Up to ${form.interestMax}%`,
        dealPreference: form.dealPreferences[0]?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Seller-Finance",
        minAcreage:     form.minAcreage ? Number(form.minAcreage) : null,
        maxAcreage:     form.maxAcreage ? Number(form.maxAcreage) : null,
        timelineMonths: Number(form.timelineMonths),
        badges:         ["New"],
        avatar:         "",
      };
      const saved = await saveCommProfile(profile);
      if (saved) { setNewId(saved.id); setSubmitted(true); toast.success("Buyer profile live on Sel-Fi Business!"); }
      else toast.error("Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 px-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Buyer Profile Created!</h1>
        <p className="text-gray-500 mb-8">Your profile is live. Sellers whose properties match your criteria can find you.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/business/profiles/${newId}`} className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">View Profile</Link>
          <Link to="/business/listings" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Browse Listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Buyer Profile</h1>
          </div>
          <p className="text-gray-500 text-sm">Tell sellers who you are, what you're looking for, and how you want to buy. The more detail, the better your matches.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">About You</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name / Company" error={errors.name} hint="Individual or company name.">
                <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Brampton Dev Group" />
              </Field>
              <Field label="Contact Name" hint="If different from above.">
                <input className={inputCls} value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="Raj Patel" />
              </Field>
            </div>

            <Field label="City / Area" error={errors.city} hint="Your home base or target region.">
              <input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Brampton, ON" />
            </Field>

            <Field label="About You / Your Business" hint="Tell sellers who you are, your track record, and what you're trying to accomplish.">
              <textarea className={`${inputCls} h-28 resize-none`} value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="Active land developer with 15 years of experience in the GTA. We have shovel-ready projects and prefer seller-financing to preserve capital..." />
            </Field>
          </div>

          {/* What You're Looking For */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">What You're Looking For</h2>

            <Field label="Property Categories" error={errors.propertyCategories} hint="Select all you'd consider.">
              <TagGrid options={PROPERTY_CATEGORIES} state={form.propertyCategories} setState={(v) => set("propertyCategories", v)} />
            </Field>

            <Field label="Intended Use" error={errors.intendedUses} hint="What will you do with the property?">
              <TagGrid options={INTENDED_USES} state={form.intendedUses} setState={(v) => set("intendedUses", v)} />
            </Field>

            <Field label="Acceptable Zoning" hint="Select all zoning types you'd consider.">
              <TagGrid options={ZONING_TYPES} state={form.zoningPreferences} setState={(v) => set("zoningPreferences", v)} />
            </Field>

            <Field label="Utilities Required" hint="Must-have utilities.">
              <TagGrid options={UTILITY_OPTIONS} state={form.utilitiesRequired} setState={(v) => set("utilitiesRequired", v)} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Min Acreage" hint="Minimum land area needed.">
                <div className="relative">
                  <input className={`${inputCls} pr-14`} inputMode="decimal" value={form.minAcreage}
                    onChange={(e) => set("minAcreage", e.target.value)} placeholder="10" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">acres</span>
                </div>
              </Field>
              <Field label="Max Acreage" hint="Maximum you'd consider.">
                <div className="relative">
                  <input className={`${inputCls} pr-14`} inputMode="decimal" value={form.maxAcreage}
                    onChange={(e) => set("maxAcreage", e.target.value)} placeholder="100" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">acres</span>
                </div>
              </Field>
            </div>

            <Field label="Purchase Timeline">
              <select className={inputCls} value={form.timelineMonths} onChange={(e) => set("timelineMonths", e.target.value)}>
                {[
                  { val: "3",  label: "Within 3 months" },
                  { val: "6",  label: "Within 6 months" },
                  { val: "12", label: "Within 12 months" },
                  { val: "24", label: "Within 2 years" },
                  { val: "0",  label: "No firm timeline" },
                ].map(({ val, label }) => <option key={val} value={val}>{label}</option>)}
              </select>
            </Field>
          </div>

          {/* Financial Profile */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Financial Profile</h2>
            <p className="text-sm text-gray-500">Used for matching — the more accurate, the better your results.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <CurrencyInput label="Max Purchase Budget" value={form.budget}
                onChange={(v) => set("budget", v)} placeholder="5,000,000" error={errors.budget} />
              <CurrencyInput label="Available Down Payment" value={form.downPayment}
                onChange={(v) => set("downPayment", v)} placeholder="1,000,000" error={errors.downPayment} />
            </div>

            <Field label="Max Interest Rate (%)" error={errors.interestMax} hint="e.g. 8 for 8%">
              <div className="relative">
                <input type="text" inputMode="decimal" value={form.interestMax}
                  onChange={(e) => set("interestMax", e.target.value)} placeholder="8" className={`${inputCls} pr-7`} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">%</span>
              </div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <CurrencyInput label="Gross Monthly Income" value={form.monthlyIncome}
                onChange={(v) => set("monthlyIncome", v)} placeholder="80,000" hint="Before tax." />
              <CurrencyInput label="Existing Monthly Debt" value={form.monthlyDebt}
                onChange={(v) => set("monthlyDebt", v)} placeholder="0" hint="Current obligations." />
            </div>

            {/* Deal preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Deal Types You'd Accept</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {["Seller-Finance", "Rent-to-Own", "Lease Option", "Private Sale"].map((t) => {
                  const checked = form.dealPreferences.includes(t);
                  return (
                    <label key={t} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      checked ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input type="checkbox" checked={checked}
                        onChange={() => set("dealPreferences", checked ? form.dealPreferences.filter((v) => v !== t) : [...form.dealPreferences, t])}
                        className="w-4 h-4 accent-emerald-600 shrink-0" />
                      <span className={`text-sm font-semibold ${checked ? "text-emerald-700" : "text-gray-800"}`}>{t}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Risk tolerance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Risk Tolerance</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: "Low",      color: "border-green-400 bg-green-50",   text: "text-green-700",  desc: "Clean title, no issues" },
                  { val: "Moderate", color: "border-yellow-400 bg-yellow-50", text: "text-yellow-700", desc: "Some flexibility" },
                  { val: "High",     color: "border-red-400 bg-red-50",       text: "text-red-700",    desc: "Complex deals welcome" },
                ].map(({ val, color, text, desc }) => {
                  const active = form.riskTolerance === val;
                  return (
                    <label key={val} className={`flex flex-col gap-1 p-3.5 rounded-xl border-2 cursor-pointer transition-all text-center ${active ? color : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="radio" name="risk" checked={active} onChange={() => set("riskTolerance", val)} className="hidden" />
                      <span className={`text-sm font-semibold ${active ? text : "text-gray-700"}`}>{val}</span>
                      <span className="text-xs text-gray-400 leading-tight">{desc}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <strong>Privacy Note:</strong> Your financial details are used for matching only and are not visible publicly.
            Sel-Fi Business does not share your information with third parties.
          </div>

          <div className="flex gap-3 pb-8">
            <button type="submit" disabled={submitting}
              className="flex-1 sm:flex-none px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60">
              {submitting ? "Creating..." : "Create Buyer Profile"}
            </button>
            <Link to="/business" className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

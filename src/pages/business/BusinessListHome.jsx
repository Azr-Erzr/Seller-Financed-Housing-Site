// src/pages/business/BusinessListHome.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { saveCommListing } from "../../lib/commercial-storage";
import { useToast } from "../../components/Toast";
import { Building2, CheckCircle } from "lucide-react";
import AddressAutocomplete from "../../components/AddressAutocomplete";
import {
  PROPERTY_CATEGORIES, ZONING_TYPES, UTILITY_OPTIONS,
  PERMITTED_USES, ROAD_ACCESS, ENVIRONMENTAL_STATUS,
} from "../../data/commercial-seed";

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white text-gray-900 placeholder-gray-400";
const DEAL_TYPES = ["Seller-Finance", "Rent-to-Own", "Lease Option", "Private Sale"];

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

function CheckGrid({ options, state, setState }) {
  const toggle = (val) => setState(state.includes(val) ? state.filter((v) => v !== val) : [...state, val]);
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = state.includes(opt);
        return (
          <label key={opt} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
            checked ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-gray-200 text-gray-600 hover:border-gray-300"
          }`}>
            <input type="checkbox" checked={checked} onChange={() => toggle(opt)} className="w-4 h-4 accent-emerald-600 shrink-0" />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

export default function BusinessListHome() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [newId, setNewId]         = useState(null);
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "", address: "", city: "", state: "ON",
    price: "", acreage: "", propertyCategory: "",
    zoning: "", utilities: [], roadAccess: "",
    permittedUses: [], environmentalStatus: "",
    existingStructures: "", frontage: "",
    dealTypes: [], downPayment: "", interestMin: "", interestMax: "", term: "5",
    description: "", docsLocked: true,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const needsFinancing = form.dealTypes.some((d) => d !== "Private Sale");

  const validate = () => {
    const e = {};
    if (!form.title.trim())            e.title    = "Required";
    if (!form.city.trim())             e.city     = "Required";
    if (!form.price)                   e.price    = "Required";
    if (!form.propertyCategory)        e.propertyCategory = "Required";
    if (form.dealTypes.length === 0)   e.dealTypes = "Select at least one";
    if (!form.description.trim())      e.description = "Required";
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
      const primaryDeal = form.dealTypes[0] || "Private Sale";
      const listing = {
        ...form,
        price:         Number(form.price),
        acreage:       form.acreage ? Number(form.acreage) : null,
        dealType:      primaryDeal,
        downPayment:   needsFinancing && form.downPayment ? Number(form.downPayment) : 0,
        interest:      needsFinancing ? (Number(form.interestMin) + Number(form.interestMax)) / 2 / 100 : 0,
        interestRange: needsFinancing ? [Number(form.interestMin)/100, Number(form.interestMax)/100] : [0,0],
        term:          Number(form.term),
        image:         "",
        badges:        ["New"],
      };
      const saved = await saveCommListing(listing);
      if (saved) { setNewId(saved.id); setSubmitted(true); toast.success("Property listed on LandMatch Business!"); }
      else toast.error("Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 px-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Listed!</h1>
        <p className="text-gray-500 mb-8">Your property is live on LandMatch Business.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/business/listings/${newId}`} className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">View Listing</Link>
          <Link to="/business/listings" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Browse All</Link>
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
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">List a Commercial Property</h1>
          </div>
          <p className="text-gray-500 text-sm">Vacant land, farms, commercial buildings, and more. Seller-financed deals welcome.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Property Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Property Information</h2>

            <Field label="Listing Title" error={errors.title}>
              <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Prime 50-Acre Development Land — Clarington" />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Street Address / Legal Description">
                <AddressAutocomplete
                  value={form.address}
                  onChange={(v) => set("address", v)}
                  onSelect={(s) => {
                    const parts = (s.short || s.display).split(",").map((p) => p.trim());
                    if (parts[0]) set("address", parts[0]);
                    if (parts[1]) set("city", parts[1]);
                  }}
                  placeholder="Lot 14, Concession 5 or start typing..."
                  ringColor="focus:ring-emerald-500"
                />
              </Field>
              <Field label="City / Municipality" error={errors.city}>
                <input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Clarington" />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Property Category" error={errors.propertyCategory}>
                <select className={inputCls} value={form.propertyCategory} onChange={(e) => set("propertyCategory", e.target.value)}>
                  <option value="">Select category...</option>
                  {PROPERTY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <CurrencyInput label="Asking Price" value={form.price} onChange={(v) => set("price", v)} placeholder="1,850,000" error={errors.price} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Total Acreage" hint="Leave blank for commercial buildings">
                <div className="relative">
                  <input className={`${inputCls} pr-14`} inputMode="decimal" value={form.acreage}
                    onChange={(e) => set("acreage", e.target.value)} placeholder="50" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">acres</span>
                </div>
              </Field>
              <Field label="Frontage">
                <input className={inputCls} value={form.frontage} onChange={(e) => set("frontage", e.target.value)}
                  placeholder="660 ft on Concession Rd" />
              </Field>
            </div>

            <Field label="Description" error={errors.description} hint="Describe the property, its history, and what makes it a good opportunity.">
              <textarea className={`${inputCls} h-32 resize-none`} value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="50 acres of prime development land fronting a municipal road..." />
            </Field>

            <Field label="Existing Structures" hint="Describe any buildings, improvements, or infrastructure on the property.">
              <input className={inputCls} value={form.existingStructures} onChange={(e) => set("existingStructures", e.target.value)}
                placeholder="Small barn (as-is), fenced perimeter" />
            </Field>
          </div>

          {/* Land Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Land & Zoning Details</h2>
            <p className="text-sm text-gray-500">These fields power the commercial-specific filters buyers use to find properties like yours.</p>

            <Field label="Zoning Classification">
              <select className={inputCls} value={form.zoning} onChange={(e) => set("zoning", e.target.value)}>
                <option value="">Select zoning...</option>
                {ZONING_TYPES.map((z) => <option key={z}>{z}</option>)}
              </select>
            </Field>

            <Field label="Road Access">
              <select className={inputCls} value={form.roadAccess} onChange={(e) => set("roadAccess", e.target.value)}>
                <option value="">Select road access...</option>
                {ROAD_ACCESS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>

            <Field label="Environmental Status">
              <select className={inputCls} value={form.environmentalStatus} onChange={(e) => set("environmentalStatus", e.target.value)}>
                <option value="">Select status...</option>
                {ENVIRONMENTAL_STATUS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Utilities Available on Property">
              <CheckGrid options={UTILITY_OPTIONS} state={form.utilities} setState={(v) => set("utilities", v)} />
            </Field>

            <Field label="Permitted Uses">
              <CheckGrid options={PERMITTED_USES} state={form.permittedUses} setState={(v) => set("permittedUses", v)} />
            </Field>
          </div>

          {/* Deal Terms */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Deal Terms</h2>
            {errors.dealTypes && <p className="text-xs text-red-500">{errors.dealTypes}</p>}

            <div className="grid sm:grid-cols-2 gap-3">
              {DEAL_TYPES.map((t) => {
                const checked = form.dealTypes.includes(t);
                return (
                  <label key={t} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    checked ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <input type="checkbox" checked={checked}
                      onChange={() => set("dealTypes", checked ? form.dealTypes.filter((v) => v !== t) : [...form.dealTypes, t])}
                      className="mt-0.5 w-4 h-4 accent-emerald-600 shrink-0" />
                    <span className={`text-sm font-semibold ${checked ? "text-emerald-700" : "text-gray-800"}`}>{t}</span>
                  </label>
                );
              })}
            </div>

            {needsFinancing && (
              <div className="space-y-4 pt-2 border-t border-gray-50">
                <p className="text-sm font-medium text-gray-700 pt-1">Financing Details</p>
                <CurrencyInput label="Minimum Down Payment" value={form.downPayment}
                  onChange={(v) => set("downPayment", v)} placeholder="370,000"
                  hint="The minimum you'd accept." />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Min Rate (%)">
                    <div className="relative">
                      <input className={`${inputCls} pr-7`} inputMode="decimal" value={form.interestMin}
                        onChange={(e) => set("interestMin", e.target.value)} placeholder="5.5" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </Field>
                  <Field label="Max Rate (%)">
                    <div className="relative">
                      <input className={`${inputCls} pr-7`} inputMode="decimal" value={form.interestMax}
                        onChange={(e) => set("interestMax", e.target.value)} placeholder="8" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </Field>
                  <Field label="Term (years)">
                    <select className={inputCls} value={form.term} onChange={(e) => set("term", e.target.value)}>
                      {[1,2,3,5,7,10,15,20,25,30].map((y) => <option key={y} value={y}>{y} yr</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input type="checkbox" checked={form.docsLocked} onChange={(e) => set("docsLocked", e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Require NDA before sharing documents</p>
                <p className="text-xs text-gray-400 mt-0.5">Buyers must sign an NDA before accessing surveys, environmental reports, and financial documents.</p>
              </div>
            </label>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <strong>Disclaimer:</strong> LandMatch Business is a marketplace platform only. We do not provide legal,
            financial, or real estate advice. Commercial transactions are complex — consult a real estate lawyer
            and accountant before entering any agreement.
          </div>

          <div className="flex gap-3 pb-8">
            <button type="submit" disabled={submitting}
              className="flex-1 sm:flex-none px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60">
              {submitting ? "Submitting..." : "List Property"}
            </button>
            <Link to="/business" className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

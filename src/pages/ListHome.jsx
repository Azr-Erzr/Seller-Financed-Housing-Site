// src/pages/ListHome.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveListing } from "../lib/storage";
import { Home, CheckCircle } from "lucide-react";

const DEAL_TYPES    = ["Seller-Finance", "Rent-to-Own", "Lease Option"];
const PROPERTY_TYPES = ["Single-Family", "Townhouse", "Condo", "Multi-Unit"];

const Field = ({ label, hint, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {hint  && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

export default function ListHome() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [newId, setNewId] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "", address: "", city: "", state: "ON",
    price: "", bedrooms: "", bathrooms: "", sqft: "", lot: "",
    propertyType: "Single-Family",
    dealType: "Seller-Finance",
    dealTypes: ["seller-finance"],
    downPayment: "", interestMin: "", interestMax: "", term: "25",
    description: "", docsLocked: true,
  });

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Title is required";
    if (!form.address.trim())     e.address     = "Address is required";
    if (!form.city.trim())        e.city        = "City is required";
    if (!form.price || isNaN(Number(form.price))) e.price = "Valid price required";
    if (!form.bedrooms)           e.bedrooms    = "Required";
    if (!form.bathrooms)          e.bathrooms   = "Required";
    if (!form.sqft)               e.sqft        = "Required";
    if (!form.downPayment)        e.downPayment = "Required";
    if (!form.interestMin || !form.interestMax) e.interest = "Both rates required";
    if (!form.description.trim()) e.description = "Please add a description";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const listing = {
      ...form,
      price:        Number(form.price),
      bedrooms:     Number(form.bedrooms),
      bathrooms:    Number(form.bathrooms),
      sqft:         Number(form.sqft),
      downPayment:  Number(form.downPayment),
      interest:     (Number(form.interestMin) + Number(form.interestMax)) / 2 / 100,
      interestRange: [Number(form.interestMin) / 100, Number(form.interestMax) / 100],
      term:         Number(form.term),
      image:        "",
      badges:       ["New"],
      dealTypes:    [form.dealType.toLowerCase().replace(/ /g, "-")],
    };

    const saved = saveListing(listing);
    if (saved) { setNewId(saved.id); setSubmitted(true); }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 px-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h1>
        <p className="text-gray-500 mb-8">
          Your home has been added to HomeMatch. Buyers whose profile matches your terms will be able to find it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/listings/${newId}`} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            View My Listing
          </Link>
          <Link to="/listings" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Browse All Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">List Your Home</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Tell buyers about your property and the financing terms you're offering. Takes about 5 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Section 1 — Property Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Property Information</h2>

          <Field label="Listing Title" error={errors.title} hint="e.g. 'Sunny 3-bed Craftsman near Park'">
            <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Give your listing a descriptive title" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Street Address" error={errors.address}>
              <input className={inputCls} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="145 Maple Ave" />
            </Field>
            <Field label="City" error={errors.city}>
              <input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Whitby" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Property Type">
              <select className={inputCls} value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Asking Price ($)" error={errors.price}>
              <input className={inputCls} type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="575000" />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Bedrooms" error={errors.bedrooms}>
              <input className={inputCls} type="number" min="1" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} placeholder="3" />
            </Field>
            <Field label="Bathrooms" error={errors.bathrooms}>
              <input className={inputCls} type="number" min="1" step="0.5" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} placeholder="2" />
            </Field>
            <Field label="Sq Ft" error={errors.sqft}>
              <input className={inputCls} type="number" value={form.sqft} onChange={(e) => set("sqft", e.target.value)} placeholder="1800" />
            </Field>
          </div>

          <Field label="Lot Size" hint="Optional — e.g. 40x120 or 0.25 acres">
            <input className={inputCls} value={form.lot} onChange={(e) => set("lot", e.target.value)} placeholder="40x120" />
          </Field>

          <Field label="Description" error={errors.description} hint="Describe the home, recent updates, and what makes it special for a buyer.">
            <textarea
              className={`${inputCls} h-32 resize-none`}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Charming craftsman on a quiet street near excellent schools..."
            />
          </Field>
        </div>

        {/* Section 2 — Financing Terms */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Financing Terms</h2>
          <p className="text-sm text-gray-500">These terms are what buyers will see and match against. Be as accurate as possible.</p>

          <Field label="Deal Type">
            <div className="flex flex-wrap gap-3 mt-1">
              {DEAL_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dealType"
                    checked={form.dealType === t}
                    onChange={() => set("dealType", t)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{t}</span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Minimum Down Payment ($)" error={errors.downPayment} hint="The minimum you'd accept from a buyer.">
            <input className={inputCls} type="number" value={form.downPayment} onChange={(e) => set("downPayment", e.target.value)} placeholder="46000" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Min Interest Rate (%)" error={errors.interest} hint="The lowest rate you'd offer.">
              <input className={inputCls} type="number" step="0.1" value={form.interestMin} onChange={(e) => set("interestMin", e.target.value)} placeholder="5.5" />
            </Field>
            <Field label="Max Interest Rate (%)" hint="The highest rate you'd charge.">
              <input className={inputCls} type="number" step="0.1" value={form.interestMax} onChange={(e) => set("interestMax", e.target.value)} placeholder="8.5" />
            </Field>
          </div>

          <Field label="Amortization Period (years)">
            <select className={inputCls} value={form.term} onChange={(e) => set("term", e.target.value)}>
              {[10, 15, 20, 25, 30].map((y) => <option key={y} value={y}>{y} years</option>)}
            </select>
          </Field>

          <Field label="Document Privacy">
            <label className="flex items-start gap-3 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={form.docsLocked}
                onChange={(e) => set("docsLocked", e.target.checked)}
                className="mt-0.5 accent-blue-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Require NDA before sharing documents</p>
                <p className="text-xs text-gray-400">Buyers must sign a short non-disclosure agreement before accessing financial details and documents.</p>
              </div>
            </label>
          </Field>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
          <strong>Disclaimer:</strong> HomeMatch is a marketplace platform only. We do not provide legal, financial, or mortgage advice. 
          Seller-financed arrangements are complex and we strongly recommend consulting a real estate lawyer before entering any agreement.
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" className="flex-1 sm:flex-none px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
            Submit Listing
          </button>
          <Link to="/" className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

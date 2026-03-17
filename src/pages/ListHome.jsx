// src/pages/ListHome.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { saveListing } from "../lib/storage";
import { supabase } from "../lib/supabase";
import { useToast } from "../components/Toast";
import { Home, CheckCircle, Upload, X, ImageIcon } from "lucide-react";

const DEAL_TYPES = [
  { value: "seller-finance", label: "Seller-Finance", desc: "You hold the mortgage directly" },
  { value: "rent-to-own",    label: "Rent-to-Own",    desc: "Rent with option to buy" },
  { value: "lease-option",   label: "Lease Option",   desc: "Upfront option fee to purchase" },
  { value: "private-sale",   label: "Private Sale",   desc: "Standard sale, no bank required" },
];

const PROPERTY_TYPES = ["Single-Family", "Townhouse", "Condo", "Multi-Unit"];

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-900 placeholder-gray-400";

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
          placeholder={placeholder}
          className={`${inputCls} pl-7`} />
      </div>
      {hint  && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────
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

// ── Percent input ─────────────────────────────────────────────────────
function PctInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} className={`${inputCls} pr-7`} />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">%</span>
    </div>
  );
}

// ── Photo uploader ────────────────────────────────────────────────────
function PhotoUploader({ photos, onAdd, onRemove }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    Array.from(files).slice(0, 8 - photos.length).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      onAdd({ file, preview: URL.createObjectURL(file) });
    });
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => photos.length < 8 && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          photos.length >= 8 ? "opacity-50 cursor-not-allowed border-gray-200" :
          dragging ? "border-blue-400 bg-blue-50 cursor-copy" :
          "border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-600">
          {photos.length >= 8 ? "Maximum 8 photos reached" : "Drag photos here or click to browse"}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · Max 10MB each · Up to 8 photos</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {photos.map((p, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img src={p.preview} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  Main
                </span>
              )}
              <button type="button" onClick={() => onRemove(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 shrink-0" />
          Listings with photos receive significantly more interest from buyers.
        </p>
      )}
    </div>
  );
}

// ── Upload photos to Supabase Storage ────────────────────────────────
async function uploadPhotos(photos) {
  if (!supabase || photos.length === 0) return [];
  const urls = [];
  for (const { file } of photos) {
    const ext  = file.name.split(".").pop().toLowerCase();
    const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("listing-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (!error && data) {
      const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(data.path);
      urls.push(urlData.publicUrl);
    }
  }
  return urls;
}

// ── Main form ─────────────────────────────────────────────────────────
export default function ListHome() {
  const { toast } = useToast();
  const [submitted, setSubmitted]   = useState(false);
  const [newId, setNewId]           = useState(null);
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos]         = useState([]);

  const [form, setForm] = useState({
    title: "", address: "", city: "", state: "ON",
    price: "", bedrooms: "", bathrooms: "", sqft: "", lot: "",
    propertyType: "Single-Family", dealTypes: [],
    downPayment: "", interestMin: "", interestMax: "", term: "25",
    description: "", docsLocked: true,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const toggleDeal = (val) => {
    const curr = form.dealTypes;
    set("dealTypes", curr.includes(val) ? curr.filter((v) => v !== val) : [...curr, val]);
  };

  const needsFinancing = form.dealTypes.some((d) => d !== "private-sale");

  const validate = () => {
    const e = {};
    if (!form.title.trim())          e.title       = "Title is required";
    if (!form.address.trim())        e.address     = "Address is required";
    if (!form.city.trim())           e.city        = "City is required";
    if (!form.price)                 e.price       = "Price is required";
    if (!form.bedrooms)              e.bedrooms    = "Required";
    if (!form.bathrooms)             e.bathrooms   = "Required";
    if (!form.sqft)                  e.sqft        = "Required";
    if (form.dealTypes.length === 0) e.dealTypes   = "Select at least one deal type";
    if (needsFinancing) {
      if (!form.downPayment)   e.downPayment = "Required for financing deals";
      if (!form.interestMin || !form.interestMax) e.interest = "Both rates required";
    }
    if (!form.description.trim())    e.description = "Please add a description";
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
      const imageUrls = await uploadPhotos(photos);
      const primaryDeal = form.dealTypes[0] || "private-sale";
      const dealTypeLabel = DEAL_TYPES.find((d) => d.value === primaryDeal)?.label || "Private Sale";

      const listing = {
        title:         form.title,
        address:       form.address,
        city:          form.city,
        state:         form.state,
        image:         imageUrls[0] || "",
        price:         Number(form.price),
        bedrooms:      Number(form.bedrooms),
        bathrooms:     Number(form.bathrooms),
        sqft:          Number(form.sqft),
        lot:           form.lot,
        propertyType:  form.propertyType,
        dealType:      dealTypeLabel,
        dealTypes:     form.dealTypes,
        downPayment:   needsFinancing ? Number(form.downPayment) : 0,
        interest:      needsFinancing ? (Number(form.interestMin) + Number(form.interestMax)) / 2 / 100 : 0,
        interestRange: needsFinancing ? [Number(form.interestMin) / 100, Number(form.interestMax) / 100] : [0, 0],
        term:          Number(form.term),
        description:   form.description,
        docsLocked:    form.docsLocked,
        badges:        ["New"],
      };

      const saved = await saveListing(listing);
      if (saved) {
        setNewId(saved.id);
        setSubmitted(true);
        toast.success("Your listing is live on HomeMatch!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.");
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h1>
        <p className="text-gray-500 mb-8">
          Your home is now live on HomeMatch. Buyers whose profile matches your terms will be able to find it.
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">List Your Home</h1>
          </div>
          <p className="text-gray-500 text-sm ml-13">
            Tell buyers about your property and the terms you're offering. Takes about 5 minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Property Information ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-base">Property Information</h2>

            <Field label="Listing Title" error={errors.title} hint="e.g. 'Sunny 3-bed Craftsman near Park'">
              <input className={inputCls} value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Give your listing a descriptive title" />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Street Address" error={errors.address}>
                <input className={inputCls} value={form.address}
                  onChange={(e) => set("address", e.target.value)} placeholder="145 Maple Ave" />
              </Field>
              <Field label="City" error={errors.city}>
                <input className={inputCls} value={form.city}
                  onChange={(e) => set("city", e.target.value)} placeholder="Whitby" />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Property Type">
                <select className={inputCls} value={form.propertyType}
                  onChange={(e) => set("propertyType", e.target.value)}>
                  {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <CurrencyInput label="Asking Price" value={form.price}
                onChange={(v) => set("price", v)} placeholder="575,000" error={errors.price} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Bedrooms" error={errors.bedrooms}>
                <input className={inputCls} inputMode="numeric" value={form.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)} placeholder="3" />
              </Field>
              <Field label="Bathrooms" error={errors.bathrooms}>
                <input className={inputCls} inputMode="decimal" value={form.bathrooms}
                  onChange={(e) => set("bathrooms", e.target.value)} placeholder="2" />
              </Field>
              <Field label="Sq Ft" error={errors.sqft}>
                <input className={inputCls} inputMode="numeric" value={form.sqft}
                  onChange={(e) => set("sqft", e.target.value)} placeholder="1,800" />
              </Field>
            </div>

            <Field label="Lot Size" hint="Optional — e.g. 40x120 or 0.25 acres">
              <input className={inputCls} value={form.lot}
                onChange={(e) => set("lot", e.target.value)} placeholder="40x120" />
            </Field>

            <Field label="Description" error={errors.description}
              hint="Describe the home, recent updates, and what makes it special for a buyer.">
              <textarea className={`${inputCls} h-32 resize-none`} value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Charming craftsman on a quiet street near excellent schools..." />
            </Field>
          </div>

          {/* ── Photos ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 text-base mb-5">Photos</h2>
            <PhotoUploader photos={photos} onAdd={(p) => setPhotos((prev) => [...prev, p])} onRemove={(i) => setPhotos((prev) => prev.filter((_, idx) => idx !== i))} />
          </div>

          {/* ── Financing Terms ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-base">Deal Terms</h2>
            <p className="text-sm text-gray-500">What kinds of deals are you open to? Select everything that applies — buyers will match against all of them.</p>

            {/* Multi-select deal types */}
            {errors.dealTypes && <p className="text-xs text-red-500">{errors.dealTypes}</p>}
            <div className="grid sm:grid-cols-2 gap-3">
              {DEAL_TYPES.map(({ value, label, desc }) => {
                const checked = form.dealTypes.includes(value);
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

            {/* Financing fields — only show if financing deal selected */}
            {needsFinancing && (
              <div className="space-y-5 pt-2 border-t border-gray-50">
                <p className="text-sm font-medium text-gray-700 pt-1">Financing Details</p>

                <CurrencyInput label="Minimum Down Payment" value={form.downPayment}
                  onChange={(v) => set("downPayment", v)} placeholder="46,000"
                  hint="The minimum you'd accept from a buyer." error={errors.downPayment} />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Min Interest Rate" error={errors.interest} hint="The lowest rate you'd offer.">
                    <PctInput value={form.interestMin} onChange={(v) => set("interestMin", v)} placeholder="5.5" />
                  </Field>
                  <Field label="Max Interest Rate" hint="The highest rate you'd charge.">
                    <PctInput value={form.interestMax} onChange={(v) => set("interestMax", v)} placeholder="8.5" />
                  </Field>
                </div>

                <Field label="Amortization Period">
                  <select className={inputCls} value={form.term} onChange={(e) => set("term", e.target.value)}>
                    {[10, 15, 20, 25, 30].map((y) => <option key={y} value={y}>{y} years</option>)}
                  </select>
                </Field>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input type="checkbox" checked={form.docsLocked}
                onChange={(e) => set("docsLocked", e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Require NDA before sharing documents</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Buyers must sign a short NDA before accessing financial details and documents.
                </p>
              </div>
            </label>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <strong>Disclaimer:</strong> HomeMatch is a marketplace platform only. We do not provide legal,
            financial, or mortgage advice. We strongly recommend consulting a real estate lawyer before
            entering any agreement.
          </div>

          {/* Submit */}
          <div className="flex gap-3 pb-8">
            <button type="submit" disabled={submitting}
              className="flex-1 sm:flex-none px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? "Submitting..." : "Submit Listing"}
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

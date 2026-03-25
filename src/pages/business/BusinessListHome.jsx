// src/pages/business/BusinessListHome.jsx
// Comprehensive commercial listing form with all enriched fields + live preview.
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { saveCommListing } from "../../lib/commercial-storage";
import { useToast } from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import { Building2, CheckCircle, Eye, EyeOff, Ruler, Building, Truck, Check } from "lucide-react";
import AddressAutocomplete from "../../components/AddressAutocomplete";
import ListingUpgrade from "../../components/ListingUpgrade";
import {
  PROPERTY_CATEGORIES, ZONING_TYPES, UTILITY_OPTIONS,
  PERMITTED_USES, ROAD_ACCESS, ENVIRONMENTAL_STATUS,
} from "../../data/commercial-seed";

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white text-gray-900 placeholder-gray-400";
const selectCls = `${inputCls} appearance-auto`;
const DEAL_TYPES = ["Seller-Finance", "Rent-to-Own", "Lease Option", "Private Sale"];
const HEATING_OPTS = ["Forced Air (Natural Gas)", "Radiant (Natural Gas)", "Radiant (Electric)", "Baseboard", "None"];
const COOLING_OPTS = ["Central Air", "Ductless Mini-Split", "Office area only", "None"];
const SOIL_OPTS = ["Class 1", "Class 2", "Class 3", "Class 4", "Unknown", "N/A"];
const NEARBY_OPTIONS = ["Highway Access", "Transit", "Schools", "Shopping", "Restaurants", "Port", "Rail", "Business Parks", "Industrial Area"];

function CurrencyInput({ label, hint, error, value, onChange, placeholder }) {
  const format = (n) => { const r = String(n).replace(/[^0-9]/g, ""); return r ? Number(r).toLocaleString("en-CA") : ""; };
  return (<div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">$</span>
      <input type="text" inputMode="numeric" value={format(value)} onChange={(e) => { const r = e.target.value.replace(/[^0-9]/g, ""); onChange(r ? Number(r) : ""); }} placeholder={placeholder} className={`${inputCls} pl-7`} /></div>
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>);
}

function Field({ label, hint, error, optional, children }) {
  return (<div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}{optional && <span className="text-gray-400 font-normal ml-1">(optional)</span>}</label>}
    {children}{hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>);
}

function PctInput({ value, onChange, placeholder }) {
  return (<div className="relative"><input type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls} pr-7`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">%</span></div>);
}

function PillSelect({ options, selected, onToggle, color = "emerald" }) {
  return (<div className="flex flex-wrap gap-2">
    {options.map((opt) => { const active = selected.includes(opt); return (
      <button key={opt} type="button" onClick={() => onToggle(opt)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? `bg-${color}-600 text-white border-${color}-600` : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>{opt}</button>); })}
  </div>);
}

function SectionCard({ title, subtitle, children }) {
  return (<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
    <div><h2 className="font-semibold text-gray-900 text-base">{title}</h2>{subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}</div>
    {children}
  </div>);
}

// ── Live Preview ──────────────────────────────────────────────────────
function CommPreview({ form }) {
  const getCategoryColor = (cat) => { if (!cat) return "#059669"; if (cat.includes("Farm")) return "#16a34a"; if (cat.includes("Development")) return "#d97706"; if (cat.includes("Commercial")) return "#2563eb"; if (cat.includes("Industrial")) return "#475569"; if (cat.includes("Waterfront")) return "#0891b2"; return "#059669"; };
  const price = form.price ? `$${Number(form.price).toLocaleString("en-CA")}` : "$—";
  const catColor = getCategoryColor(form.propertyCategory);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="relative h-48 bg-emerald-50 flex items-center justify-center text-emerald-200"><Building2 className="w-12 h-12" />
        {form.propertyCategory && <div className="absolute top-3 left-3 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow" style={{ background: catColor }}>{form.propertyCategory}</div>}
        {form.dealTypes[0] && <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">{form.dealTypes[0]}</div>}
        <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-medium">Preview</div>
      </div>
      <div className="p-5">
        <p className="text-2xl font-bold text-emerald-700 mb-1">{price}</p>
        {form.propertyTax && <span className="text-[10px] text-gray-400">${Number(form.propertyTax).toLocaleString()}/yr tax</span>}
        <p className="text-sm text-gray-500 mt-1">{form.address || "Address"}, {form.city || "City"}</p>
        <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
          {form.acreage && <span className="flex items-center gap-1"><Ruler className="w-4 h-4 text-gray-400" />{form.acreage} ac</span>}
          {form.buildingSqft && <span className="flex items-center gap-1"><Building className="w-4 h-4 text-gray-400" />{Number(form.buildingSqft).toLocaleString()} sqft</span>}
          {form.loadingDocks && <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-gray-400" />{form.loadingDocks} docks</span>}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {form.zoning && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{form.zoning}</span>}
          {form.environmentalStatus && form.environmentalStatus.includes("Clean") && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 flex items-center gap-0.5"><Check className="w-3 h-3"/> Env Clean</span>}
        </div>
      </div>
    </div>
  );
}

export default function BusinessListHome() {
  const { toast } = useToast();
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [newId, setNewId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState({
    title: "", address: "", city: "", state: "ON",
    price: "", acreage: "", propertyCategory: "",
    zoning: "", utilities: [], roadAccess: "",
    permittedUses: [], environmentalStatus: "",
    existingStructures: "", frontage: "",
    dealTypes: [], downPayment: "", interestMin: "", interestMax: "", term: "5",
    description: "", docsLocked: true,
    // New fields
    propertyTax: "", buildingSqft: "", ceilingHeight: "",
    soilClass: "", topography: "", drainage: "",
    heating: "", cooling: "", loadingDocks: "", parkingSpaces: "",
    nearbyAmenities: [],
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const toggleArr = (key, val) => { const c = form[key]; set(key, c.includes(val) ? c.filter((v) => v !== val) : [...c, val]); };
  const needsFinancing = form.dealTypes.some((d) => d !== "Private Sale");
  const hasBuilding = form.propertyCategory && (form.propertyCategory.includes("Commercial") || form.propertyCategory.includes("Industrial") || form.propertyCategory.includes("Multi"));

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) openAuthModal(location.pathname);
  }, [authLoading, user, openAuthModal, location.pathname]);

  if (authLoading) return <div className="py-20 text-center text-gray-400">Loading...</div>;
  if (!user) return (
    <div className="py-20 text-center">
      <p className="text-gray-500 mb-2">You need to sign in to list a property.</p>
      <p className="text-sm text-gray-400">A sign-in prompt should appear shortly.</p>
    </div>
  );

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.price) e.price = "Required";
    if (!form.propertyCategory) e.propertyCategory = "Required";
    if (form.dealTypes.length === 0) e.dealTypes = "Select at least one";
    if (!form.description.trim()) e.description = "Required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({ top: 0, behavior: "smooth" }); toast.error("Please fix the errors."); return; }
    setSubmitting(true);
    try {
      const listing = {
        ...form,
        price: Number(form.price),
        acreage: form.acreage ? Number(form.acreage) : null,
        dealType: form.dealTypes[0] || "Private Sale",
        downPayment: needsFinancing && form.downPayment ? Number(form.downPayment) : 0,
        interest: needsFinancing ? (Number(form.interestMin) + Number(form.interestMax)) / 2 / 100 : 0,
        interestRange: needsFinancing ? [Number(form.interestMin) / 100, Number(form.interestMax) / 100] : [0, 0],
        term: Number(form.term),
        propertyTax: form.propertyTax ? Number(form.propertyTax) : null,
        buildingSqft: form.buildingSqft ? Number(form.buildingSqft) : null,
        loadingDocks: form.loadingDocks ? Number(form.loadingDocks) : null,
        parkingSpaces: form.parkingSpaces ? Number(form.parkingSpaces) : null,
        image: "", badges: ["New"], daysOnMarket: 0,
      };
      const saved = await saveCommListing(listing);
      if (saved) { setNewId(saved.id); setSubmitted(true); toast.success("Property listed!"); }
      else toast.error("Something went wrong.");
    } finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Listed!</h1>
        <p className="text-gray-500 mb-6">Your property is live on Sel-Fi Business.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link to={`/business/listings/${newId}`} className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700">View Listing</Link>
          <Link to="/business/listings" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">Browse All</Link>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <ListingUpgrade listingId={newId} onClose={null} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-emerald-600" /></div>
            <div><h1 className="text-2xl font-bold text-gray-900">List a Commercial Property</h1>
              <p className="text-gray-500 text-sm">Vacant land, farms, commercial buildings, and more. Seller-financed deals welcome.</p></div>
          </div>
          <button type="button" onClick={() => setShowPreview(!showPreview)}
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}{showPreview ? "Hide Preview" : "Live Preview"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">

            {/* Property Information */}
            <SectionCard title="Property Information">
              <Field label="Listing Title" error={errors.title} hint="e.g. 'Prime 50-Acre Development Land — Clarington'">
                <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Prime 50-Acre Development Land — Clarington" />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Street Address / Legal Description">
                  <AddressAutocomplete value={form.address} onChange={(v) => set("address", v)}
                    onSelect={(s) => { const parts = (s.short || s.display).split(",").map((p) => p.trim()); if (parts[0]) set("address", parts[0]); if (parts[1]) set("city", parts[1]); }}
                    placeholder="Lot 14, Concession 5 or start typing..." ringColor="focus:ring-emerald-500" />
                </Field>
                <Field label="City / Municipality" error={errors.city}>
                  <input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Clarington" />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Property Category" error={errors.propertyCategory}>
                  <select className={selectCls} value={form.propertyCategory} onChange={(e) => set("propertyCategory", e.target.value)}>
                    <option value="">Select category...</option>
                    {PROPERTY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <CurrencyInput label="Asking Price" value={form.price} onChange={(v) => set("price", v)} placeholder="1,850,000" error={errors.price} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Total Acreage" optional hint="Leave blank for commercial buildings">
                  <div className="relative"><input className={`${inputCls} pr-14`} inputMode="decimal" value={form.acreage} onChange={(e) => set("acreage", e.target.value)} placeholder="50" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">acres</span></div>
                </Field>
                <Field label="Frontage" optional>
                  <input className={inputCls} value={form.frontage} onChange={(e) => set("frontage", e.target.value)} placeholder="660 ft on Concession Rd" />
                </Field>
              </div>
              <Field label="Description" error={errors.description} hint="Describe the property, its history, and what makes it a good opportunity.">
                <textarea className={`${inputCls} h-32 resize-none`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="50 acres of prime development land fronting a municipal road..." />
              </Field>
              <Field label="Existing Structures" optional hint="Describe any buildings, improvements, or infrastructure on the property.">
                <input className={inputCls} value={form.existingStructures} onChange={(e) => set("existingStructures", e.target.value)} placeholder="Small barn (as-is), fenced perimeter" />
              </Field>
            </SectionCard>

            {/* Land & Zoning */}
            <SectionCard title="Land & Zoning Details" subtitle="These fields power the commercial-specific filters buyers use to find properties like yours.">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Zoning Classification"><select className={selectCls} value={form.zoning} onChange={(e) => set("zoning", e.target.value)}><option value="">Select zoning...</option>{ZONING_TYPES.map((z) => <option key={z}>{z}</option>)}</select></Field>
                <Field label="Road Access"><select className={selectCls} value={form.roadAccess} onChange={(e) => set("roadAccess", e.target.value)}><option value="">Select road access...</option>{ROAD_ACCESS.map((r) => <option key={r}>{r}</option>)}</select></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Environmental Status"><select className={selectCls} value={form.environmentalStatus} onChange={(e) => set("environmentalStatus", e.target.value)}><option value="">Select status...</option>{ENVIRONMENTAL_STATUS.map((s) => <option key={s}>{s}</option>)}</select></Field>
                <Field label="Soil Class" optional><select className={selectCls} value={form.soilClass} onChange={(e) => set("soilClass", e.target.value)}><option value="">Select...</option>{SOIL_OPTS.map((s) => <option key={s}>{s}</option>)}</select></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Topography" optional><input className={inputCls} value={form.topography} onChange={(e) => set("topography", e.target.value)} placeholder="Gently rolling, mostly cleared" /></Field>
                <Field label="Drainage" optional><input className={inputCls} value={form.drainage} onChange={(e) => set("drainage", e.target.value)} placeholder="Tile-drained" /></Field>
              </div>
              <CurrencyInput label="Annual Property Tax" value={form.propertyTax} onChange={(v) => set("propertyTax", v)} placeholder="12,400" hint="Optional — helps buyers estimate costs." />
              <Field label="Utilities Available"><PillSelect options={UTILITY_OPTIONS} selected={form.utilities} onToggle={(v) => toggleArr("utilities", v)} /></Field>
              <Field label="Permitted Uses"><PillSelect options={PERMITTED_USES} selected={form.permittedUses} onToggle={(v) => toggleArr("permittedUses", v)} /></Field>
            </SectionCard>

            {/* Building Details (conditional) */}
            {hasBuilding && (
              <SectionCard title="Building Details" subtitle="For properties with existing commercial structures.">
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Building Sqft" optional><input className={inputCls} inputMode="numeric" value={form.buildingSqft} onChange={(e) => set("buildingSqft", e.target.value)} placeholder="6,000" /></Field>
                  <Field label="Ceiling Height" optional><input className={inputCls} value={form.ceilingHeight} onChange={(e) => set("ceilingHeight", e.target.value)} placeholder="24 ft clear span" /></Field>
                  <Field label="Loading Docks" optional><input className={inputCls} inputMode="numeric" value={form.loadingDocks} onChange={(e) => set("loadingDocks", e.target.value)} placeholder="3" /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Parking Spaces" optional><input className={inputCls} inputMode="numeric" value={form.parkingSpaces} onChange={(e) => set("parkingSpaces", e.target.value)} placeholder="12" /></Field>
                  <Field label="Heating" optional><select className={selectCls} value={form.heating} onChange={(e) => set("heating", e.target.value)}><option value="">Select...</option>{HEATING_OPTS.map((o) => <option key={o}>{o}</option>)}</select></Field>
                </div>
                <Field label="Cooling" optional><select className={selectCls} value={form.cooling} onChange={(e) => set("cooling", e.target.value)}><option value="">Select...</option>{COOLING_OPTS.map((o) => <option key={o}>{o}</option>)}</select></Field>
              </SectionCard>
            )}

            {/* What's Nearby */}
            <SectionCard title="What's Nearby" subtitle="Help buyers understand the location.">
              <PillSelect options={NEARBY_OPTIONS} selected={form.nearbyAmenities} onToggle={(v) => toggleArr("nearbyAmenities", v)} />
            </SectionCard>

            {/* Deal Terms */}
            <SectionCard title="Deal Terms" subtitle="What kinds of deals are you open to?">
              {errors.dealTypes && <p className="text-xs text-red-500">{errors.dealTypes}</p>}
              <div className="grid sm:grid-cols-2 gap-3">
                {DEAL_TYPES.map((dt) => { const checked = form.dealTypes.includes(dt); return (
                  <label key={dt} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${checked ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleArr("dealTypes", dt)} className="w-4 h-4 accent-emerald-600 shrink-0" />
                    <span className={`text-sm font-semibold ${checked ? "text-emerald-700" : "text-gray-800"}`}>{dt}</span>
                  </label>); })}
              </div>
              {needsFinancing && (<div className="space-y-5 pt-2 border-t border-gray-50">
                <p className="text-sm font-medium text-gray-700 pt-1">Vendor Financing Details</p>
                <CurrencyInput label="Minimum Down Payment" value={form.downPayment} onChange={(v) => set("downPayment", v)} placeholder="370,000" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Min Interest Rate"><PctInput value={form.interestMin} onChange={(v) => set("interestMin", v)} placeholder="5.5" /></Field>
                  <Field label="Max Interest Rate"><PctInput value={form.interestMax} onChange={(v) => set("interestMax", v)} placeholder="8.0" /></Field>
                </div>
                <Field label="Term"><select className={selectCls} value={form.term} onChange={(e) => set("term", e.target.value)}>
                  {[1, 2, 3, 5, 7, 10, 15].map((y) => <option key={y} value={y}>{y} years</option>)}</select></Field>
              </div>)}
              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input type="checkbox" checked={form.docsLocked} onChange={(e) => set("docsLocked", e.target.checked)} className="mt-0.5 w-4 h-4 accent-emerald-600 shrink-0" />
                <div><p className="text-sm font-medium text-gray-700">Require NDA before sharing documents</p><p className="text-xs text-gray-400 mt-0.5">Buyers must sign before accessing surveys, environmental reports, and financials.</p></div>
              </label>
            </SectionCard>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
              <strong>Disclaimer:</strong> Sel-Fi facilitates introductions only — not a mortgage broker, real estate agent, or legal advisor. Always consult a licensed Ontario real estate lawyer before entering any agreement.
            </div>

            <div className="flex gap-3 pb-8">
              <button type="submit" disabled={submitting}
                className="flex-1 sm:flex-none px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60">
                {submitting ? "Submitting..." : "Submit Property"}
              </button>
              <Link to="/business" className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50">Cancel</Link>
            </div>
          </form>

          {/* Preview sidebar */}
          {showPreview && (
            <div className="hidden lg:block lg:w-96 shrink-0">
              <div className="sticky top-24 space-y-4">
                <p className="text-sm font-semibold text-gray-700">Live Preview</p>
                <CommPreview form={form} />
                <p className="text-xs text-gray-400">This is how your listing will appear to buyers.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

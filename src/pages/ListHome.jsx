// src/pages/ListHome.jsx
// Comprehensive listing form with all property detail fields + live preview.
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { saveListing } from "../lib/storage";
import { supabase } from "../lib/supabase";
import { useToast } from "../components/Toast";
import { Home, CheckCircle, Upload, X, ImageIcon, Star, Wand2, GripVertical, Video, Eye, EyeOff, Bed, Bath, Square, Car } from "lucide-react";
import AddressAutocomplete from "../components/AddressAutocomplete";

const DEAL_TYPES = [
  { value: "seller-finance", label: "Seller-Finance", desc: "You hold the mortgage directly" },
  { value: "rent-to-own",    label: "Rent-to-Own",    desc: "Rent with option to buy" },
  { value: "lease-option",   label: "Lease Option",   desc: "Upfront option fee to purchase" },
  { value: "private-sale",   label: "Private Sale",   desc: "Standard sale, no bank required" },
];
const PROPERTY_TYPES = ["Single-Family", "Townhouse", "Semi-Detached", "Condo", "Multi-Unit"];
const BASEMENT_OPTS  = ["None", "Unfinished", "Partially Finished", "Finished"];
const PARKING_OPTS   = ["None", "Driveway", "Attached Garage", "Detached Garage", "Underground", "Street"];
const HEATING_OPTS   = ["Forced Air (Natural Gas)", "Forced Air (Electric)", "Radiant", "Baseboard", "Heat Pump", "Other"];
const COOLING_OPTS   = ["Central Air", "Ductless Mini-Split", "Window Units", "None"];
const EXTERIOR_OPTS  = ["Brick", "Brick & Vinyl", "Brick & Stone", "Vinyl Siding", "Aluminum Siding", "Stucco", "Wood", "Other"];
const WATER_OPTS     = ["Municipal", "Well"];
const SEWER_OPTS     = ["Municipal", "Septic"];

const AMENITY_OPTIONS = [
  "Fireplace","Hardwood Floors","Updated Kitchen","Ensuite Bath","Walk-in Closet",
  "Deck","Pool","Hot Tub","Fenced Yard","Sprinkler System","Central Vacuum",
  "Crown Moulding","9ft Ceilings","Open Concept","Stainless Appliances",
  "Quartz Counters","Balcony","Separate Entrance Basement","Main Floor Laundry",
];
const NEARBY_OPTIONS = [
  "Schools","Parks","Transit","Shopping","Restaurants","GO Station",
  "Highway Access","Groceries","Community Centre","Waterfront Trail","Hospital",
];

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-900 placeholder-gray-400";
const selectCls = `${inputCls} appearance-auto`;

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
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Field({ label, hint, error, optional, children }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{optional && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
      </label>}
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function PctInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls} pr-7`} />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">%</span>
    </div>
  );
}

function PillSelect({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => onToggle(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}>{opt}</button>
        );
      })}
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-gray-900 text-base">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Photo Uploader ────────────────────────────────────────────────────
function PhotoUploader({ photos, onChange }) {
  const inputRef = useRef(); const [dragging, setDragging] = useState(false); const [dragIdx, setDragIdx] = useState(null);
  const addFiles = (files) => {
    const np = Array.from(files).filter((f)=>f.type.startsWith("image/")).slice(0,20-photos.length).map((file)=>({file,preview:URL.createObjectURL(file),aiStaged:false}));
    onChange([...photos,...np]);
  };
  const remove=(i)=>onChange(photos.filter((_,idx)=>idx!==i));
  const setCover=(i)=>{const u=[...photos];const[item]=u.splice(i,1);onChange([item,...u]);};
  const toggleAI=(i)=>{const u=[...photos];u[i]={...u[i],aiStaged:!u[i].aiStaged};onChange(u);};
  const onDragStart=(e,i)=>{setDragIdx(i);e.dataTransfer.effectAllowed="move";};
  const onDragOver=(e,i)=>{e.preventDefault();if(dragIdx===null||dragIdx===i)return;const u=[...photos];const[item]=u.splice(dragIdx,1);u.splice(i,0,item);setDragIdx(i);onChange(u);};
  const onDragEnd=()=>setDragIdx(null);
  return (
    <div>
      <div onDragOver={(e)=>{if(photos.length<20){e.preventDefault();setDragging(true);}}} onDragLeave={()=>setDragging(false)}
        onDrop={(e)=>{e.preventDefault();setDragging(false);addFiles(e.dataTransfer.files);}}
        onClick={()=>photos.length<20&&inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${photos.length>=20?"opacity-50 cursor-not-allowed border-gray-200":dragging?"border-blue-400 bg-blue-50 cursor-copy":"border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer"}`}>
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2"/>
        <p className="text-sm font-medium text-gray-600">{photos.length>=20?"Maximum 20 photos reached":"Drag & drop photos or click to browse"}</p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · Max 10MB each · Up to 20 photos</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e)=>addFiles(e.target.files)}/>
      </div>
      {photos.length>0&&(<div className="mt-5"><p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5"><GripVertical className="w-3.5 h-3.5"/>Drag to reorder · First photo = cover · Click ★ to set cover</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {photos.map((p,i)=>(<div key={i} draggable onDragStart={(e)=>onDragStart(e,i)} onDragOver={(e)=>onDragOver(e,i)} onDragEnd={onDragEnd}
            className={`relative group aspect-square rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${i===0?"border-blue-500 ring-2 ring-blue-200":dragIdx===i?"border-blue-300 opacity-60":"border-gray-200"}`}>
            <img src={p.preview} alt="" className="w-full h-full object-cover"/>
            {i===0&&<span className="absolute bottom-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1"><Star className="w-2.5 h-2.5"/>Cover</span>}
            {p.aiStaged&&<span className="absolute top-1.5 left-1.5 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1"><Wand2 className="w-2.5 h-2.5"/>AI</span>}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              {i!==0&&<button type="button" onClick={()=>setCover(i)} className="w-full flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-semibold py-1 rounded-lg"><Star className="w-3 h-3"/>Set Cover</button>}
              <button type="button" onClick={()=>toggleAI(i)} className={`w-full flex items-center justify-center gap-1 text-[11px] font-semibold py-1 rounded-lg ${p.aiStaged?"bg-purple-500 hover:bg-purple-600 text-white":"bg-white/20 hover:bg-white/30 text-white"}`}><Wand2 className="w-3 h-3"/>{p.aiStaged?"AI Staged ✓":"AI Staged?"}</button>
              <button type="button" onClick={()=>remove(i)} className="w-full flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[11px] font-semibold py-1 rounded-lg"><X className="w-3 h-3"/>Remove</button>
            </div>
          </div>))}
        </div></div>)}
      {photos.length===0&&<p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5 shrink-0"/>Listings with photos receive significantly more interest.</p>}
    </div>
  );
}

// ── Video field ───────────────────────────────────────────────────────
function VideoField({ value, onChange }) {
  const getEmbedUrl=(url)=>{if(!url)return null;const yt=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);if(yt)return`https://www.youtube.com/embed/${yt[1]}`;const vm=url.match(/vimeo\.com\/(\d+)/);if(vm)return`https://player.vimeo.com/video/${vm[1]}`;if(url.includes("matterport.com")){const mp=url.match(/\/show\/\?m=([^&\s]+)/);if(mp)return`https://my.matterport.com/show/?m=${mp[1]}&play=1`;}return null;};
  const embedUrl=getEmbedUrl(value);
  return (<div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Video / Virtual Tour URL <span className="text-gray-400 font-normal">(optional)</span></label>
    <div className="relative"><Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input type="url" value={value} onChange={(e)=>onChange(e.target.value)} placeholder="YouTube, Vimeo, or Matterport URL" className={`${inputCls} pl-9`}/></div>
    <p className="text-xs text-gray-400 mt-1">Supports YouTube, Vimeo, and Matterport 3D tours.</p>
    {embedUrl&&<div className="mt-3 rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-100"><iframe src={embedUrl} title="Tour" className="w-full h-full" allowFullScreen/></div>}
    {value&&!embedUrl&&<p className="text-xs text-orange-500 mt-1.5">⚠ URL not recognized. Use YouTube, Vimeo, or Matterport.</p>}
  </div>);
}

// ── Upload photos to Supabase ────────────────────────────────────────
async function uploadPhotos(photos) {
  if (!supabase || photos.length === 0) return photos.map((p) => ({ url: p.preview, aiStaged: p.aiStaged }));
  const results = [];
  for (const p of photos) {
    const ext = p.file?.name?.split(".").pop() || "jpg";
    const path = `listings/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("listing-photos").upload(path, p.file);
    if (!error) {
      const { data: urlData } = supabase.storage.from("listing-photos").getPublicUrl(path);
      results.push({ url: urlData?.publicUrl || p.preview, aiStaged: p.aiStaged });
    } else { results.push({ url: p.preview, aiStaged: p.aiStaged }); }
  }
  return results;
}

// ── Live Preview ─────────────────────────────────────────────────────
function ListingPreview({ form, photos }) {
  const getDealColor = (dt) => {
    if (!dt) return "#2563EB"; const d = dt.toLowerCase();
    if (d.includes("rent")) return "#7C3AED"; if (d.includes("lease")) return "#D97706";
    if (d.includes("private")) return "#059669"; return "#2563EB";
  };
  const dealLabel = DEAL_TYPES.find((d) => form.dealTypes.includes(d.value))?.label || "—";
  const price = form.price ? `$${Number(form.price).toLocaleString("en-CA")}` : "$—";
  const coverImg = photos[0]?.preview || null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        {coverImg ? <img src={coverImg} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🏠</div>}
        {dealLabel !== "—" && <div className="absolute top-3 right-3 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow" style={{ background: getDealColor(dealLabel) }}>{dealLabel}</div>}
        <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-medium">Preview</div>
      </div>
      <div className="p-5">
        <p className="text-2xl font-bold text-blue-600 mb-1">{price}</p>
        {form.propertyTax && <span className="text-[10px] text-gray-400">${Number(form.propertyTax).toLocaleString()}/yr tax</span>}
        <p className="text-sm text-gray-500 mt-1">{form.address || "Street Address"}, {form.city || "City"}</p>
        <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
          {form.bedrooms && <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-gray-400"/>{form.bedrooms}</span>}
          {form.bathrooms && <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-gray-400"/>{form.bathrooms}</span>}
          {form.sqft && <span className="flex items-center gap-1"><Square className="w-4 h-4 text-gray-400"/>{Number(form.sqft).toLocaleString()}</span>}
          {form.parkingSpaces && <span className="flex items-center gap-1"><Car className="w-4 h-4 text-gray-400"/>{form.parkingSpaces}</span>}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {form.propertyType && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{form.propertyType}</span>}
          {form.basement && form.basement !== "None" && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{form.basement} Bsmt</span>}
          {form.yearBuilt && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Built {form.yearBuilt}</span>}
        </div>
      </div>
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────
export default function ListHome() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [newId, setNewId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState({
    title: "", address: "", city: "", state: "ON",
    price: "", bedrooms: "", bathrooms: "", sqft: "", lot: "",
    propertyType: "Single-Family", dealTypes: [],
    downPayment: "", interestMin: "", interestMax: "", term: "25",
    description: "", docsLocked: true, videoUrl: "",
    // New fields
    yearBuilt: "", propertyTax: "", stories: "",
    basement: "None", parking: "None", parkingSpaces: "",
    heating: "", cooling: "", waterSource: "", sewer: "",
    exterior: "", foundation: "", roofing: "",
    amenities: [], nearbyAmenities: [], condoFees: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const toggleDeal = (val) => { const c = form.dealTypes; set("dealTypes", c.includes(val) ? c.filter((v) => v !== val) : [...c, val]); };
  const toggleArr = (key, val) => { const c = form[key]; set(key, c.includes(val) ? c.filter((v) => v !== val) : [...c, val]); };
  const needsFinancing = form.dealTypes.some((d) => d !== "private-sale");
  const showCondo = form.propertyType === "Condo" || form.propertyType === "Townhouse";

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.price) e.price = "Required";
    if (!form.bedrooms) e.bedrooms = "Required";
    if (!form.bathrooms) e.bathrooms = "Required";
    if (!form.sqft) e.sqft = "Required";
    if (form.dealTypes.length === 0) e.dealTypes = "Select at least one deal type";
    if (needsFinancing && !form.downPayment) e.downPayment = "Required for financing deals";
    if (needsFinancing && (!form.interestMin || !form.interestMax)) e.interest = "Both rates required";
    if (!form.description.trim()) e.description = "Please add a description";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({ top: 0, behavior: "smooth" }); toast.error("Please fix the errors above."); return; }
    setSubmitting(true);
    try {
      const uploadedPhotos = await uploadPhotos(photos);
      const primaryDeal = form.dealTypes[0] || "private-sale";
      const dealTypeLabel = DEAL_TYPES.find((d) => d.value === primaryDeal)?.label || "Private Sale";
      const listing = {
        title: form.title, address: form.address, city: form.city, state: form.state,
        image: uploadedPhotos[0]?.url || "", images: uploadedPhotos,
        price: Number(form.price), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms),
        sqft: Number(form.sqft), lot: form.lot, propertyType: form.propertyType,
        dealType: dealTypeLabel, dealTypes: form.dealTypes,
        downPayment: needsFinancing ? Number(form.downPayment) : 0,
        interest: needsFinancing ? (Number(form.interestMin)+Number(form.interestMax))/2/100 : 0,
        interestRange: needsFinancing ? [Number(form.interestMin)/100, Number(form.interestMax)/100] : [0,0],
        term: Number(form.term), description: form.description, docsLocked: form.docsLocked, videoUrl: form.videoUrl,
        // New fields
        yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : null,
        propertyTax: form.propertyTax ? Number(form.propertyTax) : null,
        stories: form.stories ? Number(form.stories) : null,
        basement: form.basement, parking: form.parking,
        parkingSpaces: form.parkingSpaces ? Number(form.parkingSpaces) : null,
        heating: form.heating, cooling: form.cooling,
        waterSource: form.waterSource, sewer: form.sewer,
        exterior: form.exterior, foundation: form.foundation, roofing: form.roofing,
        amenities: form.amenities, nearbyAmenities: form.nearbyAmenities,
        condoFees: form.condoFees ? Number(form.condoFees) : null,
        badges: ["New"], daysOnMarket: 0,
      };
      const saved = await saveListing(listing);
      if (saved) { setNewId(saved.id); setSubmitted(true); toast.success("Your listing is live on Sel-Fi!"); }
      else toast.error("Something went wrong.");
    } catch (err) { console.error(err); toast.error("Submission failed."); }
    finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div className="max-w-lg mx-auto py-20 px-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600"/></div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h1>
      <p className="text-gray-500 mb-8">Your home is live on Sel-Fi. Buyers whose profile matches your terms will be able to find it.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={`/listings/${newId}`} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">View My Listing</Link>
        <Link to="/listings" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">Browse All</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0"><Home className="w-5 h-5 text-orange-600"/></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">List Your Home</h1>
              <p className="text-gray-500 text-sm">Tell buyers about your property and the terms you're offering. Takes about 5 minutes.</p>
            </div>
          </div>
          <button type="button" onClick={() => setShowPreview(!showPreview)}
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
            {showPreview ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
            {showPreview ? "Hide Preview" : "Live Preview"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form column */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">

            {/* Property Information */}
            <SectionCard title="Property Information">
              <Field label="Listing Title" error={errors.title} hint="e.g. 'Sunny 3-bed Craftsman near Park'">
                <input className={inputCls} value={form.title} onChange={(e)=>set("title",e.target.value)} placeholder="Give your listing a descriptive title"/>
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Street Address" error={errors.address}>
                  <AddressAutocomplete value={form.address} onChange={(v)=>set("address",v)}
                    onSelect={(s)=>{const parts=(s.short||s.display).split(",").map((p)=>p.trim());if(parts[0])set("address",parts[0]);if(parts[1])set("city",parts[1]);}}
                    placeholder="Start typing an address..." ringColor="focus:ring-blue-500"/>
                </Field>
                <Field label="City" error={errors.city}>
                  <input className={inputCls} value={form.city} onChange={(e)=>set("city",e.target.value)} placeholder="Whitby"/>
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Property Type">
                  <select className={selectCls} value={form.propertyType} onChange={(e)=>set("propertyType",e.target.value)}>
                    {PROPERTY_TYPES.map((t)=><option key={t}>{t}</option>)}
                  </select>
                </Field>
                <CurrencyInput label="Asking Price" value={form.price} onChange={(v)=>set("price",v)} placeholder="575,000" error={errors.price}/>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Bedrooms" error={errors.bedrooms}><input className={inputCls} inputMode="numeric" value={form.bedrooms} onChange={(e)=>set("bedrooms",e.target.value)} placeholder="3"/></Field>
                <Field label="Bathrooms" error={errors.bathrooms}><input className={inputCls} inputMode="decimal" value={form.bathrooms} onChange={(e)=>set("bathrooms",e.target.value)} placeholder="2"/></Field>
                <Field label="Sq Ft" error={errors.sqft}><input className={inputCls} inputMode="numeric" value={form.sqft} onChange={(e)=>set("sqft",e.target.value)} placeholder="1,800"/></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Lot Size" optional hint="e.g. 40x120 or 0.25 acres">
                  <input className={inputCls} value={form.lot} onChange={(e)=>set("lot",e.target.value)} placeholder="40x120"/>
                </Field>
                <Field label="Year Built" optional>
                  <input className={inputCls} inputMode="numeric" value={form.yearBuilt} onChange={(e)=>set("yearBuilt",e.target.value)} placeholder="1985"/>
                </Field>
              </div>
              <Field label="Description" error={errors.description} hint="Describe the home, recent updates, and what makes it special.">
                <textarea className={`${inputCls} h-32 resize-none`} value={form.description} onChange={(e)=>set("description",e.target.value)} placeholder="Charming craftsman on a quiet street near excellent schools..."/>
              </Field>
            </SectionCard>

            {/* Building Details */}
            <SectionCard title="Building Details" subtitle="Help buyers understand the property. Fill in what you know — all fields optional.">
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Stories" optional><input className={inputCls} inputMode="numeric" value={form.stories} onChange={(e)=>set("stories",e.target.value)} placeholder="2"/></Field>
                <Field label="Basement" optional><select className={selectCls} value={form.basement} onChange={(e)=>set("basement",e.target.value)}>{BASEMENT_OPTS.map((o)=><option key={o}>{o}</option>)}</select></Field>
                <Field label="Exterior" optional><select className={selectCls} value={form.exterior} onChange={(e)=>set("exterior",e.target.value)}><option value="">Select...</option>{EXTERIOR_OPTS.map((o)=><option key={o}>{o}</option>)}</select></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Heating" optional><select className={selectCls} value={form.heating} onChange={(e)=>set("heating",e.target.value)}><option value="">Select...</option>{HEATING_OPTS.map((o)=><option key={o}>{o}</option>)}</select></Field>
                <Field label="Cooling" optional><select className={selectCls} value={form.cooling} onChange={(e)=>set("cooling",e.target.value)}><option value="">Select...</option>{COOLING_OPTS.map((o)=><option key={o}>{o}</option>)}</select></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Parking Type" optional><select className={selectCls} value={form.parking} onChange={(e)=>set("parking",e.target.value)}>{PARKING_OPTS.map((o)=><option key={o}>{o}</option>)}</select></Field>
                <Field label="Parking Spaces" optional><input className={inputCls} inputMode="numeric" value={form.parkingSpaces} onChange={(e)=>set("parkingSpaces",e.target.value)} placeholder="2"/></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Water Source" optional><select className={selectCls} value={form.waterSource} onChange={(e)=>set("waterSource",e.target.value)}><option value="">Select...</option>{WATER_OPTS.map((o)=><option key={o}>{o}</option>)}</select></Field>
                <Field label="Sewer" optional><select className={selectCls} value={form.sewer} onChange={(e)=>set("sewer",e.target.value)}><option value="">Select...</option>{SEWER_OPTS.map((o)=><option key={o}>{o}</option>)}</select></Field>
              </div>
              <CurrencyInput label="Annual Property Tax" value={form.propertyTax} onChange={(v)=>set("propertyTax",v)} placeholder="4,200" hint="Optional — helps buyers estimate monthly costs."/>
              {showCondo && <CurrencyInput label="Monthly Condo/Maintenance Fees" value={form.condoFees} onChange={(v)=>set("condoFees",v)} placeholder="289" hint="If applicable."/>}
            </SectionCard>

            {/* Amenities */}
            <SectionCard title="Features & Amenities" subtitle="Select all that apply. These show on your listing and help with search filters.">
              <Field label="Interior Features" optional>
                <PillSelect options={AMENITY_OPTIONS} selected={form.amenities} onToggle={(v)=>toggleArr("amenities",v)}/>
              </Field>
              <Field label="What's Nearby" optional>
                <PillSelect options={NEARBY_OPTIONS} selected={form.nearbyAmenities} onToggle={(v)=>toggleArr("nearbyAmenities",v)}/>
              </Field>
            </SectionCard>

            {/* Photos */}
            <SectionCard title="Photos"><PhotoUploader photos={photos} onChange={setPhotos}/></SectionCard>

            {/* Video */}
            <SectionCard title="Video & Virtual Tour"><VideoField value={form.videoUrl} onChange={(v)=>set("videoUrl",v)}/></SectionCard>

            {/* Deal Terms */}
            <SectionCard title="Deal Terms" subtitle="What kinds of deals are you open to?">
              {errors.dealTypes && <p className="text-xs text-red-500">{errors.dealTypes}</p>}
              <div className="grid sm:grid-cols-2 gap-3">
                {DEAL_TYPES.map(({value,label,desc})=>{const checked=form.dealTypes.includes(value);return(
                  <label key={value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${checked?"border-blue-500 bg-blue-50":"border-gray-200 hover:border-gray-300"}`}>
                    <input type="checkbox" checked={checked} onChange={()=>toggleDeal(value)} className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0"/>
                    <div><p className={`text-sm font-semibold ${checked?"text-blue-700":"text-gray-800"}`}>{label}</p><p className="text-xs text-gray-400 mt-0.5">{desc}</p></div>
                  </label>);})}
              </div>
              {needsFinancing&&(<div className="space-y-5 pt-2 border-t border-gray-50">
                <p className="text-sm font-medium text-gray-700 pt-1">Financing Details</p>
                <CurrencyInput label="Minimum Down Payment" value={form.downPayment} onChange={(v)=>set("downPayment",v)} placeholder="46,000" error={errors.downPayment}/>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Min Interest Rate" error={errors.interest}><PctInput value={form.interestMin} onChange={(v)=>set("interestMin",v)} placeholder="5.5"/></Field>
                  <Field label="Max Interest Rate"><PctInput value={form.interestMax} onChange={(v)=>set("interestMax",v)} placeholder="8.5"/></Field>
                </div>
                <Field label="Amortization Period"><select className={selectCls} value={form.term} onChange={(e)=>set("term",e.target.value)}>{[10,15,20,25,30].map((y)=><option key={y} value={y}>{y} years</option>)}</select></Field>
              </div>)}
              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input type="checkbox" checked={form.docsLocked} onChange={(e)=>set("docsLocked",e.target.checked)} className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0"/>
                <div><p className="text-sm font-medium text-gray-700">Require NDA before sharing documents</p><p className="text-xs text-gray-400 mt-0.5">Buyers must sign before accessing financial details.</p></div>
              </label>
            </SectionCard>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
              <strong>Disclaimer:</strong> Sel-Fi is a marketplace platform only. We do not provide legal, financial, or mortgage advice.
              Always consult a licensed Ontario real estate lawyer before entering any agreement.
            </div>

            <div className="flex gap-3 pb-8">
              <button type="submit" disabled={submitting}
                className="flex-1 sm:flex-none px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60">
                {submitting ? "Submitting..." : "Submit Listing"}
              </button>
              <Link to="/" className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50">Cancel</Link>
            </div>
          </form>

          {/* Preview sidebar */}
          {showPreview && (
            <div className="hidden lg:block lg:w-96 shrink-0">
              <div className="sticky top-24 space-y-4">
                <p className="text-sm font-semibold text-gray-700">Live Preview</p>
                <ListingPreview form={form} photos={photos}/>
                <p className="text-xs text-gray-400">This is how your listing will appear to buyers.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

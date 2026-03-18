// src/pages/ListHome.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { saveListing } from "../lib/storage";
import { supabase } from "../lib/supabase";
import { useToast } from "../components/Toast";
import { Home, CheckCircle, Upload, X, ImageIcon, Star, Wand2, GripVertical, Video } from "lucide-react";
import AddressAutocomplete from "../components/AddressAutocomplete";

const DEAL_TYPES = [
  { value: "seller-finance", label: "Seller-Finance", desc: "You hold the mortgage directly" },
  { value: "rent-to-own",    label: "Rent-to-Own",    desc: "Rent with option to buy" },
  { value: "lease-option",   label: "Lease Option",   desc: "Upfront option fee to purchase" },
  { value: "private-sale",   label: "Private Sale",   desc: "Standard sale, no bank required" },
];
const PROPERTY_TYPES = ["Single-Family", "Townhouse", "Condo", "Multi-Unit"];

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-900 placeholder-gray-400";

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

function PctInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input type="text" inputMode="decimal" value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`${inputCls} pr-7`} />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">%</span>
    </div>
  );
}

// ── Advanced Photo Uploader ────────────────────────────────────────────
function PhotoUploader({ photos, onChange }) {
  const inputRef  = useRef();
  const [dragging, setDragging] = useState(false);
  const [dragIdx,  setDragIdx]  = useState(null);

  const addFiles = (files) => {
    const newPhotos = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 20 - photos.length)
      .map((file) => ({ file, preview: URL.createObjectURL(file), aiStaged: false }));
    onChange([...photos, ...newPhotos]);
  };

  const remove   = (i) => onChange(photos.filter((_, idx) => idx !== i));
  const setCover = (i) => {
    const updated = [...photos];
    const [item]  = updated.splice(i, 1);
    onChange([item, ...updated]);
  };
  const toggleAI = (i) => {
    const updated = [...photos];
    updated[i] = { ...updated[i], aiStaged: !updated[i].aiStaged };
    onChange(updated);
  };

  // Drag-to-reorder
  const onDragStart = (e, i) => { setDragIdx(i); e.dataTransfer.effectAllowed = "move"; };
  const onDragOver  = (e, i) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const updated = [...photos];
    const [item]  = updated.splice(dragIdx, 1);
    updated.splice(i, 0, item);
    setDragIdx(i);
    onChange(updated);
  };
  const onDragEnd = () => setDragIdx(null);

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { if (photos.length < 20) { e.preventDefault(); setDragging(true); } }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => photos.length < 20 && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          photos.length >= 20 ? "opacity-50 cursor-not-allowed border-gray-200" :
          dragging ? "border-blue-400 bg-blue-50 cursor-copy" :
          "border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-600">
          {photos.length >= 20 ? "Maximum 20 photos reached" : "Drag & drop photos or click to browse"}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · Max 10MB each · Up to 20 photos</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => addFiles(e.target.files)} />
      </div>

      {/* Photo grid with reorder */}
      {photos.length > 0 && (
        <div className="mt-5">
          <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
            <GripVertical className="w-3.5 h-3.5" />
            Drag photos to reorder · First photo is the cover · Click ★ to set cover
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {photos.map((p, i) => (
              <div
                key={i}
                draggable
                onDragStart={(e) => onDragStart(e, i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDragEnd={onDragEnd}
                className={`relative group aspect-square rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                  i === 0 ? "border-blue-500 ring-2 ring-blue-200" :
                  dragIdx === i ? "border-blue-300 opacity-60" : "border-gray-200"
                }`}
              >
                <img src={p.preview} alt="" className="w-full h-full object-cover" />

                {/* Cover badge */}
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                    <Star className="w-2.5 h-2.5" /> Cover
                  </span>
                )}

                {/* AI staged badge */}
                {p.aiStaged && (
                  <span className="absolute top-1.5 left-1.5 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                    <Wand2 className="w-2.5 h-2.5" /> AI
                  </span>
                )}

                {/* Hover controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {i !== 0 && (
                    <button type="button" onClick={() => setCover(i)}
                      title="Set as cover photo"
                      className="w-full flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-semibold py-1 rounded-lg transition-colors">
                      <Star className="w-3 h-3" /> Set Cover
                    </button>
                  )}
                  <button type="button" onClick={() => toggleAI(i)}
                    title="Mark as AI staged"
                    className={`w-full flex items-center justify-center gap-1 text-[11px] font-semibold py-1 rounded-lg transition-colors ${
                      p.aiStaged
                        ? "bg-purple-500 hover:bg-purple-600 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}>
                    <Wand2 className="w-3 h-3" /> {p.aiStaged ? "AI Staged ✓" : "AI Staged?"}
                  </button>
                  <button type="button" onClick={() => remove(i)}
                    className="w-full flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[11px] font-semibold py-1 rounded-lg transition-colors">
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {photos.length === 0 && (
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 shrink-0" />
          Listings with photos receive significantly more interest. Luxury listings should include at least 10 photos.
        </p>
      )}
    </div>
  );
}

// ── Video URL field with embed preview ───────────────────────────────
function VideoField({ value, onChange }) {
  const getEmbedUrl = (url) => {
    if (!url) return null;
    // YouTube
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    // Vimeo
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    // Matterport
    if (url.includes("matterport.com") || url.includes("my.matterport")) {
      const mp = url.match(/\/show\/\?m=([^&\s]+)/);
      if (mp) return `https://my.matterport.com/show/?m=${mp[1]}&play=1`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(value);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Video Tour or Virtual Tour URL
        <span className="text-gray-400 font-normal ml-1">(optional)</span>
      </label>
      <div className="relative">
        <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="YouTube, Vimeo, or Matterport URL"
          className={`${inputCls} pl-9`}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Supports YouTube, Vimeo, and Matterport 3D tours. Drone footage and walkthroughs welcome.
      </p>

      {/* Live embed preview */}
      {embedUrl && (
        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-100">
          <iframe
            src={embedUrl}
            title="Property video tour"
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}
      {value && !embedUrl && (
        <p className="text-xs text-orange-500 mt-1.5">
          ⚠ URL format not recognized. Please use a YouTube, Vimeo, or Matterport link.
        </p>
      )}
    </div>
  );
}

// ── Upload photos to Supabase Storage ────────────────────────────────
async function uploadPhotos(photos) {
  if (!supabase || photos.length === 0) return photos.map((p) => ({ url: p.preview, aiStaged: p.aiStaged }));
  const results = [];
  for (const { file, preview, aiStaged } of photos) {
    if (!file) { results.push({ url: preview, aiStaged }); continue; }
    const ext  = file.name.split(".").pop().toLowerCase();
    const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("listing-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (!error && data) {
      const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(data.path);
      results.push({ url: urlData.publicUrl, aiStaged });
    } else {
      results.push({ url: preview, aiStaged });
    }
  }
  return results;
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
    description: "", docsLocked: true, videoUrl: "",
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
    if (needsFinancing && !form.downPayment) e.downPayment = "Required for financing deals";
    if (needsFinancing && (!form.interestMin || !form.interestMax)) e.interest = "Both rates required";
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
      const uploadedPhotos = await uploadPhotos(photos);
      const primaryDeal = form.dealTypes[0] || "private-sale";
      const dealTypeLabel = DEAL_TYPES.find((d) => d.value === primaryDeal)?.label || "Private Sale";

      const listing = {
        title:         form.title,
        address:       form.address,
        city:          form.city,
        state:         form.state,
        image:         uploadedPhotos[0]?.url || "",
        images:        uploadedPhotos,
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
        interestRange: needsFinancing ? [Number(form.interestMin)/100, Number(form.interestMax)/100] : [0, 0],
        term:          Number(form.term),
        description:   form.description,
        docsLocked:    form.docsLocked,
        videoUrl:      form.videoUrl,
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
        <p className="text-gray-500 mb-8">Your home is live on HomeMatch. Buyers whose profile matches your terms will be able to find it.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/listings/${newId}`} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">View My Listing</Link>
          <Link to="/listings" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Browse All Listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">List Your Home</h1>
          </div>
          <p className="text-gray-500 text-sm">Tell buyers about your property and the terms you're offering. Takes about 5 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Property Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-base">Property Information</h2>
            <Field label="Listing Title" error={errors.title} hint="e.g. 'Sunny 3-bed Craftsman near Park'">
              <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Give your listing a descriptive title" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Street Address" error={errors.address}>
                <AddressAutocomplete
                  value={form.address}
                  onChange={(v) => set("address", v)}
                  onSelect={(s) => {
                    // Parse the short address: "house_number road, city, province"
                    const parts = (s.short || s.display).split(",").map((p) => p.trim());
                    if (parts[0]) set("address", parts[0]);
                    // Fill city from the suggestion if available
                    if (parts[1]) set("city", parts[1]);
                  }}
                  placeholder="Start typing an address..."
                  ringColor="focus:ring-blue-500"
                />
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
              <CurrencyInput label="Asking Price" value={form.price} onChange={(v) => set("price", v)} placeholder="575,000" error={errors.price} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Bedrooms" error={errors.bedrooms}>
                <input className={inputCls} inputMode="numeric" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} placeholder="3" />
              </Field>
              <Field label="Bathrooms" error={errors.bathrooms}>
                <input className={inputCls} inputMode="decimal" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} placeholder="2" />
              </Field>
              <Field label="Sq Ft" error={errors.sqft}>
                <input className={inputCls} inputMode="numeric" value={form.sqft} onChange={(e) => set("sqft", e.target.value)} placeholder="1,800" />
              </Field>
            </div>
            <Field label="Lot Size" hint="Optional — e.g. 40x120 or 0.25 acres">
              <input className={inputCls} value={form.lot} onChange={(e) => set("lot", e.target.value)} placeholder="40x120" />
            </Field>
            <Field label="Description" error={errors.description} hint="Describe the home, recent updates, and what makes it special.">
              <textarea className={`${inputCls} h-32 resize-none`} value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Charming craftsman on a quiet street near excellent schools..." />
            </Field>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 text-base mb-5">Photos</h2>
            <PhotoUploader photos={photos} onChange={setPhotos} />
          </div>

          {/* Video / Virtual Tour */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 text-base mb-5">Video &amp; Virtual Tour</h2>
            <VideoField value={form.videoUrl} onChange={(v) => set("videoUrl", v)} />
          </div>

          {/* Deal Terms */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-base">Deal Terms</h2>
            <p className="text-sm text-gray-500">What kinds of deals are you open to? Select everything that applies.</p>
            {errors.dealTypes && <p className="text-xs text-red-500">{errors.dealTypes}</p>}
            <div className="grid sm:grid-cols-2 gap-3">
              {DEAL_TYPES.map(({ value, label, desc }) => {
                const checked = form.dealTypes.includes(value);
                return (
                  <label key={value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${checked ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleDeal(value)} className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
                    <div>
                      <p className={`text-sm font-semibold ${checked ? "text-blue-700" : "text-gray-800"}`}>{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {needsFinancing && (
              <div className="space-y-5 pt-2 border-t border-gray-50">
                <p className="text-sm font-medium text-gray-700 pt-1">Financing Details</p>
                <CurrencyInput label="Minimum Down Payment" value={form.downPayment} onChange={(v) => set("downPayment", v)} placeholder="46,000" hint="The minimum you'd accept from a buyer." error={errors.downPayment} />
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
                    {[10,15,20,25,30].map((y) => <option key={y} value={y}>{y} years</option>)}
                  </select>
                </Field>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input type="checkbox" checked={form.docsLocked} onChange={(e) => set("docsLocked", e.target.checked)} className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Require NDA before sharing documents</p>
                <p className="text-xs text-gray-400 mt-0.5">Buyers must sign a short NDA before accessing financial details and documents.</p>
              </div>
            </label>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <strong>Disclaimer:</strong> HomeMatch is a marketplace platform only. We do not provide legal, financial, or mortgage advice.
            We strongly recommend consulting a real estate lawyer before entering any agreement.
          </div>

          <div className="flex gap-3 pb-8">
            <button type="submit" disabled={submitting}
              className="flex-1 sm:flex-none px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? "Submitting..." : "Submit Listing"}
            </button>
            <Link to="/" className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

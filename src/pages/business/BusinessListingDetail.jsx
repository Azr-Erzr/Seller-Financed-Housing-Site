// src/pages/business/BusinessListingDetail.jsx
// Comprehensive commercial property detail — Wahi-level information density, emerald theme.
// Mirrors ListingDetail.jsx structure with commercial-specific fields.

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getCommListingById, getAllCommListings, toggleSavedListing, isListingSaved } from "../../lib/commercial-storage";
import { monthlyPayment, amortizationPreview, ltv } from "../../lib/finance";
import { useToast } from "../../components/Toast";
import NDA from "../../components/NDA";
import ContactModal from "../../components/ContactModal";
import CommListingCard from "../../components/business/CommListingCard";
import { DetailSkeleton } from "../../components/LoadingSkeleton";
import {
  MapPin, Ruler, Building, Truck, Phone, Bookmark, BookmarkCheck, ArrowLeft,
  Flame, Snowflake, Droplets, Trees, Shield, Clock, DollarSign, Zap, Wifi,
  ChevronDown, Calendar, Leaf
} from "lucide-react";

const money = (n) => n ? `$${Number(n).toLocaleString("en-CA")}` : "—";
const pct   = (n) => n ? `${(Number(n) * 100).toFixed(1)}%` : "—";

const categoryColors = {
  "Vacant Land":              "bg-lime-100 text-lime-700",
  "Agricultural / Farm":      "bg-green-100 text-green-700",
  "Development Land":         "bg-amber-100 text-amber-700",
  "Commercial Building":      "bg-blue-100 text-blue-700",
  "Industrial / Warehouse":   "bg-slate-100 text-slate-700",
  "Multi-Unit / Apartment":   "bg-purple-100 text-purple-700",
  "Waterfront / Recreational":"bg-cyan-100 text-cyan-700",
  "Special Purpose":          "bg-orange-100 text-orange-700",
};

function SectionHeader({ title, id }) {
  return (
    <div id={id} className="scroll-mt-32">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 bg-emerald-600 rounded-full" />
        <h2 className="font-bold text-gray-900 text-lg uppercase tracking-wide">{title}</h2>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon: Icon }) {
  if (!value || value === "—") return null;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

const TABS = [
  { id: "highlights",  label: "Highlights" },
  { id: "description", label: "Description" },
  { id: "details",     label: "Property Details" },
  { id: "land",        label: "Land & Site" },
  { id: "building",    label: "Building" },
  { id: "financing",   label: "Financing" },
  { id: "savings",     label: "Vendor Savings" },
  { id: "similar",     label: "Similar" },
];

function TabNav({ activeTab, onTabClick }) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-[73px] z-30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => onTabClick(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BusinessListingDetail() {
  const { id } = useParams();
  const { toast } = useToast();

  const [listing,      setListing]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [ndaOpen,      setNdaOpen]      = useState(false);
  const [docsUnlocked, setDocsUnlocked] = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [contactOpen,  setContactOpen]  = useState(false);
  const [activeTab,    setActiveTab]    = useState("highlights");
  const [similar,      setSimilar]      = useState([]);

  const [calcDown, setCalcDown] = useState(0);
  const [calcRate, setCalcRate] = useState(0.065);
  const [calcTerm, setCalcTerm] = useState(5);

  useEffect(() => {
    getCommListingById(id).then((l) => {
      setListing(l);
      if (l) {
        setCalcDown(l.downPayment ?? 0);
        setCalcRate(l.interest ?? 0.065);
        setCalcTerm(l.term ?? 5);
        setSaved(isListingSaved(`comm_${id}`));
      }
      setLoading(false);
    });
    getAllCommListings().then((all) => {
      setSimilar(all.filter((l) => l.id !== id).slice(0, 3));
    });
  }, [id]);

  const handleSave = () => {
    const nowSaved = toggleSavedListing(`comm_${id}`);
    setSaved(nowSaved);
    toast[nowSaved ? "success" : "info"](nowSaved ? "Listing saved." : "Listing removed.");
  };

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return <DetailSkeleton />;
  if (!listing) return (
    <div className="p-12 text-center text-gray-500">
      Listing not found. <Link to="/business/listings" className="text-emerald-600 underline">Back to listings</Link>
    </div>
  );

  const [minRate, maxRate] = listing.interestRange || [listing.interest, listing.interest];
  const hasFinancing = listing.downPayment && minRate > 0;
  const payment  = hasFinancing ? monthlyPayment({ price: listing.price, down: calcDown, rateAnnual: calcRate, termYears: calcTerm }) : 0;
  const ltvRatio = hasFinancing ? ltv({ price: listing.price, down: calcDown }) : 0;
  const amort    = hasFinancing ? amortizationPreview({ price: listing.price, down: calcDown, rateAnnual: calcRate, termYears: calcTerm }, 6) : [];
  const pricePerAcre = listing.acreage > 0 ? Math.round(listing.price / listing.acreage) : null;
  const catColor = categoryColors[listing.propertyCategory] || "bg-gray-100 text-gray-600";

  // Commercial commission savings (2-3%)
  const commLow  = listing.price * 0.02;
  const commHigh = listing.price * 0.03;
  const hstLow   = commLow * 0.13;
  const hstHigh  = commHigh * 0.13;
  const totalSavedLow  = commLow + hstLow;
  const totalSavedHigh = commHigh + hstHigh;

  return (
    <>
      <TabNav activeTab={activeTab} onTabClick={scrollToSection} />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">

          <Link to="/business/listings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Properties
          </Link>

          {/* Hero */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="relative h-72 md:h-[420px] bg-emerald-50">
              {listing.image
                ? <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">🏢</div>
              }
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full shadow ${catColor}`}>
                  {listing.propertyCategory}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                {listing.badges?.map((b) => (
                  <span key={b} className="bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">{b}</span>
                ))}
              </div>
              {listing.daysOnMarket != null && (
                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                  {listing.daysOnMarket === 0 ? "Just listed" : `${listing.daysOnMarket} days on market`}
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{listing.title}</h1>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {listing.address}, {listing.city}, {listing.state}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-extrabold text-emerald-700">{money(listing.price)}</p>
                  <p className="text-sm text-gray-400">{listing.dealType}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-5 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                {listing.acreage && <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4 text-gray-400" />{listing.acreage} acres</span>}
                {listing.buildingSqft && <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-gray-400" />{listing.buildingSqft.toLocaleString()} sqft</span>}
                {listing.frontage && <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4 text-gray-400" />{listing.frontage}</span>}
                {listing.zoning && <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-gray-400" />{listing.zoning}</span>}
                {listing.loadingDocks && <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-gray-400" />{listing.loadingDocks} loading docks</span>}
              </div>
            </div>
          </div>

          {/* 2-column layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-6">

              {/* HIGHLIGHTS */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader title="Highlights" id="highlights" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Days on Market", value: listing.daysOnMarket != null ? `${listing.daysOnMarket} days` : "—" },
                    { label: "Price / Acre", value: pricePerAcre ? `$${pricePerAcre.toLocaleString()}` : "—" },
                    { label: "Property Tax", value: listing.propertyTax ? `${money(listing.propertyTax)}/yr` : "—" },
                    { label: "Environmental", value: listing.environmentalStatus || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400 mb-1">{label}</p>
                      <p className="text-sm font-bold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader title="Description" id="description" />
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>

              {/* PROPERTY DETAILS */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader title="Property Details" id="details" />
                <div className="grid sm:grid-cols-2 gap-x-8">
                  <DetailRow label="Category" value={listing.propertyCategory} icon={Building} />
                  <DetailRow label="Zoning" value={listing.zoning} icon={Shield} />
                  <DetailRow label="Acreage" value={listing.acreage ? `${listing.acreage} acres` : null} icon={Ruler} />
                  <DetailRow label="Frontage" value={listing.frontage} icon={Ruler} />
                  <DetailRow label="Road Access" value={listing.roadAccess} icon={Truck} />
                  <DetailRow label="Property Tax" value={listing.propertyTax ? `${money(listing.propertyTax)}/yr` : null} icon={DollarSign} />
                  <DetailRow label="Environmental" value={listing.environmentalStatus} icon={Leaf} />
                  <DetailRow label="Existing Structures" value={listing.existingStructures} icon={Building} />
                </div>
                {listing.permittedUses?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Permitted Uses</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.permittedUses.map((u) => (
                        <span key={u} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">{u}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* LAND & SITE */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader title="Land & Site" id="land" />
                <div className="grid sm:grid-cols-2 gap-x-8">
                  <DetailRow label="Soil Class" value={listing.soilClass} icon={Leaf} />
                  <DetailRow label="Topography" value={listing.topography} icon={Trees} />
                  <DetailRow label="Drainage" value={listing.drainage} icon={Droplets} />
                </div>
                {listing.utilities?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Utilities</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.utilities.map((u) => (
                        <span key={u} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-xs font-medium border border-gray-100 flex items-center gap-1.5">
                          {u.includes("Hydro") ? <Zap className="w-3 h-3" /> : u.includes("Internet") ? <Wifi className="w-3 h-3" /> : <Droplets className="w-3 h-3" />}
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {listing.nearbyAmenities?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-gray-700 mb-3">What's Nearby</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.nearbyAmenities.map((a) => (
                        <span key={a} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100 flex items-center gap-1.5">
                          <Trees className="w-3 h-3" />{a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* BUILDING (if applicable) */}
              {(listing.buildingSqft || listing.ceilingHeight || listing.heating || listing.loadingDocks) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <SectionHeader title="Building" id="building" />
                  <div className="grid sm:grid-cols-2 gap-x-8">
                    <DetailRow label="Building Size" value={listing.buildingSqft ? `${listing.buildingSqft.toLocaleString()} sqft` : null} icon={Building} />
                    <DetailRow label="Ceiling Height" value={listing.ceilingHeight} icon={Building} />
                    <DetailRow label="Loading Docks" value={listing.loadingDocks} icon={Truck} />
                    <DetailRow label="Parking Spaces" value={listing.parkingSpaces} icon={Truck} />
                    <DetailRow label="Heating" value={listing.heating} icon={Flame} />
                    <DetailRow label="Cooling" value={listing.cooling} icon={Snowflake} />
                  </div>
                </div>
              )}

              {/* VENDOR SAVINGS */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-6">
                <SectionHeader title="Vendor Savings on This Property" id="savings" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {[
                    { label: "Commission Saved (2%)", value: money(commLow), color: "text-red-500" },
                    { label: "Commission Saved (3%)", value: money(commHigh), color: "text-red-500" },
                    { label: "Total with HST", value: `${money(totalSavedLow)}–${money(totalSavedHigh)}`, color: "text-green-700" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <p className="text-xs text-gray-400 mb-1">{label}</p>
                      <p className={`text-lg font-extrabold ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
                {hasFinancing && (
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600">
                      <strong className="text-emerald-700">Plus interest income:</strong>{" "}
                      At {(calcRate*100).toFixed(1)}% on a {money(listing.price - calcDown)} VTB over {calcTerm} years,
                      the vendor collects approximately <strong className="text-emerald-700">{money(payment*calcTerm*12-(listing.price-calcDown))}</strong> in interest.
                      CRA may allow spreading capital gains over the payment term (max 5 years).
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-3">Estimates based on typical 2–3% commercial commission + 13% HST. Always consult a real estate lawyer and accountant.</p>
              </div>

              {/* FINANCING CALCULATOR */}
              {hasFinancing && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <SectionHeader title="Financing Calculator" id="financing" />
                  <div className="grid sm:grid-cols-2 gap-x-8 mb-5">
                    <DetailRow label="Min Down Payment" value={money(listing.downPayment)} icon={DollarSign} />
                    <DetailRow label="Interest Range" value={`${pct(minRate)} – ${pct(maxRate)}`} />
                    <DetailRow label="Term" value={`${listing.term} years`} icon={Clock} />
                    <DetailRow label="Deal Type" value={listing.dealType} />
                  </div>
                  <p className="text-sm text-gray-500 mb-5">Adjust sliders to explore different scenarios.</p>
                  <div className="grid sm:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="text-sm font-medium block mb-1">Down — {money(calcDown)}</label>
                      <input type="range" min={listing.downPayment} max={Math.round(listing.price*0.5)} step={10000}
                        value={calcDown} onChange={(e) => setCalcDown(Number(e.target.value))} className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Rate — {(calcRate*100).toFixed(2)}%</label>
                      <input type="range" min={minRate||0.05} max={maxRate||0.09} step={0.0025}
                        value={calcRate} onChange={(e) => setCalcRate(Number(e.target.value))} className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Term — {calcTerm} yrs</label>
                      <input type="range" min={1} max={15} step={1}
                        value={calcTerm} onChange={(e) => setCalcTerm(Number(e.target.value))} className="w-full accent-emerald-600" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-emerald-400 mb-1">Monthly Payment</p>
                      <p className="text-2xl font-extrabold text-emerald-700">{money(payment)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">Loan Amount</p>
                      <p className="text-xl font-bold text-gray-800">{money(listing.price - calcDown)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">LTV</p>
                      <p className="text-xl font-bold text-gray-800">{(ltvRatio*100).toFixed(1)}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">Total Interest</p>
                      <p className="text-xl font-bold text-gray-800">{money(payment*calcTerm*12-(listing.price-calcDown))}</p>
                    </div>
                  </div>
                  {amort.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b text-gray-400 text-xs uppercase">
                          <th className="pb-2 text-left">Month</th><th className="pb-2 text-left">Payment</th>
                          <th className="pb-2 text-left">Principal</th><th className="pb-2 text-left">Interest</th>
                          <th className="pb-2 text-left">Balance</th>
                        </tr></thead>
                        <tbody>
                          {amort.map((row) => (
                            <tr key={row.month} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-2 text-gray-500">{row.month}</td>
                              <td className="py-2 font-medium">{money(row.payment)}</td>
                              <td className="py-2 text-green-600">{money(row.principal)}</td>
                              <td className="py-2 text-orange-500">{money(row.interest)}</td>
                              <td className="py-2 text-gray-700">{money(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* SIMILAR */}
              {similar.length > 0 && (
                <div id="similar" className="scroll-mt-32">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-6 bg-emerald-600 rounded-full" />
                    <h2 className="font-bold text-gray-900 text-lg uppercase tracking-wide">Similar Properties</h2>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {similar.map((l) => <CommListingCard key={l.id} listing={l} />)}
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="lg:w-80 shrink-0 space-y-5">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-36">
                <p className="font-bold text-gray-900 text-lg mb-1">Interested in this property?</p>
                <p className="text-sm text-gray-500 mb-5">Contact the vendor directly — no agents, no commissions.</p>
                <button onClick={() => setContactOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold transition-colors mb-3">
                  <Phone className="w-4 h-4" /> Contact Vendor
                </button>
                <button onClick={handleSave}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors mb-3 ${
                    saved ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {saved ? "Saved" : "Save Property"}
                </button>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">
                    {docsUnlocked ? "📄 Documents unlocked — surveys, environmental reports, and financials available." : "📄 Full documents available after NDA."}
                  </p>
                  {!docsUnlocked ? (
                    <button onClick={() => setNdaOpen(true)}
                      className="w-full py-2.5 bg-gray-100 text-gray-700 text-sm rounded-xl hover:bg-gray-200 font-medium transition-colors">
                      Sign NDA & Unlock Docs
                    </button>
                  ) : (
                    <span className="text-green-600 font-medium text-sm">✓ NDA signed — docs available</span>
                  )}
                </div>
              </div>

              {hasFinancing && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <p className="font-semibold text-gray-900 mb-3">Vendor's Terms</p>
                  <div className="space-y-2">
                    <DetailRow label="Down Payment" value={money(listing.downPayment)} />
                    <DetailRow label="Rate Range" value={`${pct(minRate)} – ${pct(maxRate)}`} />
                    <DetailRow label="Term" value={`${listing.term} years`} />
                    <DetailRow label="Monthly (est.)" value={money(payment)} />
                  </div>
                </div>
              )}

              <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 text-center">
                <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide mb-1">Commission Saved</p>
                <p className="text-3xl font-extrabold text-emerald-700">{money(totalSavedLow)}–{money(totalSavedHigh)}</p>
                <p className="text-xs text-emerald-500 mt-1">vs. traditional 2–3% + HST agent sale</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  LandMatch facilitates introductions only — we are not a mortgage broker, real estate agent, or legal advisor.
                  Always consult a licensed Ontario real estate lawyer before entering any agreement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NDA open={ndaOpen} onClose={() => setNdaOpen(false)} alias={listing.title}
        onApprove={() => { setDocsUnlocked(true); toast.success("NDA signed. Documents unlocked."); }} />
      <ContactModal
        open={contactOpen} onClose={() => setContactOpen(false)}
        recipientName={`Vendor — ${listing.title}`} recipientType="seller"
        refType="listing" refId={listing.id} refTitle={listing.title}
      />
    </>
  );
}

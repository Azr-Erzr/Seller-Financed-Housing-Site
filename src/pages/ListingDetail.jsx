// src/pages/ListingDetail.jsx
// Comprehensive property detail page — Wahi-level information density.
// NEW DESIGN PRECEDENTS:
//   - max-w-6xl wider layout
//   - Sticky tab navigation that scrolls to sections
//   - Section headers with colored left-border accent bar
//   - 2-column layout: main content (left) + sidebar (right)
//   - Property summary grid, building details, interior/exterior sections
//   - Days on market, price/sqft in highlights strip

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getListingById, getAllListings, toggleSavedListing, isListingSaved } from "../lib/storage";
import { monthlyPayment, amortizationPreview, ltv } from "../lib/finance";
import { useToast } from "../components/Toast";
import NDA from "../components/NDA";
import ContactModal from "../components/ContactModal";
import ListingCard from "../components/ListingCard";
import { DetailSkeleton } from "../components/LoadingSkeleton";
import ChatAgent from "../components/ChatAgent";
import {
  MapPin, Bed, Bath, Square, Car, Calendar, Ruler, Home, Bookmark,
  BookmarkCheck, Phone, ArrowLeft, Flame, Snowflake, Droplets, Trees,
  Building, Shield, Clock, DollarSign, ChevronDown, Check, FileText
} from "lucide-react";

const money = (n) => n ? `$${Number(n).toLocaleString("en-CA")}` : "—";
const pct   = (n) => n ? `${(Number(n) * 100).toFixed(1)}%` : "—";

// ── Section Header (Wahi-style with accent bar) ──────────────────────
function SectionHeader({ title, id }) {
  return (
    <div id={id} className="scroll-mt-32">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 bg-blue-600 rounded-full" />
        <h2 className="font-bold text-gray-900 text-lg uppercase tracking-wide">{title}</h2>
      </div>
    </div>
  );
}

// ── Detail Row ───────────────────────────────────────────────────────
function DetailRow({ label, value, icon: Icon }) {
  if (!value || value === "—") return null;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

// ── Feature Pill ─────────────────────────────────────────────────────
function FeaturePill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
      {Icon && <Icon className="w-4 h-4 text-blue-500" />}
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

// ── Tab Navigation ───────────────────────────────────────────────────
const TABS = [
  { id: "highlights",  label: "Highlights" },
  { id: "description", label: "Description" },
  { id: "details",     label: "Property Details" },
  { id: "interior",    label: "Interior" },
  { id: "exterior",    label: "Exterior" },
  { id: "financing",   label: "Financing" },
  { id: "savings",     label: "Potential Savings" },
  { id: "similar",     label: "Similar" },
];

function TabNav({ activeTab, onTabClick }) {
  const scrollRef = useRef(null);
  return (
    <div className="bg-white border-b border-gray-200 sticky top-[73px] z-30">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={scrollRef} className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => onTabClick(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
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

export default function ListingDetail() {
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
  const [calcRate, setCalcRate] = useState(0.07);
  const [calcTerm, setCalcTerm] = useState(25);

  useEffect(() => {
    getListingById(id).then((l) => {
      setListing(l);
      if (l) {
        setCalcDown(l.downPayment ?? 0);
        setCalcRate(l.interest ?? 0.07);
        setCalcTerm(l.term ?? 25);
        setSaved(isListingSaved(id));
      }
      setLoading(false);
    });
    // Load similar listings
    getAllListings().then((all) => {
      setSimilar(all.filter((l) => l.id !== id).slice(0, 3));
    });
  }, [id]);

  const handleSave = () => {
    const nowSaved = toggleSavedListing(id);
    setSaved(nowSaved);
    toast[nowSaved ? "success" : "info"](nowSaved ? "Listing saved." : "Listing removed from saved.");
  };

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return <DetailSkeleton />;
  if (!listing) return (
    <div className="p-12 text-center text-gray-500">
      Listing not found. <Link to="/listings" className="text-blue-600 underline">Back to listings</Link>
    </div>
  );

  const [minRate, maxRate] = listing.interestRange || [listing.interest, listing.interest];
  const hasFinancing = listing.downPayment && minRate > 0;
  const payment  = hasFinancing ? monthlyPayment({ price: listing.price, down: calcDown, rateAnnual: calcRate, termYears: calcTerm }) : 0;
  const ltvRatio = hasFinancing ? ltv({ price: listing.price, down: calcDown }) : 0;
  const amort    = hasFinancing ? amortizationPreview({ price: listing.price, down: calcDown, rateAnnual: calcRate, termYears: calcTerm }, 6) : [];
  const pricePerSqft = listing.sqft ? Math.round(listing.price / listing.sqft) : null;

  // Listing-side commission savings only — buyer-side is buyer's negotiation
  const listingComm = listing.price * 0.025;
  const hst         = listingComm * 0.13;
  const totalSaved  = listingComm + hst;

  return (
    <>
      {/* Tab nav */}
      <TabNav activeTab={activeTab} onTabClick={scrollToSection} />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">

          <Link to="/listings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </Link>

          {/* Hero Image */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="relative h-72 md:h-[420px] bg-gray-100">
              {listing.image
                ? <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-300"><Home className="w-16 h-16" /></div>
              }
              <div className="absolute top-4 right-4 flex gap-2">
                {listing.badges?.map((b) => (
                  <span key={b} className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">{b}</span>
                ))}
              </div>
              {listing.daysOnMarket != null && (
                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                  {listing.daysOnMarket === 0 ? "Just listed" : `${listing.daysOnMarket} days on market`}
                </div>
              )}
            </div>

            {/* Address bar + quick stats */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{listing.propertyType}</p>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{listing.title}</h1>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {listing.address}, {listing.city}, {listing.state}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-extrabold text-blue-700">{money(listing.price)}</p>
                  <p className="text-sm text-gray-400">{listing.dealType}</p>
                </div>
              </div>

              {/* Quick stats strip */}
              <div className="flex flex-wrap items-center gap-5 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-gray-400" />{listing.bedrooms} bed</span>
                <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-gray-400" />{listing.bathrooms} bath</span>
                <span className="flex items-center gap-1.5"><Square className="w-4 h-4 text-gray-400" />{listing.sqft?.toLocaleString()} sqft</span>
                {listing.parkingSpaces > 0 && <span className="flex items-center gap-1.5"><Car className="w-4 h-4 text-gray-400" />{listing.parkingSpaces} parking</span>}
                {listing.lot && listing.lot !== "—" && <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4 text-gray-400" />{listing.lot} lot</span>}
                {listing.yearBuilt && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" />Built {listing.yearBuilt}</span>}
              </div>
            </div>
          </div>

          {/* 2-column layout */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Main content */}
            <div className="flex-1 space-y-6">

              {/* ── HIGHLIGHTS ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader title="Highlights" id="highlights" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Days on Market", value: listing.daysOnMarket != null ? `${listing.daysOnMarket} days` : "—" },
                    { label: "Price / Sqft", value: pricePerSqft ? `$${pricePerSqft}` : "—" },
                    { label: "Property Tax", value: listing.propertyTax ? `${money(listing.propertyTax)}/yr` : "—" },
                    { label: "Condo Fees", value: listing.condoFees ? `${money(listing.condoFees)}/mo` : "N/A" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400 mb-1">{label}</p>
                      <p className="text-sm font-bold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── DESCRIPTION ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader title="Description" id="description" />
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>

              {/* ── PROPERTY DETAILS ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader title="Property Details" id="details" />
                <div className="grid sm:grid-cols-2 gap-x-8">
                  <DetailRow label="Property Type" value={listing.propertyType} icon={Home} />
                  <DetailRow label="Year Built" value={listing.yearBuilt} icon={Calendar} />
                  <DetailRow label="Square Footage" value={listing.sqft ? `${listing.sqft.toLocaleString()} sqft` : null} icon={Square} />
                  <DetailRow label="Stories" value={listing.stories} icon={Building} />
                  <DetailRow label="Lot Size" value={listing.lot !== "—" ? listing.lot : null} icon={Ruler} />
                  {listing.lotWidth && <DetailRow label="Lot Width × Depth" value={`${listing.lotWidth}' × ${listing.lotDepth}'`} icon={Ruler} />}
                  <DetailRow label="Parking" value={listing.parking} icon={Car} />
                  <DetailRow label="Parking Spaces" value={listing.parkingSpaces} icon={Car} />
                  <DetailRow label="Property Tax" value={listing.propertyTax ? `${money(listing.propertyTax)} / year` : null} icon={DollarSign} />
                  {listing.condoFees && <DetailRow label="Condo / Maintenance Fees" value={`${money(listing.condoFees)} / month`} icon={DollarSign} />}
                </div>
              </div>

              {/* ── INTERIOR ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader title="Interior" id="interior" />
                <div className="grid sm:grid-cols-2 gap-x-8 mb-5">
                  <DetailRow label="Heating" value={listing.heating} icon={Flame} />
                  <DetailRow label="Cooling" value={listing.cooling} icon={Snowflake} />
                  <DetailRow label="Basement" value={listing.basement} icon={Building} />
                  <DetailRow label="Foundation" value={listing.foundation} icon={Shield} />
                </div>
                {listing.amenities?.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Features & Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.amenities.map((a) => (
                        <span key={a} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">{a}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* ── EXTERIOR ── */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <SectionHeader title="Exterior" id="exterior" />
                <div className="grid sm:grid-cols-2 gap-x-8 mb-5">
                  <DetailRow label="Exterior Material" value={listing.exterior} icon={Home} />
                  <DetailRow label="Roofing" value={listing.roofing} icon={Home} />
                  <DetailRow label="Water Source" value={listing.waterSource} icon={Droplets} />
                  <DetailRow label="Sewer" value={listing.sewer} icon={Droplets} />
                </div>
                {listing.nearbyAmenities?.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-gray-700 mb-3">What's Nearby</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.nearbyAmenities.map((a) => (
                        <span key={a} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100 flex items-center gap-1.5">
                          <Trees className="w-3 h-3" />{a}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* ── POTENTIAL SAVINGS ── */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
                <SectionHeader title="Potential Seller-Side Savings" id="savings" />
                <p className="text-xs text-gray-400 mb-4">Assumptions: 2.5% listing-side commission + 13% HST on a {money(listing.price)} sale.</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { label: "Listing-side commission", value: money(listingComm), color: "text-green-700" },
                    { label: "HST on commission", value: money(hst), color: "text-green-700" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <p className="text-xs text-gray-400 mb-1">{label}</p>
                      <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm mb-4">
                  <p className="text-xs text-gray-400 mb-1">Estimated listing-side savings</p>
                  <p className="text-2xl font-extrabold text-green-700">{money(totalSaved)}</p>
                </div>
                {hasFinancing && (
                  <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
                    <p className="text-sm text-gray-600">
                      <strong className="text-green-700">Plus potential interest income:</strong>{" "}
                      At {(calcRate*100).toFixed(1)}% on a {money(listing.price - calcDown)} VTB over {calcTerm} years,
                      the seller may earn approximately <strong className="text-green-700">{money(payment*calcTerm*12-(listing.price-calcDown))}</strong> in interest.
                    </p>
                  </div>
                )}
                <div className="border-t border-green-100 pt-3">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Not included in estimate</p>
                  <p className="text-xs text-gray-400 leading-relaxed">Buyer-side commission (buyer's decision) · Legal fees · Taxes · Closing costs</p>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Illustrative only. Actual savings depend on negotiated terms. Consult a real estate lawyer and accountant.
                </p>
              </div>

              {/* ── FINANCING CALCULATOR ── */}
              {hasFinancing && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <SectionHeader title="Financing Calculator" id="financing" />

                  <div className="grid sm:grid-cols-2 gap-x-8 mb-5">
                    <DetailRow label="Min Down Payment" value={money(listing.downPayment)} icon={DollarSign} />
                    <DetailRow label="Interest Range" value={`${pct(minRate)} – ${pct(maxRate)}`} />
                    <DetailRow label="Amortization" value={`${listing.term} years`} icon={Clock} />
                    <DetailRow label="Deal Type" value={listing.dealType} />
                  </div>

                  <p className="text-sm text-gray-500 mb-5">Adjust sliders to explore different scenarios.</p>
                  <div className="grid sm:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="text-sm font-medium block mb-1">Down — {money(calcDown)}</label>
                      <input type="range" min={listing.downPayment} max={Math.round(listing.price * 0.5)} step={5000}
                        value={calcDown} onChange={(e) => setCalcDown(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Rate — {(calcRate*100).toFixed(2)}%</label>
                      <input type="range" min={minRate} max={maxRate} step={0.0025}
                        value={calcRate} onChange={(e) => setCalcRate(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Term — {calcTerm} yrs</label>
                      <input type="range" min={5} max={30} step={1}
                        value={calcTerm} onChange={(e) => setCalcTerm(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-blue-400 mb-1">Monthly Payment</p>
                      <p className="text-2xl font-extrabold text-blue-700">{money(payment)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">Loan Amount</p>
                      <p className="text-xl font-bold text-gray-800">{money(listing.price - calcDown)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">Loan-to-Value</p>
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
                        <thead>
                          <tr className="border-b text-gray-400 text-xs uppercase">
                            <th className="pb-2 text-left">Month</th>
                            <th className="pb-2 text-left">Payment</th>
                            <th className="pb-2 text-left">Principal</th>
                            <th className="pb-2 text-left">Interest</th>
                            <th className="pb-2 text-left">Balance</th>
                          </tr>
                        </thead>
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

              {/* ── SIMILAR LISTINGS ── */}
              {similar.length > 0 && (
                <div id="similar" className="scroll-mt-32">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-6 bg-blue-600 rounded-full" />
                    <h2 className="font-bold text-gray-900 text-lg uppercase tracking-wide">Similar Listings</h2>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {similar.map((l) => <ListingCard key={l.id} listing={l} />)}
                  </div>
                </div>
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <div className="lg:w-80 shrink-0 space-y-5">

              {/* CTA Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-36">
                <p className="font-bold text-gray-900 text-lg mb-1">Interested in this property?</p>
                <p className="text-sm text-gray-500 mb-5">Contact the seller directly. Agent-optional, bank-optional.</p>

                <button onClick={() => setContactOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors mb-3">
                  <Phone className="w-4 h-4" /> Contact Seller
                </button>

                <button onClick={handleSave}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors mb-3 ${
                    saved ? "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {saved ? "Saved" : "Save Listing"}
                </button>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {docsUnlocked
                      ? "Documents are unlocked."
                      : "Full documents available after NDA."}
                  </p>
                  {!docsUnlocked ? (
                    <button onClick={() => setNdaOpen(true)}
                      className="w-full py-2.5 bg-gray-100 text-gray-700 text-sm rounded-xl hover:bg-gray-200 font-medium transition-colors">
                      Sign NDA & Unlock Docs
                    </button>
                  ) : (
                    <span className="text-green-600 font-medium text-sm flex items-center gap-1"><Check className="w-4 h-4" /> NDA signed — docs available</span>
                  )}
                </div>
              </div>

              {/* Seller's Terms Quick View */}
              {hasFinancing && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <p className="font-semibold text-gray-900 mb-3">Seller's Terms</p>
                  <div className="space-y-2">
                    <DetailRow label="Down Payment" value={money(listing.downPayment)} />
                    <DetailRow label="Rate Range" value={`${pct(minRate)} – ${pct(maxRate)}`} />
                    <DetailRow label="Amortization" value={`${listing.term} years`} />
                    <DetailRow label="Monthly (est.)" value={money(payment)} />
                  </div>
                </div>
              )}

              {/* Quick savings */}
              <div className="bg-green-50 rounded-2xl border border-green-100 p-6 text-center">
                <p className="text-xs text-green-500 font-medium uppercase tracking-wide mb-1">Potential Listing-Side Savings</p>
                <p className="text-3xl font-extrabold text-green-700">{money(totalSaved)}</p>
                <p className="text-xs text-green-500 mt-1">listing-side only · 2.5% + HST · illustrative</p>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Sel-Fi facilitates introductions only — we are not a mortgage broker, real estate agent, or legal advisor.
                  Always consult a licensed Ontario real estate lawyer before entering any agreement.
                </p>
              </div>

              {/* AI Chat — listing-specific Q&A */}
              <div className="rounded-2xl overflow-hidden" style={{ height: "480px" }}>
                <ChatAgent currentListing={listing} floating={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <NDA open={ndaOpen} onClose={() => setNdaOpen(false)} alias={listing.title}
        onApprove={() => { setDocsUnlocked(true); toast.success("NDA signed. Documents unlocked."); }} />

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        recipientName={`Seller — ${listing.title}`}
        recipientType="seller"
        refType="listing"
        refId={listing.id}
        refTitle={listing.title}
      />
    </>
  );
}

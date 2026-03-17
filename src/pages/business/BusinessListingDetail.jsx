// src/pages/business/BusinessListingDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCommListingById, getAllCommProfiles, toggleSavedListing, isListingSaved } from "../../lib/commercial-storage";
import { monthlyPayment, amortizationPreview, ltv } from "../../lib/finance";
import { useToast } from "../../components/Toast";
import NDA from "../../components/NDA";
import { MapPin, Ruler, Phone, Bookmark, BookmarkCheck, ArrowLeft, ShieldCheck } from "lucide-react";

const money = (n) => n ? `$${Number(n).toLocaleString("en-CA")}` : "—";

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="font-semibold text-gray-900">{value ?? "—"}</span>
    </div>
  );
}

const categoryColors = {
  "Vacant Land":            "bg-lime-100 text-lime-700",
  "Agricultural / Farm":    "bg-green-100 text-green-700",
  "Development Land":       "bg-emerald-100 text-emerald-700",
  "Commercial Building":    "bg-blue-100 text-blue-700",
  "Industrial / Warehouse": "bg-slate-100 text-slate-700",
  "Multi-Unit / Apartment": "bg-purple-100 text-purple-700",
  "Waterfront / Recreational": "bg-cyan-100 text-cyan-700",
  "Special Purpose":        "bg-orange-100 text-orange-700",
};

export default function BusinessListingDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [listing, setListing]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [ndaOpen, setNdaOpen]           = useState(false);
  const [docsUnlocked, setDocsUnlocked] = useState(false);
  const [saved, setSaved]               = useState(false);

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
  }, [id]);

  const handleSave = () => {
    const nowSaved = toggleSavedListing(`comm_${id}`);
    setSaved(nowSaved);
    toast[nowSaved ? "success" : "info"](
      nowSaved ? "Listing saved to bookmarks." : "Listing removed from bookmarks."
    );
  };

  const handleContact = () => {
    toast.info("Messaging feature coming soon. Create a profile to be notified.");
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>;
  if (!listing) return (
    <div className="p-12 text-center text-gray-500">
      Listing not found.{" "}
      <Link to="/business/listings" className="text-emerald-600 underline">Back to listings</Link>
    </div>
  );

  const [minRate, maxRate] = listing.interestRange || [listing.interest, listing.interest];
  const hasFinancing = listing.downPayment && listing.downPayment > 0 && minRate > 0;

  const payment  = hasFinancing ? monthlyPayment({ price: listing.price, down: calcDown, rateAnnual: calcRate, termYears: calcTerm }) : 0;
  const ltvRatio = hasFinancing ? ltv({ price: listing.price, down: calcDown }) : 0;
  const amort    = hasFinancing ? amortizationPreview({ price: listing.price, down: calcDown, rateAnnual: calcRate, termYears: calcTerm }, 6) : [];

  const catColor = categoryColors[listing.propertyCategory] || "bg-gray-100 text-gray-600";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        <Link to="/business/listings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>

        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="relative h-72 md:h-96 bg-emerald-50">
            {listing.image
              ? <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-emerald-200 text-6xl">🌿</div>
            }
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {listing.address}, {listing.city}, {listing.state}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-emerald-700">{money(listing.price)}</p>
                <p className="text-sm text-gray-400">{listing.dealType}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {listing.propertyCategory && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${catColor}`}>{listing.propertyCategory}</span>
              )}
              {listing.badges?.map((b) => (
                <span key={b} className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">{b}</span>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed mt-4">{listing.description}</p>
          </div>
        </div>

        {/* Details + Terms grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Property Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {listing.acreage && <Stat label="Total Acreage" value={`${listing.acreage} acres`} />}
              {listing.frontage && <Stat label="Frontage" value={listing.frontage} />}
              <Stat label="Zoning" value={listing.zoning} />
              <Stat label="Road Access" value={listing.roadAccess} />
              <Stat label="Environmental" value={listing.environmentalStatus} />
              {listing.existingStructures && <Stat label="Structures" value={listing.existingStructures} />}
            </div>
          </div>

          {/* Seller Terms */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">Seller's Terms</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {hasFinancing && (
                <>
                  <Stat label="Min. Down Payment" value={money(listing.downPayment)} />
                  <Stat label="Interest Range" value={`${(minRate*100).toFixed(1)}%–${(maxRate*100).toFixed(1)}%`} />
                  <Stat label="Term" value={`${listing.term} years`} />
                </>
              )}
              <Stat label="Deal Type" value={listing.dealType} />
            </div>

            {/* Utilities */}
            {listing.utilities?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Utilities on Property</p>
                <div className="flex flex-wrap gap-1.5">
                  {listing.utilities.map((u) => (
                    <span key={u} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{u}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Permitted Uses */}
            {listing.permittedUses?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Permitted Uses</p>
                <div className="flex flex-wrap gap-1.5">
                  {listing.permittedUses.map((u) => (
                    <span key={u} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{u}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Doc lock */}
            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">
                {docsUnlocked
                  ? "📄 Documents unlocked — surveys, environmental reports, and financials available."
                  : "📄 Full documents (survey, environmental, financials) available after signing a short NDA."}
              </p>
              {!docsUnlocked ? (
                <button onClick={() => setNdaOpen(true)}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition">
                  Sign NDA &amp; Unlock Docs
                </button>
              ) : (
                <span className="text-green-600 font-medium text-sm">✓ NDA signed</span>
              )}
            </div>
          </div>
        </div>

        {/* Finance Calculator — only shown if financing terms exist */}
        {hasFinancing && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-lg mb-1 text-gray-900">Payment Calculator</h2>
            <p className="text-sm text-gray-500 mb-5">Adjust sliders to explore different financing scenarios.</p>

            <div className="grid sm:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium block mb-1">Down Payment — {money(calcDown)}</label>
                <input type="range" min={listing.downPayment} max={Math.round(listing.price * 0.5)} step={5000}
                  value={calcDown} onChange={(e) => setCalcDown(Number(e.target.value))} className="w-full accent-emerald-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{money(listing.downPayment)} min</span><span>{money(listing.price * 0.5)}</span></div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Interest Rate — {(calcRate*100).toFixed(2)}%</label>
                <input type="range" min={minRate} max={maxRate} step={0.0025}
                  value={calcRate} onChange={(e) => setCalcRate(Number(e.target.value))} className="w-full accent-emerald-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{(minRate*100).toFixed(1)}%</span><span>{(maxRate*100).toFixed(1)}%</span></div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Term — {calcTerm} years</label>
                <input type="range" min={1} max={30} step={1}
                  value={calcTerm} onChange={(e) => setCalcTerm(Number(e.target.value))} className="w-full accent-emerald-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 yr</span><span>30 yr</span></div>
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
                <table className="w-full text-sm text-left">
                  <thead><tr className="border-b text-gray-400 text-xs uppercase">
                    <th className="pb-2">Month</th><th className="pb-2">Payment</th><th className="pb-2">Principal</th><th className="pb-2">Interest</th><th className="pb-2">Balance</th>
                  </tr></thead>
                  <tbody>
                    {amort.map((row) => (
                      <tr key={row.month} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 text-gray-500">{row.month}</td>
                        <td className="py-2 font-medium">{money(row.payment)}</td>
                        <td className="py-2 text-green-600">{money(row.principal)}</td>
                        <td className="py-2 text-amber-600">{money(row.interest)}</td>
                        <td className="py-2 text-gray-700">{money(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">* Principal + interest only. Commercial terms are fully negotiable.</p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <button onClick={handleContact}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition">
            <Phone className="w-4 h-4" /> Contact Seller
          </button>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
              saved
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {saved ? "Saved" : "Save Listing"}
          </button>
          <Link to="/business/listings" className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition">
            ← Back
          </Link>
        </div>

        <NDA
          open={ndaOpen}
          onClose={() => setNdaOpen(false)}
          alias={listing.title}
          onApprove={() => {
            setDocsUnlocked(true);
            toast.success("NDA signed. Documents are now unlocked.");
          }}
        />
      </div>
    </div>
  );
}

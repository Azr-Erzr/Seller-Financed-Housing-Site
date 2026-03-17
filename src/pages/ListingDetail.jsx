// src/pages/ListingDetail.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getListingById, getAllProfiles } from "../lib/storage";
import { rankProfilesForListing } from "../lib/match";
import { monthlyPayment, amortizationPreview, ltv } from "../lib/finance";
import { money, Badge, Stat, LockValue, Img } from "../ui/UIComponents";
import NDA from "../components/NDA";
import { Bed, Bath, Square, MapPin } from "lucide-react";

const StarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const getMatchColor = (score) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-green-400";
  if (score >= 40) return "bg-yellow-400";
  return "bg-orange-400";
};

export default function ListingDetail() {
  const { id } = useParams();
  const listing = getListingById(id);
  const [ndaOpen, setNdaOpen] = useState(false);
  const [docsUnlocked, setDocsUnlocked] = useState(false);
  const [calcDown, setCalcDown] = useState(listing?.downPayment ?? 0);
  const [calcRate, setCalcRate] = useState(listing?.interest ?? 0.07);
  const [calcTerm, setCalcTerm] = useState(listing?.term ?? 25);

  if (!listing) return (
    <div className="p-12 text-center text-gray-500">
      Listing not found. <Link to="/listings" className="text-blue-600 underline">Back to listings</Link>
    </div>
  );

  const payment = monthlyPayment({ price: listing.price, down: calcDown, rateAnnual: calcRate, termYears: calcTerm });
  const ltvRatio = ltv({ price: listing.price, down: calcDown });
  const amort = amortizationPreview({ price: listing.price, down: calcDown, rateAnnual: calcRate, termYears: calcTerm }, 6);
  const [minRate, maxRate] = listing.interestRange || [listing.interest, listing.interest];

  const allProfiles = getAllProfiles();
  const matchedProfiles = rankProfilesForListing(allProfiles, listing).filter(({ score }) => score > 0);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">

      {/* Back link */}
      <Link to="/listings" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
        ← Back to Listings
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative h-72 md:h-96 bg-gray-100 overflow-hidden">
          {listing.image ? (
            <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No photo yet</div>
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
              <p className="text-gray-500 mt-1 flex items-center gap-1.5 text-sm">
                <MapPin className="w-3.5 h-3.5" /> {listing.address} · {listing.city}, {listing.state}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-blue-600">{money(listing.price)}</p>
              <p className="text-sm text-gray-400">{listing.dealType}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {listing.badges?.map((b) => <Badge key={b} tone="purple">{b}</Badge>)}
            <Badge tone="info">{listing.propertyType}</Badge>
          </div>
          <div className="flex items-center gap-5 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1.5"><Bed className="w-4 h-4" /> {listing.bedrooms} bed</span>
            <span className="flex items-center gap-1.5"><Bath className="w-4 h-4" /> {listing.bathrooms} bath</span>
            <span className="flex items-center gap-1.5"><Square className="w-4 h-4" /> {listing.sqft?.toLocaleString()} sqft</span>
          </div>
          <p className="text-gray-600 leading-relaxed">{listing.description}</p>
        </div>
      </div>

      {/* Details + Terms */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-lg mb-4">Property Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Bedrooms"    value={listing.bedrooms} />
            <Stat label="Bathrooms"   value={listing.bathrooms} />
            <Stat label="Square Feet" value={listing.sqft?.toLocaleString()} />
            <Stat label="Lot Size"    value={listing.lot} />
            <Stat label="Deal Type"   value={listing.dealType} />
            <Stat label="Property"    value={listing.propertyType} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-lg mb-4">Seller's Terms</h2>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Min. Down Payment" value={money(listing.downPayment)} />
            <Stat label="Interest Range"    value={`${(minRate * 100).toFixed(1)}%–${(maxRate * 100).toFixed(1)}%`} />
            <Stat label="Amortization"      value={`${listing.term} years`} />
            <Stat label="Deal Types"        value={listing.dealTypes?.map(d => d.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())).join(", ")} />
          </div>
          <div className="mt-5 pt-4 border-t">
            <p className="text-sm text-gray-500 mb-3">
              {docsUnlocked ? "📄 Documents unlocked." : "📄 Full documents available after signing a short NDA."}
            </p>
            {!docsUnlocked ? (
              <button onClick={() => setNdaOpen(true)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                Sign NDA &amp; Unlock Docs
              </button>
            ) : (
              <span className="text-green-600 font-medium text-sm">✓ NDA signed</span>
            )}
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-lg mb-1">Payment Calculator</h2>
        <p className="text-sm text-gray-500 mb-5">Adjust sliders to explore different scenarios.</p>

        <div className="grid sm:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium block mb-1">Down Payment — {money(calcDown)}</label>
            <input type="range" min={listing.downPayment} max={Math.round(listing.price * 0.5)} step={1000} value={calcDown} onChange={(e) => setCalcDown(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{money(listing.downPayment)} min</span><span>{money(listing.price * 0.5)} max</span></div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Interest Rate — {(calcRate * 100).toFixed(2)}%</label>
            <input type="range" min={minRate} max={maxRate} step={0.0025} value={calcRate} onChange={(e) => setCalcRate(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{(minRate * 100).toFixed(1)}%</span><span>{(maxRate * 100).toFixed(1)}%</span></div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Amortization — {calcTerm} years</label>
            <input type="range" min={10} max={30} step={5} value={calcTerm} onChange={(e) => setCalcTerm(Number(e.target.value))} className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10 yr</span><span>30 yr</span></div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center"><p className="text-xs text-blue-400 mb-1">Monthly Payment</p><p className="text-2xl font-extrabold text-blue-700">{money(payment)}</p></div>
          <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">Loan Amount</p><p className="text-xl font-bold text-gray-800">{money(listing.price - calcDown)}</p></div>
          <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">Loan-to-Value</p><p className="text-xl font-bold text-gray-800">{(ltvRatio * 100).toFixed(1)}%</p></div>
          <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">Total Interest</p><p className="text-xl font-bold text-gray-800">{money(payment * calcTerm * 12 - (listing.price - calcDown))}</p></div>
        </div>

        <h3 className="font-medium text-sm mb-2 text-gray-700">First 6 Payments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead><tr className="border-b text-gray-400 text-xs uppercase"><th className="pb-2">Month</th><th className="pb-2">Payment</th><th className="pb-2">Principal</th><th className="pb-2">Interest</th><th className="pb-2">Balance</th></tr></thead>
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
        <p className="text-xs text-gray-400 mt-2">* Principal + interest only. Does not include taxes, insurance, or maintenance.</p>
      </div>

      {/* Buyer Match Suggestions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-lg mb-1">Buyer Match Suggestions</h2>
        <p className="text-sm text-gray-500 mb-4">Buyers whose budget, down payment, and deal preferences align with this listing.</p>
        <div className="space-y-3">
          {matchedProfiles.length === 0 && <p className="text-gray-400 text-sm">No strong buyer matches yet.</p>}
          {matchedProfiles.map(({ profile, score }) => (
            <div key={profile.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 text-white font-bold flex items-center justify-center text-sm">
                  {profile.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{profile.name}</p>
                  <p className="text-xs text-gray-400">{profile.city} · {profile.dealPreference}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`${getMatchColor(score)} text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-semibold`}>
                  <StarIcon />{score}% match
                </span>
                <Link to={`/profiles/${profile.id}`} className="text-xs text-blue-600 hover:underline">View →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">Contact Seller</button>
        <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition">Save Listing</button>
        <Link to="/listings" className="px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition">← Back</Link>
      </div>

      <NDA open={ndaOpen} onClose={() => setNdaOpen(false)} alias={listing.title} onApprove={() => setDocsUnlocked(true)} />
    </div>
  );
}

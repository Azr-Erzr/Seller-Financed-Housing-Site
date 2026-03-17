// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Shield, Users, TrendingUp, Heart, Building2, Tractor, Star, CheckCircle } from "lucide-react";
import { useSite } from "../context/SiteContext";

// ── Homes version ────────────────────────────────────────────────────
function AboutHomes() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-blue-100 mb-5">
            LandMatch Homes
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5" style={{ color: "#fff" }}>About LandMatch Homes</h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#bfdbfe" }}>
            We built LandMatch because the traditional mortgage system locks out too many good people
            from homeownership — and leaves too many sellers with no good way to pass on property
            they've spent a lifetime building equity in.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem We're Solving</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">Banks approve or reject buyers based on rigid formulas — credit scores, employment type, income documentation. They don't account for context. A self-employed person with real income gets rejected. A family that's been saving for years can't qualify because they can't show two years of T4s.</p>
              <p className="text-gray-600 leading-relaxed">Meanwhile, sellers — especially older homeowners who've owned their homes outright for decades — have no good platform to find the right buyer. They end up on Facebook Marketplace pushing them toward a conventional sale, even though holding the mortgage themselves would earn them far better returns.</p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">Seller financing — also called a Vendor Take-Back (VTB) mortgage — solves both problems. The seller becomes the bank. The buyer gets a path to ownership that the traditional system closed. Terms are negotiated directly, human to human.</p>
              <p className="text-gray-600 leading-relaxed">The problem is there's never been a dedicated, safe, organized place to make these connections. Until LandMatch.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-blue-600" />, bg: "bg-blue-100", title: "Trust & Safety", text: "Verified profiles, NDA-protected documents, and transparent terms before any conversation happens." },
              { icon: <Users className="w-6 h-6 text-green-600" />, bg: "bg-green-100", title: "Access", text: "Homeownership should not be gated by a bank's algorithm. We create a path for people who've been shut out." },
              { icon: <TrendingUp className="w-6 h-6 text-orange-600" />, bg: "bg-orange-100", title: "Fairness", text: "No realtors taking commissions on both sides. No outside investors inflating prices. Direct deals." },
              { icon: <Heart className="w-6 h-6 text-purple-600" />, bg: "bg-purple-100", title: "Community", text: "Housing moves wealth between generations. We want that movement to stay local and benefit real people." },
            ].map(({ icon, bg, title, text }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnerSection isBusiness={false} />
      <WhatWeAreSection isBusiness={false} />

      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#fff" }}>Ready to Get Started?</h2>
          <p className="mb-8" style={{ color: "#bfdbfe" }}>Whether you own a home and want to pass it on your terms, or you're a buyer who's been shut out by the banks — there's a place for you here.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/list-home"      className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">List Your Home</Link>
            <Link to="/create-profile" className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">Create Buyer Profile</Link>
          </div>
          <p className="mt-6 text-sm" style={{ color: "#93c5fd" }}>
            Looking for commercial & land deals?{" "}
            <Link to="/business" className="underline font-medium text-white">Switch to LandMatch Business →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

// ── Business version ─────────────────────────────────────────────────
function AboutBusiness() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-emerald-100 mb-5">
            <Building2 className="w-4 h-4" /> LandMatch Business
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5" style={{ color: "#fff" }}>About LandMatch Business</h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#a7f3d0" }}>
            Commercial real estate and land transactions are complex, opaque, and dominated by brokers
            who take large commissions on both sides. LandMatch Business cuts through that.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem We're Solving</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">A retiring farmer with 200 acres of Class 1 soil has no good way to find a serious buyer directly. A developer looking for serviced development land spends months working through agents who don't actually know the properties. A small business owner selling their building has to pay a broker 4–5% for an introduction they could have made themselves.</p>
              <p className="text-gray-600 leading-relaxed">Commercial banks are even more restrictive than residential lenders. They require 30–40% down on commercial properties, refuse non-traditional operators, and make the process take months. Seller-financing in commercial real estate is common — but there's no organized place to find it.</p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">LandMatch Business creates a direct marketplace for commercial and land transactions. Sellers list their property with full zoning, utility, and permitted-use details. Buyers create profiles with their intended use, acreage needs, and financial capacity. The matching engine connects them directly.</p>
              <p className="text-gray-600 leading-relaxed">No listing agent. No buyer's agent. No commission. A real estate lawyer closes it — and they cost a fraction of what a broker takes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-100", title: "Transparency", text: "Full zoning details, utility access, permitted uses, and environmental status visible before any conversation." },
              { icon: <Tractor className="w-6 h-6 text-amber-600" />, bg: "bg-amber-100", title: "Landowners First", text: "Farmers, retiring business owners, and long-time landowners deserve a better path to exit than a broker." },
              { icon: <TrendingUp className="w-6 h-6 text-blue-600" />, bg: "bg-blue-100", title: "Serious Buyers", text: "Buyer profiles show intended use, capital, zoning flexibility, and timeline — so sellers can qualify quickly." },
              { icon: <Building2 className="w-6 h-6 text-purple-600" />, bg: "bg-purple-100", title: "No Middlemen", text: "Direct seller-to-buyer transactions. The only professionals involved are the ones you actually need." },
            ].map(({ icon, bg, title, text }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property types */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">What You Can List or Buy</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🌾", title: "Agricultural / Farmland", desc: "Working farms, raw land, hobby farms, orchards." },
              { icon: "🏗️", title: "Development Land", desc: "Serviced and un-serviced development parcels, zoned or pending." },
              { icon: "🏢", title: "Commercial Buildings", desc: "Retail units, office space, strip plazas, mixed-use." },
              { icon: "🏭", title: "Industrial / Warehouse", desc: "Manufacturing, logistics, storage, flex industrial." },
              { icon: "🌊", title: "Waterfront & Recreational", desc: "Cottage country, lakefront lots, recreational land." },
              { icon: "🏘️", title: "Multi-Unit Properties", desc: "Apartment buildings, fourplexes, multi-residential." },
              { icon: "🌳", title: "Vacant Land", desc: "Unimproved lots, bush parcels, rural acreage." },
              { icon: "⭐", title: "Special Purpose", desc: "Hospitality, institutional, unique-use properties." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="text-2xl mb-2">{icon}</div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnerSection isBusiness={true} />
      <WhatWeAreSection isBusiness={true} />

      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#fff" }}>Ready to Make a Deal?</h2>
          <p className="mb-8" style={{ color: "#a7f3d0" }}>Whether you're listing commercial land or looking to buy your next investment — LandMatch Business connects you directly.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/business/list-property"   className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors">List a Property</Link>
            <Link to="/business/create-profile"  className="px-8 py-3 bg-white text-emerald-800 font-semibold rounded-lg hover:bg-emerald-50 transition-colors">Create Buyer Profile</Link>
          </div>
          <p className="mt-6 text-sm" style={{ color: "#6ee7b7" }}>
            Looking for residential homes?{" "}
            <Link to="/" className="underline font-medium text-white">Switch to LandMatch Homes →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

// ── Shared sections ───────────────────────────────────────────────────
function PartnerSection({ isBusiness }) {
  const primary = isBusiness ? "text-emerald-600" : "text-blue-600";
  const btnCls  = isBusiness ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white";
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">A Complete Transaction Ecosystem</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Finding the right buyer or seller is only the first step. Closing a deal requires lawyers, inspectors, stagers, and {isBusiness ? "environmental consultants." : "photographers — and someone to move your belongings when it's all done."}</p>
            <p className="text-gray-600 leading-relaxed mb-6">LandMatch brings all of that together. Our Partner Directory connects you with vetted local professionals who understand {isBusiness ? "commercial and land transactions" : "seller-financed transactions"}.</p>
            <Link to="/partners" className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors ${btnCls}`}>
              Browse the Partner Directory →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { icon: "⚖️", title: "Real Estate Lawyers", desc: "Essential for drafting promissory notes, VTB agreements, and title transfers." },
              { icon: "🔍", title: "Home Inspectors", desc: isBusiness ? "Property inspections and environmental assessments." : "Pre-listing inspections give confidence to both sides." },
              { icon: "🏦", title: "Mortgage Brokers", desc: "For buyers who want to compare seller-finance against traditional options." },
              { icon: "🚛", title: "Verified Movers", desc: "CVOR-registered, cargo-insured, WSIB-covered movers." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <span className="text-2xl shrink-0">{icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatWeAreSection({ isBusiness }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">What LandMatch {isBusiness ? "Business" : "Homes"} Is — and Isn't</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-green-800 mb-4">✓ What we are</h3>
            <ul className="space-y-2.5 text-sm text-green-700">
              <li>A marketplace connecting sellers and buyers directly</li>
              <li>A matching system that surfaces compatible deals</li>
              <li>A safe space with NDA-protected document sharing</li>
              <li>A tool for organizing and comparing deal terms</li>
              {isBusiness
                ? <><li>A home for commercial, land, and development deals</li><li>A directory of vetted professional services</li></>
                : <><li>A home for private sales, rent-to-own, and VTB deals</li><li>A directory of vetted local professionals</li></>
              }
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-semibold text-red-800 mb-4">✗ What we are not</h3>
            <ul className="space-y-2.5 text-sm text-red-700">
              <li>A licensed mortgage broker or lender</li>
              <li>A law firm or legal advisor</li>
              <li>A financial or investment advisor</li>
              <li>A guarantor of any transaction</li>
              <li>A title search or due diligence service</li>
              {isBusiness && <li>An environmental assessment firm</li>}
            </ul>
          </div>
        </div>
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800 leading-relaxed">
          <strong>Important:</strong> {isBusiness
            ? "Commercial and land transactions are legally and financially complex. Always engage a real estate lawyer, accountant, and where relevant, an environmental consultant before signing any agreement."
            : "Seller-financed real estate transactions are legally complex. We strongly recommend both parties engage a real estate lawyer before signing any agreement."
          } LandMatch facilitates introductions — the due diligence is yours to complete.
        </div>
      </div>
    </section>
  );
}

// ── Main export ───────────────────────────────────────────────────────
export default function About() {
  const { mode, MODES } = useSite();
  return mode === MODES.business ? <AboutBusiness /> : <AboutHomes />;
}

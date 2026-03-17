// src/pages/Partners.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PARTNERS, PARTNER_CATEGORIES } from "../data/partners";
import { MapPin, Phone, Star, ChevronRight, ShieldCheck } from "lucide-react";
import { useSite } from "../context/SiteContext";

const getInitials = (name) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const categoryColors = {
  lawyer:       "bg-blue-100 text-blue-700",
  stager:       "bg-purple-100 text-purple-700",
  photographer: "bg-orange-100 text-orange-700",
  inspector:    "bg-green-100 text-green-700",
  broker:       "bg-yellow-100 text-yellow-700",
  mover:        "bg-teal-100 text-teal-700",
};
const avatarColors = {
  lawyer:       "from-blue-500 to-blue-700",
  stager:       "from-purple-500 to-purple-700",
  photographer: "from-orange-400 to-orange-600",
  inspector:    "from-green-500 to-green-700",
  broker:       "from-yellow-500 to-yellow-600",
  mover:        "from-teal-500 to-teal-700",
};

export default function Partners() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const primary    = isBusiness ? "bg-emerald-600 text-white"   : "bg-blue-600 text-white";
  const heroBg     = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const subColor   = isBusiness ? "#a7f3d0" : "#bfdbfe";
  const activeBtn  = isBusiness ? "bg-emerald-600 text-white"   : "bg-blue-600 text-white";
  const ctaBtnPrimary = isBusiness ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-orange-500 hover:bg-orange-600 text-white";
  const ctaBtnSec     = isBusiness ? "bg-white text-emerald-700 hover:bg-emerald-50" : "bg-white text-blue-700 hover:bg-blue-50";
  const linkColor     = isBusiness ? "text-emerald-600" : "text-blue-600";

  const filtered = PARTNERS.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <div className="min-h-screen bg-gray-50">

      <section className={`bg-gradient-to-br ${heroBg} py-16`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#fff" }}>
            Find a Real Estate Professional
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: subColor }}>
            Trusted lawyers, inspectors, stagers, photographers, brokers, and verified movers —
            everything you need to close your deal in the Durham Region.
          </p>
          <div className="max-w-lg mx-auto">
            <input type="text" placeholder="Search by name, city, or specialty..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 rounded-xl text-gray-800 text-sm focus:outline-none shadow-lg" />
          </div>
        </div>
      </section>

      {/* Category filters */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3">
            <button onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === "all" ? activeBtn : "text-gray-600 hover:bg-gray-100"}`}>
              All Professionals
            </button>
            {PARTNER_CATEGORIES.map(({ value, label, icon }) => (
              <button key={value} onClick={() => setActiveCategory(value)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${activeCategory === value ? activeBtn : "text-gray-600 hover:bg-gray-100"}`}>
                <span>{icon}</span>
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movers trust note */}
      {(activeCategory === "mover" || activeCategory === "all") && (
        <div className="max-w-7xl mx-auto px-6 pt-5">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-teal-800">All Listed Movers Are Verified</p>
              <p className="text-xs text-teal-600 mt-0.5">Every moving company on LandMatch has been verified for CVOR registration, active cargo insurance (min. $100K), and WSIB coverage before listing.</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium mb-1">No professionals found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {filtered.length} professional{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((partner) => (
                <Link key={partner.id} to={`/partners/${partner.id}`} className="block group">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${avatarColors[partner.category]} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                        {getInitials(partner.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{partner.name}</h3>
                          {partner.badge && (
                            <span className="shrink-0 flex items-center gap-1 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <Star className="w-2.5 h-2.5" /> Partner
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{partner.contact}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[partner.category]}`}>
                            {PARTNER_CATEGORIES.find(c => c.value === partner.category)?.icon}{" "}
                            {PARTNER_CATEGORIES.find(c => c.value === partner.category)?.label.replace("Real Estate ", "").replace("Licensed & Insured ", "").replace("Home ", "").replace("Mortgage ", "")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">{partner.bio}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-400"><MapPin className="w-3 h-3 shrink-0" /><span>{partner.city} · {partner.region}</span></div>
                      <div className="flex items-center gap-2 text-xs text-gray-400"><Phone className="w-3 h-3 shrink-0" /><span>{partner.phone}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {partner.services.slice(0, 3).map((s) => (
                        <span key={s} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                      {partner.services.length > 3 && <span className="text-[11px] text-gray-400">+{partner.services.length - 3} more</span>}
                    </div>
                    <div className={`mt-4 flex items-center text-xs font-medium gap-1 group-hover:gap-2 transition-all ${linkColor}`}>
                      View Profile <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className={`bg-gradient-to-br ${heroBg} rounded-2xl p-8 md:p-10 text-center`}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#fff" }}>Are You a Real Estate Professional?</h2>
          <p className="mb-6 max-w-xl mx-auto" style={{ color: subColor }}>
            Join the LandMatch Partner network and connect with buyers and sellers who need your expertise. All applications are reviewed manually before approval.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/partner-apply" className={`px-6 py-3 font-semibold rounded-lg transition-colors ${ctaBtnPrimary}`}>Apply to Become a Partner</Link>
            <Link to="/about"         className={`px-6 py-3 font-semibold rounded-lg transition-colors ${ctaBtnSec}`}>Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

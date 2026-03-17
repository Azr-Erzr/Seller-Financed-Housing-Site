// src/pages/Partners.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PARTNERS, PARTNER_CATEGORIES } from "../data/partners";
import { MapPin, Phone, Globe, ChevronRight, Star } from "lucide-react";

const getInitials = (name) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const categoryColors = {
  lawyer:       "bg-blue-100 text-blue-700",
  stager:       "bg-purple-100 text-purple-700",
  photographer: "bg-orange-100 text-orange-700",
  inspector:    "bg-green-100 text-green-700",
  broker:       "bg-yellow-100 text-yellow-700",
};

const avatarColors = {
  lawyer:       "from-blue-500 to-blue-700",
  stager:       "from-purple-500 to-purple-700",
  photographer: "from-orange-400 to-orange-600",
  inspector:    "from-green-500 to-green-700",
  broker:       "from-yellow-500 to-yellow-600",
};

export default function Partners() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = PARTNERS.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.city.toLowerCase().includes(search.toLowerCase()) &&
        !p.contact.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#ffffff" }}>
            Find a Real Estate Professional
          </h1>
          <p className="text-lg mb-8" style={{ color: "#bfdbfe" }}>
            Trusted lawyers, stagers, photographers, and inspectors in the Durham Region —
            everything you need to close your deal with confidence.
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search by name, city, or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 rounded-xl text-gray-800 text-sm focus:outline-none shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Category filters */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Professionals
            </button>
            {PARTNER_CATEGORIES.map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeCategory === value
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category explainer */}
      {activeCategory !== "all" && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          {PARTNER_CATEGORIES.filter((c) => c.value === activeCategory).map((cat) => (
            <div key={cat.value} className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="font-semibold text-blue-900 text-sm">{cat.label}</p>
                <p className="text-blue-600 text-xs">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Partner grid */}
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
              {activeCategory !== "all" && ` · ${PARTNER_CATEGORIES.find(c => c.value === activeCategory)?.label}`}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((partner) => (
                <Link key={partner.id} to={`/partners/${partner.id}`} className="block group">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">

                    {/* Header */}
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
                        <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[partner.category]}`}>
                          {PARTNER_CATEGORIES.find(c => c.value === partner.category)?.label.replace("Real Estate ", "").replace("Home ", "").replace("Mortgage ", "")}
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
                      {partner.bio}
                    </p>

                    {/* Location + contact */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{partner.city} · {partner.region}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{partner.phone}</span>
                      </div>
                    </div>

                    {/* Services preview */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {partner.services.slice(0, 3).map((s) => (
                        <span key={s} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                      {partner.services.length > 3 && (
                        <span className="text-[11px] text-gray-400">+{partner.services.length - 3} more</span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center text-blue-600 text-xs font-medium group-hover:gap-2 gap-1 transition-all">
                      View Profile <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Become a partner CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 md:p-10 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Are You a Real Estate Professional?
          </h2>
          <p className="mb-6 max-w-xl mx-auto" style={{ color: "#bfdbfe" }}>
            Join the HomeMatch Partner network and connect with buyers and sellers who need your expertise.
            Featured partners appear at the top of search results with a Partner badge.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:partners@homematch.ca"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">
              Apply to Become a Partner
            </a>
            <Link to="/about"
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

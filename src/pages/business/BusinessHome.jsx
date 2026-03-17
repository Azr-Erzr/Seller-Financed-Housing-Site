// src/pages/business/BusinessHome.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Building2, Users, FileText, CheckCircle, Tractor, Waves, Factory } from "lucide-react";
import { getAllCommListings, getAllCommProfiles } from "../../lib/commercial-storage";
import CommListingCard from "../../components/business/CommListingCard";
import CommProfileCard from "../../components/business/CommProfileCard";

export default function BusinessHome() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [featuredProfiles, setFeaturedProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllCommListings().then((l) => setFeaturedListings(l.slice(0, 3)));
    getAllCommProfiles().then((p) => setFeaturedProfiles(p.slice(0, 3)));
  }, []);

  const handleSearch = () => {
    const q = search.trim();
    navigate(q ? `/business/listings?location=${encodeURIComponent(q)}` : "/business/listings");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              LandMatch Business
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight" style={{ color: "#ffffff" }}>
              Commercial & Land Deals,<br />Direct from Owner
            </h1>
            <p className="text-lg mb-8" style={{ color: "#a7f3d0" }}>
              Vacant land, farms, development parcels, commercial buildings, and industrial properties —
              seller-financed, no banks, no agents.
            </p>

            <div className="bg-white rounded-xl shadow-xl p-2 flex gap-2 mb-7 max-w-2xl mx-auto">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="City, county, or property type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 text-gray-800 text-sm outline-none bg-transparent"
                />
              </div>
              <button onClick={handleSearch}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-lg transition-colors">
                Search
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/business/listings"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-800 font-semibold rounded-lg hover:bg-emerald-50 transition-colors">
                <Building2 className="w-4 h-4" /> Browse Properties
              </Link>
              <Link to="/business/profiles"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-800 font-semibold rounded-lg hover:bg-emerald-50 transition-colors">
                <Users className="w-4 h-4" /> Browse Buyers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Property categories */}
      <section className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { icon: "🌾", label: "Farmland" },
              { icon: "🏗️", label: "Development" },
              { icon: "🏢", label: "Commercial" },
              { icon: "🏭", label: "Industrial" },
              { icon: "🌊", label: "Waterfront" },
              { icon: "🌳", label: "Vacant Land" },
              { icon: "🏘️", label: "Multi-Unit" },
              { icon: "⭐", label: "Special Use" },
            ].map(({ icon, label }) => (
              <Link key={label} to={`/business/listings?category=${encodeURIComponent(label)}`}
                className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 border border-transparent rounded-xl transition-all text-center">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-medium text-gray-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Properties</h2>
            <p className="text-gray-500">Seller-financed commercial and land opportunities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <CommListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/business/listings"
              className="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Buyers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Active Buyers</h2>
            <p className="text-gray-500">Developers, farmers, and investors ready to move</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProfiles.map((profile) => (
              <CommProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/business/profiles"
              className="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              View All Buyers
            </Link>
          </div>
        </div>
      </section>

      {/* How it's different */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Why LandMatch Business?</h2>
            <p className="text-gray-500">Commercial and land deals are fundamentally different from residential.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <FileText className="w-7 h-7 text-emerald-600" />, bg: "bg-emerald-100", num: 1, numBg: "bg-emerald-600",
                title: "Zoning & Use Filters",
                body: "Filter by zoning classification, permitted uses, utilities on lot, road access, and environmental status — the details that actually matter for commercial deals." },
              { icon: <Building2 className="w-7 h-7 text-amber-600" />, bg: "bg-amber-100", num: 2, numBg: "bg-amber-500",
                title: "Serious Buyer Profiles",
                body: "Buyers list their intended use, acreage range, zoning flexibility, and timeline — so sellers can quickly tell who is qualified and aligned." },
              { icon: <CheckCircle className="w-7 h-7 text-green-600" />, bg: "bg-green-100", num: 3, numBg: "bg-green-600",
                title: "No Agents Required",
                body: "Direct seller-to-buyer connections. VTB financing. The seller holds the paper on the deal — no listing agent, no buyer agent, no commission." },
            ].map(({ icon, bg, num, numBg, title, body }) => (
              <div key={title} className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>{icon}</div>
                <div className={`w-7 h-7 ${numBg} text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold`}>{num}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#ffffff" }}>Ready to Make a Deal?</h2>
          <p className="mb-8" style={{ color: "#a7f3d0" }}>
            Whether you own land, a commercial building, or a farm — or you're a buyer with capital to deploy —
            LandMatch Business connects you directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/business/list-property"
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors">
              List a Property
            </Link>
            <Link to="/business/create-profile"
              className="px-8 py-3 bg-white text-emerald-800 font-semibold rounded-lg hover:bg-emerald-50 transition-colors">
              Create Buyer Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

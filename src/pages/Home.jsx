// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Home, Users, FileText, CheckCircle } from "lucide-react";
import ListingCard from "../components/ListingCard";
import ProfileCard from "../components/ProfileCard";
import { getAllListings, getAllProfiles } from "../lib/storage";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredListings, setFeaturedListings] = useState([]);
  const [featuredProfiles, setFeaturedProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllListings().then((l) => setFeaturedListings(l.slice(0, 3)));
    getAllProfiles().then((p) => setFeaturedProfiles(p.slice(0, 3)));
  }, []);

  const handleSearch = () => {
    const q = searchQuery.trim();
    navigate(q ? `/listings?location=${encodeURIComponent(q)}` : "/listings");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight text-white">
              Find Your Perfect Match in Housing
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Connect with sellers and buyers for seller-financed and rent-to-own deals.
              No banks required.
            </p>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-xl p-2 flex gap-2 mb-7 max-w-2xl mx-auto">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter city, state, or ZIP code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 text-gray-800 text-sm outline-none bg-transparent placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                Search Homes
              </button>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/listings" className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                <Home className="w-4 h-4" /> Browse Homes
              </Link>
              <Link to="/profiles" className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                <Users className="w-4 h-4" /> Browse Buyers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Homes ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Homes</h2>
            <p className="text-gray-500">Discover properties with flexible financing terms</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/listings" className="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Buyers ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Active Buyers</h2>
            <p className="text-gray-500">Motivated buyers ready to make a deal</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/profiles" className="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              View All Buyers
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-500">Three simple steps to your dream home</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Search className="w-7 h-7 text-blue-600" />, bg: "bg-blue-100", num: 1, numBg: "bg-blue-600", title: "Browse & Match", body: "Search properties and see your personalized match score based on your budget, preferences, and financial profile." },
              { icon: <FileText className="w-7 h-7 text-orange-500" />, bg: "bg-orange-100", num: 2, numBg: "bg-orange-500", title: "Connect & Negotiate", body: "Connect directly with sellers to discuss terms, down payments, interest rates, and payment schedules." },
              { icon: <CheckCircle className="w-7 h-7 text-green-600" />, bg: "bg-green-100", num: 3, numBg: "bg-green-600", title: "Close the Deal", body: "Finalize your agreement with seller financing or rent-to-own terms. No bank approval needed." },
            ].map(({ icon, bg, num, numBg, title, body }) => (
              <div key={title} className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>{icon}</div>
                <div className={`w-7 h-7 ${numBg} text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold`}>{num}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/how-it-works" className="text-blue-600 hover:underline text-sm font-medium">
              Read the full guide →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Make a Match?</h2>
          <p className="text-blue-100 mb-8">
            Whether you're a seller looking to finance or a buyer searching for your first home — we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/listings" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">
              Find a Home
            </Link>
            <Link to="/profiles" className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Find a Buyer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

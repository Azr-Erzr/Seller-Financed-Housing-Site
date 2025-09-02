// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import ProfileCard from "../components/ProfileCard";
import { LISTINGS, PROFILES } from "../data/seed";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Find Your Perfect Match in Housing
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Explore seller-financed homes and connect with buyers & investors looking for deals.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <input
              type="text"
              placeholder="City, ZIP, or Keyword"
              className="w-full md:w-96 px-5 py-3 rounded-full text-gray-800 shadow focus:outline-none"
            />
            <button className="px-6 py-3 rounded-full bg-white text-indigo-600 font-semibold shadow hover:bg-gray-100">
              Search
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/listings"
              className="px-6 py-2 rounded-full bg-indigo-500 hover:bg-indigo-400 transition font-medium shadow"
            >
              Browse Homes
            </Link>
            <Link
              to="/profiles"
              className="px-6 py-2 rounded-full bg-pink-500 hover:bg-pink-400 transition font-medium shadow"
            >
              Browse Buyers
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Homes */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Homes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LISTINGS.slice(0, 3).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* Featured Buyers */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Buyers</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROFILES.slice(0, 3).map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 rounded-lg shadow hover:shadow-lg transition bg-gray-50">
              <h3 className="text-xl font-semibold mb-3">1. List or Create Profile</h3>
              <p className="text-gray-600">
                Sellers list homes with financing terms. Buyers create profiles with budget, goals & risk tolerance.
              </p>
            </div>
            <div className="p-6 rounded-lg shadow hover:shadow-lg transition bg-gray-50">
              <h3 className="text-xl font-semibold mb-3">2. Get Matched</h3>
              <p className="text-gray-600">
                Our matching engine shows best-fit homes or buyers with clear compatibility scores.
              </p>
            </div>
            <div className="p-6 rounded-lg shadow hover:shadow-lg transition bg-gray-50">
              <h3 className="text-xl font-semibold mb-3">3. Close the Deal</h3>
              <p className="text-gray-600">
                Chat, negotiate, and finalize agreements with transparency. No banks needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Match?</h2>
        <p className="mb-6">
          Whether you’re a seller looking to finance or a buyer searching for your first home, we’ve got you covered.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/listings"
            className="px-6 py-3 rounded-full bg-white text-orange-600 font-semibold shadow hover:bg-gray-100"
          >
            Find a Home
          </Link>
          <Link
            to="/profiles"
            className="px-6 py-3 rounded-full bg-white text-pink-600 font-semibold shadow hover:bg-gray-100"
          >
            Find a Buyer
          </Link>
        </div>
      </section>
    </div>
  );
}
// src/pages/Listings.jsx
import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import ListingCard from "../components/ListingCard";
import { LISTINGS } from "../data/seed";

const DEAL_TYPES = ["Seller-Finance", "Rent-to-Own", "Lease Option"];
const PROPERTY_TYPES = ["Single-Family", "Townhouse", "Condo", "Multi-Unit"];

export default function Listings() {
  const [location, setLocation]       = useState("");
  const [minPrice, setMinPrice]       = useState(0);
  const [maxPrice, setMaxPrice]       = useState(1000000);
  const [dealTypes, setDealTypes]     = useState([]);
  const [propTypes, setPropTypes]     = useState([]);
  const [matchMin, setMatchMin]       = useState(0);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const filtered = LISTINGS.filter((l) => {
    if (location && !l.city.toLowerCase().includes(location.toLowerCase())) return false;
    if (l.price < minPrice || l.price > maxPrice) return false;
    if (dealTypes.length && !dealTypes.includes(l.dealType)) return false;
    if (propTypes.length && !propTypes.includes(l.propertyType)) return false;
    return true;
  });

  const clearFilters = () => {
    setLocation(""); setMinPrice(0); setMaxPrice(1000000);
    setDealTypes([]); setPropTypes([]); setMatchMin(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Available Properties</h1>
          <p className="text-gray-500">{filtered.length} {filtered.length === 1 ? "property" : "properties"} found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ── */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="City, State, or ZIP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="mb-2">
                  <input
                    type="range"
                    min={0}
                    max={1000000}
                    step={10000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>$0</span>
                  <span>${(maxPrice / 1000).toFixed(0)}K</span>
                </div>
              </div>

              {/* Deal Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Deal Type</label>
                <div className="space-y-2.5">
                  {DEAL_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dealTypes.includes(type)}
                        onChange={() => toggle(dealTypes, setDealTypes, type)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                      />
                      <span className="text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Property Type</label>
                <div className="space-y-2.5">
                  {PROPERTY_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={propTypes.includes(type)}
                        onChange={() => toggle(propTypes, setPropTypes, type)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                      />
                      <span className="text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Min Match */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Match Score — <span className="text-blue-600">{matchMin}%+</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={matchMin}
                  onChange={(e) => setMatchMin(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Grid ── */}
          <main className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium mb-2">No properties found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

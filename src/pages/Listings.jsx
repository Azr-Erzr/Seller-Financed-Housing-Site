// src/pages/Listings.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import ListingCard from "../components/ListingCard";
import { getAllListings } from "../lib/storage";

const DEAL_TYPES     = ["Seller-Finance", "Rent-to-Own", "Lease Option"];
const PROPERTY_TYPES = ["Single-Family", "Townhouse", "Condo", "Multi-Unit"];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allListings, setAllListings] = useState([]);

  // Initialise location from URL param (from homepage search)
  const [location, setLocation]   = useState(searchParams.get("location") || "");
  const [maxPrice, setMaxPrice]   = useState(1000000);
  const [dealTypes, setDealTypes] = useState([]);
  const [propTypes, setPropTypes] = useState([]);

  useEffect(() => {
    getAllListings().then(setAllListings);
  }, []);

  // Keep location in sync with URL param when navigating from homepage
  useEffect(() => {
    const loc = searchParams.get("location");
    if (loc) setLocation(loc);
  }, [searchParams]);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const filtered = allListings.filter((l) => {
    if (location && !l.city.toLowerCase().includes(location.toLowerCase()) &&
        !l.address?.toLowerCase().includes(location.toLowerCase())) return false;
    if (l.price > maxPrice) return false;
    if (dealTypes.length && !dealTypes.includes(l.dealType)) return false;
    if (propTypes.length && !propTypes.includes(l.propertyType)) return false;
    return true;
  });

  const clearFilters = () => {
    setLocation(""); setMaxPrice(1000000); setDealTypes([]); setPropTypes([]);
    setSearchParams({});
  };

  const handleLocationChange = (val) => {
    setLocation(val);
    if (val) setSearchParams({ location: val });
    else setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Available Properties</h1>
          <p className="text-gray-500">
            {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
            {location && <span className="text-blue-600"> near "{location}"</span>}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </h2>
                <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear all</button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="City, State, or ZIP"
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price — <span className="text-blue-600">{maxPrice >= 1000000 ? `$${(maxPrice / 1000000).toFixed(1)}M` : `$${(maxPrice / 1000).toFixed(0)}K`}</span>
                </label>
                <input type="range" min={200000} max={1200000} step={10000} value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$200K</span><span>$1.2M</span></div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Deal Type</label>
                <div className="space-y-2.5">
                  {DEAL_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={dealTypes.includes(type)}
                        onChange={() => toggle(dealTypes, setDealTypes, type)}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600" />
                      <span className="text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Property Type</label>
                <div className="space-y-2.5">
                  {PROPERTY_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={propTypes.includes(type)}
                        onChange={() => toggle(propTypes, setPropTypes, type)}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600" />
                      <span className="text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium mb-2">No properties found</p>
                <p className="text-sm">Try adjusting your filters or <button onClick={clearFilters} className="text-blue-500 hover:underline">clear all filters</button></p>
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

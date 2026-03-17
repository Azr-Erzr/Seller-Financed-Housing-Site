// src/pages/business/BusinessListings.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import CommListingCard from "../../components/business/CommListingCard";
import { getAllCommListings } from "../../lib/commercial-storage";
import {
  PROPERTY_CATEGORIES, ZONING_TYPES, UTILITY_OPTIONS,
  PERMITTED_USES, ROAD_ACCESS, ENVIRONMENTAL_STATUS,
} from "../../data/commercial-seed";

const DEAL_TYPES = ["Seller-Finance", "Rent-to-Own", "Lease Option", "Private Sale"];

export default function BusinessListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allListings, setAllListings]   = useState([]);
  const [location, setLocation]         = useState(searchParams.get("location") || "");
  const [categories, setCategories]     = useState([]);
  const [zonings, setZonings]           = useState([]);
  const [utilities, setUtilities]       = useState([]);
  const [permittedUses, setPermittedUses] = useState([]);
  const [dealTypes, setDealTypes]       = useState([]);
  const [minAcreage, setMinAcreage]     = useState("");
  const [maxAcreage, setMaxAcreage]     = useState("");
  const [maxPrice, setMaxPrice]         = useState(10000000);
  const [roadAccess, setRoadAccess]     = useState([]);

  useEffect(() => { getAllCommListings().then(setAllListings); }, []);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const filtered = allListings.filter((l) => {
    if (location && !l.city?.toLowerCase().includes(location.toLowerCase())) return false;
    if (l.price > maxPrice) return false;
    if (categories.length && !categories.includes(l.propertyCategory)) return false;
    if (zonings.length && !zonings.includes(l.zoning)) return false;
    if (dealTypes.length && !dealTypes.includes(l.dealType)) return false;
    if (minAcreage && l.acreage < Number(minAcreage)) return false;
    if (maxAcreage && l.acreage > Number(maxAcreage)) return false;
    if (utilities.length && !utilities.every((u) => l.utilities?.includes(u))) return false;
    if (permittedUses.length && !permittedUses.some((u) => l.permittedUses?.includes(u))) return false;
    if (roadAccess.length && !roadAccess.includes(l.roadAccess)) return false;
    return true;
  });

  const clearFilters = () => {
    setLocation(""); setCategories([]); setZonings([]); setUtilities([]);
    setPermittedUses([]); setDealTypes([]); setMinAcreage(""); setMaxAcreage("");
    setMaxPrice(10000000); setRoadAccess([]);
    setSearchParams({});
  };

  const CheckGroup = ({ title, options, state, setState, colorClass = "accent-emerald-600" }) => (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={state.includes(opt)} onChange={() => toggle(state, setState, opt)}
              className={`w-4 h-4 rounded border-gray-300 ${colorClass}`} />
            <span className="text-sm text-gray-600">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Available Properties</h1>
          <p className="text-gray-500">{filtered.length} {filtered.length === 1 ? "property" : "properties"} found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </h2>
                <button onClick={clearFilters} className="text-xs text-emerald-600 hover:underline">Clear all</button>
              </div>

              {/* Location */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" placeholder="City, region..." value={location}
                  onChange={(e) => { setLocation(e.target.value); setSearchParams(e.target.value ? { location: e.target.value } : {}); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              {/* Max Price */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price — <span className="text-emerald-600">${(maxPrice / 1000000).toFixed(1)}M</span>
                </label>
                <input type="range" min={100000} max={10000000} step={100000} value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-emerald-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$100K</span><span>$10M</span></div>
              </div>

              {/* Acreage */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Acreage Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={minAcreage}
                    onChange={(e) => setMinAcreage(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input type="number" placeholder="Max" value={maxAcreage}
                    onChange={(e) => setMaxAcreage(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <CheckGroup title="Property Category" options={PROPERTY_CATEGORIES} state={categories} setState={setCategories} />
              <CheckGroup title="Zoning" options={ZONING_TYPES} state={zonings} setState={setZonings} />
              <CheckGroup title="Deal Type" options={DEAL_TYPES} state={dealTypes} setState={setDealTypes} />
              <CheckGroup title="Utilities on Property" options={UTILITY_OPTIONS} state={utilities} setState={setUtilities} />
              <CheckGroup title="Permitted Uses" options={PERMITTED_USES} state={permittedUses} setState={setPermittedUses} />
              <CheckGroup title="Road Access" options={ROAD_ACCESS} state={roadAccess} setState={setRoadAccess} />
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium mb-2">No properties found</p>
                <p className="text-sm">Try adjusting your filters or <button onClick={clearFilters} className="text-emerald-600 hover:underline">clear all</button></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((listing) => <CommListingCard key={listing.id} listing={listing} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

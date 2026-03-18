// src/pages/business/BusinessListings.jsx
// Redesigned filter sidebar: collapsible sections, pill-style toggles, mobile drawer
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import CommListingCard from "../../components/business/CommListingCard";
import { getAllCommListings } from "../../lib/commercial-storage";
import {
  PROPERTY_CATEGORIES, ZONING_TYPES, UTILITY_OPTIONS,
  PERMITTED_USES, ROAD_ACCESS,
} from "../../data/commercial-seed";

const DEAL_TYPES = ["Seller-Finance", "Rent-to-Own", "Lease Option", "Private Sale"];

function FilterSection({ title, defaultOpen = false, count = 0, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {title}
          {count > 0 && (
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function PillGroup({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onToggle(opt)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            selected.includes(opt)
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}>
          {opt}
        </button>
      ))}
    </div>
  );
}

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
  const [mobileOpen, setMobileOpen]     = useState(false);

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

  const activeN = categories.length + zonings.length + dealTypes.length + utilities.length +
    permittedUses.length + roadAccess.length +
    (location ? 1 : 0) + (maxPrice < 10000000 ? 1 : 0) + (minAcreage ? 1 : 0) + (maxAcreage ? 1 : 0);

  const clearFilters = () => {
    setLocation(""); setCategories([]); setZonings([]); setUtilities([]);
    setPermittedUses([]); setDealTypes([]); setMinAcreage(""); setMaxAcreage("");
    setMaxPrice(10000000); setRoadAccess([]); setSearchParams({});
  };

  const filterContent = (
    <>
      <div className="pb-4 border-b border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <input type="text" placeholder="City, region..." value={location}
          onChange={(e) => { setLocation(e.target.value); setSearchParams(e.target.value ? { location: e.target.value } : {}); }}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>
      <div className="py-4 border-b border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Price — <span className="text-emerald-600 font-semibold">${(maxPrice / 1000000).toFixed(1)}M</span>
        </label>
        <input type="range" min={100000} max={10000000} step={100000} value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-emerald-600" />
        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$100K</span><span>$10M</span></div>
      </div>
      <div className="py-4 border-b border-gray-100">
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
      <FilterSection title="Property Category" defaultOpen={true} count={categories.length}>
        <PillGroup options={PROPERTY_CATEGORIES} selected={categories} onToggle={(v) => toggle(categories, setCategories, v)} />
      </FilterSection>
      <FilterSection title="Deal Type" defaultOpen={true} count={dealTypes.length}>
        <PillGroup options={DEAL_TYPES} selected={dealTypes} onToggle={(v) => toggle(dealTypes, setDealTypes, v)} />
      </FilterSection>
      <FilterSection title="Zoning" count={zonings.length}>
        <PillGroup options={ZONING_TYPES} selected={zonings} onToggle={(v) => toggle(zonings, setZonings, v)} />
      </FilterSection>
      <FilterSection title="Utilities" count={utilities.length}>
        <PillGroup options={UTILITY_OPTIONS} selected={utilities} onToggle={(v) => toggle(utilities, setUtilities, v)} />
      </FilterSection>
      <FilterSection title="Permitted Uses" count={permittedUses.length}>
        <PillGroup options={PERMITTED_USES} selected={permittedUses} onToggle={(v) => toggle(permittedUses, setPermittedUses, v)} />
      </FilterSection>
      <FilterSection title="Road Access" count={roadAccess.length}>
        <PillGroup options={ROAD_ACCESS} selected={roadAccess} onToggle={(v) => toggle(roadAccess, setRoadAccess, v)} />
      </FilterSection>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Available Properties</h1>
            <p className="text-gray-500">{filtered.length} {filtered.length === 1 ? "property" : "properties"} found</p>
          </div>
          <button onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {activeN > 0 && <span className="bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeN}</span>}
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </h2>
                {activeN > 0 && <button onClick={clearFilters} className="text-xs text-emerald-600 hover:underline">Clear all ({activeN})</button>}
              </div>
              {filterContent}
            </div>
          </aside>
          {/* Mobile drawer */}
          {mobileOpen && (
            <>
              <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
              <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto lg:hidden">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
                  <h2 className="font-semibold text-gray-900 text-sm"><SlidersHorizontal className="w-4 h-4 inline mr-2" />Filters</h2>
                  <div className="flex items-center gap-3">
                    {activeN > 0 && <button onClick={clearFilters} className="text-xs text-emerald-600 hover:underline">Clear all</button>}
                    <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400" /></button>
                  </div>
                </div>
                <div className="p-5">{filterContent}</div>
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                  <button onClick={() => setMobileOpen(false)}
                    className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                    Show {filtered.length} results
                  </button>
                </div>
              </div>
            </>
          )}
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

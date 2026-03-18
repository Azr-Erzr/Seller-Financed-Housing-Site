// src/pages/Listings.jsx
// Comprehensive filter sidebar matching Business page style. Wider layout.
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, X, Map } from "lucide-react";
import ListingCard from "../components/ListingCard";
import { getAllListings } from "../lib/storage";

const DEAL_TYPES = [
  { value: "Seller-Finance", color: "bg-blue-600" },
  { value: "Rent-to-Own",    color: "bg-purple-600" },
  { value: "Lease Option",   color: "bg-amber-600" },
  { value: "Private Sale",   color: "bg-emerald-600" },
];
const PROPERTY_TYPES = [
  { value: "Single-Family",  color: "bg-blue-600" },
  { value: "Townhouse",      color: "bg-indigo-600" },
  { value: "Semi-Detached",  color: "bg-teal-600" },
  { value: "Condo",          color: "bg-violet-600" },
  { value: "Multi-Unit",     color: "bg-rose-600" },
];
const BASEMENT_OPTS = ["Any", "Finished", "Partially Finished", "Unfinished", "None"];
const PARKING_OPTS  = ["Any", "Attached Garage", "Detached Garage", "Driveway", "Underground"];

function FilterSection({ title, defaultOpen = false, count = 0, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {title}
          {count > 0 && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{count}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function ColorPillGroup({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ value, color }) => {
        const active = selected.includes(value);
        return (
          <button key={value} type="button" onClick={() => onToggle(value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              active ? `${color} text-white border-transparent` : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}>
            {value}
          </button>
        );
      })}
    </div>
  );
}

function NumberPills({ options, value, onChange, label }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button key={opt.label} type="button" onClick={() => onChange(opt.val)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            value === opt.val ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allListings, setAllListings] = useState([]);
  const [mobileOpen, setMobileOpen]   = useState(false);

  const [location,   setLocation]   = useState(searchParams.get("location") || "");
  const [minPrice,   setMinPrice]   = useState("");
  const [maxPrice,   setMaxPrice]   = useState("");
  const [dealTypes,  setDealTypes]  = useState([]);
  const [propTypes,  setPropTypes]  = useState([]);
  const [minBeds,    setMinBeds]    = useState(0);
  const [minBaths,   setMinBaths]   = useState(0);
  const [minSqft,    setMinSqft]    = useState("");
  const [maxSqft,    setMaxSqft]    = useState("");
  const [basement,   setBasement]   = useState("Any");
  const [parking,    setParking]    = useState("Any");

  useEffect(() => { getAllListings().then(setAllListings); }, []);
  useEffect(() => { const loc = searchParams.get("location"); if (loc) setLocation(loc); }, [searchParams]);

  const toggle = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const filtered = allListings.filter((l) => {
    if (location && !l.city?.toLowerCase().includes(location.toLowerCase()) && !l.address?.toLowerCase().includes(location.toLowerCase())) return false;
    if (minPrice && l.price < Number(minPrice)) return false;
    if (maxPrice && l.price > Number(maxPrice)) return false;
    if (dealTypes.length && !dealTypes.includes(l.dealType)) return false;
    if (propTypes.length && !propTypes.includes(l.propertyType)) return false;
    if (minBeds && l.bedrooms < minBeds) return false;
    if (minBaths && l.bathrooms < minBaths) return false;
    if (minSqft && l.sqft < Number(minSqft)) return false;
    if (maxSqft && l.sqft > Number(maxSqft)) return false;
    if (basement !== "Any" && l.basement !== basement) return false;
    if (parking !== "Any" && l.parking !== parking) return false;
    return true;
  });

  const activeN = (location ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) +
    dealTypes.length + propTypes.length + (minBeds ? 1 : 0) + (minBaths ? 1 : 0) +
    (minSqft ? 1 : 0) + (maxSqft ? 1 : 0) + (basement !== "Any" ? 1 : 0) + (parking !== "Any" ? 1 : 0);

  const clearFilters = () => {
    setLocation(""); setMinPrice(""); setMaxPrice(""); setDealTypes([]); setPropTypes([]);
    setMinBeds(0); setMinBaths(0); setMinSqft(""); setMaxSqft(""); setBasement("Any"); setParking("Any");
    setSearchParams({});
  };

  const handleLocationChange = (val) => {
    setLocation(val);
    if (val) setSearchParams({ location: val }); else setSearchParams({});
  };

  const filterContent = (
    <>
      {/* Location */}
      <div className="pb-4 border-b border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <input type="text" placeholder="City or address..." value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Price */}
      <FilterSection title="Price" defaultOpen={true} count={(minPrice ? 1 : 0) + (maxPrice ? 1 : 0)}>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Min price</label>
            <input type="text" inputMode="numeric" placeholder="No min" value={minPrice ? `$${Number(minPrice).toLocaleString()}` : ""}
              onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Max price</label>
            <input type="text" inputMode="numeric" placeholder="No max" value={maxPrice ? `$${Number(maxPrice).toLocaleString()}` : ""}
              onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </FilterSection>

      {/* Property Type - color coded */}
      <FilterSection title="Property Type" defaultOpen={true} count={propTypes.length}>
        <ColorPillGroup options={PROPERTY_TYPES} selected={propTypes} onToggle={(v) => toggle(propTypes, setPropTypes, v)} />
      </FilterSection>

      {/* Deal Type - color coded */}
      <FilterSection title="Deal Type" defaultOpen={true} count={dealTypes.length}>
        <ColorPillGroup options={DEAL_TYPES} selected={dealTypes} onToggle={(v) => toggle(dealTypes, setDealTypes, v)} />
      </FilterSection>

      {/* Beds & Baths */}
      <FilterSection title="Beds & Baths" defaultOpen={true} count={(minBeds ? 1 : 0) + (minBaths ? 1 : 0)}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Bedrooms</label>
            <NumberPills value={minBeds} onChange={setMinBeds}
              options={[{ label: "Any", val: 0 }, { label: "1+", val: 1 }, { label: "2+", val: 2 }, { label: "3+", val: 3 }, { label: "4+", val: 4 }, { label: "5+", val: 5 }]} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Bathrooms</label>
            <NumberPills value={minBaths} onChange={setMinBaths}
              options={[{ label: "Any", val: 0 }, { label: "1+", val: 1 }, { label: "2+", val: 2 }, { label: "3+", val: 3 }, { label: "4+", val: 4 }]} />
          </div>
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size (sqft)" count={(minSqft ? 1 : 0) + (maxSqft ? 1 : 0)}>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minSqft} onChange={(e) => setMinSqft(e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" placeholder="Max" value={maxSqft} onChange={(e) => setMaxSqft(e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </FilterSection>

      {/* Basement */}
      <FilterSection title="Basement" count={basement !== "Any" ? 1 : 0}>
        <div className="flex flex-wrap gap-2">
          {BASEMENT_OPTS.map((b) => (
            <button key={b} onClick={() => setBasement(b)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                basement === b ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}>{b}</button>
          ))}
        </div>
      </FilterSection>

      {/* Parking */}
      <FilterSection title="Parking" count={parking !== "Any" ? 1 : 0}>
        <div className="flex flex-wrap gap-2">
          {PARKING_OPTS.map((p) => (
            <button key={p} onClick={() => setParking(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                parking === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}>{p}</button>
          ))}
        </div>
      </FilterSection>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Browse Homes</h1>
            <p className="text-gray-500">
              {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
              {location && <span className="text-blue-600"> near "{location}"</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/map"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Map className="w-4 h-4" /> Map View
            </Link>
            <button onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {activeN > 0 && <span className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeN}</span>}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </h2>
                {activeN > 0 && <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear all ({activeN})</button>}
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
                    {activeN > 0 && <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear all</button>}
                    <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400" /></button>
                  </div>
                </div>
                <div className="p-5">{filterContent}</div>
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                  <button onClick={() => setMobileOpen(false)}
                    className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">
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
                <p className="text-sm">Try adjusting your filters or <button onClick={clearFilters} className="text-blue-600 hover:underline">clear all</button></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

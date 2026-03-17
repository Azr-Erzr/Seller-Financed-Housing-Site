// src/pages/MapSearch.jsx
// Key fix: ResizeObserver watches the wrapper div and calls
// map.invalidateSize() any time its dimensions change.
// This is more reliable than setTimeout because it fires exactly
// when the browser finishes painting the container.

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAllListings } from "../lib/storage";
import { SlidersHorizontal, X, Bed, Bath, Square, LocateFixed, PenTool } from "lucide-react";

const CITY_COORDS = {
  "Whitby":    { lat: 43.8975, lng: -78.9429 },
  "Oshawa":    { lat: 43.8971, lng: -78.8658 },
  "Ajax":      { lat: 43.8509, lng: -79.0204 },
  "Pickering": { lat: 43.8384, lng: -79.0868 },
  "Clarington":{ lat: 43.9351, lng: -78.6897 },
};

const DEAL_TYPES     = ["Seller-Finance", "Rent-to-Own", "Lease Option", "Private Sale"];
const PROPERTY_TYPES = ["Single-Family", "Townhouse", "Condo", "Multi-Unit"];
const PRICE_PRESETS  = [
  { label: "Any",       min: 0,       max: 9999999 },
  { label: "<$500K",    min: 0,       max: 499999  },
  { label: "$500–750K", min: 500000,  max: 749999  },
  { label: "$750K–$1M", min: 750000,  max: 999999  },
  { label: "$1M+",      min: 1000000, max: 9999999 },
];

const getDealColor = (dt) => {
  if (!dt) return "#2563EB";
  const d = dt.toLowerCase();
  if (d.includes("rent"))    return "#7C3AED";
  if (d.includes("lease"))   return "#D97706";
  if (d.includes("private")) return "#059669";
  return "#2563EB";
};

const money = (n) => n ? `$${Number(n).toLocaleString("en-CA")}` : "—";

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function MapSearch() {
  // ── Refs ────────────────────────────────────────────────────────────
  const wrapperRef      = useRef(null); // outer div — ResizeObserver watches this
  const mapDivRef       = useRef(null); // the actual Leaflet container
  const mapRef          = useRef(null); // Leaflet map instance
  const leafletRef      = useRef(null);
  const markersRef      = useRef([]);
  const radiusLayerRef  = useRef(null);
  const drawLayerRef    = useRef(null);
  const drawStateRef    = useRef({ active: false, startLatLng: null, tempRect: null });
  const resizeObsRef    = useRef(null);

  // ── State ───────────────────────────────────────────────────────────
  const [listings,    setListings]    = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [view,        setView]        = useState("split");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapReady,    setMapReady]    = useState(false);

  const [pricePreset, setPricePreset] = useState(0);
  const [dealTypes,   setDealTypes]   = useState([]);
  const [propTypes,   setPropTypes]   = useState([]);
  const [minBeds,     setMinBeds]     = useState(0);

  const [userLat,      setUserLat]      = useState(null);
  const [userLng,      setUserLng]      = useState(null);
  const [radiusKm,     setRadiusKm]     = useState(10);
  const [radiusActive, setRadiusActive] = useState(false);
  const [drawMode,     setDrawMode]     = useState(false);
  const [drawnBounds,  setDrawnBounds]  = useState(null);
  const [locating,     setLocating]     = useState(false);

  // ── Load listings ───────────────────────────────────────────────────
  useEffect(() => {
    getAllListings().then((all) => {
      const withCoords = all.map((l) => {
        if (l.lat && l.lng) return l;
        const f = CITY_COORDS[l.city];
        if (!f) return null;
        return { ...l, lat: f.lat + (Math.random()-.5)*.012, lng: f.lng + (Math.random()-.5)*.018 };
      }).filter(Boolean);
      setListings(withCoords);
    });
  }, []);

  // ── Filter ──────────────────────────────────────────────────────────
  useEffect(() => {
    const preset = PRICE_PRESETS[pricePreset];
    let result = listings.filter((l) => {
      if (l.price < preset.min || l.price > preset.max) return false;
      if (dealTypes.length && !dealTypes.includes(l.dealType)) return false;
      if (propTypes.length && !propTypes.includes(l.propertyType)) return false;
      if (minBeds && l.bedrooms < minBeds) return false;
      return true;
    });
    if (radiusActive && userLat != null) {
      result = result.filter((l) => haversine(userLat, userLng, l.lat, l.lng) <= radiusKm);
    }
    if (drawnBounds && leafletRef.current) {
      result = result.filter((l) => drawnBounds.contains([l.lat, l.lng]));
    }
    setFiltered(result);
  }, [listings, pricePreset, dealTypes, propTypes, minBeds, radiusActive, userLat, userLng, radiusKm, drawnBounds]);

  // ── Init Leaflet + ResizeObserver ───────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      const Lf = L.default || L;
      leafletRef.current = Lf;

      delete Lf.Icon.Default.prototype._getIconUrl;
      Lf.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = Lf.map(mapDivRef.current, {
        center: [43.89, -78.93],
        zoom: 11,
        zoomControl: true,
      });

      Lf.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      // Use ResizeObserver on the wrapper to call invalidateSize
      // every time the container actually changes size
      if (window.ResizeObserver) {
        resizeObsRef.current = new ResizeObserver(() => {
          requestAnimationFrame(() => {
            map.invalidateSize();
          });
        });
        if (wrapperRef.current) {
          resizeObsRef.current.observe(wrapperRef.current);
        }
      }

      // Also call it after a delay as a fallback
      setTimeout(() => {
        map.invalidateSize();
        setMapReady(true);
      }, 200);
    });

    return () => {
      resizeObsRef.current?.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        leafletRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Re-invalidate when view changes (list↔split↔map resizes the container)
  useEffect(() => {
    if (!mapRef.current) return;
    // Small delay then invalidate — the DOM needs to repaint first
    const t = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 50);
    return () => clearTimeout(t);
  }, [view]);

  // ── Markers ─────────────────────────────────────────────────────────
  useEffect(() => {
    const Lf  = leafletRef.current;
    const map = mapRef.current;
    if (!Lf || !map || !mapReady) return;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    filtered.forEach((listing) => {
      const color      = getDealColor(listing.dealType);
      const isSelected = selected?.id === listing.id;

      const icon = Lf.divIcon({
        className: "",
        html: `<div style="background:${color};color:white;padding:${isSelected?"5px 10px":"4px 8px"};border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.3);border:${isSelected?"3px":"2px"} solid white;cursor:pointer;transform:${isSelected?"scale(1.1)":"scale(1)"};transition:all .15s;">$${Math.round(listing.price/1000)}K</div>`,
        iconAnchor: [30, 16],
      });

      const marker = Lf.marker([listing.lat, listing.lng], { icon })
        .addTo(map)
        .on("click", () => {
          setSelected((prev) => prev?.id === listing.id ? null : listing);
          map.panTo([listing.lat, listing.lng], { animate: true, duration: 0.4 });
        });
      markersRef.current.push(marker);
    });
  }, [filtered, mapReady, selected]);

  // ── Radius circle ────────────────────────────────────────────────────
  useEffect(() => {
    const Lf = leafletRef.current, map = mapRef.current;
    if (!Lf || !map || !mapReady) return;
    if (radiusLayerRef.current) { map.removeLayer(radiusLayerRef.current); radiusLayerRef.current = null; }
    if (radiusActive && userLat != null) {
      radiusLayerRef.current = Lf.circle([userLat, userLng], {
        radius: radiusKm*1000, color:"#2563EB", fillColor:"#2563EB", fillOpacity:0.07, weight:2,
      }).addTo(map);
      map.setView([userLat, userLng], 11, { animate: true });
    }
  }, [radiusActive, userLat, userLng, radiusKm, mapReady]);

  // ── Draw mode ────────────────────────────────────────────────────────
  useEffect(() => {
    const Lf = leafletRef.current, map = mapRef.current;
    if (!Lf || !map || !mapReady || !drawMode) return;
    const state = drawStateRef.current;
    state.active = true;
    map.getContainer().style.cursor = "crosshair";
    const onDown = (e) => { if (!state.active) return; state.startLatLng = e.latlng; map.dragging.disable(); };
    const onMove = (e) => {
      if (!state.active || !state.startLatLng) return;
      if (state.tempRect) map.removeLayer(state.tempRect);
      state.tempRect = Lf.rectangle(Lf.latLngBounds(state.startLatLng, e.latlng), { color:"#059669", fillOpacity:0.08, weight:2, dashArray:"6 4" }).addTo(map);
    };
    const onUp = (e) => {
      if (!state.active || !state.startLatLng) return;
      const bounds = Lf.latLngBounds(state.startLatLng, e.latlng);
      if (drawLayerRef.current) map.removeLayer(drawLayerRef.current);
      drawLayerRef.current = Lf.rectangle(bounds, { color:"#059669", fillOpacity:0.07, weight:2 }).addTo(map);
      setDrawnBounds(bounds); setDrawMode(false); state.startLatLng = null; map.dragging.enable();
    };
    map.on("mousedown", onDown); map.on("mousemove", onMove); map.on("mouseup", onUp);
    return () => {
      state.active = false;
      map.off("mousedown", onDown); map.off("mousemove", onMove); map.off("mouseup", onUp);
      map.getContainer().style.cursor = "";
      if (state.tempRect) { map.removeLayer(state.tempRect); state.tempRect = null; }
      map.dragging.enable();
    };
  }, [drawMode, mapReady]);

  // ── Helpers ──────────────────────────────────────────────────────────
  const locateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => { setUserLat(p.coords.latitude); setUserLng(p.coords.longitude); setRadiusActive(true); setLocating(false); },
      () => { setLocating(false); alert("Location access denied."); }
    );
  };
  const clearRadius = () => { setRadiusActive(false); setUserLat(null); setUserLng(null); };
  const clearDraw   = () => {
    if (drawLayerRef.current && mapRef.current) mapRef.current.removeLayer(drawLayerRef.current);
    drawLayerRef.current = null; setDrawnBounds(null);
  };
  const toggle = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  const clearFilters = () => { setPricePreset(0); setDealTypes([]); setPropTypes([]); setMinBeds(0); clearRadius(); clearDraw(); };
  const activeFilterCount = (pricePreset>0?1:0) + dealTypes.length + propTypes.length + (minBeds>0?1:0) + (radiusActive?1:0) + (drawnBounds?1:0);

  return (
    // The wrapper ref is what the ResizeObserver watches
    <div ref={wrapperRef} className="flex flex-col" style={{ height: "calc(100vh - 73px)", overflow: "hidden" }}>

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap shrink-0">
        <h1 className="font-bold text-gray-900 text-sm hidden sm:block">Map Search</h1>
        <span className="text-xs text-gray-400 shrink-0">{filtered.length} listings</span>

        <div className="flex items-center gap-2 ml-1 flex-wrap">
          <button onClick={locateMe} disabled={locating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${radiusActive?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <LocateFixed className="w-3.5 h-3.5" />
            {locating ? "Locating..." : radiusActive ? `Within ${radiusKm}km` : "Near Me"}
          </button>
          {radiusActive && (
            <>
              <input type="range" min={2} max={50} step={2} value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))} className="w-20 accent-blue-600" />
              <button onClick={clearRadius} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-3.5 h-3.5 text-gray-400" /></button>
            </>
          )}
          <button onClick={() => !drawMode && setDrawMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${drawMode?"bg-green-600 text-white":drawnBounds?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <PenTool className="w-3.5 h-3.5" />
            {drawMode ? "Drawing — drag on map" : drawnBounds ? "Boundary Active" : "Draw Area"}
          </button>
          {drawnBounds && <button onClick={clearDraw} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-3.5 h-3.5 text-gray-400" /></button>}
        </div>

        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-auto gap-0.5">
          {["List","Split","Map"].map((v) => (
            <button key={v} onClick={() => setView(v.toLowerCase())}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${view===v.toLowerCase()?"bg-white shadow text-gray-900":"text-gray-500 hover:text-gray-700"}`}>
              {v}
            </button>
          ))}
        </div>

        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFilterCount>0?"bg-blue-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount>0 && <span className="bg-white text-blue-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Filter drawer */}
        {sidebarOpen && (
          <>
            <div className="absolute inset-0 bg-black/20 z-20 sm:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-30 overflow-y-auto p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <div className="flex items-center gap-2">
                  {activeFilterCount>0 && <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear all</button>}
                  <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400" /></button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_PRESETS.map((p,i) => (
                    <button key={i} onClick={() => setPricePreset(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${pricePreset===i?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Bedrooms</label>
                <div className="flex gap-2">
                  {[0,1,2,3,4,5].map((n) => (
                    <button key={n} onClick={() => setMinBeds(n)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${minBeds===n?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {n===0?"Any":n===5?"5+":n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Type</label>
                <div className="space-y-2">
                  {DEAL_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={dealTypes.includes(t)} onChange={() => toggle(dealTypes,setDealTypes,t)} className="w-4 h-4 accent-blue-600" />
                      <span className="text-sm text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <div className="space-y-2">
                  {PROPERTY_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={propTypes.includes(t)} onChange={() => toggle(propTypes,setPropTypes,t)} className="w-4 h-4 accent-blue-600" />
                      <span className="text-sm text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pin Legend</label>
                {[{color:"#2563EB",label:"Seller-Finance"},{color:"#7C3AED",label:"Rent-to-Own"},{color:"#D97706",label:"Lease Option"},{color:"#059669",label:"Private Sale"}].map(({color,label}) => (
                  <div key={label} className="flex items-center gap-2 mb-1.5">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{background:color}} />
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* List panel */}
        {(view==="list"||view==="split") && (
          <div className={`${view==="split"?"w-72 lg:w-96 shrink-0":"flex-1"} overflow-y-auto bg-gray-50 border-r border-gray-200`}>
            {filtered.length===0 ? (
              <div className="text-center py-16 text-gray-400 px-6">
                <p className="font-medium mb-1">No listings found</p>
                <p className="text-sm">Try adjusting filters</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {filtered.map((listing) => (
                  <button key={listing.id}
                    onClick={() => {
                      setSelected((prev) => prev?.id===listing.id ? null : listing);
                      if (mapRef.current && listing.lat) mapRef.current.panTo([listing.lat,listing.lng],{animate:true,duration:0.4});
                    }}
                    className={`w-full text-left bg-white rounded-xl border-2 overflow-hidden hover:shadow-md transition-all ${selected?.id===listing.id?"border-blue-500 shadow-md":"border-transparent shadow-sm"}`}>
                    <div className="flex">
                      <div className="w-24 h-24 shrink-0 bg-gray-100 overflow-hidden">
                        {listing.image ? <img src={listing.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                      </div>
                      <div className="flex-1 p-3 min-w-0">
                        <p className="font-bold text-blue-600 text-sm">{money(listing.price)}</p>
                        <p className="text-xs font-medium text-gray-800 truncate mt-0.5">{listing.title}</p>
                        <p className="text-xs text-gray-400">{listing.city}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" />{listing.bedrooms}</span>
                          <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{listing.bathrooms}</span>
                          <span className="flex items-center gap-0.5"><Square className="w-3 h-3" />{listing.sqft?.toLocaleString()}</span>
                        </div>
                        <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{background:getDealColor(listing.dealType)}}>
                          {listing.dealType}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map panel — the div must have an explicit non-zero height */}
        {(view==="map"||view==="split") && (
          <div className="flex-1 relative overflow-hidden">
            {/* THE KEY FIX: 100% width and height fills the flex parent,
                which now has an explicit height from the outer wrapper */}
            <div
              ref={mapDivRef}
              style={{ width: "100%", height: "100%", minHeight: "400px" }}
            />

            {drawMode && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg pointer-events-none">
                Click and drag on the map to draw a search boundary
              </div>
            )}

            {selected && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <button onClick={() => setSelected(null)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center z-10 transition-colors">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                {selected.image && <img src={selected.image} alt="" className="w-full h-32 object-cover" />}
                <div className="p-4">
                  <p className="text-xl font-extrabold text-blue-600">{money(selected.price)}</p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5 truncate">{selected.title}</p>
                  <p className="text-xs text-gray-400 truncate">{selected.address}, {selected.city}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{selected.bedrooms} bed</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{selected.bathrooms} bath</span>
                    <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5" />{selected.sqft?.toLocaleString()} sqft</span>
                  </div>
                  <Link to={`/listings/${selected.id}`}
                    className="mt-3 w-full flex items-center justify-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                    View Full Listing →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// src/pages/MapSearch.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllListings } from "../lib/storage";
import { SlidersHorizontal, List, Map, X, Bed, Bath, Square, LocateFixed, PenTool } from "lucide-react";

const CITY_COORDS = {
  "Whitby":    { lat: 43.8975, lng: -78.9429 },
  "Oshawa":    { lat: 43.8971, lng: -78.8658 },
  "Ajax":      { lat: 43.8509, lng: -79.0204 },
  "Pickering": { lat: 43.8384, lng: -79.0868 },
  "Clarington":{ lat: 43.9351, lng: -78.6897 },
};

const DEAL_TYPES     = ["Seller-Finance", "Rent-to-Own", "Lease Option", "Private Sale"];
const PROPERTY_TYPES = ["Single-Family", "Townhouse", "Condo", "Multi-Unit"];

const PRICE_PRESETS = [
  { label: "Any",      min: 0,       max: 9999999 },
  { label: "<$500K",   min: 0,       max: 499999 },
  { label: "$500–750K",min: 500000,  max: 749999 },
  { label: "$750K–$1M",min: 750000,  max: 999999 },
  { label: "$1M+",     min: 1000000, max: 9999999 },
];

const getDealColor = (dt) => {
  if (!dt) return "#2563EB";
  if (dt.toLowerCase().includes("rent"))    return "#7C3AED";
  if (dt.toLowerCase().includes("lease"))   return "#D97706";
  if (dt.toLowerCase().includes("private")) return "#059669";
  return "#2563EB";
};

const money = (n) => n ? `$${Number(n).toLocaleString("en-CA")}` : "—";

// Haversine distance in km
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function MapSearch() {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const markersRef  = useRef([]);
  const leafletRef  = useRef(null);
  const radiusCircleRef = useRef(null);
  const drawnLayerRef   = useRef(null);

  const [listings, setListings]     = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [selected, setSelected]     = useState(null);
  const [view, setView]             = useState("split");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [pricePreset, setPricePreset] = useState(0);
  const [dealTypes, setDealTypes]     = useState([]);
  const [propTypes, setPropTypes]     = useState([]);
  const [minBeds, setMinBeds]         = useState(0);

  // Location tools
  const [userLat, setUserLat]         = useState(null);
  const [userLng, setUserLng]         = useState(null);
  const [radiusKm, setRadiusKm]       = useState(10);
  const [radiusActive, setRadiusActive] = useState(false);
  const [drawMode, setDrawMode]       = useState(false);
  const [drawnBounds, setDrawnBounds] = useState(null); // leaflet bounds
  const [locating, setLocating]       = useState(false);

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

  // Apply all filters
  useEffect(() => {
    const preset = PRICE_PRESETS[pricePreset];
    let result = listings.filter((l) => {
      if (l.price < preset.min || l.price > preset.max) return false;
      if (dealTypes.length && !dealTypes.includes(l.dealType)) return false;
      if (propTypes.length && !propTypes.includes(l.propertyType)) return false;
      if (minBeds && l.bedrooms < minBeds) return false;
      return true;
    });
    // Radius filter
    if (radiusActive && userLat && userLng) {
      result = result.filter((l) => haversine(userLat, userLng, l.lat, l.lng) <= radiusKm);
    }
    // Draw filter
    if (drawnBounds) {
      result = result.filter((l) => drawnBounds.contains([l.lat, l.lng]));
    }
    setFiltered(result);
  }, [listings, pricePreset, dealTypes, propTypes, minBeds, radiusActive, userLat, userLng, radiusKm, drawnBounds]);

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    import("leaflet").then((L) => {
      const Lf = L.default || L;
      leafletRef.current = Lf;
      delete Lf.Icon.Default.prototype._getIconUrl;
      Lf.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      mapInstance.current = Lf.map(mapRef.current, { center: [43.89, -78.93], zoom: 11 });
      Lf.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapInstance.current);
    });
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, []);

  // Update markers
  useEffect(() => {
    const Lf = leafletRef.current;
    const map = mapInstance.current;
    if (!Lf || !map) return;
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    filtered.forEach((listing) => {
      const color = getDealColor(listing.dealType);
      const icon = Lf.divIcon({
        className: "",
        html: `<div style="background:${color};color:white;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.3);border:2px solid white;cursor:pointer;">$${Math.round(listing.price/1000)}K</div>`,
        iconAnchor: [30, 16],
      });
      const marker = Lf.marker([listing.lat, listing.lng], { icon })
        .addTo(map)
        .on("click", () => setSelected(listing));
      markersRef.current.push(marker);
    });
  }, [filtered]);

  // Update radius circle on map
  useEffect(() => {
    const Lf = leafletRef.current;
    const map = mapInstance.current;
    if (!Lf || !map) return;
    if (radiusCircleRef.current) { map.removeLayer(radiusCircleRef.current); radiusCircleRef.current = null; }
    if (radiusActive && userLat && userLng) {
      radiusCircleRef.current = Lf.circle([userLat, userLng], {
        radius: radiusKm * 1000,
        color: "#2563EB", fillColor: "#2563EB", fillOpacity: 0.08, weight: 2,
      }).addTo(map);
      map.setView([userLat, userLng], 11, { animate: true });
    }
  }, [radiusActive, userLat, userLng, radiusKm]);

  // Enable draw mode
  useEffect(() => {
    const Lf = leafletRef.current;
    const map = mapInstance.current;
    if (!Lf || !map) return;
    if (!drawMode) return;

    // Simple click-to-draw rectangle using mousedown/mouseup
    let startLatLng = null;
    let rectLayer = null;

    const onMouseDown = (e) => {
      startLatLng = e.latlng;
      map.dragging.disable();
    };
    const onMouseMove = (e) => {
      if (!startLatLng) return;
      if (rectLayer) map.removeLayer(rectLayer);
      const bounds = Lf.latLngBounds(startLatLng, e.latlng);
      rectLayer = Lf.rectangle(bounds, { color: "#059669", fillOpacity: 0.1, weight: 2, dashArray: "6 4" }).addTo(map);
    };
    const onMouseUp = (e) => {
      if (!startLatLng) return;
      const bounds = Lf.latLngBounds(startLatLng, e.latlng);
      if (drawnLayerRef.current) map.removeLayer(drawnLayerRef.current);
      drawnLayerRef.current = Lf.rectangle(bounds, { color: "#059669", fillOpacity: 0.08, weight: 2 }).addTo(map);
      setDrawnBounds(bounds);
      setDrawMode(false);
      startLatLng = null;
      map.dragging.enable();
    };

    map.on("mousedown", onMouseDown);
    map.on("mousemove", onMouseMove);
    map.on("mouseup", onMouseUp);
    map.getContainer().style.cursor = "crosshair";

    return () => {
      map.off("mousedown", onMouseDown);
      map.off("mousemove", onMouseMove);
      map.off("mouseup", onMouseUp);
      map.getContainer().style.cursor = "";
      if (rectLayer) map.removeLayer(rectLayer);
    };
  }, [drawMode]);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setRadiusActive(true);
        setLocating(false);
      },
      () => { setLocating(false); alert("Could not get your location. Please allow location access."); }
    );
  };

  const clearDraw = () => {
    if (drawnLayerRef.current && mapInstance.current) mapInstance.current.removeLayer(drawnLayerRef.current);
    drawnLayerRef.current = null;
    setDrawnBounds(null);
  };

  const clearRadius = () => {
    setRadiusActive(false);
    setUserLat(null); setUserLng(null);
  };

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const activeFilterCount = (pricePreset > 0 ? 1 : 0) + dealTypes.length + propTypes.length + (minBeds > 0 ? 1 : 0) + (radiusActive ? 1 : 0) + (drawnBounds ? 1 : 0);

  return (
    <div className="h-[calc(100vh-73px)] flex flex-col overflow-hidden">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-2 z-10 flex-wrap">
        <h1 className="font-bold text-gray-900 text-sm hidden sm:block">Map Search</h1>
        <span className="text-xs text-gray-400">{filtered.length} listings</span>

        {/* Location tools */}
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={locateMe}
            disabled={locating}
            title="Search from my location"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              radiusActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <LocateFixed className="w-3.5 h-3.5" />
            {locating ? "Locating..." : radiusActive ? `Within ${radiusKm}km` : "Near Me"}
          </button>
          {radiusActive && (
            <>
              <input type="range" min={2} max={50} step={2} value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-20 accent-blue-600" title="Radius in km" />
              <button onClick={clearRadius} className="p-1 hover:bg-gray-100 rounded"><X className="w-3.5 h-3.5 text-gray-400" /></button>
            </>
          )}

          <button
            onClick={() => { setDrawMode(!drawMode); }}
            title="Draw a search boundary"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              drawMode ? "bg-green-600 text-white" : drawnBounds ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            {drawMode ? "Drawing... (drag to draw)" : drawnBounds ? "Boundary Active" : "Draw Area"}
          </button>
          {drawnBounds && (
            <button onClick={clearDraw} className="p-1 hover:bg-gray-100 rounded"><X className="w-3.5 h-3.5 text-gray-400" /></button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 ml-auto gap-1">
          {[
            { id: "list",  label: "List" },
            { id: "split", label: "Split" },
            { id: "map",   label: "Map" },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setView(id)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${view === id ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Filter button */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilterCount > 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-white text-blue-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Filter drawer */}
        {sidebarOpen && (
          <>
            <div className="absolute inset-0 bg-black/20 z-20 sm:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-30 overflow-y-auto p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button onClick={() => { setPricePreset(0); setDealTypes([]); setPropTypes([]); setMinBeds(0); clearRadius(); clearDraw(); }}
                      className="text-xs text-blue-600 hover:underline">Clear all</button>
                  )}
                  <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400" /></button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_PRESETS.map((p, i) => (
                    <button key={i} onClick={() => setPricePreset(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${pricePreset === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
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
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${minBeds === n ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {n === 0 ? "Any" : n === 5 ? "5+" : n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Type</label>
                <div className="space-y-2">
                  {DEAL_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={dealTypes.includes(t)} onChange={() => toggle(dealTypes, setDealTypes, t)} className="w-4 h-4 accent-blue-600" />
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
                      <input type="checkbox" checked={propTypes.includes(t)} onChange={() => toggle(propTypes, setPropTypes, t)} className="w-4 h-4 accent-blue-600" />
                      <span className="text-sm text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pin Colors</label>
                {[
                  { color: "#2563EB", label: "Seller-Finance" },
                  { color: "#7C3AED", label: "Rent-to-Own" },
                  { color: "#D97706", label: "Lease Option" },
                  { color: "#059669", label: "Private Sale" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2 mb-1.5">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* List panel */}
        {(view === "list" || view === "split") && (
          <div className={`${view === "split" ? "w-full sm:w-80 lg:w-96" : "flex-1"} overflow-y-auto bg-gray-50 border-r border-gray-200`}>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400 px-6">
                <p className="font-medium mb-1">No listings found</p>
                <p className="text-sm">Try adjusting filters or removing boundaries</p>
              </div>
            ) : (
              <div className="p-3 space-y-3">
                {filtered.map((listing) => (
                  <button key={listing.id} onClick={() => {
                    setSelected(listing);
                    if (mapInstance.current && listing.lat) mapInstance.current.setView([listing.lat, listing.lng], 14, { animate: true });
                  }}
                    className={`w-full text-left bg-white rounded-xl border-2 overflow-hidden hover:shadow-md transition-all ${selected?.id === listing.id ? "border-blue-500 shadow-md" : "border-transparent shadow-sm"}`}>
                    <div className="flex">
                      <div className="w-24 h-24 shrink-0 bg-gray-100 overflow-hidden">
                        {listing.image ? <img src={listing.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                      </div>
                      <div className="flex-1 p-3 min-w-0">
                        <p className="font-bold text-blue-600 text-sm">{money(listing.price)}</p>
                        <p className="text-xs font-medium text-gray-800 truncate mt-0.5">{listing.title}</p>
                        <p className="text-xs text-gray-400">{listing.city}</p>
                        <div className="flex items-center gap-2.5 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{listing.bedrooms}</span>
                          <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{listing.bathrooms}</span>
                          <span className="flex items-center gap-1"><Square className="w-3 h-3" />{listing.sqft?.toLocaleString()}</span>
                        </div>
                        <div className="mt-1.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: getDealColor(listing.dealType) }}>
                            {listing.dealType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map */}
        {(view === "map" || view === "split") && (
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full" />

            {/* Draw mode hint */}
            {drawMode && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
                Click and drag to draw a search boundary
              </div>
            )}

            {/* Selected popup */}
            {selected && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <button onClick={() => setSelected(null)}
                  className="absolute top-2 right-2 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center z-10">
                  <X className="w-3.5 h-3.5 text-gray-600" />
                </button>
                {selected.image && <img src={selected.image} alt="" className="w-full h-36 object-cover" />}
                <div className="p-4">
                  <p className="text-xl font-extrabold text-blue-600">{money(selected.price)}</p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">{selected.title}</p>
                  <p className="text-xs text-gray-400">{selected.address}, {selected.city}</p>
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

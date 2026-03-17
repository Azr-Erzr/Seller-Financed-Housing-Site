// src/pages/business/BusinessMapSearch.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCommListings } from "../../lib/commercial-storage";
import { SlidersHorizontal, X, Ruler, LocateFixed, PenTool } from "lucide-react";
import { PROPERTY_CATEGORIES, ZONING_TYPES } from "../../data/commercial-seed";

const CITY_COORDS = {
  "Whitby":        { lat: 43.8975, lng: -78.9429 },
  "Oshawa":        { lat: 43.8971, lng: -78.8658 },
  "Ajax":          { lat: 43.8509, lng: -79.0204 },
  "Clarington":    { lat: 43.9351, lng: -78.6897 },
  "Kawartha Lakes":{ lat: 44.3595, lng: -78.7452 },
  "Brampton":      { lat: 43.7315, lng: -79.7624 },
  "Toronto":       { lat: 43.6532, lng: -79.3832 },
};

const DEAL_TYPES = ["Seller-Finance", "Rent-to-Own", "Lease Option", "Private Sale"];

const PRICE_PRESETS = [
  { label: "Any",     min: 0,        max: 99999999 },
  { label: "<$500K",  min: 0,        max: 499999   },
  { label: "$500K–$1M",min: 500000,  max: 999999   },
  { label: "$1M–$3M", min: 1000000, max: 2999999   },
  { label: "$3M+",    min: 3000000, max: 99999999  },
];

const getCategoryColor = (cat) => {
  if (!cat) return "#059669";
  if (cat.includes("Farm") || cat.includes("Agri")) return "#16a34a";
  if (cat.includes("Development"))  return "#d97706";
  if (cat.includes("Commercial"))   return "#2563eb";
  if (cat.includes("Industrial"))   return "#475569";
  if (cat.includes("Waterfront"))   return "#0891b2";
  if (cat.includes("Vacant"))       return "#84cc16";
  if (cat.includes("Multi"))        return "#7c3aed";
  return "#059669";
};

const money = (n) => n ? `$${Number(n).toLocaleString("en-CA")}` : "—";

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function BusinessMapSearch() {
  const mapRef         = useRef(null);
  const mapInstance    = useRef(null);
  const leafletRef     = useRef(null);
  const markersRef     = useRef([]);
  const radiusLayerRef = useRef(null);
  const drawLayerRef   = useRef(null);
  const drawStateRef   = useRef({ active: false, startLatLng: null, tempRect: null });

  const [listings,    setListings]    = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [view,        setView]        = useState("split");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapReady,    setMapReady]    = useState(false);

  const [pricePreset, setPricePreset] = useState(0);
  const [categories,  setCategories]  = useState([]);
  const [dealTypes,   setDealTypes]   = useState([]);
  const [minAcreage,  setMinAcreage]  = useState("");

  const [userLat,      setUserLat]      = useState(null);
  const [userLng,      setUserLng]      = useState(null);
  const [radiusKm,     setRadiusKm]     = useState(25);
  const [radiusActive, setRadiusActive] = useState(false);
  const [drawMode,     setDrawMode]     = useState(false);
  const [drawnBounds,  setDrawnBounds]  = useState(null);
  const [locating,     setLocating]     = useState(false);

  useEffect(() => {
    getAllCommListings().then((all) => {
      const withCoords = all.map((l) => {
        if (l.lat && l.lng) return l;
        const f = CITY_COORDS[l.city] || CITY_COORDS["Oshawa"];
        return { ...l, lat: f.lat + (Math.random() - 0.5) * 0.08, lng: f.lng + (Math.random() - 0.5) * 0.12 };
      });
      setListings(withCoords);
    });
  }, []);

  useEffect(() => {
    const preset = PRICE_PRESETS[pricePreset];
    let result = listings.filter((l) => {
      if (l.price < preset.min || l.price > preset.max) return false;
      if (categories.length && !categories.includes(l.propertyCategory)) return false;
      if (dealTypes.length && !dealTypes.includes(l.dealType)) return false;
      if (minAcreage && l.acreage < Number(minAcreage)) return false;
      return true;
    });
    if (radiusActive && userLat != null && userLng != null) {
      result = result.filter((l) => haversine(userLat, userLng, l.lat, l.lng) <= radiusKm);
    }
    if (drawnBounds && leafletRef.current) {
      result = result.filter((l) => drawnBounds.contains([l.lat, l.lng]));
    }
    setFiltered(result);
  }, [listings, pricePreset, categories, dealTypes, minAcreage, radiusActive, userLat, userLng, radiusKm, drawnBounds]);

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
      const map = Lf.map(mapRef.current, { center: [43.89, -78.93], zoom: 9 });
      Lf.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      mapInstance.current = map;
      setTimeout(() => { map.invalidateSize(); setMapReady(true); }, 150);
    });
    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; leafletRef.current = null; setMapReady(false); }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    setTimeout(() => mapInstance.current?.invalidateSize(), 100);
  }, [view]);

  // Update markers
  useEffect(() => {
    const Lf = leafletRef.current, map = mapInstance.current;
    if (!Lf || !map || !mapReady) return;
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    filtered.forEach((listing) => {
      const color = getCategoryColor(listing.propertyCategory);
      const isSelected = selected?.id === listing.id;
      const icon = Lf.divIcon({
        className: "",
        html: `<div style="background:${color};color:white;padding:${isSelected ? "5px 10px" : "4px 8px"};border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.3);border:${isSelected ? "3px" : "2px"} solid white;cursor:pointer;">$${Math.round(listing.price / 1000)}K</div>`,
        iconAnchor: [30, 16],
      });
      const marker = Lf.marker([listing.lat, listing.lng], { icon })
        .addTo(map)
        .on("click", () => { setSelected(listing); map.panTo([listing.lat, listing.lng], { animate: true }); });
      markersRef.current.push(marker);
    });
  }, [filtered, mapReady, selected]);

  // Radius
  useEffect(() => {
    const Lf = leafletRef.current, map = mapInstance.current;
    if (!Lf || !map || !mapReady) return;
    if (radiusLayerRef.current) { map.removeLayer(radiusLayerRef.current); radiusLayerRef.current = null; }
    if (radiusActive && userLat != null && userLng != null) {
      radiusLayerRef.current = Lf.circle([userLat, userLng], {
        radius: radiusKm * 1000, color: "#059669", fillColor: "#059669", fillOpacity: 0.07, weight: 2,
      }).addTo(map);
      map.setView([userLat, userLng], 9, { animate: true });
    }
  }, [radiusActive, userLat, userLng, radiusKm, mapReady]);

  // Draw
  useEffect(() => {
    const Lf = leafletRef.current, map = mapInstance.current;
    if (!Lf || !map || !mapReady || !drawMode) return;
    const state = drawStateRef.current;
    state.active = true;
    map.getContainer().style.cursor = "crosshair";
    const onDown = (e) => { if (!state.active) return; state.startLatLng = e.latlng; map.dragging.disable(); };
    const onMove = (e) => {
      if (!state.active || !state.startLatLng) return;
      if (state.tempRect) map.removeLayer(state.tempRect);
      state.tempRect = Lf.rectangle(Lf.latLngBounds(state.startLatLng, e.latlng), { color: "#059669", fillOpacity: 0.08, weight: 2, dashArray: "6 4" }).addTo(map);
    };
    const onUp = (e) => {
      if (!state.active || !state.startLatLng) return;
      const bounds = Lf.latLngBounds(state.startLatLng, e.latlng);
      if (drawLayerRef.current) map.removeLayer(drawLayerRef.current);
      drawLayerRef.current = Lf.rectangle(bounds, { color: "#059669", fillOpacity: 0.07, weight: 2 }).addTo(map);
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
    if (drawLayerRef.current && mapInstance.current) mapInstance.current.removeLayer(drawLayerRef.current);
    drawLayerRef.current = null; setDrawnBounds(null);
  };
  const toggle = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  const clearFilters = () => { setPricePreset(0); setCategories([]); setDealTypes([]); setMinAcreage(""); clearRadius(); clearDraw(); };

  const activeFilterCount = (pricePreset > 0 ? 1 : 0) + categories.length + dealTypes.length + (minAcreage ? 1 : 0) + (radiusActive ? 1 : 0) + (drawnBounds ? 1 : 0);
  const mapHeight = "calc(100vh - 73px - 48px)";

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 73px)" }}>

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap shrink-0" style={{ height: 48 }}>
        <h1 className="font-bold text-gray-900 text-sm hidden sm:block">Property Map</h1>
        <span className="text-xs text-gray-400 shrink-0">{filtered.length} properties</span>

        <div className="flex items-center gap-2 ml-1">
          <button onClick={locateMe} disabled={locating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${radiusActive ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <LocateFixed className="w-3.5 h-3.5" />
            {locating ? "Locating..." : radiusActive ? `Within ${radiusKm}km` : "Near Me"}
          </button>
          {radiusActive && (
            <>
              <input type="range" min={5} max={200} step={5} value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))} className="w-20 accent-emerald-600" />
              <button onClick={clearRadius} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-3.5 h-3.5 text-gray-400" /></button>
            </>
          )}
          <button onClick={() => !drawMode && setDrawMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${drawMode ? "bg-emerald-600 text-white" : drawnBounds ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <PenTool className="w-3.5 h-3.5" />
            {drawMode ? "Drawing..." : drawnBounds ? "Boundary Active" : "Draw Area"}
          </button>
          {drawnBounds && <button onClick={clearDraw} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-3.5 h-3.5 text-gray-400" /></button>}
        </div>

        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-auto gap-0.5">
          {["List","Split","Map"].map((v) => (
            <button key={v} onClick={() => setView(v.toLowerCase())}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${view === v.toLowerCase() ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {v}
            </button>
          ))}
        </div>

        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFilterCount > 0 ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFilterCount > 0 && <span className="bg-white text-emerald-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* Filter drawer */}
        {sidebarOpen && (
          <>
            <div className="absolute inset-0 bg-black/20 z-20 sm:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-30 overflow-y-auto p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && <button onClick={clearFilters} className="text-xs text-emerald-600 hover:underline">Clear all</button>}
                  <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400" /></button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_PRESETS.map((p, i) => (
                    <button key={i} onClick={() => setPricePreset(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${pricePreset === i ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Acreage</label>
                <input type="number" placeholder="e.g. 10" value={minAcreage} onChange={(e) => setMinAcreage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Category</label>
                <div className="space-y-2">
                  {PROPERTY_CATEGORIES.map((c) => (
                    <label key={c} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={categories.includes(c)} onChange={() => toggle(categories, setCategories, c)} className="w-4 h-4 accent-emerald-600" />
                      <span className="text-sm text-gray-600">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Type</label>
                <div className="space-y-2">
                  {DEAL_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={dealTypes.includes(t)} onChange={() => toggle(dealTypes, setDealTypes, t)} className="w-4 h-4 accent-emerald-600" />
                      <span className="text-sm text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* List panel */}
        {(view === "list" || view === "split") && (
          <div className={`${view === "split" ? "w-72 lg:w-96 shrink-0" : "flex-1"} overflow-y-auto bg-gray-50 border-r border-gray-200`}>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400 px-6">
                <p className="font-medium mb-1">No properties found</p>
                <p className="text-sm">Try adjusting filters or removing boundaries</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {filtered.map((listing) => (
                  <button key={listing.id}
                    onClick={() => {
                      setSelected((prev) => prev?.id === listing.id ? null : listing);
                      if (mapInstance.current && listing.lat) mapInstance.current.panTo([listing.lat, listing.lng], { animate: true });
                    }}
                    className={`w-full text-left bg-white rounded-xl border-2 overflow-hidden hover:shadow-md transition-all ${selected?.id === listing.id ? "border-emerald-500 shadow-md" : "border-transparent shadow-sm"}`}>
                    <div className="flex">
                      <div className="w-24 h-24 shrink-0 bg-emerald-50 overflow-hidden">
                        {listing.image ? <img src={listing.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-2xl">🌿</div>}
                      </div>
                      <div className="flex-1 p-3 min-w-0">
                        <p className="font-bold text-emerald-700 text-sm">{money(listing.price)}</p>
                        <p className="text-xs font-medium text-gray-800 truncate mt-0.5">{listing.title}</p>
                        <p className="text-xs text-gray-400">{listing.city}</p>
                        {listing.acreage && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Ruler className="w-3 h-3" /> {listing.acreage} acres
                          </p>
                        )}
                        <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                          style={{ background: getCategoryColor(listing.propertyCategory) }}>
                          {listing.propertyCategory || listing.dealType}
                        </span>
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
          <div className="flex-1 relative overflow-hidden">
            <div ref={mapRef} style={{ width: "100%", height: mapHeight, minHeight: 400 }} />
            {drawMode && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg pointer-events-none">
                Click and drag to draw a search boundary
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
                  <p className="text-xl font-extrabold text-emerald-700">{money(selected.price)}</p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5 truncate">{selected.title}</p>
                  <p className="text-xs text-gray-400 truncate">{selected.address}, {selected.city}</p>
                  {selected.acreage && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Ruler className="w-3 h-3" />{selected.acreage} acres · {selected.zoning}</p>}
                  <Link to={`/business/listings/${selected.id}`}
                    className="mt-3 w-full flex items-center justify-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors">
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

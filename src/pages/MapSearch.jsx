// src/pages/MapSearch.jsx
// MapLibre GL JS — editable radius, freeform polygon draw, viewport filtering.

import maplibregl from "maplibre-gl";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllListings } from "../lib/storage";
import { SlidersHorizontal, X, Bed, Bath, Square, LocateFixed, PenTool } from "lucide-react";

const NAVBAR_HEIGHT = 73;

const MAP_STYLE = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: '© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    },
  },
  layers: [{ id: "carto", type: "raster", source: "carto" }],
};

const CITY_COORDS = {
  "Whitby":     { lat: 43.8975, lng: -78.9429 },
  "Oshawa":     { lat: 43.8971, lng: -78.8658 },
  "Ajax":       { lat: 43.8509, lng: -79.0204 },
  "Pickering":  { lat: 43.8384, lng: -79.0868 },
  "Clarington": { lat: 43.9351, lng: -78.6897 },
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

function geoCircle(centerLng, centerLat, radiusKm) {
  const coords = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * 2 * Math.PI;
    const dx = radiusKm / (111.32 * Math.cos(centerLat * Math.PI / 180));
    const dy = radiusKm / 110.574;
    coords.push([centerLng + dx * Math.cos(angle), centerLat + dy * Math.sin(angle)]);
  }
  return { type: "Feature", geometry: { type: "Polygon", coordinates: [coords] } };
}

// Point-in-polygon (ray casting)
function pointInPolygon(lng, lat, polygon) {
  const coords = polygon[0]; // outer ring
  let inside = false;
  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const xi = coords[i][0], yi = coords[i][1];
    const xj = coords[j][0], yj = coords[j][1];
    if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

// ── Editable Radius Input ─────────────────────────────────────────────
function RadiusInput({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef(null);

  useEffect(() => { setDraft(String(value)); }, [value]);
  useEffect(() => { if (editing && inputRef.current) inputRef.current.select(); }, [editing]);

  const commit = () => {
    const n = Math.max(1, Math.min(200, Number(draft) || value));
    onChange(n);
    setDraft(String(n));
    setEditing(false);
  };

  if (editing) {
    return (
      <input ref={inputRef} type="number" min={1} max={200} value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
        className="w-14 px-1.5 py-0.5 text-xs font-bold text-center border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
    );
  }

  return (
    <button onClick={() => setEditing(true)}
      className="text-xs font-bold text-white underline decoration-dotted underline-offset-2 hover:decoration-solid cursor-text"
      title="Click to type a distance">
      {value}km
    </button>
  );
}

export default function MapSearch() {
  const mapDivRef  = useRef(null);
  const mapRef     = useRef(null);
  const markersRef = useRef([]);
  const topBarRef  = useRef(null);

  const [listings,     setListings]     = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [view,         setView]         = useState("split");
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [mapReady,     setMapReady]     = useState(false);
  const [topBarH,      setTopBarH]      = useState(40);

  const [pricePreset,  setPricePreset]  = useState(0);
  const [dealTypes,    setDealTypes]    = useState([]);
  const [propTypes,    setPropTypes]    = useState([]);
  const [minBeds,      setMinBeds]      = useState(0);
  const [userLat,      setUserLat]      = useState(null);
  const [userLng,      setUserLng]      = useState(null);
  const [radiusKm,     setRadiusKm]     = useState(10);
  const [radiusActive, setRadiusActive] = useState(false);
  const [drawMode,     setDrawMode]     = useState(false);
  const [drawnPoly,    setDrawnPoly]    = useState(null); // [[lng,lat], ...] closed polygon
  const [locating,     setLocating]     = useState(false);
  const [mapBounds,    setMapBounds]    = useState(null); // { sw: [lng,lat], ne: [lng,lat] }

  // Freeform draw state
  const drawPoints = useRef([]);

  // Load listings
  useEffect(() => {
    getAllListings().then((all) => {
      setListings(all.map((l) => {
        if (l.lat && l.lng) return l;
        const f = CITY_COORDS[l.city];
        if (!f) return null;
        return { ...l, lat: f.lat + (Math.random() - .5) * .012, lng: f.lng + (Math.random() - .5) * .018 };
      }).filter(Boolean));
    });
  }, []);

  // Apply filters (including viewport bounds)
  useEffect(() => {
    const p = PRICE_PRESETS[pricePreset];
    let r = listings.filter((l) => {
      if (l.price < p.min || l.price > p.max) return false;
      if (dealTypes.length && !dealTypes.includes(l.dealType)) return false;
      if (propTypes.length && !propTypes.includes(l.propertyType)) return false;
      if (minBeds && l.bedrooms < minBeds) return false;
      return true;
    });
    if (radiusActive && userLat != null)
      r = r.filter((l) => haversine(userLat, userLng, l.lat, l.lng) <= radiusKm);
    if (drawnPoly && drawnPoly.length >= 3) {
      const ring = [...drawnPoly, drawnPoly[0]]; // close the ring
      r = r.filter((l) => pointInPolygon(l.lng, l.lat, [ring]));
    }
    // Viewport filtering — only show listings visible on current map view
    if (mapBounds && !radiusActive && !drawnPoly) {
      const { sw, ne } = mapBounds;
      r = r.filter((l) => l.lng >= sw[0] && l.lng <= ne[0] && l.lat >= sw[1] && l.lat <= ne[1]);
    }
    setFiltered(r);
  }, [listings, pricePreset, dealTypes, propTypes, minBeds, radiusActive, userLat, userLng, radiusKm, drawnPoly, mapBounds]);

  // Measure top bar
  useEffect(() => {
    if (topBarRef.current) setTopBarH(topBarRef.current.offsetHeight);
  }, []);

  // Update map bounds on move
  const handleMapMove = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const b = map.getBounds();
    setMapBounds({
      sw: [b.getWest(), b.getSouth()],
      ne: [b.getEast(), b.getNorth()],
    });
  }, []);

  // ── Init MapLibre ──────────────────────────────────────────────────
  useEffect(() => {
    if (view === "list") return;
    if (mapRef.current) return;
    if (!mapDivRef.current) return;

    const map = new maplibregl.Map({
      container: mapDivRef.current,
      style: MAP_STYLE,
      center: [-78.93, 43.89],
      zoom: 10.5,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      // Radius circle source
      map.addSource("radius-circle", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      map.addLayer({ id: "radius-fill", type: "fill", source: "radius-circle", paint: { "fill-color": "#2563EB", "fill-opacity": 0.07 } });
      map.addLayer({ id: "radius-line", type: "line", source: "radius-circle", paint: { "line-color": "#2563EB", "line-width": 2 } });

      // Freeform polygon source
      map.addSource("draw-poly", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      map.addLayer({ id: "draw-fill", type: "fill", source: "draw-poly", paint: { "fill-color": "#059669", "fill-opacity": 0.08 } });
      map.addLayer({ id: "draw-line", type: "line", source: "draw-poly", paint: { "line-color": "#059669", "line-width": 2.5 } });

      // Draw points source (small circles at each click)
      map.addSource("draw-points", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      map.addLayer({ id: "draw-dots", type: "circle", source: "draw-points", paint: { "circle-radius": 5, "circle-color": "#059669", "circle-stroke-color": "#fff", "circle-stroke-width": 2 } });

      setMapReady(true);

      // Initial bounds
      const b = map.getBounds();
      setMapBounds({ sw: [b.getWest(), b.getSouth()], ne: [b.getEast(), b.getNorth()] });
    });

    // Update bounds on pan/zoom
    map.on("moveend", () => {
      const b = map.getBounds();
      setMapBounds({ sw: [b.getWest(), b.getSouth()], ne: [b.getEast(), b.getNorth()] });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [view]);

  // Resize on view toggle
  useEffect(() => {
    if (mapRef.current) setTimeout(() => { mapRef.current?.resize(); handleMapMove(); }, 50);
  }, [view, mapReady, handleMapMove]);

  // ── Update markers ─────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filtered.forEach((listing) => {
      const color = getDealColor(listing.dealType);
      const isSel = selected?.id === listing.id;
      const el = document.createElement("div");
      el.style.cssText = `background:${color};color:white;padding:${isSel ? "5px 10px" : "4px 8px"};border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.3);border:${isSel ? "3px" : "2px"} solid white;cursor:pointer;transform:translate(-50%,-50%);`;
      el.textContent = `$${Math.round(listing.price / 1000)}K`;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelected((p) => p?.id === listing.id ? null : listing);
        mapRef.current?.flyTo({ center: [listing.lng, listing.lat], duration: 600 });
      });
      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([listing.lng, listing.lat])
        .addTo(mapRef.current);
      markersRef.current.push(marker);
    });
  }, [filtered, mapReady, selected]);

  // ── Radius circle ──────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const src = map.getSource("radius-circle");
    if (!src) return;
    if (radiusActive && userLat != null) {
      src.setData({ type: "FeatureCollection", features: [geoCircle(userLng, userLat, radiusKm)] });
      map.flyTo({ center: [userLng, userLat], zoom: 11, duration: 800 });
    } else {
      src.setData({ type: "FeatureCollection", features: [] });
    }
  }, [radiusActive, userLat, userLng, radiusKm, mapReady]);

  // ── Freeform polygon draw mode ─────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !drawMode) return;

    const canvas = map.getCanvasContainer();
    canvas.style.cursor = "crosshair";
    drawPoints.current = [];

    const updatePreview = () => {
      const pts = drawPoints.current;
      // Update dots
      map.getSource("draw-points")?.setData({
        type: "FeatureCollection",
        features: pts.map((p) => ({ type: "Feature", geometry: { type: "Point", coordinates: p } })),
      });
      // Update polygon preview (need at least 2 points for a line, 3 for polygon)
      if (pts.length >= 2) {
        const ring = [...pts, pts[0]]; // close it for preview
        map.getSource("draw-poly")?.setData({
          type: "FeatureCollection",
          features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [ring] } }],
        });
      }
    };

    const onClick = (e) => {
      drawPoints.current.push([e.lngLat.lng, e.lngLat.lat]);
      updatePreview();
    };

    const onDblClick = (e) => {
      e.preventDefault();
      const pts = drawPoints.current;
      if (pts.length >= 3) {
        setDrawnPoly([...pts]);
        // Final polygon display
        const ring = [...pts, pts[0]];
        map.getSource("draw-poly")?.setData({
          type: "FeatureCollection",
          features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [ring] } }],
        });
      }
      drawPoints.current = [];
      map.getSource("draw-points")?.setData({ type: "FeatureCollection", features: [] });
      setDrawMode(false);
    };

    map.on("click", onClick);
    map.on("dblclick", onDblClick);
    map.doubleClickZoom.disable();

    return () => {
      canvas.style.cursor = "";
      map.off("click", onClick);
      map.off("dblclick", onDblClick);
      map.doubleClickZoom.enable();
      drawPoints.current = [];
      map.getSource("draw-points")?.setData({ type: "FeatureCollection", features: [] });
    };
  }, [drawMode, mapReady]);

  // ── Helpers ────────────────────────────────────────────────────────
  const locateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => { setUserLat(p.coords.latitude); setUserLng(p.coords.longitude); setRadiusActive(true); setLocating(false); },
      () => { setLocating(false); alert("Location access denied."); }
    );
  };
  const clearRadius = () => { setRadiusActive(false); setUserLat(null); setUserLng(null); };
  const clearDraw = () => {
    mapRef.current?.getSource("draw-poly")?.setData({ type: "FeatureCollection", features: [] });
    mapRef.current?.getSource("draw-points")?.setData({ type: "FeatureCollection", features: [] });
    setDrawnPoly(null);
  };
  const toggle   = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  const clearAll = () => { setPricePreset(0); setDealTypes([]); setPropTypes([]); setMinBeds(0); clearRadius(); clearDraw(); };
  const activeN  = (pricePreset > 0 ? 1 : 0) + dealTypes.length + propTypes.length + (minBeds > 0 ? 1 : 0) + (radiusActive ? 1 : 0) + (drawnPoly ? 1 : 0);
  const mapAreaH = `calc(100vh - ${NAVBAR_HEIGHT}px - ${topBarH}px)`;

  return (
    <div style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)`, overflow: "hidden", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div ref={topBarRef} className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap shrink-0">
        <h1 className="font-bold text-gray-900 text-sm hidden sm:block">Map Search</h1>
        <span className="text-xs text-gray-400 shrink-0">{filtered.length} listings</span>

        <div className="flex items-center gap-2 ml-1 flex-wrap">
          <button onClick={locateMe} disabled={locating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${radiusActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <LocateFixed className="w-3.5 h-3.5" />
            {locating ? "Locating..." : radiusActive ? (<>Within <RadiusInput value={radiusKm} onChange={setRadiusKm} /></>) : "Near Me"}
          </button>
          {radiusActive && (
            <>
              <input type="range" min={1} max={100} step={1} value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))} className="w-24 accent-blue-600" />
              <button onClick={clearRadius} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-3.5 h-3.5 text-gray-400" /></button>
            </>
          )}
          <button onClick={() => { if (!drawMode) { clearDraw(); setDrawMode(true); } }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${drawMode ? "bg-green-600 text-white" : drawnPoly ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <PenTool className="w-3.5 h-3.5" />
            {drawMode ? "Click to add points, double-click to finish" : drawnPoly ? "Boundary Active" : "Draw Area"}
          </button>
          {drawnPoly && <button onClick={clearDraw} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-3.5 h-3.5 text-gray-400" /></button>}
        </div>

        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-auto gap-0.5">
          {["List", "Split", "Map"].map((v) => (
            <button key={v} onClick={() => setView(v.toLowerCase())}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${view === v.toLowerCase() ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {v}
            </button>
          ))}
        </div>

        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeN > 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeN > 0 && <span className="bg-white text-blue-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeN}</span>}
        </button>
      </div>

      {/* Main layout */}
      <div style={{ position: "relative", height: mapAreaH }}>

        {/* Filter drawer */}
        {sidebarOpen && (
          <>
            <div className="absolute inset-0 bg-black/20 z-20 sm:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-30 overflow-y-auto p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <div className="flex items-center gap-2">
                  {activeN > 0 && <button onClick={clearAll} className="text-xs text-blue-600 hover:underline">Clear all</button>}
                  <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400" /></button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_PRESETS.map((p, i) => (
                    <button key={i} onClick={() => setPricePreset(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${pricePreset === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Bedrooms</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setMinBeds(n)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${minBeds === n ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pin Legend</label>
                {[{ color: "#2563EB", label: "Seller-Finance" }, { color: "#7C3AED", label: "Rent-to-Own" }, { color: "#D97706", label: "Lease Option" }, { color: "#059669", label: "Private Sale" }].map(({ color, label }) => (
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
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: view === "list" ? "100%" : "320px", overflowY: "auto", background: "#f9fafb", borderRight: "1px solid #e5e7eb", zIndex: 10 }}>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400 px-6">
                <p className="font-medium mb-1">No listings in this area</p>
                <p className="text-sm">Try zooming out or adjusting filters</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {filtered.map((listing) => (
                  <button key={listing.id}
                    onClick={() => {
                      setSelected((p) => p?.id === listing.id ? null : listing);
                      if (mapRef.current && listing.lat) mapRef.current.flyTo({ center: [listing.lng, listing.lat], duration: 600 });
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
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" />{listing.bedrooms}</span>
                          <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{listing.bathrooms}</span>
                          <span className="flex items-center gap-0.5"><Square className="w-3 h-3" />{listing.sqft?.toLocaleString()}</span>
                        </div>
                        <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: getDealColor(listing.dealType) }}>
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

        {/* Map container */}
        {(view === "map" || view === "split") && (
          <div ref={mapDivRef} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: view === "split" ? "320px" : "0" }}>
            {drawMode && (
              <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none" }}
                className="bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
                Click to add points — double-click to close boundary
              </div>
            )}
            {selected && (
              <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
                className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
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

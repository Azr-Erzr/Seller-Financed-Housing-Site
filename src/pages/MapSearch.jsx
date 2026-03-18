// src/pages/MapSearch.jsx
// Batch C — Wahi-inspired split view: wider panel, hover-to-highlight,
// richer cards, 2-column grid in list view.

import maplibregl from "maplibre-gl";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllListings } from "../lib/storage";
import { SlidersHorizontal, X, Bed, Bath, Square, Car, LocateFixed, PenTool } from "lucide-react";

const NAVBAR_HEIGHT = 73;
const SPLIT_PANEL_W = 420;

const MAP_STYLE = {
  version: 8,
  sources: { carto: { type: "raster", tiles: [
    "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
    "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
    "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
  ], tileSize: 256, attribution: '© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OSM</a>' } },
  layers: [{ id: "carto", type: "raster", source: "carto" }],
};

const CITY_COORDS = {
  "Whitby": { lat: 43.8975, lng: -78.9429 }, "Oshawa": { lat: 43.8971, lng: -78.8658 },
  "Ajax": { lat: 43.8509, lng: -79.0204 }, "Pickering": { lat: 43.8384, lng: -79.0868 },
  "Clarington": { lat: 43.9351, lng: -78.6897 },
};

const DEAL_TYPES     = ["Seller-Finance", "Rent-to-Own", "Lease Option", "Private Sale"];
const PROPERTY_TYPES = ["Single-Family", "Townhouse", "Semi-Detached", "Condo", "Multi-Unit"];
const PRICE_PRESETS  = [
  { label: "Any", min: 0, max: 9999999 }, { label: "<$500K", min: 0, max: 499999 },
  { label: "$500–750K", min: 500000, max: 749999 }, { label: "$750K–$1M", min: 750000, max: 999999 },
  { label: "$1M+", min: 1000000, max: 9999999 },
];

const getDealColor = (dt) => {
  if (!dt) return "#2563EB";
  const d = dt.toLowerCase();
  if (d.includes("rent")) return "#7C3AED"; if (d.includes("lease")) return "#D97706";
  if (d.includes("private")) return "#059669"; return "#2563EB";
};

const money = (n) => n ? `$${Number(n).toLocaleString("en-CA")}` : "—";

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function geoCircle(cLng, cLat, rKm) {
  const c = [];
  for (let i=0;i<=64;i++) { const a=(i/64)*2*Math.PI; c.push([cLng+rKm/(111.32*Math.cos(cLat*Math.PI/180))*Math.cos(a), cLat+rKm/110.574*Math.sin(a)]); }
  return { type:"Feature", geometry:{ type:"Polygon", coordinates:[c] } };
}

function pointInPolygon(lng, lat, polygon) {
  const coords = polygon[0]; let inside = false;
  for (let i=0,j=coords.length-1;i<coords.length;j=i++) {
    const xi=coords[i][0],yi=coords[i][1],xj=coords[j][0],yj=coords[j][1];
    if (((yi>lat)!==(yj>lat))&&(lng<(xj-xi)*(lat-yi)/(yj-yi)+xi)) inside=!inside;
  }
  return inside;
}

function RadiusInput({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef(null);
  useEffect(() => { setDraft(String(value)); }, [value]);
  useEffect(() => { if (editing && inputRef.current) inputRef.current.select(); }, [editing]);
  const commit = () => { const n=Math.max(1,Math.min(200,Number(draft)||value)); onChange(n); setDraft(String(n)); setEditing(false); };
  if (editing) return <input ref={inputRef} type="number" min={1} max={200} value={draft}
    onChange={(e)=>setDraft(e.target.value)} onBlur={commit} onKeyDown={(e)=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}}
    className="w-14 px-1.5 py-0.5 text-xs font-bold text-center border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />;
  return <button onClick={()=>setEditing(true)} className="text-xs font-bold text-white underline decoration-dotted underline-offset-2 hover:decoration-solid cursor-text" title="Click to type">{value}km</button>;
}

// ── Listing Card for split/list view ─────────────────────────────────
function MapListingCard({ listing, isSelected, isHovered, onClick, onHover, onLeave }) {
  const dealColor = getDealColor(listing.dealType);
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`w-full text-left bg-white rounded-xl overflow-hidden transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : isHovered ? "ring-2 ring-blue-300 shadow-md" : "shadow-sm hover:shadow-md"
      }`}>
      <div className="flex">
        <div className="w-32 h-28 shrink-0 bg-gray-100 overflow-hidden relative">
          {listing.image ? <img src={listing.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
          {listing.daysOnMarket != null && (
            <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white px-1.5 py-0.5 rounded text-[9px] font-medium backdrop-blur-sm">
              {listing.daysOnMarket === 0 ? "New" : `${listing.daysOnMarket}d`}
            </div>
          )}
        </div>
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <p className="font-bold text-blue-600 text-base">{money(listing.price)}</p>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full text-white shrink-0" style={{ background: dealColor }}>
              {listing.dealType}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">{listing.address}, {listing.city}</p>
          <div className="flex items-center gap-2.5 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-0.5"><Bed className="w-3 h-3 text-gray-400" />{listing.bedrooms}</span>
            <span className="flex items-center gap-0.5"><Bath className="w-3 h-3 text-gray-400" />{listing.bathrooms}</span>
            <span className="flex items-center gap-0.5"><Square className="w-3 h-3 text-gray-400" />{listing.sqft?.toLocaleString()}</span>
            {listing.parkingSpaces > 0 && <span className="flex items-center gap-0.5"><Car className="w-3 h-3 text-gray-400" />{listing.parkingSpaces}</span>}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            {listing.propertyType && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{listing.propertyType}</span>}
            {listing.yearBuilt && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{listing.yearBuilt}</span>}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function MapSearch() {
  const mapDivRef  = useRef(null);
  const mapRef     = useRef(null);
  const markersRef = useRef(new Map()); // Map<listingId, { marker, el }>
  const topBarRef  = useRef(null);
  const drawPoints = useRef([]);
  const listRefs   = useRef({});
  const boundsTimer = useRef(null);

  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [view, setView] = useState("split");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [topBarH, setTopBarH] = useState(40);

  const [pricePreset, setPricePreset] = useState(0);
  const [dealTypes, setDealTypes] = useState([]);
  const [propTypes, setPropTypes] = useState([]);
  const [minBeds, setMinBeds] = useState(0);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [radiusKm, setRadiusKm] = useState(10);
  const [radiusActive, setRadiusActive] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [drawnPoly, setDrawnPoly] = useState(null);
  const [locating, setLocating] = useState(false);
  const [mapBounds, setMapBounds] = useState(null);

  useEffect(() => {
    getAllListings().then((all) => {
      setListings(all.map((l) => {
        if (l.lat && l.lng) return l;
        const f = CITY_COORDS[l.city]; if (!f) return null;
        return { ...l, lat: f.lat+(Math.random()-.5)*.012, lng: f.lng+(Math.random()-.5)*.018 };
      }).filter(Boolean));
    });
  }, []);

  useEffect(() => {
    const p = PRICE_PRESETS[pricePreset];
    let r = listings.filter((l) => {
      if (l.price<p.min||l.price>p.max) return false;
      if (dealTypes.length&&!dealTypes.includes(l.dealType)) return false;
      if (propTypes.length&&!propTypes.includes(l.propertyType)) return false;
      if (minBeds&&l.bedrooms<minBeds) return false;
      return true;
    });
    if (radiusActive&&userLat!=null) r=r.filter((l)=>haversine(userLat,userLng,l.lat,l.lng)<=radiusKm);
    if (drawnPoly&&drawnPoly.length>=3) { const ring=[...drawnPoly,drawnPoly[0]]; r=r.filter((l)=>pointInPolygon(l.lng,l.lat,[ring])); }
    if (mapBounds&&!radiusActive&&!drawnPoly) { const{sw,ne}=mapBounds; r=r.filter((l)=>l.lng>=sw[0]&&l.lng<=ne[0]&&l.lat>=sw[1]&&l.lat<=ne[1]); }
    setFiltered(r);
  }, [listings,pricePreset,dealTypes,propTypes,minBeds,radiusActive,userLat,userLng,radiusKm,drawnPoly,mapBounds]);

  useEffect(() => { if (topBarRef.current) setTopBarH(topBarRef.current.offsetHeight); }, []);

  const handleMapMove = useCallback(() => {
    const map=mapRef.current; if(!map) return;
    const b=map.getBounds(); setMapBounds({sw:[b.getWest(),b.getSouth()],ne:[b.getEast(),b.getNorth()]});
  }, []);

  // ── Init MapLibre ──
  useEffect(() => {
    if (view==="list"||mapRef.current||!mapDivRef.current) return;
    const map = new maplibregl.Map({ container: mapDivRef.current, style: MAP_STYLE, center: [-78.93, 43.89], zoom: 10.5 });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("load", () => {
      map.addSource("radius-circle",{type:"geojson",data:{type:"FeatureCollection",features:[]}});
      map.addLayer({id:"radius-fill",type:"fill",source:"radius-circle",paint:{"fill-color":"#2563EB","fill-opacity":0.07}});
      map.addLayer({id:"radius-line",type:"line",source:"radius-circle",paint:{"line-color":"#2563EB","line-width":2}});
      map.addSource("draw-poly",{type:"geojson",data:{type:"FeatureCollection",features:[]}});
      map.addLayer({id:"draw-fill",type:"fill",source:"draw-poly",paint:{"fill-color":"#059669","fill-opacity":0.08}});
      map.addLayer({id:"draw-line",type:"line",source:"draw-poly",paint:{"line-color":"#059669","line-width":2.5}});
      map.addSource("draw-points",{type:"geojson",data:{type:"FeatureCollection",features:[]}});
      map.addLayer({id:"draw-dots",type:"circle",source:"draw-points",paint:{"circle-radius":5,"circle-color":"#059669","circle-stroke-color":"#fff","circle-stroke-width":2}});
      setMapReady(true);
      const b=map.getBounds(); setMapBounds({sw:[b.getWest(),b.getSouth()],ne:[b.getEast(),b.getNorth()]});
    });
    map.on("moveend", () => {
      clearTimeout(boundsTimer.current);
      boundsTimer.current = setTimeout(() => {
        const b=map.getBounds(); setMapBounds({sw:[b.getWest(),b.getSouth()],ne:[b.getEast(),b.getNorth()]});
      }, 300);
    });
    mapRef.current = map;
    return () => { clearTimeout(boundsTimer.current); map.remove(); mapRef.current=null; setMapReady(false); };
  }, [view]);

  useEffect(() => { if (mapRef.current) setTimeout(()=>{mapRef.current?.resize();handleMapMove();},50); }, [view,mapReady,handleMapMove]);

  // ── Update markers (with hover interaction) ──
  useEffect(() => {
    if (!mapRef.current||!mapReady) return;
    markersRef.current.forEach(({marker})=>marker.remove());
    markersRef.current = new Map();

    filtered.forEach((listing) => {
      const color = getDealColor(listing.dealType);
      const el = document.createElement("div");
      el.dataset.listingId = listing.id;
      el.style.cssText = `background:${color};color:white;padding:4px 9px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.3);border:2px solid white;cursor:pointer;transform:translate(-50%,-50%);transition:transform 0.15s,box-shadow 0.15s,padding 0.15s,font-size 0.15s;`;
      el.textContent = `$${Math.round(listing.price/1000)}K`;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelected((p)=>p?.id===listing.id?null:listing);
        mapRef.current?.flyTo({center:[listing.lng,listing.lat],duration:600});
      });
      el.addEventListener("mouseenter", () => setHoveredId(listing.id));
      el.addEventListener("mouseleave", () => setHoveredId(null));

      const marker = new maplibregl.Marker({element:el,anchor:"center"}).setLngLat([listing.lng,listing.lat]).addTo(mapRef.current);
      markersRef.current.set(listing.id, { marker, el });
    });
  }, [filtered,mapReady]);

  // ── Selection styling on markers (no recreation) ──
  useEffect(() => {
    markersRef.current.forEach(({el}, id) => {
      if (id === selected?.id) {
        el.style.padding = "6px 12px"; el.style.fontSize = "12px"; el.style.borderWidth = "3px";
        el.style.zIndex = "10";
      } else {
        el.style.padding = "4px 9px"; el.style.fontSize = "11px"; el.style.borderWidth = "2px";
        if (id !== hoveredId) el.style.zIndex = "auto";
      }
    });
  }, [selected, hoveredId]);

  // ── Hover highlight on markers from list ──
  useEffect(() => {
    markersRef.current.forEach(({el}, id) => {
      if (id === hoveredId) {
        el.style.transform = "translate(-50%,-50%) scale(1.3)";
        el.style.boxShadow = "0 4px 16px rgba(0,0,0,.4)";
        el.style.zIndex = "10";
      } else {
        el.style.transform = "translate(-50%,-50%) scale(1)";
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,.3)";
        el.style.zIndex = "auto";
      }
    });
  }, [hoveredId]);

  // ── Radius circle ──
  useEffect(() => {
    const map=mapRef.current; if(!map||!mapReady) return;
    const src=map.getSource("radius-circle"); if(!src) return;
    if (radiusActive&&userLat!=null) { src.setData({type:"FeatureCollection",features:[geoCircle(userLng,userLat,radiusKm)]}); map.flyTo({center:[userLng,userLat],zoom:11,duration:800}); }
    else { src.setData({type:"FeatureCollection",features:[]}); }
  }, [radiusActive,userLat,userLng,radiusKm,mapReady]);

  // ── Freeform polygon draw ──
  useEffect(() => {
    const map=mapRef.current; if(!map||!mapReady||!drawMode) return;
    const canvas=map.getCanvasContainer(); canvas.style.cursor="crosshair"; drawPoints.current=[];
    const updatePreview=()=>{const pts=drawPoints.current;
      map.getSource("draw-points")?.setData({type:"FeatureCollection",features:pts.map((p)=>({type:"Feature",geometry:{type:"Point",coordinates:p}}))});
      if(pts.length>=2){const ring=[...pts,pts[0]];map.getSource("draw-poly")?.setData({type:"FeatureCollection",features:[{type:"Feature",geometry:{type:"Polygon",coordinates:[ring]}}]});}
    };
    const onClick=(e)=>{drawPoints.current.push([e.lngLat.lng,e.lngLat.lat]);updatePreview();};
    const onDblClick=(e)=>{e.preventDefault();const pts=drawPoints.current;
      if(pts.length>=3){setDrawnPoly([...pts]);const ring=[...pts,pts[0]];map.getSource("draw-poly")?.setData({type:"FeatureCollection",features:[{type:"Feature",geometry:{type:"Polygon",coordinates:[ring]}}]});}
      drawPoints.current=[];map.getSource("draw-points")?.setData({type:"FeatureCollection",features:[]});setDrawMode(false);
    };
    map.on("click",onClick);map.on("dblclick",onDblClick);map.doubleClickZoom.disable();
    return()=>{canvas.style.cursor="";map.off("click",onClick);map.off("dblclick",onDblClick);map.doubleClickZoom.enable();drawPoints.current=[];map.getSource("draw-points")?.setData({type:"FeatureCollection",features:[]});};
  }, [drawMode,mapReady]);

  // ── Scroll list card into view on marker hover ──
  useEffect(() => {
    if (hoveredId && listRefs.current[hoveredId]) {
      listRefs.current[hoveredId].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [hoveredId]);

  const locateMe=()=>{if(!navigator.geolocation)return;setLocating(true);
    navigator.geolocation.getCurrentPosition((p)=>{setUserLat(p.coords.latitude);setUserLng(p.coords.longitude);setRadiusActive(true);setLocating(false);},()=>{setLocating(false);alert("Location access denied.");});};
  const clearRadius=()=>{setRadiusActive(false);setUserLat(null);setUserLng(null);};
  const clearDraw=()=>{mapRef.current?.getSource("draw-poly")?.setData({type:"FeatureCollection",features:[]});mapRef.current?.getSource("draw-points")?.setData({type:"FeatureCollection",features:[]});setDrawnPoly(null);};
  const toggle=(arr,setArr,val)=>setArr(arr.includes(val)?arr.filter((v)=>v!==val):[...arr,val]);
  const clearAll=()=>{setPricePreset(0);setDealTypes([]);setPropTypes([]);setMinBeds(0);clearRadius();clearDraw();};
  const activeN=(pricePreset>0?1:0)+dealTypes.length+propTypes.length+(minBeds>0?1:0)+(radiusActive?1:0)+(drawnPoly?1:0);
  const mapAreaH=`calc(100vh - ${NAVBAR_HEIGHT}px - ${topBarH}px)`;

  return (
    <div style={{height:`calc(100vh - ${NAVBAR_HEIGHT}px)`,overflow:"hidden",display:"flex",flexDirection:"column"}}>

      {/* Top bar */}
      <div ref={topBarRef} className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center gap-3 flex-wrap shrink-0">
        <h1 className="font-bold text-gray-900 text-base hidden sm:block">Map Search</h1>
        <span className="text-sm text-gray-400 shrink-0">{filtered.length} listings</span>

        <div className="flex items-center gap-2 ml-1 flex-wrap">
          <button onClick={locateMe} disabled={locating}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${radiusActive?"bg-blue-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <LocateFixed className="w-4 h-4" />
            {locating?"Locating...":radiusActive?(<>Within <RadiusInput value={radiusKm} onChange={setRadiusKm}/></>):"Near Me"}
          </button>
          {radiusActive&&(<>
            <input type="range" min={1} max={100} step={1} value={radiusKm} onChange={(e)=>setRadiusKm(Number(e.target.value))} className="w-24 accent-blue-600"/>
            <button onClick={clearRadius} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-4 h-4 text-gray-400"/></button>
          </>)}
          <button onClick={()=>{if(!drawMode){clearDraw();setDrawMode(true);}}}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${drawMode?"bg-green-600 text-white":drawnPoly?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <PenTool className="w-4 h-4"/>
            {drawMode?"Click points, double-click to finish":drawnPoly?"Boundary Active":"Draw Area"}
          </button>
          {drawnPoly&&<button onClick={clearDraw} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-4 h-4 text-gray-400"/></button>}
        </div>

        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-auto gap-0.5">
          {["List","Split","Map"].map((v)=>(
            <button key={v} onClick={()=>setView(v.toLowerCase())}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view===v.toLowerCase()?"bg-white shadow text-gray-900":"text-gray-500 hover:text-gray-700"}`}>{v}</button>
          ))}
        </div>

        <button onClick={()=>setSidebarOpen(!sidebarOpen)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${activeN>0?"bg-blue-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          <SlidersHorizontal className="w-4 h-4"/> Filters
          {activeN>0&&<span className="bg-white text-blue-600 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeN}</span>}
        </button>
      </div>

      <div style={{position:"relative",height:mapAreaH}}>

        {/* Filter drawer */}
        {sidebarOpen&&(<>
          <div className="absolute inset-0 bg-black/20 z-20 sm:hidden" onClick={()=>setSidebarOpen(false)}/>
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-30 overflow-y-auto p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <div className="flex items-center gap-2">
                {activeN>0&&<button onClick={clearAll} className="text-xs text-blue-600 hover:underline">Clear all</button>}
                <button onClick={()=>setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400"/></button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex flex-wrap gap-2">
                {PRICE_PRESETS.map((p,i)=>(<button key={i} onClick={()=>setPricePreset(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${pricePreset===i?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>{p.label}</button>))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <div className="flex gap-1.5">
                {[0,1,2,3,4,5].map((n)=>(<button key={n} onClick={()=>setMinBeds(n)}
                  className={`w-10 h-10 rounded-full text-sm font-medium border transition-all ${minBeds===n?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>{n===0?"Any":n===5?"5+":n+"+"}</button>))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deal Type</label>
              <div className="flex flex-wrap gap-2">
                {DEAL_TYPES.map((t)=>(<button key={t} onClick={()=>toggle(dealTypes,setDealTypes,t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${dealTypes.includes(t)?`text-white border-transparent`:"bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                  style={dealTypes.includes(t)?{background:getDealColor(t)}:{}}>{t}</button>))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((t)=>(<button key={t} onClick={()=>toggle(propTypes,setPropTypes,t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${propTypes.includes(t)?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>{t}</button>))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pin Legend</label>
              {[{color:"#2563EB",label:"Seller-Finance"},{color:"#7C3AED",label:"Rent-to-Own"},{color:"#D97706",label:"Lease Option"},{color:"#059669",label:"Private Sale"}].map(({color,label})=>(
                <div key={label} className="flex items-center gap-2 mb-1.5"><div className="w-3 h-3 rounded-full shrink-0" style={{background:color}}/><span className="text-xs text-gray-500">{label}</span></div>))}
            </div>
          </div>
        </>)}

        {/* List panel */}
        {(view==="list"||view==="split")&&(
          <div style={{position:"absolute",top:0,left:0,bottom:0,width:view==="list"?"100%":`${SPLIT_PANEL_W}px`,overflowY:"auto",background:"#f9fafb",borderRight:"1px solid #e5e7eb",zIndex:10}}>
            {filtered.length===0?(
              <div className="text-center py-16 text-gray-400 px-6"><p className="font-medium mb-1">No listings in this area</p><p className="text-sm">Try zooming out or adjusting filters</p></div>
            ):(
              <div className={view==="list"?"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4":"p-3 space-y-2"}>
                {filtered.map((listing)=>(
                  <div key={listing.id} ref={(el)=>{listRefs.current[listing.id]=el;}}>
                    <MapListingCard
                      listing={listing}
                      isSelected={selected?.id===listing.id}
                      isHovered={hoveredId===listing.id}
                      onClick={()=>{setSelected((p)=>p?.id===listing.id?null:listing);if(mapRef.current&&listing.lat)mapRef.current.flyTo({center:[listing.lng,listing.lat],duration:600});}}
                      onHover={()=>setHoveredId(listing.id)}
                      onLeave={()=>setHoveredId(null)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map */}
        {(view==="map"||view==="split")&&(
          <div ref={mapDivRef} style={{position:"absolute",top:0,right:0,bottom:0,left:view==="split"?`${SPLIT_PANEL_W}px`:"0"}}>
            {drawMode&&(
              <div style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",zIndex:10,pointerEvents:"none"}}
                className="bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">Click to add points — double-click to close</div>
            )}
            {selected&&(
              <div style={{position:"absolute",top:16,right:16,zIndex:10,width:"300px"}}
                className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in">
                <button onClick={()=>setSelected(null)} className="absolute top-2 right-2 w-6 h-6 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center z-10"><X className="w-3 h-3 text-white"/></button>
                {selected.image&&<img src={selected.image} alt="" className="w-full h-32 object-cover"/>}
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-lg font-extrabold text-blue-600">{money(selected.price)}</p>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full text-white shrink-0 mt-0.5" style={{background:getDealColor(selected.dealType)}}>{selected.dealType}</span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm mt-0.5 truncate">{selected.title}</p>
                  <p className="text-xs text-gray-400 truncate">{selected.address}, {selected.city}</p>
                  <div className="flex items-center gap-2.5 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-0.5"><Bed className="w-3 h-3"/>{selected.bedrooms}</span>
                    <span className="flex items-center gap-0.5"><Bath className="w-3 h-3"/>{selected.bathrooms}</span>
                    <span className="flex items-center gap-0.5"><Square className="w-3 h-3"/>{selected.sqft?.toLocaleString()}</span>
                  </div>
                  <Link to={`/listings/${selected.id}`}
                    className="mt-2.5 w-full flex items-center justify-center py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
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

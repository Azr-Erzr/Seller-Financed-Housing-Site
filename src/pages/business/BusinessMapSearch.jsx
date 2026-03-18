// src/pages/business/BusinessMapSearch.jsx
// Static import of Leaflet — same fix as MapSearch.jsx
import L from "leaflet";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCommListings } from "../../lib/commercial-storage";
import { SlidersHorizontal, X, Ruler, LocateFixed, PenTool } from "lucide-react";
import { PROPERTY_CATEGORIES } from "../../data/commercial-seed";

// Fix default icon paths once at module load
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const NAVBAR_HEIGHT = 73;

const CITY_COORDS = {
  "Whitby":        { lat: 43.8975, lng: -78.9429 },
  "Oshawa":        { lat: 43.8971, lng: -78.8658 },
  "Ajax":          { lat: 43.8509, lng: -79.0204 },
  "Clarington":    { lat: 43.9351, lng: -78.6897 },
  "Kawartha Lakes":{ lat: 44.3595, lng: -78.7452 },
  "Brampton":      { lat: 43.7315, lng: -79.7624 },
  "Toronto":       { lat: 43.6532, lng: -79.3832 },
};

const DEAL_TYPES    = ["Seller-Finance", "Rent-to-Own", "Lease Option", "Private Sale"];
const PRICE_PRESETS = [
  { label: "Any",       min: 0,       max: 99999999 },
  { label: "<$500K",    min: 0,       max: 499999   },
  { label: "$500K–$1M", min: 500000,  max: 999999   },
  { label: "$1M–$3M",   min: 1000000, max: 2999999  },
  { label: "$3M+",      min: 3000000, max: 99999999 },
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
  const dLat = (lat2-lat1)*Math.PI/180, dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function BusinessMapSearch() {
  const mapDivRef      = useRef(null);
  const mapRef         = useRef(null);
  const markersRef     = useRef([]);
  const radiusLayerRef = useRef(null);
  const drawLayerRef   = useRef(null);
  const drawState      = useRef({ active:false, startLL:null, tempRect:null });
  const topBarRef      = useRef(null);

  const [listings,    setListings]    = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [view,        setView]        = useState("split");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapReady,    setMapReady]    = useState(false);
  const [topBarH,     setTopBarH]     = useState(40);

  const [pricePreset, setPricePreset] = useState(0);
  const [categories,  setCategories]  = useState([]);
  const [dealTypes,   setDealTypes]   = useState([]);
  const [minAcreage,  setMinAcreage]  = useState("");
  const [userLat,     setUserLat]     = useState(null);
  const [userLng,     setUserLng]     = useState(null);
  const [radiusKm,    setRadiusKm]    = useState(25);
  const [radiusActive,setRadiusActive]= useState(false);
  const [drawMode,    setDrawMode]    = useState(false);
  const [drawnBounds, setDrawnBounds] = useState(null);
  const [locating,    setLocating]    = useState(false);

  useEffect(() => {
    getAllCommListings().then((all) => {
      setListings(all.map((l) => {
        if (l.lat && l.lng) return l;
        const f = CITY_COORDS[l.city] || CITY_COORDS["Oshawa"];
        return { ...l, lat: f.lat+(Math.random()-.5)*.08, lng: f.lng+(Math.random()-.5)*.12 };
      }));
    });
  }, []);

  useEffect(() => {
    const p = PRICE_PRESETS[pricePreset];
    let r = listings.filter((l) => {
      if (l.price < p.min || l.price > p.max) return false;
      if (categories.length && !categories.includes(l.propertyCategory)) return false;
      if (dealTypes.length && !dealTypes.includes(l.dealType)) return false;
      if (minAcreage && l.acreage < Number(minAcreage)) return false;
      return true;
    });
    if (radiusActive && userLat != null) r = r.filter((l) => haversine(userLat,userLng,l.lat,l.lng) <= radiusKm);
    if (drawnBounds) r = r.filter((l) => drawnBounds.contains([l.lat,l.lng]));
    setFiltered(r);
  }, [listings, pricePreset, categories, dealTypes, minAcreage, radiusActive, userLat, userLng, radiusKm, drawnBounds]);

  useEffect(() => {
    if (topBarRef.current) setTopBarH(topBarRef.current.offsetHeight);
  }, []);

  // Init — L is synchronously available. Tailwind override is in index.html.
  useEffect(() => {
    if (view === "list" || mapRef.current || !mapDivRef.current) return;

    const map = L.map(mapDivRef.current, { center:[43.89,-78.93], zoom:9 });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom:19,
    }).addTo(map);
    mapRef.current = map;
    map.invalidateSize();
    requestAnimationFrame(() => { map.invalidateSize(); setMapReady(true); });
    const t = setTimeout(() => map.invalidateSize(), 400);
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(mapDivRef.current);
    }
    return () => { clearTimeout(t); if (ro) ro.disconnect(); map.remove(); mapRef.current = null; setMapReady(false); };
  }, [view]);

  useEffect(() => {
    if (mapRef.current && mapReady) requestAnimationFrame(() => mapRef.current?.invalidateSize());
  }, [view, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    filtered.forEach((listing) => {
      const color = getCategoryColor(listing.propertyCategory);
      const isSel = selected?.id === listing.id;
      const icon  = L.divIcon({
        className:"",
        html:`<div style="background:${color};color:white;padding:${isSel?"5px 10px":"4px 8px"};border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.3);border:${isSel?"3px":"2px"} solid white;cursor:pointer;">$${Math.round(listing.price/1000)}K</div>`,
        iconAnchor:[30,16],
      });
      const marker = L.marker([listing.lat,listing.lng],{icon}).addTo(map)
        .on("click",() => { setSelected((p) => p?.id===listing.id?null:listing); map.panTo([listing.lat,listing.lng],{animate:true}); });
      markersRef.current.push(marker);
    });
  }, [filtered, mapReady, selected]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    if (radiusLayerRef.current) { map.removeLayer(radiusLayerRef.current); radiusLayerRef.current = null; }
    if (radiusActive && userLat != null) {
      radiusLayerRef.current = L.circle([userLat,userLng],{radius:radiusKm*1000,color:"#059669",fillColor:"#059669",fillOpacity:0.07,weight:2}).addTo(map);
      map.setView([userLat,userLng],9,{animate:true});
    }
  }, [radiusActive, userLat, userLng, radiusKm, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !drawMode) return;
    const s = drawState.current;
    s.active = true;
    map.getContainer().style.cursor = "crosshair";
    const onDown = (e) => { s.startLL=e.latlng; map.dragging.disable(); };
    const onMove = (e) => { if(!s.startLL)return; if(s.tempRect)map.removeLayer(s.tempRect); s.tempRect=L.rectangle(L.latLngBounds(s.startLL,e.latlng),{color:"#059669",fillOpacity:0.08,weight:2,dashArray:"6 4"}).addTo(map); };
    const onUp   = (e) => { if(!s.startLL)return; const b=L.latLngBounds(s.startLL,e.latlng); if(drawLayerRef.current)map.removeLayer(drawLayerRef.current); drawLayerRef.current=L.rectangle(b,{color:"#059669",fillOpacity:0.07,weight:2}).addTo(map); setDrawnBounds(b); setDrawMode(false); s.startLL=null; map.dragging.enable(); };
    map.on("mousedown",onDown); map.on("mousemove",onMove); map.on("mouseup",onUp);
    return () => { s.active=false; map.off("mousedown",onDown); map.off("mousemove",onMove); map.off("mouseup",onUp); map.getContainer().style.cursor=""; if(s.tempRect){map.removeLayer(s.tempRect);s.tempRect=null;} map.dragging.enable(); };
  }, [drawMode, mapReady]);

  const locateMe = () => { if(!navigator.geolocation)return; setLocating(true); navigator.geolocation.getCurrentPosition((p)=>{setUserLat(p.coords.latitude);setUserLng(p.coords.longitude);setRadiusActive(true);setLocating(false);},(()=>setLocating(false))); };
  const clearRadius = () => { setRadiusActive(false); setUserLat(null); setUserLng(null); };
  const clearDraw   = () => { if(drawLayerRef.current&&mapRef.current)mapRef.current.removeLayer(drawLayerRef.current); drawLayerRef.current=null; setDrawnBounds(null); };
  const toggle      = (arr,setArr,val) => setArr(arr.includes(val)?arr.filter((v)=>v!==val):[...arr,val]);
  const clearAll    = () => { setPricePreset(0);setCategories([]);setDealTypes([]);setMinAcreage("");clearRadius();clearDraw(); };
  const activeN     = (pricePreset>0?1:0)+categories.length+dealTypes.length+(minAcreage?1:0)+(radiusActive?1:0)+(drawnBounds?1:0);
  const mapAreaH    = `calc(100vh - ${NAVBAR_HEIGHT}px - ${topBarH}px)`;

  return (
    <div style={{height:`calc(100vh - ${NAVBAR_HEIGHT}px)`,overflow:"hidden",display:"flex",flexDirection:"column"}}>

      <div ref={topBarRef} className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap shrink-0">
        <h1 className="font-bold text-gray-900 text-sm hidden sm:block">Property Map</h1>
        <span className="text-xs text-gray-400 shrink-0">{filtered.length} properties</span>
        <div className="flex items-center gap-2 ml-1">
          <button onClick={locateMe} disabled={locating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${radiusActive?"bg-emerald-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <LocateFixed className="w-3.5 h-3.5"/>
            {locating?"Locating...":radiusActive?`Within ${radiusKm}km`:"Near Me"}
          </button>
          {radiusActive&&(<><input type="range" min={5} max={200} step={5} value={radiusKm} onChange={(e)=>setRadiusKm(Number(e.target.value))} className="w-20 accent-emerald-600"/><button onClick={clearRadius} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-3.5 h-3.5 text-gray-400"/></button></>)}
          <button onClick={()=>!drawMode&&setDrawMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${drawMode?"bg-emerald-600 text-white":drawnBounds?"bg-emerald-100 text-emerald-700":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <PenTool className="w-3.5 h-3.5"/>
            {drawMode?"Drawing...":drawnBounds?"Boundary Active":"Draw Area"}
          </button>
          {drawnBounds&&<button onClick={clearDraw} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-3.5 h-3.5 text-gray-400"/></button>}
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-auto gap-0.5">
          {["List","Split","Map"].map((v)=>(<button key={v} onClick={()=>setView(v.toLowerCase())} className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${view===v.toLowerCase()?"bg-white shadow text-gray-900":"text-gray-500 hover:text-gray-700"}`}>{v}</button>))}
        </div>
        <button onClick={()=>setSidebarOpen(!sidebarOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeN>0?"bg-emerald-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          <SlidersHorizontal className="w-3.5 h-3.5"/>Filters
          {activeN>0&&<span className="bg-white text-emerald-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeN}</span>}
        </button>
      </div>

      <div style={{position:"relative",height:mapAreaH}}>

        {sidebarOpen&&(<>
          <div className="absolute inset-0 bg-black/20 z-20 sm:hidden" onClick={()=>setSidebarOpen(false)}/>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl z-30 overflow-y-auto p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <div className="flex items-center gap-2">
                {activeN>0&&<button onClick={clearAll} className="text-xs text-emerald-600 hover:underline">Clear all</button>}
                <button onClick={()=>setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400"/></button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex flex-wrap gap-2">{PRICE_PRESETS.map((p,i)=>(<button key={i} onClick={()=>setPricePreset(i)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${pricePreset===i?"bg-emerald-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p.label}</button>))}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Acreage</label>
              <input type="number" placeholder="e.g. 10" value={minAcreage} onChange={(e)=>setMinAcreage(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Category</label>
              <div className="space-y-2">{PROPERTY_CATEGORIES.map((c)=>(<label key={c} className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={categories.includes(c)} onChange={()=>toggle(categories,setCategories,c)} className="w-4 h-4 accent-emerald-600"/><span className="text-sm text-gray-600">{c}</span></label>))}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deal Type</label>
              <div className="space-y-2">{DEAL_TYPES.map((t)=>(<label key={t} className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={dealTypes.includes(t)} onChange={()=>toggle(dealTypes,setDealTypes,t)} className="w-4 h-4 accent-emerald-600"/><span className="text-sm text-gray-600">{t}</span></label>))}</div>
            </div>
          </div>
        </>)}

        {(view==="list"||view==="split")&&(
          <div style={{position:"absolute",top:0,left:0,bottom:0,width:view==="list"?"100%":"320px",overflowY:"auto",background:"#f9fafb",borderRight:"1px solid #e5e7eb",zIndex:10}}>
            {filtered.length===0?(<div className="text-center py-16 text-gray-400 px-6"><p className="font-medium mb-1">No properties found</p><p className="text-sm">Try adjusting filters</p></div>):(
              <div className="p-3 space-y-2">
                {filtered.map((listing)=>(
                  <button key={listing.id} onClick={()=>{setSelected((p)=>p?.id===listing.id?null:listing);if(mapRef.current&&listing.lat)mapRef.current.panTo([listing.lat,listing.lng],{animate:true});}}
                    className={`w-full text-left bg-white rounded-xl border-2 overflow-hidden hover:shadow-md transition-all ${selected?.id===listing.id?"border-emerald-500 shadow-md":"border-transparent shadow-sm"}`}>
                    <div className="flex">
                      <div className="w-24 h-24 shrink-0 bg-emerald-50 overflow-hidden">
                        {listing.image?<img src={listing.image} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full bg-emerald-100 flex items-center justify-center text-2xl">🌿</div>}
                      </div>
                      <div className="flex-1 p-3 min-w-0">
                        <p className="font-bold text-emerald-700 text-sm">{money(listing.price)}</p>
                        <p className="text-xs font-medium text-gray-800 truncate mt-0.5">{listing.title}</p>
                        <p className="text-xs text-gray-400">{listing.city}</p>
                        {listing.acreage&&<p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Ruler className="w-3 h-3"/>{listing.acreage} acres</p>}
                        <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{background:getCategoryColor(listing.propertyCategory)}}>{listing.propertyCategory||listing.dealType}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {(view==="map"||view==="split")&&(
          <div ref={mapDivRef} style={{position:"absolute",top:0,right:0,bottom:0,left:view==="split"?"320px":"0"}}>
            {drawMode&&(<div style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",zIndex:1000,pointerEvents:"none"}} className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">Click and drag to draw a search boundary</div>)}
            {selected&&(
              <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:1000}} className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <button onClick={()=>setSelected(null)} className="absolute top-2 right-2 w-7 h-7 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center z-10 transition-colors"><X className="w-3.5 h-3.5 text-white"/></button>
                {selected.image&&<img src={selected.image} alt="" className="w-full h-32 object-cover"/>}
                <div className="p-4">
                  <p className="text-xl font-extrabold text-emerald-700">{money(selected.price)}</p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5 truncate">{selected.title}</p>
                  <p className="text-xs text-gray-400 truncate">{selected.address}, {selected.city}</p>
                  {selected.acreage&&<p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Ruler className="w-3 h-3"/>{selected.acreage} acres · {selected.zoning}</p>}
                  <Link to={`/business/listings/${selected.id}`} className="mt-3 w-full flex items-center justify-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors">View Full Listing →</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

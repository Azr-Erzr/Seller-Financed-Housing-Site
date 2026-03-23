// src/lib/mapConfig.js
// Batch 14 — Centralized Mapbox configuration.
// Token is read from VITE_MAPBOX_TOKEN env var (set in Cloudflare build vars).

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

// Mapbox Streets style — good typography, building footprints, terrain shading
export const MAPBOX_STYLE = "mapbox://styles/mapbox/streets-v12";

// Fallback: CARTO Voyager tiles (used if no Mapbox token is set)
export const CARTO_STYLE = {
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
      attribution:
        '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    },
  },
  layers: [{ id: "carto", type: "raster", source: "carto" }],
};

// Returns the appropriate style + token for map initialization.
// If Mapbox token exists, uses Mapbox Streets; otherwise falls back to CARTO.
export function getMapStyle() {
  if (MAPBOX_TOKEN) return MAPBOX_STYLE;
  return CARTO_STYLE;
}

// Geocoding — Mapbox Geocoding API v5
export const GEOCODE_BASE = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export async function geocodeAddress(query, options = {}) {
  if (!MAPBOX_TOKEN || !query?.trim()) return [];
  const params = new URLSearchParams({
    access_token: MAPBOX_TOKEN,
    autocomplete: "true",
    country: "ca",
    limit: String(options.limit || 5),
    types: options.types || "address,place,locality,neighborhood",
  });
  if (options.proximity) {
    params.set("proximity", `${options.proximity[0]},${options.proximity[1]}`);
  }
  try {
    const res = await fetch(`${GEOCODE_BASE}/${encodeURIComponent(query.trim())}.json?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features || []).map((f) => ({
      text: f.text,
      placeName: f.place_name,
      center: f.center, // [lng, lat]
      bbox: f.bbox || null,
    }));
  } catch {
    return [];
  }
}

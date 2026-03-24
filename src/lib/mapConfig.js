// src/lib/mapConfig.js
// Centralized Mapbox configuration with diagnostics.
// Token is read from VITE_MAPBOX_TOKEN env var (set in Cloudflare build vars).
// IMPORTANT: Vite bakes VITE_* vars at BUILD time. Changing the var in Cloudflare
// requires a full redeploy (push to GitHub or trigger manual deploy).

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

// ── Diagnostics (only in dev) ─────────────────────────────────────────
if (import.meta.env.DEV) {
  if (MAPBOX_TOKEN) {
    console.log("[MapConfig] Token present:", MAPBOX_TOKEN.slice(0, 12) + "...");
    console.log("[MapConfig] Token starts with pk.:", MAPBOX_TOKEN.startsWith("pk."));
  } else {
    console.warn("[MapConfig] VITE_MAPBOX_TOKEN is empty. Map will show error state.");
    console.warn("[MapConfig] Set it in .env locally or in Cloudflare Pages env vars for production.");
  }
}

// Mapbox Streets style
export const MAPBOX_STYLE = "mapbox://styles/mapbox/streets-v12";

// Fallback: CARTO Voyager tiles (free, no key needed)
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

// Returns the appropriate style for map initialization.
export function getMapStyle() {
  if (MAPBOX_TOKEN) return MAPBOX_STYLE;
  return CARTO_STYLE;
}

/**
 * Check if the map can initialize.
 * Returns { ok, reason } — used by MapSearch to show the right error.
 */
export function checkMapReady() {
  if (!MAPBOX_TOKEN) {
    return {
      ok: false,
      reason: "no-token",
      message: "Mapbox token not configured. The map requires VITE_MAPBOX_TOKEN to be set in the build environment.",
    };
  }
  if (!MAPBOX_TOKEN.startsWith("pk.")) {
    return {
      ok: false,
      reason: "bad-token",
      message: "Mapbox token appears invalid — it should start with 'pk.' (public token). Check your Mapbox account.",
    };
  }
  return { ok: true };
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
      center: f.center,
      bbox: f.bbox || null,
    }));
  } catch {
    return [];
  }
}

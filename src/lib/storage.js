// src/lib/storage.js
// Batch 5 — renamed keys (selfi_*), user_id on insert, seed/live separation.
// Demo seed data is tagged with isDemo:true and never blended silently with live data.

import { LISTINGS as SEED_LISTINGS, PROFILES as SEED_PROFILES } from "../data/seed";
import { supabase } from "./supabase";

const USE_SUPABASE = true;

const KEYS = {
  listings:      "selfi_listings",
  profiles:      "selfi_profiles",
  savedListings: "selfi_saved_listings",
  savedProfiles: "selfi_saved_profiles",
};

const read  = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
const write = (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); return true; } catch { return false; } };

// ── Migrate old hm_* keys to selfi_* (runs once, cleans up) ─────────
(function migrateKeys() {
  const OLD = { savedListings: "hm_saved_listings", savedProfiles: "hm_saved_profiles" };
  try {
    Object.entries(OLD).forEach(([newKey, oldKey]) => {
      const old = localStorage.getItem(oldKey);
      if (old && !localStorage.getItem(KEYS[newKey])) {
        localStorage.setItem(KEYS[newKey], old);
      }
      localStorage.removeItem(oldKey);
    });
    // Also clean other old keys
    ["hm_listings", "hm_profiles", "hm_site_mode"].forEach((k) => {
      // Don't remove hm_site_mode — SiteContext migrates it separately
      if (k !== "hm_site_mode") localStorage.removeItem(k);
    });
  } catch {}
})();

// ── Save / bookmark helpers ───────────────────────────────────────────

export function isListingSaved(id) {
  return read(KEYS.savedListings).includes(String(id));
}

export function toggleSavedListing(id) {
  const saved = read(KEYS.savedListings);
  const sid   = String(id);
  const next  = saved.includes(sid) ? saved.filter((v) => v !== sid) : [...saved, sid];
  write(KEYS.savedListings, next);
  return next.includes(sid);
}

export function isProfileSaved(id) {
  return read(KEYS.savedProfiles).includes(String(id));
}

export function toggleSavedProfile(id) {
  const saved = read(KEYS.savedProfiles);
  const sid   = String(id);
  const next  = saved.includes(sid) ? saved.filter((v) => v !== sid) : [...saved, sid];
  write(KEYS.savedProfiles, next);
  return next.includes(sid);
}

// ── Auth helper — get current user ID for inserts ────────────────────
async function getCurrentUserId() {
  if (!supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch { return null; }
}

// ── Field mapping helpers ────────────────────────────────────────────

function listingToRow(l, userId) {
  return {
    title:          l.title,
    address:        l.address,
    city:           l.city,
    state:          l.state || "ON",
    image:          l.image || "",
    lat:            l.lat || null,
    lng:            l.lng || null,
    price:          Number(l.price),
    bedrooms:       Number(l.bedrooms),
    bathrooms:      Number(l.bathrooms),
    sqft:           l.sqft ? Number(l.sqft) : null,
    lot:            l.lot || "",
    property_type:  l.propertyType,
    deal_type:      l.dealType,
    deal_types:     l.dealTypes || [],
    down_payment:   l.downPayment ? Number(l.downPayment) : null,
    interest_min:   l.interestRange?.[0] ?? null,
    interest_max:   l.interestRange?.[1] ?? null,
    term:           l.term ? Number(l.term) : null,
    description:    l.description || "",
    docs_locked:    l.docsLocked ?? true,
    video_url:      l.videoUrl || "",
    badges:         l.badges || [],
    is_active:      true,
    owner_email:    l.ownerEmail || null,
    ...(userId ? { user_id: userId } : {}),
  };
}

function rowToListing(r) {
  return {
    id:           r.id,
    title:        r.title,
    address:      r.address,
    city:         r.city,
    state:        r.state,
    image:        r.image,
    lat:          r.lat,
    lng:          r.lng,
    price:        r.price,
    bedrooms:     r.bedrooms,
    bathrooms:    r.bathrooms,
    sqft:         r.sqft,
    lot:          r.lot,
    propertyType: r.property_type,
    dealType:     r.deal_type,
    dealTypes:    r.deal_types || [],
    downPayment:  r.down_payment,
    interest:     ((r.interest_min ?? 0) + (r.interest_max ?? 0)) / 2,
    interestRange:[r.interest_min ?? 0, r.interest_max ?? 0],
    term:         r.term,
    description:  r.description,
    docsLocked:   r.docs_locked,
    videoUrl:     r.video_url,
    badges:       r.badges || [],
    createdAt:    r.created_at,
    isDemo:       false,
  };
}

function profileToRow(p, userId) {
  return {
    name:           p.name,
    city:           p.city,
    bio:            p.bio || "",
    avatar:         p.avatar || "",
    avatar_url:     p.avatar_url || p.avatar || "",
    budget:         Number(p.budget),
    down_payment:   Number(p.downPayment),
    interest_max:   Number(p.interestMax),
    interest_range: p.interestRange || "",
    payment_budget: Number(p.paymentBudget),
    monthly_income: Number(p.monthlyIncome),
    monthly_debt:   Number(p.monthlyDebt) || 0,
    deal_preference: p.dealPreference,
    deal_preferences: p.dealPreferences || [],
    risk_tolerance: p.riskTolerance || "Moderate",
    show_income:    p.showIncome ?? p.show_income ?? false,
    use_alias:      p.useAlias ?? p.use_alias ?? true,
    alias:          p.alias || null,
    badges:         p.badges || [],
    is_active:      true,
    owner_email:    p.ownerEmail || null,
    ...(userId ? { user_id: userId } : {}),
  };
}

function rowToProfile(r) {
  return {
    id:             r.id,
    name:           r.name,
    city:           r.city,
    bio:            r.bio,
    avatar:         r.avatar || r.avatar_url,
    budget:         r.budget,
    downPayment:    r.down_payment,
    interestMax:    r.interest_max,
    interestRange:  r.interest_range,
    paymentBudget:  r.payment_budget,
    monthlyIncome:  r.monthly_income,
    monthlyDebt:    r.monthly_debt,
    dealPreference: r.deal_preference,
    dealPreferences:r.deal_preferences || [],
    riskTolerance:  r.risk_tolerance,
    showIncome:     r.show_income,
    useAlias:       r.use_alias ?? true,
    alias:          r.alias || null,
    badges:         r.badges || [],
    createdAt:      r.created_at,
    isDemo:         false,
  };
}

// ── Demo seed data (tagged) ──────────────────────────────────────────
// Seed items always carry isDemo:true so the UI can badge them visibly.
const DEMO_LISTINGS = SEED_LISTINGS.map((l) => ({ ...l, isDemo: true }));
const DEMO_PROFILES = SEED_PROFILES.map((p) => ({ ...p, isDemo: true }));

// ── Public API ────────────────────────────────────────────────────────

export async function getAllListings() {
  // Live data from Supabase (never includes seed)
  let live = [];
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) live = data.map(rowToListing);
  }
  // If no live data exists yet, include demo listings so the site isn't empty
  // Once real listings exist, demo data stops appearing in public views
  if (live.length === 0) return [...DEMO_LISTINGS];
  return live;
}

export async function getListingById(id) {
  // Check demo first (demo IDs are like "h1", "h2" etc.)
  const demo = DEMO_LISTINGS.find((l) => l.id === id);
  if (demo) return demo;
  // Then check Supabase
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();
    if (!error && data) return rowToListing(data);
  }
  return read(KEYS.listings).find((l) => l.id === id) || null;
}

export async function saveListing(listing) {
  if (USE_SUPABASE && supabase) {
    const userId = await getCurrentUserId();
    const row = listingToRow(listing, userId);
    const { data, error } = await supabase.from("listings").insert(row).select().single();
    if (error) { console.error("Supabase listing error:", error.message); return null; }
    return rowToListing(data);
  }
  const stored = read(KEYS.listings);
  const saved  = { ...listing, id: `ul_${Date.now()}`, userSubmitted: true, isDemo: false };
  write(KEYS.listings, [...stored, saved]);
  return saved;
}

export async function getAllProfiles() {
  let live = [];
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase
      .from("public_profiles")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) live = data.map(rowToProfile);
  }
  if (live.length === 0) return [...DEMO_PROFILES];
  return live;
}

export async function getProfileById(id) {
  const demo = DEMO_PROFILES.find((p) => p.id === id);
  if (demo) return demo;
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase.from("public_profiles").select("*").eq("id", id).single();
    if (!error && data) return rowToProfile(data);
  }
  return read(KEYS.profiles).find((p) => p.id === id) || null;
}

export async function saveProfile(profile) {
  if (USE_SUPABASE && supabase) {
    const userId = await getCurrentUserId();
    const row = profileToRow(profile, userId);
    const { data, error } = await supabase.from("profiles").insert(row).select().single();
    if (error) { console.error("Supabase profile error:", error.message); return null; }
    return rowToProfile(data);
  }
  const stored = read(KEYS.profiles);
  const saved  = { ...profile, id: `up_${Date.now()}`, userSubmitted: true, isDemo: false };
  write(KEYS.profiles, [...stored, saved]);
  return saved;
}

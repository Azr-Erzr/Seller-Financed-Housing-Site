// src/lib/storage.js
import { LISTINGS as SEED_LISTINGS, PROFILES as SEED_PROFILES } from "../data/seed";
import { supabase } from "./supabase";

const USE_SUPABASE = true;

const KEYS = {
  listings:      "hm_listings",
  profiles:      "hm_profiles",
  savedListings: "hm_saved_listings",   // must match Saved.jsx
  savedProfiles: "hm_saved_profiles",   // must match Saved.jsx
};

const read  = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
const write = (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); return true; } catch { return false; } };

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

// ── Field mapping helpers ────────────────────────────────────────────

function listingToRow(l) {
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
  };
}

function profileToRow(p) {
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
    badges:         p.badges || [],
    is_active:      true,
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
    badges:         r.badges || [],
    createdAt:      r.created_at,
  };
}

// ── Public API ────────────────────────────────────────────────────────

export async function getAllListings() {
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) return [...SEED_LISTINGS, ...data.map(rowToListing)];
  }
  return [...SEED_LISTINGS, ...read(KEYS.listings)];
}

export async function getListingById(id) {
  const seed = SEED_LISTINGS.find((l) => l.id === id);
  if (seed) return seed;
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();
    if (!error && data) return rowToListing(data);
  }
  return read(KEYS.listings).find((l) => l.id === id) || null;
}

export async function saveListing(listing) {
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase.from("listings").insert(listingToRow(listing)).select().single();
    if (error) { console.error("Supabase listing error:", error.message); return null; }
    return rowToListing(data);
  }
  const stored = read(KEYS.listings);
  const saved  = { ...listing, id: `ul_${Date.now()}`, userSubmitted: true };
  write(KEYS.listings, [...stored, saved]);
  return saved;
}

export async function getAllProfiles() {
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) return [...SEED_PROFILES, ...data.map(rowToProfile)];
  }
  return [...SEED_PROFILES, ...read(KEYS.profiles)];
}

export async function getProfileById(id) {
  const seed = SEED_PROFILES.find((p) => p.id === id);
  if (seed) return seed;
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (!error && data) return rowToProfile(data);
  }
  return read(KEYS.profiles).find((p) => p.id === id) || null;
}

export async function saveProfile(profile) {
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase.from("profiles").insert(profileToRow(profile)).select().single();
    if (error) { console.error("Supabase profile error:", error.message); return null; }
    return rowToProfile(data);
  }
  const stored = read(KEYS.profiles);
  const saved  = { ...profile, id: `up_${Date.now()}`, userSubmitted: true };
  write(KEYS.profiles, [...stored, saved]);
  return saved;
}

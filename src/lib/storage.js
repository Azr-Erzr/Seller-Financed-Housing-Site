// src/lib/storage.js
import { LISTINGS as SEED_LISTINGS, PROFILES as SEED_PROFILES } from "../data/seed";
import { supabase } from "./supabase";

const USE_SUPABASE = true; // ← connected

const KEYS = {
  listings:      "hm_listings",
  profiles:      "hm_profiles",
  savedListings: "hm_saved_listings",
  savedProfiles: "hm_saved_profiles",
};

const read  = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
const write = (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); return true; } catch { return false; } };

// ── Field mapping: JS camelCase ↔ Supabase snake_case ────────────────

function listingToRow(l) {
  return {
    title:         l.title,
    address:       l.address,
    city:          l.city,
    state:         l.state || "ON",
    image:         l.image || "",
    price:         Number(l.price),
    down_payment:  Number(l.downPayment),
    interest_min:  l.interestRange?.[0] ?? Number(l.interestMin ?? 0),
    interest_max:  l.interestRange?.[1] ?? Number(l.interestMax ?? 0),
    term:          Number(l.term),
    deal_type:     l.dealType,
    deal_types:    l.dealTypes || [],
    property_type: l.propertyType,
    bedrooms:      Number(l.bedrooms),
    bathrooms:     Number(l.bathrooms),
    sqft:          Number(l.sqft),
    lot:           l.lot || "",
    description:   l.description || "",
    badges:        l.badges || [],
    docs_locked:   l.docsLocked ?? true,
    is_active:     true,
  };
}

function rowToListing(r) {
  return {
    id:            r.id,
    title:         r.title,
    address:       r.address,
    city:          r.city,
    state:         r.state,
    image:         r.image,
    price:         r.price,
    downPayment:   r.down_payment,
    interest:      ((r.interest_min ?? 0) + (r.interest_max ?? 0)) / 2,
    interestRange: [r.interest_min ?? 0, r.interest_max ?? 0],
    term:          r.term,
    dealType:      r.deal_type,
    dealTypes:     r.deal_types || [],
    propertyType:  r.property_type,
    bedrooms:      r.bedrooms,
    bathrooms:     r.bathrooms,
    sqft:          r.sqft,
    lot:           r.lot,
    description:   r.description,
    badges:        r.badges || [],
    docsLocked:    r.docs_locked,
    createdAt:     r.created_at,
  };
}

function profileToRow(p) {
  return {
    name:             p.name,
    city:             p.city,
    bio:              p.bio || "",
    avatar:           p.avatar || "",
    budget:           Number(p.budget),
    down_payment:     Number(p.downPayment),
    payment_budget:   Number(p.paymentBudget),
    monthly_income:   Number(p.monthlyIncome),
    monthly_debt:     Number(p.monthlyDebt) || 0,
    interest_max:     Number(p.interestMax),
    interest_range:   p.interestRange || "",
    deal_preference:  p.dealPreference,
    deal_preferences: p.dealPreferences || [],
    risk_tolerance:   p.riskTolerance || "Moderate",
    badges:           p.badges || [],
    is_active:        true,
  };
}

function rowToProfile(r) {
  return {
    id:              r.id,
    name:            r.name,
    city:            r.city,
    bio:             r.bio,
    avatar:          r.avatar,
    budget:          r.budget,
    downPayment:     r.down_payment,
    paymentBudget:   r.payment_budget,
    monthlyIncome:   r.monthly_income,
    monthlyDebt:     r.monthly_debt,
    interestMax:     r.interest_max,
    interestRange:   r.interest_range,
    dealPreference:  r.deal_preference,
    dealPreferences: r.deal_preferences || [],
    riskTolerance:   r.risk_tolerance,
    badges:          r.badges || [],
    createdAt:       r.created_at,
  };
}

// ── Listings ──────────────────────────────────────────────────────────

export async function getAllListings() {
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) {
      const dbListings = data.map(rowToListing);
      return [...SEED_LISTINGS, ...dbListings];
    }
  }
  return [...SEED_LISTINGS, ...read(KEYS.listings)];
}

export async function getListingById(id) {
  if (USE_SUPABASE && supabase) {
    const seed = SEED_LISTINGS.find((l) => l.id === id);
    if (seed) return seed;
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) return rowToListing(data);
    return null;
  }
  return [...SEED_LISTINGS, ...read(KEYS.listings)].find((l) => l.id === id) || null;
}

export async function saveListing(listing) {
  if (USE_SUPABASE && supabase) {
    const row = listingToRow(listing);
    const { data, error } = await supabase
      .from("listings")
      .insert(row)
      .select()
      .single();
    if (error) {
      console.error("Supabase insert error:", error.message);
      return null;
    }
    return rowToListing(data);
  }
  const stored = read(KEYS.listings);
  const newListing = { ...listing, id: `ul_${Date.now()}`, userSubmitted: true };
  write(KEYS.listings, [...stored, newListing]);
  return newListing;
}

// ── Profiles ──────────────────────────────────────────────────────────

export async function getAllProfiles() {
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) {
      const dbProfiles = data.map(rowToProfile);
      return [...SEED_PROFILES, ...dbProfiles];
    }
  }
  return [...SEED_PROFILES, ...read(KEYS.profiles)];
}

export async function getProfileById(id) {
  if (USE_SUPABASE && supabase) {
    const seed = SEED_PROFILES.find((p) => p.id === id);
    if (seed) return seed;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) return rowToProfile(data);
    return null;
  }
  return [...SEED_PROFILES, ...read(KEYS.profiles)].find((p) => p.id === id) || null;
}

export async function saveProfile(profile) {
  if (USE_SUPABASE && supabase) {
    const row = profileToRow(profile);
    const { data, error } = await supabase
      .from("profiles")
      .insert(row)
      .select()
      .single();
    if (error) {
      console.error("Supabase insert error:", error.message);
      return null;
    }
    return rowToProfile(data);
  }
  const stored = read(KEYS.profiles);
  const newProfile = { ...profile, id: `up_${Date.now()}`, userSubmitted: true };
  write(KEYS.profiles, [...stored, newProfile]);
  return newProfile;
}

// ── Saved items ───────────────────────────────────────────────────────

export function getSavedListingIds()  { return read(KEYS.savedListings); }
export function getSavedProfileIds()  { return read(KEYS.savedProfiles); }

export function toggleSavedListing(id) {
  const saved = read(KEYS.savedListings);
  const updated = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id];
  write(KEYS.savedListings, updated);
  return updated.includes(id);
}

export function toggleSavedProfile(id) {
  const saved = read(KEYS.savedProfiles);
  const updated = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id];
  write(KEYS.savedProfiles, updated);
  return updated.includes(id);
}

export function isListingSaved(id) { return read(KEYS.savedListings).includes(id); }
export function isProfileSaved(id) { return read(KEYS.savedProfiles).includes(id); }

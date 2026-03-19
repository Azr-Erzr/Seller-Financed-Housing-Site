// src/lib/commercial-storage.js
// Batch 5 — renamed keys (selfi_*), user_id on insert, seed/live separation.

import { COMMERCIAL_LISTINGS as SEED_LISTINGS, COMMERCIAL_PROFILES as SEED_PROFILES } from "../data/commercial-seed";
import { supabase } from "./supabase";

const USE_SUPABASE = true;

const KEYS = {
  listings:       "selfi_comm_listings",
  profiles:       "selfi_comm_profiles",
  savedListings:  "selfi_comm_saved_listings",
  savedProfiles:  "selfi_comm_saved_profiles",
};

const read  = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
const write = (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); return true; } catch { return false; } };

// ── Migrate old hm_* keys ───────────────────────────────────────────
(function migrateKeys() {
  const OLD = { savedListings: "hm_comm_saved_listings", savedProfiles: "hm_comm_saved_profiles" };
  try {
    Object.entries(OLD).forEach(([newKey, oldKey]) => {
      const old = localStorage.getItem(oldKey);
      if (old && !localStorage.getItem(KEYS[newKey])) {
        localStorage.setItem(KEYS[newKey], old);
      }
      localStorage.removeItem(oldKey);
    });
    ["hm_comm_listings", "hm_comm_profiles"].forEach((k) => localStorage.removeItem(k));
  } catch {}
})();

// ── Save / toggle helpers ─────────────────────────────────────────────

export function isListingSaved(id) {
  return read(KEYS.savedListings).includes(String(id));
}

export function toggleSavedListing(id) {
  const saved = read(KEYS.savedListings);
  const sid = String(id);
  const next = saved.includes(sid) ? saved.filter((v) => v !== sid) : [...saved, sid];
  write(KEYS.savedListings, next);
  return next.includes(sid);
}

export function isProfileSaved(id) {
  return read(KEYS.savedProfiles).includes(String(id));
}

export function toggleSavedProfile(id) {
  const saved = read(KEYS.savedProfiles);
  const sid = String(id);
  const next = saved.includes(sid) ? saved.filter((v) => v !== sid) : [...saved, sid];
  write(KEYS.savedProfiles, next);
  return next.includes(sid);
}

// ── Auth helper ──────────────────────────────────────────────────────
async function getCurrentUserId() {
  if (!supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch { return null; }
}

// ── Field mapping ─────────────────────────────────────────────────────

function listingToRow(l, userId) {
  return {
    title:                l.title,
    address:              l.address,
    city:                 l.city,
    state:                l.state || "ON",
    image:                l.image || "",
    lat:                  l.lat || null,
    lng:                  l.lng || null,
    price:                Number(l.price),
    acreage:              l.acreage ? Number(l.acreage) : null,
    property_category:    l.propertyCategory,
    zoning:               l.zoning,
    utilities:            l.utilities || [],
    road_access:          l.roadAccess,
    permitted_uses:       l.permittedUses || [],
    environmental_status: l.environmentalStatus,
    existing_structures:  l.existingStructures,
    frontage:             l.frontage,
    deal_type:            l.dealType,
    deal_types:           l.dealTypes || [],
    down_payment:         l.downPayment ? Number(l.downPayment) : null,
    interest_min:         l.interestRange?.[0] ?? null,
    interest_max:         l.interestRange?.[1] ?? null,
    term:                 l.term ? Number(l.term) : null,
    description:          l.description || "",
    badges:               l.badges || [],
    docs_locked:          l.docsLocked ?? true,
    is_active:            true,
    owner_email:          l.ownerEmail || null,
    ...(userId ? { user_id: userId } : {}),
  };
}

function rowToListing(r) {
  return {
    id:                   r.id,
    title:                r.title,
    address:              r.address,
    city:                 r.city,
    state:                r.state,
    image:                r.image,
    lat:                  r.lat,
    lng:                  r.lng,
    price:                r.price,
    acreage:              r.acreage,
    propertyCategory:     r.property_category,
    zoning:               r.zoning,
    utilities:            r.utilities || [],
    roadAccess:           r.road_access,
    permittedUses:        r.permitted_uses || [],
    environmentalStatus:  r.environmental_status,
    existingStructures:   r.existing_structures,
    frontage:             r.frontage,
    dealType:             r.deal_type,
    dealTypes:            r.deal_types || [],
    downPayment:          r.down_payment,
    interest:             ((r.interest_min ?? 0) + (r.interest_max ?? 0)) / 2,
    interestRange:        [r.interest_min ?? 0, r.interest_max ?? 0],
    term:                 r.term,
    description:          r.description,
    badges:               r.badges || [],
    docsLocked:           r.docs_locked,
    createdAt:            r.created_at,
    isDemo:               false,
  };
}

function profileToRow(p, userId) {
  return {
    name:                p.name,
    contact:             p.contact,
    city:                p.city,
    state:               p.state || "ON",
    bio:                 p.bio || "",
    avatar:              p.avatar || "",
    budget:              Number(p.budget),
    down_payment:        Number(p.downPayment),
    interest_max:        Number(p.interestMax),
    interest_range:      p.interestRange || "",
    payment_budget:      Number(p.paymentBudget) || 0,
    monthly_income:      Number(p.monthlyIncome) || 0,
    monthly_debt:        Number(p.monthlyDebt) || 0,
    deal_preference:     p.dealPreference,
    deal_preferences:    p.dealPreferences || [],
    risk_tolerance:      p.riskTolerance || "Moderate",
    intended_uses:       p.intendedUses || [],
    property_categories: p.propertyCategories || [],
    zoning_preferences:  p.zoningPreferences || [],
    utilities_required:  p.utilitiesRequired || [],
    min_acreage:         p.minAcreage ? Number(p.minAcreage) : null,
    max_acreage:         p.maxAcreage ? Number(p.maxAcreage) : null,
    timeline_months:     p.timelineMonths ? Number(p.timelineMonths) : null,
    use_alias:           p.useAlias ?? p.use_alias ?? true,
    alias:               p.alias || null,
    badges:              p.badges || [],
    is_active:           true,
    owner_email:         p.ownerEmail || null,
    verification_status: p.verificationStatus || null,
    ...(userId ? { user_id: userId } : {}),
  };
}

function rowToProfile(r) {
  return {
    id:                 r.id,
    name:               r.name,
    contact:            r.contact,
    city:               r.city,
    bio:                r.bio,
    avatar:             r.avatar,
    budget:             r.budget,
    downPayment:        r.down_payment,
    interestMax:        r.interest_max,
    interestRange:      r.interest_range,
    paymentBudget:      r.payment_budget,
    monthlyIncome:      r.monthly_income,
    monthlyDebt:        r.monthly_debt,
    dealPreference:     r.deal_preference,
    dealPreferences:    r.deal_preferences || [],
    riskTolerance:      r.risk_tolerance,
    intendedUses:       r.intended_uses || [],
    propertyCategories: r.property_categories || [],
    zoningPreferences:  r.zoning_preferences || [],
    utilitiesRequired:  r.utilities_required || [],
    minAcreage:         r.min_acreage,
    maxAcreage:         r.max_acreage,
    timelineMonths:     r.timeline_months,
    useAlias:           r.use_alias ?? true,
    alias:              r.alias || null,
    badges:             r.badges || [],
    verificationStatus: r.verification_status || null,
    createdAt:          r.created_at,
    isDemo:             false,
  };
}

// ── Demo seed data (tagged) ──────────────────────────────────────────
const DEMO_LISTINGS = SEED_LISTINGS.map((l) => ({ ...l, isDemo: true }));
const DEMO_PROFILES = SEED_PROFILES.map((p) => ({ ...p, isDemo: true }));

// ── Public API ────────────────────────────────────────────────────────

export async function getAllCommListings() {
  let live = [];
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase
      .from("commercial_listings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) live = data.map(rowToListing);
  }
  if (live.length === 0) return [...DEMO_LISTINGS];
  return live;
}

export async function getCommListingById(id) {
  const demo = DEMO_LISTINGS.find((l) => l.id === id);
  if (demo) return demo;
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase.from("commercial_listings").select("*").eq("id", id).single();
    if (!error && data) return rowToListing(data);
  }
  return read(KEYS.listings).find((l) => l.id === id) || null;
}

export async function saveCommListing(listing) {
  if (USE_SUPABASE && supabase) {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase.from("commercial_listings").insert(listingToRow(listing, userId)).select().single();
    if (error) { console.error("Supabase error:", error.message); return null; }
    return rowToListing(data);
  }
  const stored = read(KEYS.listings);
  const saved = { ...listing, id: `ucl_${Date.now()}`, userSubmitted: true, isDemo: false };
  write(KEYS.listings, [...stored, saved]);
  return saved;
}

export async function getAllCommProfiles() {
  let live = [];
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase
      .from("public_commercial_profiles")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) live = data.map(rowToProfile);
  }
  if (live.length === 0) return [...DEMO_PROFILES];
  return live;
}

export async function getCommProfileById(id) {
  const demo = DEMO_PROFILES.find((p) => p.id === id);
  if (demo) return demo;
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase.from("public_commercial_profiles").select("*").eq("id", id).single();
    if (!error && data) return rowToProfile(data);
  }
  return read(KEYS.profiles).find((p) => p.id === id) || null;
}

export async function saveCommProfile(profile) {
  if (USE_SUPABASE && supabase) {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase.from("commercial_profiles").insert(profileToRow(profile, userId)).select().single();
    if (error) { console.error("Supabase error:", error.message); return null; }
    return rowToProfile(data);
  }
  const stored = read(KEYS.profiles);
  const saved = { ...profile, id: `ucp_${Date.now()}`, userSubmitted: true, isDemo: false };
  write(KEYS.profiles, [...stored, saved]);
  return saved;
}

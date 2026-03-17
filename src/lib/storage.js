// src/lib/storage.js
// ─────────────────────────────────────────────────────────────────────
// Data layer for HomeMatch.
//
// Currently uses localStorage for user submissions + static seed data.
//
// SUPABASE UPGRADE: When you're ready to connect a real database:
//   1. Add your env vars to Vercel (see .env.example)
//   2. Run supabase-schema.sql in your Supabase SQL editor
//   3. Set USE_SUPABASE = true below
//   4. Each function has a commented Supabase equivalent ready to go
// ─────────────────────────────────────────────────────────────────────

import { LISTINGS as SEED_LISTINGS, PROFILES as SEED_PROFILES } from "../data/seed";
// import { supabase } from "./supabase"; // uncomment when USE_SUPABASE = true

const USE_SUPABASE = false; // ← flip to true when Supabase is connected

const KEYS = {
  listings:       "hm_listings",
  profiles:       "hm_profiles",
  savedListings:  "hm_saved_listings",
  savedProfiles:  "hm_saved_profiles",
};

// ── Helpers ───────────────────────────────────────────────────────────

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
};

const write = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); return true; }
  catch { return false; }
};

// ── Listings ──────────────────────────────────────────────────────────

export async function getAllListings() {
  if (USE_SUPABASE) {
    // const { data } = await supabase.from("listings").select("*").eq("is_active", true);
    // return data || [];
  }
  return [...SEED_LISTINGS, ...read(KEYS.listings)];
}

export async function getListingById(id) {
  if (USE_SUPABASE) {
    // const { data } = await supabase.from("listings").select("*").eq("id", id).single();
    // return data;
  }
  const all = [...SEED_LISTINGS, ...read(KEYS.listings)];
  return all.find((l) => l.id === id) || null;
}

export async function saveListing(listing) {
  if (USE_SUPABASE) {
    // const { data, error } = await supabase.from("listings").insert(listing).select().single();
    // return error ? null : data;
  }
  const stored = read(KEYS.listings);
  const newListing = { ...listing, id: `ul_${Date.now()}`, userSubmitted: true, createdAt: new Date().toISOString() };
  write(KEYS.listings, [...stored, newListing]);
  return newListing;
}

// ── Profiles ──────────────────────────────────────────────────────────

export async function getAllProfiles() {
  if (USE_SUPABASE) {
    // const { data } = await supabase.from("profiles").select("*").eq("is_active", true);
    // return data || [];
  }
  return [...SEED_PROFILES, ...read(KEYS.profiles)];
}

export async function getProfileById(id) {
  if (USE_SUPABASE) {
    // const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
    // return data;
  }
  const all = [...SEED_PROFILES, ...read(KEYS.profiles)];
  return all.find((p) => p.id === id) || null;
}

export async function saveProfile(profile) {
  if (USE_SUPABASE) {
    // const { data, error } = await supabase.from("profiles").insert(profile).select().single();
    // return error ? null : data;
  }
  const stored = read(KEYS.profiles);
  const newProfile = { ...profile, id: `up_${Date.now()}`, userSubmitted: true, createdAt: new Date().toISOString() };
  write(KEYS.profiles, [...stored, newProfile]);
  return newProfile;
}

// ── Saved items (bookmarks) ───────────────────────────────────────────

export function getSavedListingIds() {
  // SUPABASE: await supabase.from("saved_listings").select("listing_id").eq("user_id", userId)
  return read(KEYS.savedListings);
}

export function getSavedProfileIds() {
  // SUPABASE: await supabase.from("saved_profiles").select("profile_id").eq("user_id", userId)
  return read(KEYS.savedProfiles);
}

export function toggleSavedListing(id) {
  // SUPABASE: upsert / delete from saved_listings
  const saved = read(KEYS.savedListings);
  const updated = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id];
  write(KEYS.savedListings, updated);
  return updated.includes(id);
}

export function toggleSavedProfile(id) {
  // SUPABASE: upsert / delete from saved_profiles
  const saved = read(KEYS.savedProfiles);
  const updated = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id];
  write(KEYS.savedProfiles, updated);
  return updated.includes(id);
}

export function isListingSaved(id) {
  return read(KEYS.savedListings).includes(id);
}

export function isProfileSaved(id) {
  return read(KEYS.savedProfiles).includes(id);
}

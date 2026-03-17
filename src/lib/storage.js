// src/lib/storage.js
// Merges static seed data with user-submitted listings/profiles from localStorage.
// When Supabase is added later, this file is the only thing that needs to change.

import { LISTINGS as SEED_LISTINGS, PROFILES as SEED_PROFILES } from "../data/seed";

const KEYS = {
  listings: "hm_listings",
  profiles: "hm_profiles",
};

// ── Read ──────────────────────────────────────────────────────────────

export function getAllListings() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEYS.listings) || "[]");
    return [...SEED_LISTINGS, ...stored];
  } catch {
    return SEED_LISTINGS;
  }
}

export function getAllProfiles() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEYS.profiles) || "[]");
    return [...SEED_PROFILES, ...stored];
  } catch {
    return SEED_PROFILES;
  }
}

export function getListingById(id) {
  return getAllListings().find((l) => l.id === id) || null;
}

export function getProfileById(id) {
  return getAllProfiles().find((p) => p.id === id) || null;
}

// ── Write ─────────────────────────────────────────────────────────────

export function saveListing(listing) {
  try {
    const stored = JSON.parse(localStorage.getItem(KEYS.listings) || "[]");
    const newListing = {
      ...listing,
      id: `ul_${Date.now()}`,
      userSubmitted: true,
    };
    localStorage.setItem(KEYS.listings, JSON.stringify([...stored, newListing]));
    return newListing;
  } catch (e) {
    console.error("Failed to save listing", e);
    return null;
  }
}

export function saveProfile(profile) {
  try {
    const stored = JSON.parse(localStorage.getItem(KEYS.profiles) || "[]");
    const newProfile = {
      ...profile,
      id: `up_${Date.now()}`,
      userSubmitted: true,
    };
    localStorage.setItem(KEYS.profiles, JSON.stringify([...stored, newProfile]));
    return newProfile;
  } catch (e) {
    console.error("Failed to save profile", e);
    return null;
  }
}

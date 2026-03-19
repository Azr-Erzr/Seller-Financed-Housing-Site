// src/components/ChatAgentGlobal.jsx
// Global floating wrapper for ChatAgent.
// Loads listings + profiles for the current mode, builds recommendation
// context for both listing and buyer matching, passes to AI chat.

import React, { useState, useEffect } from "react";
import { useSite } from "../context/SiteContext";
import { getAllListings, getAllProfiles } from "../lib/storage";
import { getAllCommListings, getAllCommProfiles } from "../lib/commercial-storage";
import {
  getListingRecommendations, getProfileRecommendations,
  deriveListingPreferences, buildRecommendationContext,
} from "../lib/smart-match";
import ChatAgent from "./ChatAgent";

const readIds = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };

export default function ChatAgentGlobal() {
  const { mode, MODES } = useSite();
  const [listings, setListings] = useState([]);
  const [recContext, setRecContext] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const isBiz = mode === MODES.business;
        const [allListings, allProfiles] = await Promise.all([
          isBiz ? getAllCommListings() : getAllListings(),
          isBiz ? getAllCommProfiles() : getAllProfiles(),
        ]);
        if (cancelled) return;
        setListings(allListings || []);

        // Build recommendation context from saved items
        const savedKey = isBiz ? "selfi_comm_saved_listings" : "selfi_saved_listings";
        const savedIds = readIds(savedKey);

        if (savedIds.length >= 2) {
          const savedListings = (allListings || []).filter((l) => savedIds.includes(String(l.id)));
          if (savedListings.length >= 2) {
            const prefs = deriveListingPreferences(savedListings);
            const { recommendations: listingRecs } = getListingRecommendations(allListings, savedListings, 5);
            const { recommendations: profileRecs } = getProfileRecommendations(allProfiles, savedListings, 5);
            const ctx = buildRecommendationContext(listingRecs, profileRecs, prefs, isBiz);
            setRecContext(ctx);
          } else {
            setRecContext("");
          }
        } else {
          setRecContext("");
        }
      } catch {
        // Chat works without context
      }
    };
    load();
    return () => { cancelled = true; };
  }, [mode, MODES]);

  return <ChatAgent listings={listings} floating={true} recommendationContext={recContext} />;
}

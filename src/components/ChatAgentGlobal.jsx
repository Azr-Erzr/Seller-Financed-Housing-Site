// src/components/ChatAgentGlobal.jsx
// Mega-Batch A — Integrates with FloatingProvider to hide chat FAB when
// bottom sheets or modals are open. Safe-area padding on mobile.

import React, { useState, useEffect } from "react";
import { useSite } from "../context/SiteContext";
import { getAllListings, getAllProfiles } from "../lib/storage";
import { getAllCommListings, getAllCommProfiles } from "../lib/commercial-storage";
import {
  getListingRecommendations, getProfileRecommendations,
  deriveListingPreferences, buildRecommendationContext,
} from "../lib/smart-match";
import { useFloating } from "./FloatingActionManager";
import ChatAgent from "./ChatAgent";

const readIds = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };

export default function ChatAgentGlobal() {
  const { mode, MODES } = useSite();
  const { chatHidden } = useFloating();
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

  // Hide chat FAB when FloatingProvider says another overlay is active
  if (chatHidden) return null;

  return <ChatAgent listings={listings} floating={true} recommendationContext={recContext} />;
}

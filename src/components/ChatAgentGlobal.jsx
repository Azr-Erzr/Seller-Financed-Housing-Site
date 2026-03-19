// src/components/ChatAgentGlobal.jsx
// Global floating wrapper for ChatAgent.
// Loads listings for the current mode + saved item recommendations
// to give the AI full context about what the user is interested in.

import React, { useState, useEffect } from "react";
import { useSite } from "../context/SiteContext";
import { getAllListings } from "../lib/storage";
import { getAllCommListings } from "../lib/commercial-storage";
import { getRecommendations, buildRecommendationContext } from "../lib/smart-match";
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
        const data = isBiz ? await getAllCommListings() : await getAllListings();
        if (cancelled) return;
        setListings(data || []);

        // Build recommendation context from saved items
        const savedKey = isBiz ? "hm_comm_saved_listings" : "hm_saved_listings";
        const savedIds = readIds(savedKey);
        if (savedIds.length >= 2) {
          const savedListings = (data || []).filter((l) => savedIds.includes(String(l.id)));
          if (savedListings.length >= 2) {
            const { recommendations, preferences } = getRecommendations(data, savedListings, 5);
            const ctx = buildRecommendationContext(recommendations, preferences, isBiz);
            setRecContext(ctx);
          } else {
            setRecContext("");
          }
        } else {
          setRecContext("");
        }
      } catch {
        // Chat works without listings context
      }
    };
    load();
    return () => { cancelled = true; };
  }, [mode, MODES]);

  return <ChatAgent listings={listings} floating={true} recommendationContext={recContext} />;
}

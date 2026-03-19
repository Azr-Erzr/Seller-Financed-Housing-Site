// src/components/ChatAgentGlobal.jsx
// Global floating wrapper for ChatAgent.
// Lazy-loads listings for the current mode to give the AI context.
// Positioned bottom-right, above SupportChat (which is bottom-left).

import React, { useState, useEffect } from "react";
import { useSite } from "../context/SiteContext";
import { getAllListings } from "../lib/storage";
import { getAllCommListings } from "../lib/commercial-storage";
import ChatAgent from "./ChatAgent";

export default function ChatAgentGlobal() {
  const { mode, MODES } = useSite();
  const [listings, setListings] = useState([]);

  // Load listings for AI context when mode changes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = mode === MODES.business
          ? await getAllCommListings()
          : await getAllListings();
        if (!cancelled) setListings(data || []);
      } catch {
        // Silently fail — chat will work without listings context
      }
    };
    load();
    return () => { cancelled = true; };
  }, [mode, MODES]);

  return <ChatAgent listings={listings} floating={true} />;
}

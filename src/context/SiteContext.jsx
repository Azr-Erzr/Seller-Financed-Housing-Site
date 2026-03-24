// src/context/SiteContext.jsx
// Controls whether the user is in "Homes" (residential) or "Business" (commercial) mode.
// Mode persists in localStorage so it survives page refresh.
// Subdomain detection: if hostname starts with "business." → force Business mode, lock switcher.

import React, { createContext, useContext, useState, useMemo } from "react";

const SiteContext = createContext(null);

const STORAGE_KEY = "selfi_site_mode";

export const MODES = {
  homes:    "homes",
  business: "business",
};

export const SITE_CONFIG = {
  homes: {
    mode:        "homes",
    name:        "Sel-Fi",
    tagline:     "Homes",
    fullName:    "Sel-Fi Homes",
    description: "Seller-financed & rent-to-own residential deals",
    primaryColor:   "#2563EB",
    primaryHover:   "#1D4ED8",
    accentColor:    "#F97316",
    accentHover:    "#EA580C",
    heroBg:         "from-blue-600 to-blue-800",
    badgeBg:        "bg-blue-600",
    btnPrimary:     "bg-blue-600 hover:bg-blue-700 text-white",
    btnAccent:      "bg-orange-500 hover:bg-orange-600 text-white",
    subbanner:      "Seller-financed & rent-to-own matches — no bank required",
    subbannerBg:    "bg-blue-50 border-blue-100 text-blue-600",
    logoGradient:   "from-blue-600 to-blue-800",
  },
  business: {
    mode:        "business",
    name:        "Sel-Fi",
    tagline:     "Business",
    fullName:    "Sel-Fi Business",
    description: "Commercial, land & development properties",
    primaryColor:   "#059669",
    primaryHover:   "#047857",
    accentColor:    "#D97706",
    accentHover:    "#B45309",
    heroBg:         "from-emerald-700 to-emerald-900",
    badgeBg:        "bg-emerald-600",
    btnPrimary:     "bg-emerald-600 hover:bg-emerald-700 text-white",
    btnAccent:      "bg-amber-500 hover:bg-amber-600 text-white",
    subbanner:      "Commercial & land deals — direct seller financing, agent-optional",
    subbannerBg:    "bg-emerald-50 border-emerald-100 text-emerald-700",
    logoGradient:   "from-emerald-600 to-emerald-800",
  },
};

// Detect if hostname forces a specific mode
function detectForcedMode() {
  try {
    const host = window.location.hostname.toLowerCase();
    if (host.startsWith("business.")) return MODES.business;
  } catch {}
  return null;
}

export function SiteProvider({ children }) {
  const forcedMode = useMemo(() => detectForcedMode(), []);
  const modeLocked = forcedMode !== null;

  const [mode, setModeState] = useState(() => {
    // If subdomain forces a mode, use that and persist it
    if (forcedMode) {
      try { localStorage.setItem(STORAGE_KEY, forcedMode); } catch {}
      return forcedMode;
    }
    // Otherwise read from storage (migrate old key if present)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
        || localStorage.getItem("hm_site_mode"); // migrate old key
      if (stored === MODES.business || stored === MODES.homes) {
        // Ensure new key is set
        localStorage.setItem(STORAGE_KEY, stored);
        return stored;
      }
    } catch {}
    return MODES.homes;
  });

  const setMode = (newMode) => {
    if (modeLocked) return; // subdomain locks mode — ignore manual switches
    try { localStorage.setItem(STORAGE_KEY, newMode); } catch {}
    setModeState(newMode);
  };

  const config = SITE_CONFIG[mode] || SITE_CONFIG.homes;

  return (
    <SiteContext.Provider value={{ mode, setMode, config, MODES, modeLocked }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

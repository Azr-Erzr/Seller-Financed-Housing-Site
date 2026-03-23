// src/components/ChatAgentMobile.jsx
// Mega-Batch E (Batch 22a) — Mobile-specific ChatAgent wrapper.
// On mobile (<640px), the chat opens as a full-screen bottom sheet instead
// of the 400px floating panel. Hides the FAB launcher when open.
// Reduced prompt card width. Safe-area padding for iOS.
//
// This wraps the existing ChatAgent — no need to rewrite the AI logic.
// Import this instead of ChatAgentGlobal in App.jsx if you want mobile-specific behavior,
// or keep ChatAgentGlobal and apply these CSS changes.

import React, { useState, useEffect } from "react";
import { useSite } from "../context/SiteContext";
import { useFloating } from "./FloatingActionManager";
import { Sparkles, X } from "lucide-react";

/**
 * Mobile-aware FAB button with safe-area positioning.
 * When clicked on mobile, opens chat as full-screen overlay.
 * On desktop, delegates to the existing ChatAgent floating behavior.
 */
export function MobileChatFAB({ onClick, isBusiness }) {
  const fabBg = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const dotColor = isBusiness ? "bg-emerald-400" : "bg-blue-400";

  return (
    <button
      onClick={onClick}
      className={`fixed z-[9990] w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 ${fabBg}`}
      style={{
        bottom: "max(24px, env(safe-area-inset-bottom, 24px))",
        right: "24px",
      }}
      title="Ask Sel-Fi AI"
      aria-label="Open AI chat assistant"
    >
      <Sparkles className="w-6 h-6" />
      <span className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${dotColor}`} />
    </button>
  );
}

/**
 * Full-screen mobile chat overlay.
 * Slides up from bottom, respects safe areas, has a close button.
 */
export function MobileChatOverlay({ children, onClose, isBusiness }) {
  const headerBg = isBusiness ? "bg-emerald-600" : "bg-blue-600";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9995] bg-white flex flex-col animate-slide-up"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Close bar */}
      <div className={`flex items-center justify-between px-4 py-3 ${headerBg}`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-sm font-bold text-white">Sel-Fi AI</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
          aria-label="Close chat"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Chat content fills remaining space */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

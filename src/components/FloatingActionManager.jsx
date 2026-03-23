// src/components/FloatingActionManager.jsx
// Batch 13 — Global collision manager for floating elements.
// Controls chat button visibility/position, prevents overlap with
// map attribution, bottom sheets, and iOS safe areas.

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const FloatingContext = createContext(null);

// Layers that can request the chat button to hide/reposition
const BLOCKER_PRIORITY = {
  bottomSheet: 100,
  contactModal: 90,
  mapAttribution: 50,
  keyboard: 80,
};

export function FloatingProvider({ children }) {
  const [blockers, setBlockers] = useState(new Set());
  const [bottomOffset, setBottomOffset] = useState(0);

  const registerBlocker = useCallback((id) => {
    setBlockers((prev) => new Set([...prev, id]));
  }, []);

  const unregisterBlocker = useCallback((id) => {
    setBlockers((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const chatHidden = blockers.size > 0;

  const value = useMemo(
    () => ({
      chatHidden,
      bottomOffset,
      setBottomOffset,
      registerBlocker,
      unregisterBlocker,
    }),
    [chatHidden, bottomOffset, registerBlocker, unregisterBlocker]
  );

  return (
    <FloatingContext.Provider value={value}>
      {children}
    </FloatingContext.Provider>
  );
}

export function useFloating() {
  const ctx = useContext(FloatingContext);
  if (!ctx) {
    // Graceful fallback if not wrapped in provider
    return {
      chatHidden: false,
      bottomOffset: 0,
      setBottomOffset: () => {},
      registerBlocker: () => {},
      unregisterBlocker: () => {},
    };
  }
  return ctx;
}

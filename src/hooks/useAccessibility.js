// src/hooks/useAccessibility.js
// Mega-Batch E (Batch 22b) — Accessibility utilities.
// Provides: focus management, keyboard trap for modals, skip navigation,
// reduced motion detection, and ARIA live region announcements.

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Detect if user prefers reduced motion.
 * Use to disable animations for accessibility.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * Keyboard trap for modals — Tab cycles within the container.
 * Returns a ref to attach to the modal container.
 */
export function useFocusTrap(active = true) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Focus first element
    if (first) first.focus();

    const handler = (e) => {
      if (e.key !== "Tab") return;
      if (focusable.length === 0) { e.preventDefault(); return; }

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    container.addEventListener("keydown", handler);
    return () => container.removeEventListener("keydown", handler);
  }, [active]);

  return containerRef;
}

/**
 * Announce text to screen readers via ARIA live region.
 * Creates a visually hidden live region and updates it.
 */
export function useAnnounce() {
  const regionRef = useRef(null);

  useEffect(() => {
    // Create live region if not exists
    let region = document.getElementById("selfi-sr-announcer");
    if (!region) {
      region = document.createElement("div");
      region.id = "selfi-sr-announcer";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-atomic", "true");
      region.style.cssText =
        "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;";
      document.body.appendChild(region);
    }
    regionRef.current = region;
  }, []);

  const announce = useCallback((text) => {
    if (regionRef.current) {
      regionRef.current.textContent = "";
      // Brief delay ensures screen reader picks up the change
      requestAnimationFrame(() => {
        if (regionRef.current) regionRef.current.textContent = text;
      });
    }
  }, []);

  return announce;
}

/**
 * Skip-to-main-content link.
 * Render this at the very top of your app (inside <body> or App.jsx).
 * Visible only on keyboard focus.
 */
export function SkipNav({ targetId = "main-content" }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[99999] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}

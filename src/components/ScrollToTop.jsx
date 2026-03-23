// src/components/ScrollToTop.jsx
// Scrolls to top on every route change.
// Uses both window.scrollTo AND document.documentElement to handle
// edge cases with sticky headers and fixed-position layouts.
// Also handles hash fragments: if URL has #section, scroll there instead.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash fragment (e.g. #financing), scroll to that element
    if (hash) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    // Otherwise scroll to absolute top
    // Use multiple methods to ensure it works across browsers and layout contexts
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // Safari fallback
  }, [pathname, hash]);

  return null;
}

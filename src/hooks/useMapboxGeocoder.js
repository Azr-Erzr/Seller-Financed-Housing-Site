// src/hooks/useMapboxGeocoder.js
// Batch 14 — Debounced Mapbox Geocoding API hook for address autocomplete.
// Returns suggestions as user types, with keyboard navigation support.

import { useState, useEffect, useRef, useCallback } from "react";
import { geocodeAddress } from "../lib/mapConfig";

export default function useMapboxGeocoder(options = {}) {
  const { debounceMs = 300, minChars = 2, proximity = null } = options;

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const timer = useRef(null);
  const abortRef = useRef(null);

  // Debounced fetch
  useEffect(() => {
    clearTimeout(timer.current);
    setSelectedIdx(-1);

    if (!query || query.length < minChars) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    timer.current = setTimeout(async () => {
      // Cancel previous request
      if (abortRef.current) abortRef.current.cancelled = true;
      const token = { cancelled: false };
      abortRef.current = token;

      const results = await geocodeAddress(query, {
        limit: 5,
        proximity,
      });

      if (!token.cancelled) {
        setSuggestions(results);
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer.current);
  }, [query, debounceMs, minChars, proximity]);

  // Select a suggestion
  const select = useCallback((suggestion) => {
    setQuery(suggestion.placeName || suggestion.text);
    setSuggestions([]);
    setSelectedIdx(-1);
    return suggestion;
  }, []);

  // Clear
  const clear = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setSelectedIdx(-1);
  }, []);

  // Keyboard handler for integration with input
  const onKeyDown = useCallback(
    (e) => {
      if (!suggestions.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter" && selectedIdx >= 0) {
        e.preventDefault();
        select(suggestions[selectedIdx]);
      } else if (e.key === "Escape") {
        setSuggestions([]);
      }
    },
    [suggestions, selectedIdx, select]
  );

  return {
    query,
    setQuery,
    suggestions,
    loading,
    selectedIdx,
    select,
    clear,
    onKeyDown,
  };
}

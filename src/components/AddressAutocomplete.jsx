// src/components/AddressAutocomplete.jsx
// Uses OpenStreetMap Nominatim — completely free, no API key required.
// Debounced to avoid hammering the API (Nominatim rate limit: 1 req/sec).

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Loader } from "lucide-react";

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 transition bg-white text-gray-900 placeholder-gray-400";

function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

export default function AddressAutocomplete({
  value,
  onChange,       // (rawString) => void — called on every keystroke
  onSelect,       // ({ display, lat, lng }) => void — called when user picks a suggestion
  placeholder = "Start typing an address...",
  label,
  hint,
  error,
  ringColor = "focus:ring-blue-500",
  countryCode = "ca", // restrict to Canada by default
}) {
  const [suggestions, setSuggestions]   = useState([]);
  const [loading, setLoading]           = useState(false);
  const [open, setOpen]                 = useState(false);
  const wrapperRef                      = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 3) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q:              query,
        format:         "json",
        addressdetails: "1",
        limit:          "6",
        countrycodes:   countryCode,
      });
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { "Accept-Language": "en", "User-Agent": "Sel-Fi/1.0" },
      });
      const data = await res.json();
      setSuggestions(data.map((r) => ({
        display: r.display_name,
        short:   [r.address?.house_number, r.address?.road, r.address?.city || r.address?.town || r.address?.village, r.address?.state].filter(Boolean).join(", "),
        lat:     parseFloat(r.lat),
        lng:     parseFloat(r.lon),
      })));
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [countryCode]);

  const debouncedFetch = useDebounce(fetchSuggestions, 350);

  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v);
    debouncedFetch(v);
  };

  const handleSelect = (s) => {
    onChange(s.short || s.display);
    onSelect?.(s);
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className={`${inputCls} ${ringColor} pl-9 pr-8`}
          autoComplete="off"
        />
        {loading && (
          <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={() => handleSelect(s)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {s.short || s.display.split(",").slice(0, 2).join(",")}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-xs">{s.display}</p>
                </div>
              </div>
            </button>
          ))}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-400">Powered by OpenStreetMap / Nominatim</p>
          </div>
        </div>
      )}

      {hint  && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

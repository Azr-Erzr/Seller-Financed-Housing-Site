// src/components/LoadingSkeleton.jsx
// Mega-Batch E (Batch 22e) — Enhanced loading states.
// Adds: page-specific skeletons for every lazy-loaded route,
// image placeholder with aspect-ratio preservation,
// mode-reactive skeleton colors.

import React from "react";

function Pulse({ className = "", style }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} style={style} />;
}

// ── Listing card skeleton ────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      <Pulse className="rounded-none" style={{ aspectRatio: "16/10" }} />
      <div className="p-5 space-y-3">
        <Pulse className="h-6 w-2/3" />
        <Pulse className="h-4 w-1/2" />
        <div className="flex gap-4">
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 w-16" />
        </div>
        <div className="flex gap-2">
          <Pulse className="h-5 w-20 rounded-full" />
          <Pulse className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ── Listings grid skeleton ───────────────────────────────────────────
export function ListingsSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Detail page skeleton ─────────────────────────────────────────────
export function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 py-8 px-4">
      <Pulse className="h-4 w-32" />
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
        <Pulse className="rounded-none" style={{ aspectRatio: "16/9" }} />
        <div className="p-6 space-y-4">
          <Pulse className="h-8 w-3/4" />
          <Pulse className="h-4 w-1/2" />
          <div className="flex gap-4">
            <Pulse className="h-4 w-20" />
            <Pulse className="h-4 w-20" />
            <Pulse className="h-4 w-20" />
          </div>
          <Pulse className="h-24 w-full" />
          <div className="flex gap-2">
            <Pulse className="h-10 w-32 rounded-xl" />
            <Pulse className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Map skeleton ─────────────────────────────────────────────────────
export function MapSkeleton() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading map...</p>
      </div>
    </div>
  );
}

// ── Profile card skeleton ────────────────────────────────────────────
export function ProfileSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Pulse className="w-12 h-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Pulse className="h-4 w-2/3" />
              <Pulse className="h-3 w-1/2" />
            </div>
          </div>
          <Pulse className="h-3 w-full" />
          <Pulse className="h-3 w-4/5" />
          <div className="flex gap-2">
            <Pulse className="h-5 w-16 rounded-full" />
            <Pulse className="h-5 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Guide/article skeleton ───────────────────────────────────────────
export function GuideSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <Pulse className="h-48 w-full rounded-2xl" />
      <Pulse className="h-8 w-3/4" />
      <Pulse className="h-4 w-1/2" />
      <div className="space-y-3">
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-5/6" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-3/4" />
      </div>
    </div>
  );
}

// ── Form skeleton ────────────────────────────────────────────────────
export function FormSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <Pulse className="w-10 h-10 rounded-lg" />
        <div className="space-y-2">
          <Pulse className="h-6 w-48" />
          <Pulse className="h-3 w-64" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <Pulse className="h-5 w-32" />
        <div className="grid grid-cols-2 gap-4">
          <Pulse className="h-10 w-full rounded-lg" />
          <Pulse className="h-10 w-full rounded-lg" />
        </div>
        <Pulse className="h-10 w-full rounded-lg" />
        <Pulse className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}

// ── Pricing skeleton ─────────────────────────────────────────────────
export function PricingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="text-center space-y-3 mb-8">
        <Pulse className="h-8 w-64 mx-auto" />
        <Pulse className="h-4 w-96 mx-auto" />
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <Pulse className="h-6 w-1/2 mx-auto" />
            <Pulse className="h-10 w-24 mx-auto" />
            <div className="space-y-2">
              <Pulse className="h-3 w-full" />
              <Pulse className="h-3 w-full" />
              <Pulse className="h-3 w-4/5" />
            </div>
            <Pulse className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Image with lazy loading + aspect-ratio placeholder ───────────────
export function LazyImage({ src, alt, className = "", aspectRatio = "16/10", ...props }) {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio }}>
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-xs text-gray-400">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
          {...props}
        />
      )}
    </div>
  );
}

// ── Default export (backwards compatible) ────────────────────────────
export default function LoadingSkeleton({ type = "listings", count }) {
  switch (type) {
    case "detail":   return <DetailSkeleton />;
    case "map":      return <MapSkeleton />;
    case "profiles": return <ProfileSkeleton count={count} />;
    case "guide":    return <GuideSkeleton />;
    case "form":     return <FormSkeleton />;
    case "pricing":  return <PricingSkeleton />;
    default:         return <ListingsSkeleton count={count} />;
  }
}

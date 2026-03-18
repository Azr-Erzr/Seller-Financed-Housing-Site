// src/components/LoadingSkeleton.jsx
// Lightweight loading states for key pages.
// Usage: <LoadingSkeleton type="listings" /> or <LoadingSkeleton type="detail" />

import React from "react";

function Pulse({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

export function ListingsSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <Pulse className="h-48 rounded-none" />
          <div className="p-5 space-y-3">
            <Pulse className="h-6 w-2/3" />
            <Pulse className="h-4 w-1/2" />
            <div className="flex gap-4">
              <Pulse className="h-4 w-16" />
              <Pulse className="h-4 w-16" />
              <Pulse className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 py-8 px-4">
      <Pulse className="h-4 w-32" />
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
        <Pulse className="h-72 md:h-96 rounded-none" />
        <div className="p-6 space-y-4">
          <Pulse className="h-8 w-3/4" />
          <Pulse className="h-4 w-1/2" />
          <div className="flex gap-4">
            <Pulse className="h-4 w-20" />
            <Pulse className="h-4 w-20" />
            <Pulse className="h-4 w-20" />
          </div>
          <Pulse className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}

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

export default function LoadingSkeleton({ type = "listings", count }) {
  if (type === "detail") return <DetailSkeleton />;
  if (type === "map") return <MapSkeleton />;
  return <ListingsSkeleton count={count} />;
}

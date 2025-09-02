// src/pages/Listings.jsx
import React, { useState } from "react";
import ListingCard from "../components/ListingCard";
import { LISTINGS } from "../data/seed";

export default function Listings() {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    location: "",
    dealTypes: [],
    propertyTypes: [],
    badges: [],
    matchMin: 0,
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredListings = LISTINGS.filter((listing) => {
    const price = listing.price || 0;
    const match = listing.match || 0;

    if (filters.minPrice && price < filters.minPrice) return false;
    if (filters.maxPrice && price > filters.maxPrice) return false;
    if (
      filters.location &&
      !listing.city.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;
    if (
      filters.dealTypes.length > 0 &&
      !filters.dealTypes.includes(listing.dealType)
    )
      return false;
    if (match < filters.matchMin) return false;
    if (
      filters.propertyTypes.length > 0 &&
      !filters.propertyTypes.includes(listing.propertyType)
    )
      return false;
    if (
      filters.badges.length > 0 &&
      !filters.badges.some((b) => listing.badges?.includes(b))
    )
      return false;

    return true;
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-1/4 bg-gray-50 p-6 border-r">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Location */}
        <input
          type="text"
          placeholder="City, ZIP..."
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
          className="mb-4 w-full border rounded px-3 py-2"
        />

        {/* Price */}
        <div className="flex space-x-2 mb-4">
          <input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", Number(e.target.value))}
            className="w-1/2 border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", Number(e.target.value))}
            className="w-1/2 border rounded px-3 py-2"
          />
        </div>

        {/* Deal Types */}
        <div className="mb-4">
          <span className="font-medium text-sm">Deal Type</span>
          {["Seller-Finance", "Rent-to-Own", "Lease Option"].map((type) => (
            <label key={type} className="block">
              <input
                type="checkbox"
                checked={filters.dealTypes.includes(type)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...filters.dealTypes, type]
                    : filters.dealTypes.filter((d) => d !== type);
                  updateFilter("dealTypes", updated);
                }}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>

        {/* Property Types */}
        <div className="mb-4">
          <span className="font-medium text-sm">Property Type</span>
          {["Single-Family", "Townhouse", "Condo", "Multi-Unit"].map((type) => (
            <label key={type} className="block">
              <input
                type="checkbox"
                checked={filters.propertyTypes.includes(type)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...filters.propertyTypes, type]
                    : filters.propertyTypes.filter((p) => p !== type);
                  updateFilter("propertyTypes", updated);
                }}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>

        {/* Badges */}
        <div className="mb-4">
          <span className="font-medium text-sm">Special Badges</span>
          {["Verified", "Popular", "New", "Flexible"].map((badge) => (
            <label key={badge} className="block">
              <input
                type="checkbox"
                checked={filters.badges.includes(badge)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...filters.badges, badge]
                    : filters.badges.filter((b) => b !== badge);
                  updateFilter("badges", updated);
                }}
                className="mr-2"
              />
              {badge}
            </label>
          ))}
        </div>

        {/* Match % */}
        <div className="mb-4">
          <span className="font-medium text-sm">
            Minimum Match: {filters.matchMin}%
          </span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.matchMin}
            onChange={(e) => updateFilter("matchMin", Number(e.target.value))}
            className="w-full"
          />
        </div>
      </aside>

      {/* Results */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Available Homes</h1>
        {filteredListings.length === 0 ? (
          <p className="text-gray-500">No homes found. Try adjusting filters.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

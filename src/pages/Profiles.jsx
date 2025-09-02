// src/pages/Profiles.jsx
import React, { useState } from "react";
import ProfileCard from "../components/ProfileCard";
import { PROFILES } from "../data/seed";

export default function Profiles() {
  const [filters, setFilters] = useState({
    minBudget: "",
    maxBudget: "",
    minDown: "",
    maxDown: "",
    interest: "",
    dealPrefs: [],
    riskTolerance: [],
    badges: [],
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredProfiles = PROFILES.filter((p) => {
    if (filters.minBudget && p.budget < filters.minBudget) return false;
    if (filters.maxBudget && p.budget > filters.maxBudget) return false;
    if (filters.minDown && p.downPayment < filters.minDown) return false;
    if (filters.maxDown && p.downPayment > filters.maxDown) return false;
    if (
      filters.interest &&
      !p.interestRange?.includes(filters.interest)
    )
      return false;
    if (
      filters.dealPrefs.length > 0 &&
      !filters.dealPrefs.includes(p.dealPreference)
    )
      return false;
    if (
      filters.riskTolerance.length > 0 &&
      !filters.riskTolerance.includes(p.riskTolerance)
    )
      return false;
    if (
      filters.badges.length > 0 &&
      !filters.badges.some((b) => p.badges?.includes(b))
    )
      return false;

    return true;
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 bg-gray-50 p-6 border-r">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Budget */}
        <div className="flex space-x-2 mb-4">
          <input
            type="number"
            placeholder="Min budget"
            value={filters.minBudget}
            onChange={(e) => updateFilter("minBudget", Number(e.target.value))}
            className="w-1/2 border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Max budget"
            value={filters.maxBudget}
            onChange={(e) => updateFilter("maxBudget", Number(e.target.value))}
            className="w-1/2 border rounded px-3 py-2"
          />
        </div>

        {/* Down Payment */}
        <div className="flex space-x-2 mb-4">
          <input
            type="number"
            placeholder="Min down"
            value={filters.minDown}
            onChange={(e) => updateFilter("minDown", Number(e.target.value))}
            className="w-1/2 border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Max down"
            value={filters.maxDown}
            onChange={(e) => updateFilter("maxDown", Number(e.target.value))}
            className="w-1/2 border rounded px-3 py-2"
          />
        </div>

        {/* Interest */}
        <label className="block mb-4">
          <span className="font-medium text-sm">Interest Preference</span>
          <input
            type="text"
            placeholder="e.g. 5-7%"
            value={filters.interest}
            onChange={(e) => updateFilter("interest", e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        {/* Deal Preferences */}
        <div className="mb-4">
          <span className="font-medium text-sm">Deal Preference</span>
          {["Seller-Finance", "Rent-to-Own", "Any"].map((pref) => (
            <label key={pref} className="block">
              <input
                type="checkbox"
                checked={filters.dealPrefs.includes(pref)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...filters.dealPrefs, pref]
                    : filters.dealPrefs.filter((d) => d !== pref);
                  updateFilter("dealPrefs", updated);
                }}
                className="mr-2"
              />
              {pref}
            </label>
          ))}
        </div>

        {/* Risk Tolerance */}
        <div className="mb-4">
          <span className="font-medium text-sm">Risk Tolerance</span>
          {["Low", "Moderate", "High"].map((r) => (
            <label key={r} className="block">
              <input
                type="checkbox"
                checked={filters.riskTolerance.includes(r)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...filters.riskTolerance, r]
                    : filters.riskTolerance.filter((x) => x !== r);
                  updateFilter("riskTolerance", updated);
                }}
                className="mr-2"
              />
              {r}
            </label>
          ))}
        </div>

        {/* Badges */}
        <div className="mb-4">
          <span className="font-medium text-sm">Badges</span>
          {["Verified", "Investor", "New", "Popular"].map((badge) => (
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
      </aside>

      {/* Results */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Active Buyers</h1>
        {filteredProfiles.length === 0 ? (
          <p className="text-gray-500">No buyers found. Try adjusting filters.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

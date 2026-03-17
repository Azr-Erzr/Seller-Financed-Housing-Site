// src/pages/Profiles.jsx
import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import ProfileCard from "../components/ProfileCard";
import { getAllProfiles } from "../lib/storage";

const DEAL_PREFS  = ["Seller-Finance", "Rent-to-Own", "Any"];
const RISK_LEVELS = ["Low", "Moderate", "High"];
const BADGES      = ["Verified", "Investor", "New", "Popular"];

export default function Profiles() {
  const [minBudget, setMinBudget]           = useState("");
  const [maxBudget, setMaxBudget]           = useState("");
  const [dealPrefs, setDealPrefs]           = useState([]);
  const [riskLevels, setRiskLevels]         = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const allProfiles = getAllProfiles();

  const filtered = allProfiles.filter((p) => {
    if (minBudget && p.budget < Number(minBudget)) return false;
    if (maxBudget && p.budget > Number(maxBudget)) return false;
    if (dealPrefs.length && !dealPrefs.includes(p.dealPreference)) return false;
    if (riskLevels.length && !riskLevels.includes(p.riskTolerance)) return false;
    if (selectedBadges.length && !selectedBadges.some((b) => p.badges?.includes(b))) return false;
    return true;
  });

  const clearFilters = () => {
    setMinBudget(""); setMaxBudget(""); setDealPrefs([]); setRiskLevels([]); setSelectedBadges([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Active Buyers</h1>
          <p className="text-gray-500">{filtered.length} {filtered.length === 1 ? "buyer" : "buyers"} found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </h2>
                <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear all</button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="number" placeholder="Max" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Deal Preference</label>
                <div className="space-y-2.5">
                  {DEAL_PREFS.map((pref) => (
                    <label key={pref} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={dealPrefs.includes(pref)} onChange={() => toggle(dealPrefs, setDealPrefs, pref)} className="w-4 h-4 rounded border-gray-300 accent-blue-600" />
                      <span className="text-sm text-gray-600">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Risk Tolerance</label>
                <div className="space-y-2.5">
                  {RISK_LEVELS.map((r) => (
                    <label key={r} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={riskLevels.includes(r)} onChange={() => toggle(riskLevels, setRiskLevels, r)} className="w-4 h-4 rounded border-gray-300 accent-blue-600" />
                      <span className="text-sm text-gray-600">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Badges</label>
                <div className="space-y-2.5">
                  {BADGES.map((badge) => (
                    <label key={badge} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={selectedBadges.includes(badge)} onChange={() => toggle(selectedBadges, setSelectedBadges, badge)} className="w-4 h-4 rounded border-gray-300 accent-blue-600" />
                      <span className="text-sm text-gray-600">{badge}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium mb-2">No buyers found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((profile) => <ProfileCard key={profile.id} profile={profile} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

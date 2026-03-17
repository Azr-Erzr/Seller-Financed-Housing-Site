// src/pages/business/BusinessProfiles.jsx
import React, { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import CommProfileCard from "../../components/business/CommProfileCard";
import { getAllCommProfiles } from "../../lib/commercial-storage";
import { PROPERTY_CATEGORIES, ZONING_TYPES, INTENDED_USES } from "../../data/commercial-seed";

const RISK_LEVELS = ["Low", "Moderate", "High"];

export default function BusinessProfiles() {
  const [allProfiles, setAllProfiles]   = useState([]);
  const [minBudget, setMinBudget]       = useState("");
  const [maxBudget, setMaxBudget]       = useState("");
  const [categories, setCategories]     = useState([]);
  const [intendedUses, setIntendedUses] = useState([]);
  const [riskLevels, setRiskLevels]     = useState([]);
  const [minAcreage, setMinAcreage]     = useState("");

  useEffect(() => { getAllCommProfiles().then(setAllProfiles); }, []);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const filtered = allProfiles.filter((p) => {
    if (minBudget && p.budget < Number(minBudget)) return false;
    if (maxBudget && p.budget > Number(maxBudget)) return false;
    if (categories.length && !categories.some((c) => p.propertyCategories?.includes(c))) return false;
    if (intendedUses.length && !intendedUses.some((u) => p.intendedUses?.includes(u))) return false;
    if (riskLevels.length && !riskLevels.includes(p.riskTolerance)) return false;
    if (minAcreage && p.maxAcreage && p.maxAcreage < Number(minAcreage)) return false;
    return true;
  });

  const clearFilters = () => {
    setMinBudget(""); setMaxBudget(""); setCategories([]);
    setIntendedUses([]); setRiskLevels([]); setMinAcreage("");
  };

  const CheckGroup = ({ title, options, state, setState }) => (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={state.includes(opt)} onChange={() => toggle(state, setState, opt)}
              className="w-4 h-4 rounded border-gray-300 accent-emerald-600" />
            <span className="text-sm text-gray-600">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Active Buyers</h1>
          <p className="text-gray-500">{filtered.length} {filtered.length === 1 ? "buyer" : "buyers"} found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </h2>
                <button onClick={clearFilters} className="text-xs text-emerald-600 hover:underline">Clear all</button>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min $" value={minBudget} onChange={(e) => setMinBudget(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input type="number" placeholder="Max $" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Acreage Needed</label>
                <input type="number" placeholder="e.g. 50" value={minAcreage} onChange={(e) => setMinAcreage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <CheckGroup title="Looking For" options={PROPERTY_CATEGORIES} state={categories} setState={setCategories} />
              <CheckGroup title="Intended Use" options={INTENDED_USES} state={intendedUses} setState={setIntendedUses} />
              <CheckGroup title="Risk Tolerance" options={RISK_LEVELS} state={riskLevels} setState={setRiskLevels} />
            </div>
          </aside>

          <main className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium mb-2">No buyers found</p>
                <p className="text-sm">Try adjusting your filters or <button onClick={clearFilters} className="text-emerald-600 hover:underline">clear all</button></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((profile) => <CommProfileCard key={profile.id} profile={profile} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

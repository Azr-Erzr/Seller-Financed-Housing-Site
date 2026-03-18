// src/components/SaveSearchModal.jsx
// Used on Listings, BusinessListings, MapSearch pages to save
// the current filter state + user email for alert emails.

import React, { useState } from "react";
import { X, Bell, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import { useSite } from "../context/SiteContext";
import { Link } from "react-router-dom";

export default function SaveSearchModal({ open, onClose, filters = {}, label = "" }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;

  const [searchLabel, setSearchLabel] = useState(label);
  const [email,       setEmail]       = useState(user?.email || "");
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);

  if (!open) return null;

  const accentBtn = isBusiness
    ? "bg-emerald-600 hover:bg-emerald-700"
    : "bg-blue-600 hover:bg-blue-700";

  const handleSave = async () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address to receive alerts.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        email: email.trim(),
        label: searchLabel.trim() || "My Search",
        mode: isBusiness ? "business" : "homes",
        user_id: user?.id || null,
        // Homes filters
        min_price:   filters.minPrice   || null,
        max_price:   filters.maxPrice   || null,
        min_beds:    filters.minBeds    || null,
        deal_types:  filters.dealTypes?.length ? filters.dealTypes : null,
        prop_types:  filters.propTypes?.length ? filters.propTypes : null,
        city:        filters.city       || null,
        // Business filters
        categories:  filters.categories?.length ? filters.categories : null,
        min_acreage: filters.minAcreage || null,
        alert_active: true,
      };

      const { error } = await supabase
        .from("saved_searches")
        .insert(payload);

      if (error) throw error;
      setSaved(true);
      toast.success("Search saved! We'll email you when new matches appear.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save search. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSaved(false);
    setSearchLabel(label);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 z-10 overflow-hidden">

        {/* Header */}
        <div className={`${isBusiness ? "bg-emerald-600" : "bg-blue-600"} px-6 py-5 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-white"/>
            <div>
              <p className="font-semibold text-white">Save This Search</p>
              <p className="text-xs text-white/70 mt-0.5">Get email alerts when new listings match</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-4 h-4 text-white"/>
          </button>
        </div>

        {saved ? (
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600"/>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Search Saved!</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-2">
              We'll email <strong>{email}</strong> whenever a new listing matches your filters.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Manage your saved searches and alerts in your account settings.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleClose}
                className={`px-5 py-2.5 text-white font-medium text-sm rounded-lg transition-colors ${accentBtn}`}>
                Done
              </button>
              <Link to="/account" onClick={handleClose}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors">
                View Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="px-6 py-6 space-y-4">

            {/* Current filters summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Current Filters</p>
              <div className="flex flex-wrap gap-1.5">
                {filters.city && <Chip label={filters.city}/>}
                {filters.minPrice && <Chip label={`Min $${(filters.minPrice/1000).toFixed(0)}K`}/>}
                {filters.maxPrice && <Chip label={`Max $${(filters.maxPrice/1000).toFixed(0)}K`}/>}
                {filters.minBeds > 0 && <Chip label={`${filters.minBeds}+ beds`}/>}
                {filters.dealTypes?.map((d) => <Chip key={d} label={d}/>)}
                {filters.propTypes?.map((p) => <Chip key={p} label={p}/>)}
                {filters.categories?.map((c) => <Chip key={c} label={c}/>)}
                {filters.minAcreage && <Chip label={`${filters.minAcreage}+ acres`}/>}
                {Object.values(filters).every((v) => !v || (Array.isArray(v) && !v.length)) && (
                  <span className="text-xs text-gray-400">No filters set — will match all new listings</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name this search <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={searchLabel}
                onChange={(e) => setSearchLabel(e.target.value)}
                placeholder='e.g. "3-bed Whitby under $600K"'
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email for alerts <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {!user && (
                <p className="text-xs text-gray-400 mt-1">
                  <Link to="/account" className="text-blue-600 hover:underline">Sign in</Link> to manage all your saved searches in one place.
                </p>
              )}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              🔔 We'll send you a daily digest when new listings match your filters.
              No spam — only relevant new listings. Unsubscribe anytime from your account.
            </p>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={saving || !email.trim()}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 ${accentBtn}`}>
                <Bell className="w-4 h-4"/>
                {saving ? "Saving..." : "Save & Get Alerts"}
              </button>
              <button onClick={handleClose}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 font-medium text-sm rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label }) {
  return (
    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{label}</span>
  );
}

// src/pages/Saved.jsx
// Auth-gated: requires sign-in to view saved items.
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Home, Users, Trash2, ArrowRight } from "lucide-react";
import { getAllListings, getAllProfiles } from "../lib/storage";
import ListingCard from "../components/ListingCard";
import ProfileCard from "../components/ProfileCard";
import { ListingRecommendations, BuyerRecommendations } from "../components/AIRecommendations";
import AuthGate from "../components/AuthGate";

const SAVED_LISTINGS_KEY = "selfi_saved_listings";
const SAVED_PROFILES_KEY = "selfi_saved_profiles";

const readIds  = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
const writeIds = (key, ids) => { try { localStorage.setItem(key, JSON.stringify(ids)); } catch {} };

function SavedContent() {
  const [tab,             setTab]             = useState("listings");
  const [savedListingIds, setSavedListingIds] = useState([]);
  const [savedProfileIds, setSavedProfileIds] = useState([]);
  const [savedListings,   setSavedListings]   = useState([]);
  const [savedProfiles,   setSavedProfiles]   = useState([]);
  const [allListings,     setAllListings]     = useState([]);
  const [allProfiles,     setAllProfiles]     = useState([]);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    const lIds = readIds(SAVED_LISTINGS_KEY);
    const pIds = readIds(SAVED_PROFILES_KEY);
    setSavedListingIds(lIds);
    setSavedProfileIds(pIds);
    Promise.all([getAllListings(), getAllProfiles()]).then(([allL, allP]) => {
      setAllListings(allL);
      setAllProfiles(allP);
      setSavedListings(allL.filter((l) => lIds.includes(String(l.id))));
      setSavedProfiles(allP.filter((p) => pIds.includes(String(p.id))));
      setLoading(false);
    });
  }, []);

  const removeListing = (id) => {
    const next = savedListingIds.filter((v) => v !== String(id));
    writeIds(SAVED_LISTINGS_KEY, next);
    setSavedListingIds(next);
    setSavedListings((prev) => prev.filter((l) => String(l.id) !== String(id)));
  };

  const removeProfile = (id) => {
    const next = savedProfileIds.filter((v) => v !== String(id));
    writeIds(SAVED_PROFILES_KEY, next);
    setSavedProfileIds(next);
    setSavedProfiles((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Bookmark className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Saved — Homes</h1>
            <p className="text-gray-500 text-sm">Listings and buyer profiles you've bookmarked</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {[
            { id: "listings", label: "Saved Listings", icon: <Home className="w-4 h-4" />,  count: savedListings.length },
            { id: "profiles", label: "Saved Buyers",   icon: <Users className="w-4 h-4" />, count: savedProfiles.length },
          ].map(({ id, label, icon, count }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab===id ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}>
              {icon}{label}
              {count > 0 && (
                <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${tab===id?"bg-white/20 text-white":"bg-gray-200 text-gray-600"}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading your saved items...</div>
        ) : tab === "listings" ? (
          <>
            <ListingRecommendations savedListings={savedListings} allListings={allListings} isBusiness={false} />
            <BuyerRecommendations savedListings={savedListings} allProfiles={allProfiles} isBusiness={false} />
            {savedListings.length === 0 ? (
              <Empty icon={<Home className="w-10 h-10 text-gray-300" />} title="No saved listings yet"
                body="When you bookmark a listing, it'll appear here." linkTo="/listings" linkLabel="Browse Listings" color="blue" />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedListings.map((listing) => (
                  <div key={listing.id} className="relative group">
                    <ListingCard listing={listing} />
                    <button onClick={() => removeListing(listing.id)} title="Remove"
                      className="absolute top-3 right-3 w-7 h-7 bg-white/90 hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all z-10">
                      <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          savedProfiles.length === 0 ? (
            <Empty icon={<Users className="w-10 h-10 text-gray-300" />} title="No saved buyer profiles"
              body="When you bookmark a buyer, it'll appear here." linkTo="/profiles" linkLabel="Browse Buyers" color="blue" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedProfiles.map((profile) => (
                <div key={profile.id} className="relative group">
                  <ProfileCard profile={profile} />
                  <button onClick={() => removeProfile(profile.id)} title="Remove"
                    className="absolute top-3 right-3 w-7 h-7 bg-white/90 hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all z-10">
                    <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function Empty({ icon, title, body, linkTo, linkLabel, color }) {
  const btnCls = color === "emerald" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  return (
    <div className="text-center py-20 text-gray-400">
      <div className="flex justify-center mb-4">{icon}</div>
      <p className="font-semibold text-gray-600 text-lg mb-2">{title}</p>
      <p className="text-sm mb-6 max-w-xs mx-auto">{body}</p>
      <Link to={linkTo} className={`inline-flex items-center gap-2 px-5 py-2.5 text-white font-medium rounded-lg transition-colors text-sm ${btnCls}`}>
        {linkLabel} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function Saved() {
  return (
    <AuthGate title="Sign in to see your saved items" message="Save listings and buyer profiles to review later. Create a free account to get started.">
      <SavedContent />
    </AuthGate>
  );
}

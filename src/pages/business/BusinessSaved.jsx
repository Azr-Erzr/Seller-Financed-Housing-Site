// src/pages/business/BusinessSaved.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Building2, Users, Trash2, ArrowRight } from "lucide-react";
import { getAllCommListings, getAllCommProfiles } from "../../lib/commercial-storage";
import CommListingCard from "../../components/business/CommListingCard";
import CommProfileCard from "../../components/business/CommProfileCard";

const SAVED_LISTINGS_KEY = "hm_comm_saved_listings";
const SAVED_PROFILES_KEY = "hm_comm_saved_profiles";

const readIds  = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
const writeIds = (key, ids) => { try { localStorage.setItem(key, JSON.stringify(ids)); } catch {} };

export default function BusinessSaved() {
  const [tab,             setTab]             = useState("listings");
  const [savedListingIds, setSavedListingIds] = useState([]);
  const [savedProfileIds, setSavedProfileIds] = useState([]);
  const [savedListings,   setSavedListings]   = useState([]);
  const [savedProfiles,   setSavedProfiles]   = useState([]);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    const lIds = readIds(SAVED_LISTINGS_KEY);
    const pIds = readIds(SAVED_PROFILES_KEY);
    setSavedListingIds(lIds);
    setSavedProfileIds(pIds);

    Promise.all([getAllCommListings(), getAllCommProfiles()]).then(([allListings, allProfiles]) => {
      setSavedListings(allListings.filter((l) => lIds.includes(String(l.id))));
      setSavedProfiles(allProfiles.filter((p) => pIds.includes(String(p.id))));
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

  const Tab = ({ id, label, icon, count }) => (
    <button onClick={() => setTab(id)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        tab === id ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
      }`}>
      {icon}
      {label}
      {count > 0 && (
        <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
          tab === id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
        }`}>{count}</span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
            <Bookmark className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Saved — Business</h1>
            <p className="text-gray-500 text-sm">Commercial properties and buyer profiles you've bookmarked</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <Tab id="listings" label="Saved Properties" icon={<Building2 className="w-4 h-4" />} count={savedListings.length} />
          <Tab id="profiles" label="Saved Buyers"     icon={<Users className="w-4 h-4" />}    count={savedProfiles.length} />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading your saved items...</div>
        ) : tab === "listings" ? (
          savedListings.length === 0 ? (
            <EmptyBusiness
              icon={<Building2 className="w-10 h-10 text-gray-300" />}
              title="No saved properties yet"
              body="When you bookmark a commercial property, it'll appear here."
              linkTo="/business/listings"
              linkLabel="Browse Properties"
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedListings.map((listing) => (
                <div key={listing.id} className="relative group">
                  <CommListingCard listing={listing} />
                  <button onClick={() => removeListing(listing.id)} title="Remove"
                    className="absolute top-3 right-3 w-7 h-7 bg-white/90 hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all z-10">
                    <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          savedProfiles.length === 0 ? (
            <EmptyBusiness
              icon={<Users className="w-10 h-10 text-gray-300" />}
              title="No saved buyer profiles"
              body="When you bookmark a buyer, it'll appear here."
              linkTo="/business/profiles"
              linkLabel="Browse Buyers"
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {savedProfiles.map((profile) => (
                <div key={profile.id} className="relative group">
                  <CommProfileCard profile={profile} />
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

function EmptyBusiness({ icon, title, body, linkTo, linkLabel }) {
  return (
    <div className="text-center py-20 text-gray-400">
      <div className="flex justify-center mb-4">{icon}</div>
      <p className="font-semibold text-gray-600 text-lg mb-2">{title}</p>
      <p className="text-sm mb-6 max-w-xs mx-auto">{body}</p>
      <Link to={linkTo}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm">
        {linkLabel} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

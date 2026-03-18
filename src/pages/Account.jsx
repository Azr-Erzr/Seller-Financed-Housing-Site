// src/pages/Account.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSite } from "../context/SiteContext";
import { supabase } from "../lib/supabase";
import { Mail, CheckCircle, Shield, Eye, ArrowRight, User, Bell, Trash2, ToggleLeft, ToggleRight, LogOut } from "lucide-react";

export default function Account() {
  const { user, loading, signOut, signInWithEmail } = useAuth();
  const { mode, MODES } = useSite();
  const navigate = useNavigate();

  const isBusiness = mode === MODES.business;
  const primary    = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const accentText = isBusiness ? "text-emerald-600" : "text-blue-600";
  const heroBg     = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const iconBg     = isBusiness ? "bg-emerald-100" : "bg-blue-100";

  // Sign-in form state
  const [email,   setEmail]   = useState("");
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  // Saved searches
  const [searches, setSearches] = useState([]);
  const [loadingSearches, setLoadingSearches] = useState(false);

  useEffect(() => {
    if (user) loadSavedSearches();
  }, [user]);

  const loadSavedSearches = async () => {
    if (!supabase || !user) return;
    setLoadingSearches(true);
    const { data } = await supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setSearches(data || []);
    setLoadingSearches(false);
  };

  const toggleAlert = async (id, current) => {
    await supabase.from("saved_searches").update({ alert_active: !current }).eq("id", id);
    setSearches((prev) => prev.map((s) => s.id === id ? { ...s, alert_active: !current } : s));
  };

  const deleteSearch = async (id) => {
    await supabase.from("saved_searches").delete().eq("id", id);
    setSearches((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    setError(""); setSending(true);
    const { error: authError } = await signInWithEmail(email.trim());
    setSending(false);
    if (authError) { setError("Something went wrong. Please try again."); return; }
    setSent(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;

  // ── Signed in ────────────────────────────────────────────────────────
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${iconBg} flex items-center justify-center`}>
                  <User className={`w-7 h-7 ${accentText}`}/>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{user.email}</p>
                  <p className="text-sm text-gray-400">
                    Member since {new Date(user.created_at).toLocaleDateString("en-CA", { year:"numeric", month:"long" })}
                  </p>
                </div>
              </div>
              <button onClick={handleSignOut}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                <LogOut className="w-4 h-4"/> Sign Out
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { to: isBusiness?"/business/saved":"/saved",                label:"My Saved",        sub:"Bookmarked listings & profiles" },
              { to: isBusiness?"/business/listings":"/listings",          label:"Browse",          sub:isBusiness?"Properties":"Homes" },
              { to: isBusiness?"/business/create-profile":"/create-profile", label:"Buyer Profile",   sub:"Create or update" },
              { to: isBusiness?"/business/list-property":"/list-home",    label:isBusiness?"List a Property":"List a Home", sub:"Post your listing" },
            ].map(({ to, label, sub }) => (
              <Link key={to} to={to}
                className={`p-4 rounded-xl border-2 transition-all hover:shadow-sm ${
                  isBusiness ? "border-emerald-100 hover:border-emerald-300 bg-emerald-50" : "border-blue-100 hover:border-blue-300 bg-blue-50"
                }`}>
                <p className={`font-semibold text-sm ${accentText}`}>{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
              </Link>
            ))}
          </div>

          {/* Saved searches */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Bell className={`w-5 h-5 ${accentText}`}/>
                <h2 className="font-bold text-gray-900">Saved Searches & Alerts</h2>
              </div>
              <span className="text-xs text-gray-400">{searches.length} saved</span>
            </div>

            {loadingSearches ? (
              <p className="text-sm text-gray-400 py-4 text-center">Loading...</p>
            ) : searches.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3"/>
                <p className="font-medium text-gray-600 mb-1">No saved searches yet</p>
                <p className="text-sm mb-4">Use the "Save Search" button on any listing page to get email alerts for new matches.</p>
                <Link to={isBusiness?"/business/listings":"/listings"}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${primary}`}>
                  Browse Listings <ArrowRight className="w-4 h-4"/>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {searches.map((search) => (
                  <div key={search.id} className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {search.label || "Saved Search"}
                        </p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          search.mode === "business" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {search.mode === "business" ? "Business" : "Homes"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {search.city && <FilterChip label={search.city}/>}
                        {search.min_price && <FilterChip label={`Min $${(search.min_price/1000).toFixed(0)}K`}/>}
                        {search.max_price && <FilterChip label={`Max $${(search.max_price/1000).toFixed(0)}K`}/>}
                        {search.min_beds > 0 && <FilterChip label={`${search.min_beds}+ beds`}/>}
                        {search.deal_types?.map((d) => <FilterChip key={d} label={d}/>)}
                        {search.categories?.map((c) => <FilterChip key={c} label={c}/>)}
                        {!search.city && !search.min_price && !search.min_beds && !search.deal_types?.length && !search.categories?.length && (
                          <span className="text-xs text-gray-400">All new listings</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Alerts to: <span className="font-medium">{search.email}</span>
                        {search.last_alerted && ` · Last sent ${new Date(search.last_alerted).toLocaleDateString("en-CA")}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggleAlert(search.id, search.alert_active)}
                        title={search.alert_active ? "Disable alerts" : "Enable alerts"}
                        className="flex items-center gap-1 text-xs font-medium transition-colors">
                        {search.alert_active
                          ? <><ToggleRight className="w-5 h-5 text-green-500"/> <span className="text-green-600">On</span></>
                          : <><ToggleLeft className="w-5 h-5 text-gray-400"/> <span className="text-gray-400">Off</span></>
                        }
                      </button>
                      <button onClick={() => deleteSearch(search.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Sign in form ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-br ${heroBg} py-14`}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-3" style={{color:"#fff"}}>
            Sign in to LandMatch
          </h1>
          <p className="text-base" style={{color:isBusiness?"#a7f3d0":"#bfdbfe"}}>
            No password needed — we'll send a secure sign-in link to your email.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">
        {sent ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600"/>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
            <p className="text-gray-500 text-sm mb-2">We sent a sign-in link to</p>
            <p className="font-semibold text-gray-900 mb-6">{email}</p>
            <p className="text-xs text-gray-400 mb-6">
              Click the link in that email to sign in. It expires in 1 hour. Check spam if you don't see it.
            </p>
            <button onClick={() => { setSent(false); setEmail(""); }}
              className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors">
              Use a different email
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="font-bold text-gray-900 text-xl mb-1">Sign in or create account</h2>
            <p className="text-gray-500 text-sm mb-6">
              New to LandMatch? Just enter your email — we'll create your account automatically.
            </p>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com" required
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/>
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
              <button type="submit" disabled={sending}
                className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}>
                {sending ? "Sending link..." : <><span>Continue</span><ArrowRight className="w-4 h-4"/></>}
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-gray-50 grid gap-3">
              {[
                { icon: <Shield className="w-4 h-4 text-green-600"/>,  text: "No password — magic link only" },
                { icon: <Eye    className="w-4 h-4 text-blue-600"/>,   text: "Your data is never sold or shared" },
                { icon: <Mail   className="w-4 h-4 text-purple-600"/>, text: "Sign-in link expires in 1 hour" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500">
                  {icon}<span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ label }) {
  return (
    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{label}</span>
  );
}

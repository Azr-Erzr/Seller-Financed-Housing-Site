// src/pages/Account.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSite } from "../context/SiteContext";
import { supabase } from "../lib/supabase";
import {
  Mail, CheckCircle, Shield, Eye, EyeOff, ArrowRight, User, Bell,
  Trash2, ToggleLeft, ToggleRight, LogOut, Lock, UserPlus, LogIn,
  KeyRound, AlertTriangle,
} from "lucide-react";

const TABS = { signIn: "signIn", register: "register" };

export default function Account() {
  const {
    user, loading, signOut,
    signInWithPassword, signUpWithPassword, signInWithEmail, resetPassword,
  } = useAuth();
  const { mode, MODES } = useSite();
  const navigate = useNavigate();

  const isBusiness = mode === MODES.business;
  const primary    = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const accentText = isBusiness ? "text-emerald-600" : "text-blue-600";
  const heroBg     = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const iconBg     = isBusiness ? "bg-emerald-100" : "bg-blue-100";
  const ringColor  = isBusiness ? "focus:ring-emerald-400" : "focus:ring-blue-400";
  const tabActive  = isBusiness ? "text-emerald-600 border-emerald-600" : "text-blue-600 border-blue-600";

  // Auth form state
  const [tab, setTab] = useState(TABS.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [successView, setSuccessView] = useState(null); // "registered" | "reset" | "magic"
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [showReset, setShowReset] = useState(false);

  // Saved searches
  const [searches, setSearches] = useState([]);
  const [loadingSearches, setLoadingSearches] = useState(false);

  // MFA state
  const [mfaEnrolled, setMfaEnrolled] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSavedSearches();
      checkMfaStatus();
    }
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

  const checkMfaStatus = async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase.auth.mfa.listFactors();
      const totpFactors = data?.totp || [];
      setMfaEnrolled(totpFactors.some((f) => f.status === "verified"));
    } catch {
      // MFA not available or not configured
    }
  };

  const toggleAlert = async (id, current) => {
    await supabase.from("saved_searches").update({ alert_active: !current }).eq("id", id);
    setSearches((prev) => prev.map((s) => s.id === id ? { ...s, alert_active: !current } : s));
  };

  const deleteSearch = async (id) => {
    await supabase.from("saved_searches").delete().eq("id", id);
    setSearches((prev) => prev.filter((s) => s.id !== id));
  };

  // ── Auth handlers ─────────────────────────────────────────────────

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setError(""); setSending(true);
    const { error: authErr } = await signInWithPassword(email.trim(), password);
    setSending(false);
    if (authErr) {
      setError(authErr.includes("Invalid") ? "Invalid email or password." : authErr);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    setError(""); setSending(true);
    const { error: authErr } = await signUpWithPassword(email.trim(), password);
    setSending(false);
    if (authErr) { setError(authErr); return; }
    setSuccessView("registered");
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    setError(""); setSending(true);
    const { error: authErr } = await signInWithEmail(email.trim());
    setSending(false);
    if (authErr) { setError("Something went wrong. Please try again."); return; }
    setSuccessView("magic");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setError("Please enter your email first."); return; }
    setError(""); setSending(true);
    const { error: resetErr } = await resetPassword(email.trim());
    setSending(false);
    if (resetErr) { setError(resetErr); return; }
    setSuccessView("reset");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // ── Password strength ─────────────────────────────────────────────
  const getPasswordStrength = (pw) => {
    if (!pw) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
    if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
    if (score <= 4) return { score: 4, label: "Strong", color: "bg-green-500" };
    return { score: 5, label: "Very strong", color: "bg-green-600" };
  };

  const strength = getPasswordStrength(password);

  if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;

  // ══════════════════════════════════════════════════════════════════
  // SIGNED IN VIEW
  // ══════════════════════════════════════════════════════════════════
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

          {/* MFA prompt (if not enrolled) */}
          {!mfaEnrolled && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-amber-900">Enable Two-Factor Authentication</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded-full">Strongly Recommended</span>
                </div>
                <p className="text-sm text-amber-800 mb-3">
                  Add an extra layer of security to your account. Use an authenticator app
                  like Google Authenticator or Authy to generate time-based codes.
                </p>
                <p className="text-xs text-amber-600">
                  MFA setup will be available in a future update. We'll notify you when it's ready.
                </p>
              </div>
            </div>
          )}

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

  // ══════════════════════════════════════════════════════════════════
  // SIGNED OUT VIEW — tabbed sign in / register
  // ══════════════════════════════════════════════════════════════════

  // Success views
  if (successView) {
    const cfg = {
      registered: {
        title: "Check your email to verify",
        message: `We sent a verification link to ${email}. Click it to activate your account, then sign in.`,
        hint: "Check spam if you don't see it. The link expires in 24 hours.",
      },
      reset: {
        title: "Password reset link sent",
        message: `We sent a reset link to ${email}. Click it to set a new password.`,
        hint: "Check spam if you don't see it. The link expires in 1 hour.",
      },
      magic: {
        title: "Check your inbox",
        message: `We sent a sign-in link to ${email}. Click it to sign in instantly.`,
        hint: "Check spam if you don't see it. The link expires in 1 hour.",
      },
    }[successView];

    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`bg-gradient-to-br ${heroBg} py-14`}>
          <div className="max-w-xl mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-3" style={{color:"#fff"}}>Almost there!</h1>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600"/>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{cfg.title}</h2>
            <p className="text-gray-600 text-sm mb-1">{cfg.message}</p>
            <p className="text-xs text-gray-400 mb-6">{cfg.hint}</p>
            {successView === "registered" && (
              <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Enable MFA</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded-full">Strongly Recommended</span>
                </div>
                <p className="text-xs text-amber-700">
                  After verifying your email, visit your Account page to enable
                  two-factor authentication for extra security.
                </p>
              </div>
            )}
            <button onClick={() => { setSuccessView(null); setPassword(""); setConfirmPassword(""); }}
              className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors">
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Forgot password sub-view
  if (showReset) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`bg-gradient-to-br ${heroBg} py-14`}>
          <div className="max-w-xl mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-3" style={{color:"#fff"}}>Reset your password</h1>
            <p className="text-base" style={{color:isBusiness?"#a7f3d0":"#bfdbfe"}}>
              We'll send a link to set a new password.
            </p>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com" required
                    className={`w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}/>
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
              <button type="submit" disabled={sending}
                className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}>
                {sending ? "Sending..." : <>Send reset link <ArrowRight className="w-4 h-4"/></>}
              </button>
            </form>
            <button onClick={() => { setShowReset(false); setError(""); }}
              className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Magic link sub-view
  if (showMagicLink) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={`bg-gradient-to-br ${heroBg} py-14`}>
          <div className="max-w-xl mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-3" style={{color:"#fff"}}>Magic link sign-in</h1>
            <p className="text-base" style={{color:isBusiness?"#a7f3d0":"#bfdbfe"}}>
              No password needed — we'll email you a one-click link.
            </p>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com" required
                    className={`w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}/>
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
              <button type="submit" disabled={sending}
                className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}>
                {sending ? "Sending..." : <>Send magic link <ArrowRight className="w-4 h-4"/></>}
              </button>
            </form>
            <button onClick={() => { setShowMagicLink(false); setError(""); }}
              className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Back to sign in with password
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main tabbed form ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-br ${heroBg} py-14`}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-3" style={{color:"#fff"}}>
            {tab === TABS.signIn ? "Sign in to Sel-Fi" : "Create your Sel-Fi account"}
          </h1>
          <p className="text-base" style={{color:isBusiness?"#a7f3d0":"#bfdbfe"}}>
            {tab === TABS.signIn
              ? "Enter your email and password to continue."
              : "Free to join — start browsing seller-financed deals today."
            }
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button onClick={() => { setTab(TABS.signIn); setError(""); setPassword(""); setConfirmPassword(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === TABS.signIn ? tabActive : "text-gray-400 border-transparent hover:text-gray-600"
              }`}>
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
            <button onClick={() => { setTab(TABS.register); setError(""); setPassword(""); setConfirmPassword(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === TABS.register ? tabActive : "text-gray-400 border-transparent hover:text-gray-600"
              }`}>
              <UserPlus className="w-3.5 h-3.5" /> Register
            </button>
          </div>

          <div className="p-8">
            {tab === TABS.signIn ? (
              <>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com" required autoComplete="email"
                        className={`w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                      <input type={showPassword ? "text" : "password"} value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password" required autoComplete="current-password"
                        className={`w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}/>
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => { setShowReset(true); setError(""); }}
                      className={`text-xs font-medium ${accentText} hover:underline`}>
                      Forgot password?
                    </button>
                    <button type="button" onClick={() => { setShowMagicLink(true); setError(""); }}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
                      <KeyRound className="w-3 h-3"/> Use magic link
                    </button>
                  </div>
                  <button type="submit" disabled={sending}
                    className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}>
                    {sending ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4"/></>}
                  </button>
                </form>
                <p className="text-xs text-gray-400 text-center mt-4">
                  Don't have an account?{" "}
                  <button onClick={() => { setTab(TABS.register); setError(""); setPassword(""); }}
                    className={`font-semibold ${accentText} hover:underline`}>Register</button>
                </p>
              </>
            ) : (
              <>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com" required autoComplete="email"
                        className={`w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                      <input type={showPassword ? "text" : "password"} value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters" required autoComplete="new-password"
                        className={`w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}/>
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1,2,3,4,5].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                              i <= strength.score ? strength.color : "bg-gray-200"
                            }`}/>
                          ))}
                        </div>
                        <p className={`text-xs ${
                          strength.score <= 1 ? "text-red-500" :
                          strength.score <= 2 ? "text-orange-500" :
                          strength.score <= 3 ? "text-yellow-600" : "text-green-600"
                        }`}>{strength.label}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                      <input type={showPassword ? "text" : "password"} value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password" required autoComplete="new-password"
                        className={`w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}/>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                    )}
                    {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
                  </div>
                  <button type="submit" disabled={sending}
                    className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}>
                    {sending ? "Creating account..." : <>Create Account <ArrowRight className="w-4 h-4"/></>}
                  </button>
                </form>
                <p className="text-xs text-gray-400 text-center mt-4">
                  Already have an account?{" "}
                  <button onClick={() => { setTab(TABS.signIn); setError(""); setPassword(""); setConfirmPassword(""); }}
                    className={`font-semibold ${accentText} hover:underline`}>Sign In</button>
                </p>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-gray-50 grid gap-3">
              {[
                { icon: <Shield className="w-4 h-4 text-green-600"/>,  text: "Encrypted and secure — your data is never sold" },
                { icon: <Eye    className="w-4 h-4 text-blue-600"/>,   text: "Browse listings freely without an account" },
                { icon: <KeyRound className="w-4 h-4 text-purple-600"/>, text: "Magic link sign-in available as a fallback" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500">
                  {icon}<span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label }) {
  return (
    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{label}</span>
  );
}

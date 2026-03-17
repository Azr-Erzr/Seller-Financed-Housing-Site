// src/pages/Account.jsx
// Magic-link / email OTP authentication via Supabase.
// No passwords — just enter your email and click the link.
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useSite } from "../context/SiteContext";
import { Mail, CheckCircle, Shield, Eye, Home, Building2, ArrowRight } from "lucide-react";

export default function Account() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;

  const [email,     setEmail]     = useState("");
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [error,     setError]     = useState("");
  const [session,   setSession]   = useState(null);
  const [loading,   setLoading]   = useState(true);

  const primary    = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const accentText = isBusiness ? "text-emerald-600" : "text-blue-600";
  const heroBg     = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const subColor   = isBusiness ? "#a7f3d0" : "#bfdbfe";

  // Check if user is already signed in
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSending(true);
    try {
      if (supabase) {
        const { error: authError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (authError) throw authError;
      }
      setSent(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Loading...</div>;
  }

  // ── Already signed in ──────────────────────────────────────────────
  if (session) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className={`w-16 h-16 rounded-full ${isBusiness ? "bg-emerald-100" : "bg-blue-100"} flex items-center justify-center mx-auto mb-4`}>
              <Mail className={`w-7 h-7 ${accentText}`} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 mb-6">{session.user.email}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <Link to={isHomes ? "/saved" : "/business/saved"}
                className={`p-4 rounded-xl border-2 ${isBusiness ? "border-emerald-200 hover:border-emerald-400 bg-emerald-50" : "border-blue-200 hover:border-blue-400 bg-blue-50"} transition-all text-center`}>
                <p className={`font-semibold text-sm ${accentText}`}>My Saved</p>
                <p className="text-xs text-gray-500 mt-0.5">Listings & profiles you've bookmarked</p>
              </Link>
              <Link to={isHomes ? "/listings" : "/business/listings"}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-400 bg-gray-50 transition-all text-center">
                <p className="font-semibold text-sm text-gray-700">Browse {isBusiness ? "Properties" : "Listings"}</p>
                <p className="text-xs text-gray-500 mt-0.5">Find your match</p>
              </Link>
              <Link to={isHomes ? "/create-profile" : "/business/create-profile"}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-400 bg-gray-50 transition-all text-center">
                <p className="font-semibold text-sm text-gray-700">My Buyer Profile</p>
                <p className="text-xs text-gray-500 mt-0.5">Create or update your profile</p>
              </Link>
              <Link to={isHomes ? "/list-home" : "/business/list-property"}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-400 bg-gray-50 transition-all text-center">
                <p className="font-semibold text-sm text-gray-700">List a {isBusiness ? "Property" : "Home"}</p>
                <p className="text-xs text-gray-500 mt-0.5">Post your listing</p>
              </Link>
            </div>

            <button onClick={handleSignOut}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline">
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Sign in / create account ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className={`bg-gradient-to-br ${heroBg} py-14`}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#fff" }}>
            Sign in to LandMatch {isBusiness ? "Business" : "Homes"}
          </h1>
          <p className="text-base" style={{ color: subColor }}>
            No password needed. We'll send a secure sign-in link to your email.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">

        {sent ? (
          // ── Sent state ─────────────────────────────────────────────
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-2">
              We sent a secure sign-in link to
            </p>
            <p className="font-semibold text-gray-900 mb-6">{email}</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Click the link in that email to sign in. The link expires in 1 hour.
              If you don't see it, check your spam folder.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
            >
              Use a different email
            </button>
          </div>
        ) : (
          // ── Email form ─────────────────────────────────────────────
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="font-bold text-gray-900 text-xl mb-1">Sign in or create account</h2>
            <p className="text-gray-500 text-sm mb-6">
              New to LandMatch? Just enter your email — we'll create your account automatically.
            </p>

            <form onSubmit={handleSendLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={sending}
                className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}
              >
                {sending ? "Sending link..." : <>Continue <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            {/* Trust signals */}
            <div className="mt-8 pt-6 border-t border-gray-50 grid gap-3">
              {[
                { icon: <Shield className="w-4 h-4 text-green-600" />, text: "No password to remember — magic link only" },
                { icon: <Eye className="w-4 h-4 text-blue-600" />, text: "Your data is never sold or shared with third parties" },
                { icon: <Mail className="w-4 h-4 text-purple-600" />, text: "Sign-in link expires in 1 hour for your security" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500">
                  <div className="shrink-0">{icon}</div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode switch link */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Looking for {isBusiness ? "residential homes" : "commercial properties"}?{" "}
          <Link to={isBusiness ? "/" : "/business"} className={`font-medium underline ${accentText}`}>
            Switch to LandMatch {isBusiness ? "Homes" : "Business"}
          </Link>
        </p>
      </div>
    </div>
  );
}

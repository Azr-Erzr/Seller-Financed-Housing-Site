// src/pages/Account.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useSite } from "../context/SiteContext";
import { Mail, CheckCircle, Shield, Eye, Home, Building2, ArrowRight, User } from "lucide-react";

export default function Account() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;

  const [email,   setEmail]   = useState("");
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const primary    = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const accentText = isBusiness ? "text-emerald-600" : "text-blue-600";
  const heroBg     = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const subColor   = isBusiness ? "#a7f3d0" : "#bfdbfe";
  const iconBg     = isBusiness ? "bg-emerald-100" : "bg-blue-100";

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSend = async (e) => {
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
          options: { emailRedirectTo: window.location.origin },
        });
        if (authError) throw authError;
      }
      setSent(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;

  // ── Signed in ────────────────────────────────────────────────────────
  if (session) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-4`}>
              <User className={`w-7 h-7 ${accentText}`} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 mb-8">{session.user.email}</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
              {[
                { to: isBusiness?"/business/saved":"/saved",              label: "My Saved",       sub: "Bookmarked listings & profiles" },
                { to: isBusiness?"/business/listings":"/listings",        label: "Browse",          sub: isBusiness?"Browse properties":"Browse homes" },
                { to: isBusiness?"/business/create-profile":"/create-profile", label: "Buyer Profile", sub: "Create or update your profile" },
                { to: isBusiness?"/business/list-property":"/list-home",  label: isBusiness?"List a Property":"List a Home", sub: "Post your listing" },
              ].map(({ to, label, sub }) => (
                <Link key={to} to={to}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isBusiness ? "border-emerald-100 hover:border-emerald-300 bg-emerald-50" : "border-blue-100 hover:border-blue-300 bg-blue-50"
                  }`}>
                  <p className={`font-semibold text-sm ${accentText}`}>{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </Link>
              ))}
            </div>
            <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline">
              Sign out
            </button>
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
            Sign in to LandMatch {isBusiness ? "Business" : "Homes"}
          </h1>
          <p className="text-base" style={{color:subColor}}>
            No password needed — we'll send a secure sign-in link to your email.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">
        {sent ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
            <p className="text-gray-500 text-sm mb-2">We sent a sign-in link to</p>
            <p className="font-semibold text-gray-900 mb-6">{email}</p>
            <p className="text-xs text-gray-400">The link expires in 1 hour. Check your spam if you don't see it.</p>
            <button onClick={() => { setSent(false); setEmail(""); }}
              className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline transition-colors">
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
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com" required
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
              <button type="submit" disabled={sending}
                className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}>
                {sending ? "Sending link..." : <>Continue <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-gray-50 grid gap-3">
              {[
                { icon: <Shield className="w-4 h-4 text-green-600" />, text: "No password to remember — magic link only" },
                { icon: <Eye    className="w-4 h-4 text-blue-600"  />, text: "Your data is never sold or shared with third parties" },
                { icon: <Mail   className="w-4 h-4 text-purple-600"/>, text: "Sign-in link expires in 1 hour for your security" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500">
                  {icon}<span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
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

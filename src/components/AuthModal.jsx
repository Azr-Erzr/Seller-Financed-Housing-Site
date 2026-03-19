// src/components/AuthModal.jsx
// Overlay sign-in / register modal. Triggered by useRequireAuth() when a guest
// tries to access an auth-gated action (list a home, create profile, etc).
//
// Tabs: Sign In | Register
// Sign In: email + password, "Forgot password?" link, magic link fallback
// Register: email + password + confirm, password strength, MFA opt-in prompt after success

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSite } from "../context/SiteContext";
import {
  X, Mail, CheckCircle, Shield, ArrowRight, Eye, EyeOff,
  Lock, UserPlus, LogIn, AlertTriangle, KeyRound,
} from "lucide-react";

const TABS = { signIn: "signIn", register: "register" };

export default function AuthModal() {
  const {
    user, authModalOpen, authRedirectPath, closeAuthModal,
    signInWithPassword, signUpWithPassword, signInWithEmail, resetPassword,
  } = useAuth();
  const { mode, MODES } = useSite();
  const navigate = useNavigate();

  const isBusiness = mode === MODES.business;
  const primary = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const primaryFlat = isBusiness ? "bg-emerald-600" : "bg-blue-600";
  const accentText = isBusiness ? "text-emerald-600" : "text-blue-600";
  const ringColor = isBusiness ? "focus:ring-emerald-400" : "focus:ring-blue-400";
  const tabActive = isBusiness ? "text-emerald-600 border-emerald-600" : "text-blue-600 border-blue-600";

  // State
  const [tab, setTab] = useState(TABS.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [successView, setSuccessView] = useState(null); // "registered" | "reset" | "magic"
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const inputRef = useRef(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (authModalOpen) {
      setTab(TABS.signIn);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setBusy(false);
      setError("");
      setSuccessView(null);
      setShowMagicLink(false);
      setShowReset(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [authModalOpen]);

  // If user signs in (via any method), auto-close and redirect
  useEffect(() => {
    if (user && authModalOpen) {
      closeAuthModal();
      if (authRedirectPath) {
        navigate(authRedirectPath);
      }
    }
  }, [user, authModalOpen, authRedirectPath, closeAuthModal, navigate]);

  // Close on Escape
  useEffect(() => {
    if (!authModalOpen) return;
    const onKey = (e) => { if (e.key === "Escape") closeAuthModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  // ── Handlers ──────────────────────────────────────────────────────

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setError(""); setBusy(true);
    const { error: authErr } = await signInWithPassword(email.trim(), password);
    setBusy(false);
    if (authErr) {
      // Supabase returns "Invalid login credentials" for wrong password
      setError(authErr.includes("Invalid") ? "Invalid email or password." : authErr);
    }
    // Success is handled by the user useEffect above (auto-close)
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    setError(""); setBusy(true);
    const { error: authErr } = await signUpWithPassword(email.trim(), password);
    setBusy(false);
    if (authErr) { setError(authErr); return; }
    setSuccessView("registered");
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    setError(""); setBusy(true);
    const { error: authErr } = await signInWithEmail(email.trim());
    setBusy(false);
    if (authErr) { setError("Something went wrong. Please try again."); return; }
    setSuccessView("magic");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { setError("Please enter your email first."); return; }
    setError(""); setBusy(true);
    const { error: resetErr } = await resetPassword(email.trim());
    setBusy(false);
    if (resetErr) { setError(resetErr); return; }
    setSuccessView("reset");
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

  // ── Contextual header text ────────────────────────────────────────
  const getSubtext = () => {
    if (authRedirectPath?.includes("list"))
      return "You need an account to create a listing.";
    if (authRedirectPath?.includes("profile"))
      return "You need an account to create a buyer profile.";
    return "Sign in or create a free account to continue.";
  };

  // ── Success views ─────────────────────────────────────────────────
  if (successView) {
    const successConfig = {
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAuthModal} />
        <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <button onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors z-10">
            <X className="w-4 h-4" />
          </button>
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{successConfig.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{successConfig.message}</p>
            <p className="text-xs text-gray-400 mb-6">{successConfig.hint}</p>

            {successView === "registered" && (
              <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Enable MFA</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded-full">Strongly Recommended</span>
                </div>
                <p className="text-xs text-amber-700 text-left">
                  After verifying your email, visit your Account page to enable
                  two-factor authentication for extra security.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setSuccessView(null); setPassword(""); setConfirmPassword(""); }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button onClick={closeAuthModal}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Forgot password view ──────────────────────────────────────────
  if (showReset) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAuthModal} />
        <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <button onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors z-10">
            <X className="w-4 h-4" />
          </button>
          <div className={`px-8 pt-8 pb-5 bg-gradient-to-br ${isBusiness ? "from-emerald-600 to-emerald-800" : "from-blue-600 to-blue-800"}`}>
            <h2 className="text-xl font-bold text-white mb-1">Reset your password</h2>
            <p className="text-sm" style={{ color: isBusiness ? "#a7f3d0" : "#bfdbfe" }}>
              We'll send a link to reset your password.
            </p>
          </div>
          <div className="p-8">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input ref={inputRef} type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com" required
                    className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
              </div>
              <button type="submit" disabled={busy}
                className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}>
                {busy ? "Sending..." : <>Send reset link <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
            <button onClick={() => { setShowReset(false); setError(""); }}
              className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Magic link fallback view ──────────────────────────────────────
  if (showMagicLink) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAuthModal} />
        <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <button onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors z-10">
            <X className="w-4 h-4" />
          </button>
          <div className={`px-8 pt-8 pb-5 bg-gradient-to-br ${isBusiness ? "from-emerald-600 to-emerald-800" : "from-blue-600 to-blue-800"}`}>
            <h2 className="text-xl font-bold text-white mb-1">Magic link sign-in</h2>
            <p className="text-sm" style={{ color: isBusiness ? "#a7f3d0" : "#bfdbfe" }}>
              No password needed — we'll email you a one-click link.
            </p>
          </div>
          <div className="p-8">
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com" required
                    className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
              </div>
              <button type="submit" disabled={busy}
                className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}>
                {busy ? "Sending..." : <>Send magic link <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
            <button onClick={() => { setShowMagicLink(false); setError(""); }}
              className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Back to sign in with password
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main tabbed form ──────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAuthModal} />

      {/* Modal card */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in">
        {/* Close button */}
        <button onClick={closeAuthModal}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10">
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className={`px-8 pt-8 pb-5 bg-gradient-to-br ${isBusiness ? "from-emerald-600 to-emerald-800" : "from-blue-600 to-blue-800"}`}>
          <h2 className="text-xl font-bold text-white mb-1">
            {tab === TABS.signIn ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm" style={{ color: isBusiness ? "#a7f3d0" : "#bfdbfe" }}>
            {getSubtext()}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setTab(TABS.signIn); setError(""); setPassword(""); setConfirmPassword(""); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === TABS.signIn ? tabActive : "text-gray-400 border-transparent hover:text-gray-600"
            }`}>
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            onClick={() => { setTab(TABS.register); setError(""); setPassword(""); setConfirmPassword(""); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === TABS.register ? tabActive : "text-gray-400 border-transparent hover:text-gray-600"
            }`}>
            <UserPlus className="w-3.5 h-3.5" /> Register
          </button>
        </div>

        <div className="p-8">
          {tab === TABS.signIn ? (
            /* ── Sign In form ── */
            <>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input ref={inputRef} type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com" required autoComplete="email"
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password" required autoComplete="current-password"
                      className={`w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => { setShowReset(true); setError(""); }}
                    className={`text-xs font-medium ${accentText} hover:underline`}>
                    Forgot password?
                  </button>
                  <button type="button" onClick={() => { setShowMagicLink(true); setError(""); }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
                    <KeyRound className="w-3 h-3" /> Use magic link instead
                  </button>
                </div>

                <button type="submit" disabled={busy}
                  className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}>
                  {busy ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                Don't have an account?{" "}
                <button onClick={() => { setTab(TABS.register); setError(""); setPassword(""); }}
                  className={`font-semibold ${accentText} hover:underline`}>
                  Register
                </button>
              </p>
            </>
          ) : (
            /* ── Register form ── */
            <>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com" required autoComplete="email"
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters" required autoComplete="new-password"
                      className={`w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password strength meter */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= strength.score ? strength.color : "bg-gray-200"
                          }`} />
                        ))}
                      </div>
                      <p className={`text-xs ${
                        strength.score <= 1 ? "text-red-500" :
                        strength.score <= 2 ? "text-orange-500" :
                        strength.score <= 3 ? "text-yellow-600" : "text-green-600"
                      }`}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password" required autoComplete="new-password"
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}
                    />
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                  )}
                  {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
                </div>

                <button type="submit" disabled={busy}
                  className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}>
                  {busy ? "Creating account..." : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                Already have an account?{" "}
                <button onClick={() => { setTab(TABS.signIn); setError(""); setPassword(""); setConfirmPassword(""); }}
                  className={`font-semibold ${accentText} hover:underline`}>
                  Sign In
                </button>
              </p>
            </>
          )}

          <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-2.5 text-xs text-gray-500">
            <Shield className="w-4 h-4 text-green-600 shrink-0" />
            <span>Your data is encrypted and never sold or shared.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

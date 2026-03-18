// src/components/AuthModal.jsx
// Overlay sign-in modal. Triggered by useRequireAuth() when a guest
// tries to access an auth-gated action (list a home, create profile, etc).

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSite } from "../context/SiteContext";
import { X, Mail, CheckCircle, Shield, ArrowRight } from "lucide-react";

export default function AuthModal() {
  const { user, authModalOpen, authRedirectPath, closeAuthModal, signInWithEmail } = useAuth();
  const { mode, MODES } = useSite();
  const navigate = useNavigate();

  const isBusiness = mode === MODES.business;
  const primary = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const accentText = isBusiness ? "text-emerald-600" : "text-blue-600";
  const ringColor = isBusiness ? "focus:ring-emerald-400" : "focus:ring-blue-400";

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (authModalOpen) {
      setEmail("");
      setSending(false);
      setSent(false);
      setError("");
      // Focus input after mount animation
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [authModalOpen]);

  // If user signs in (via magic link in another tab), auto-close and redirect
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    setSending(true);
    const { error: authError } = await signInWithEmail(email.trim());
    setSending(false);
    if (authError) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in">
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className={`px-8 pt-8 pb-5 bg-gradient-to-br ${isBusiness ? "from-emerald-600 to-emerald-800" : "from-blue-600 to-blue-800"}`}>
          <h2 className="text-xl font-bold text-white mb-1">
            Sign in to continue
          </h2>
          <p className="text-sm" style={{ color: isBusiness ? "#a7f3d0" : "#bfdbfe" }}>
            {authRedirectPath?.includes("list")
              ? "You need an account to create a listing."
              : authRedirectPath?.includes("profile")
              ? "You need an account to create a buyer profile."
              : "Sign in or create a free account to continue."
            }
          </p>
        </div>

        <div className="p-8">
          {sent ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Check your inbox</h3>
              <p className="text-sm text-gray-500 mb-1">We sent a sign-in link to</p>
              <p className="font-semibold text-gray-900 mb-4">{email}</p>
              <p className="text-xs text-gray-400 mb-5">
                Click the link in that email to sign in. It expires in 1 hour.
                Check spam if you don't see it.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Use a different email
                </button>
                <button
                  onClick={closeAuthModal}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* ── Sign-in form ── */
            <>
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                      className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${ringColor} transition`}
                    />
                  </div>
                  {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 ${primary}`}
                >
                  {sending ? (
                    "Sending link..."
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                New to Sel-Fi? Just enter your email — we'll create your account automatically.
              </p>

              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-2.5 text-xs text-gray-500">
                <Shield className="w-4 h-4 text-green-600 shrink-0" />
                <span>No password needed — we'll send a secure magic link.</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

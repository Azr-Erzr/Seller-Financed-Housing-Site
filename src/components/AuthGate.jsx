// src/components/AuthGate.jsx
// Reusable auth gate for pages that require sign-in.
// Shows a branded prompt with sign-in button instead of the page content.
// Used for: Profiles, ProfileDetail, Saved, and any future auth-required pages.

import React from "react";
import { useAuth } from "../context/AuthContext";
import { useSite } from "../context/SiteContext";
import { Lock, UserPlus, LogIn } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function AuthGate({ children, title, message, icon: CustomIcon }) {
  const { user, loading, openAuthModal } = useAuth();
  const { mode, MODES } = useSite();
  const location = useLocation();
  const isBusiness = mode === MODES.business;

  // Still loading auth state — show nothing
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Signed in — render the page
  if (user) {
    return <>{children}</>;
  }

  // Not signed in — show auth prompt
  const accent = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const lightBg = isBusiness ? "bg-emerald-50" : "bg-blue-50";
  const Icon = CustomIcon || Lock;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className={`w-16 h-16 ${lightBg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
          <Icon className={`w-7 h-7 ${accent}`} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {title || "Sign in required"}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          {message || "Create a free Sel-Fi account to access this page. It takes less than a minute."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => openAuthModal(location.pathname)}
            className={`flex items-center justify-center gap-2 px-6 py-3 ${accentBg} text-white font-semibold rounded-xl transition-colors`}
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
          <button
            onClick={() => openAuthModal(location.pathname)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Create Account
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-6">
          Free to join. No credit card required.
        </p>
      </div>
    </div>
  );
}

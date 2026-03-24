// src/context/AuthContext.jsx
// Single source of truth for the logged-in user session.
// Wrap the app with <AuthProvider> and use useAuth() anywhere.
// Includes auth-gate modal: call requireAuth("/some-path") to
// either navigate (if signed in) or pop a sign-in modal.
//
// AUTH METHODS:
// - signUpWithPassword(email, password) — register new account
// - signInWithPassword(email, password) — sign in existing account
// - signInWithEmail(email) — magic link (legacy/fallback)
// - resetPassword(email) — send password reset link

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'buyer' | 'seller' | 'professional'

  // Auth modal state
  const [authModalOpen,    setAuthModalOpen]    = useState(false);
  const [authRedirectPath, setAuthRedirectPath] = useState(null);

  // Fetch role from user_roles table
  const fetchRole = useCallback(async (uid) => {
    if (!supabase || !uid) return;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .maybeSingle();
    setUserRole(data?.role ?? "buyer");
  }, []);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) fetchRole(session.user.id);
        else setUserRole(null);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchRole]);

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  // ── Email + Password registration ─────────────────────────────────
  const signUpWithPassword = async (email, password) => {
    if (!supabase) return { error: "Supabase not configured" };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/account",
      },
    });
    if (error) return { error: error.message };
    // Supabase returns user with identities=[] if email already exists
    if (data?.user && data.user.identities?.length === 0) {
      return { error: "An account with this email already exists. Try signing in instead." };
    }
    return { data, error: null };
  };

  // ── Email + Password sign in ──────────────────────────────────────
  const signInWithPassword = async (email, password) => {
    if (!supabase) return { error: "Supabase not configured" };
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return { data, error: null };
  };

  // ── Magic link (legacy fallback) ──────────────────────────────────
  const signInWithEmail = async (email) => {
    if (!supabase) return { error: "Supabase not configured" };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/account" },
    });
    return { error };
  };

  // ── Password reset ────────────────────────────────────────────────
  const resetPassword = async (email) => {
    if (!supabase) return { error: "Supabase not configured" };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/account",
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const openAuthModal = useCallback((redirectPath) => {
    setAuthRedirectPath(redirectPath || null);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthRedirectPath(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, session, loading, signOut,
      userRole, isPro: userRole === "professional",
      signUpWithPassword, signInWithPassword, signInWithEmail, resetPassword,
      authModalOpen, authRedirectPath, openAuthModal, closeAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/**
 * Hook for auth-gated navigation.
 * Usage:
 *   const requireAuth = useRequireAuth();
 *   <button onClick={() => requireAuth("/list-home")}>List a Home</button>
 */
export function useRequireAuth() {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  return useCallback((path) => {
    if (user) {
      navigate(path);
    } else {
      openAuthModal(path);
    }
  }, [user, navigate, openAuthModal]);
}

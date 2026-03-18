// src/context/AuthContext.jsx
// Single source of truth for the logged-in user session.
// Wrap the app with <AuthProvider> and use useAuth() anywhere.
// Includes auth-gate modal: call requireAuth("/some-path") to
// either navigate (if signed in) or pop a sign-in modal.

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth modal state
  const [authModalOpen,    setAuthModalOpen]    = useState(false);
  const [authRedirectPath, setAuthRedirectPath] = useState(null);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const signInWithEmail = async (email) => {
    if (!supabase) return { error: "Supabase not configured" };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/account" },
    });
    return { error };
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
      user, session, loading, signOut, signInWithEmail,
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

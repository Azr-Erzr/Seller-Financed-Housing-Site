// src/lib/supabase.js
// Supabase client — safely returns null until env vars are configured.
// See .env.example for setup instructions.

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  url && key && !url.includes("your-project-ref")
    ? createClient(url, key)
    : null;

export const isSupabaseReady = !!supabase;

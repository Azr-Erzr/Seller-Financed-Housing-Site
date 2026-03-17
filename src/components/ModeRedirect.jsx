// src/components/ModeRedirect.jsx
// Placed on both the "/" and "/business" routes.
// On mount it reads the stored mode from SiteContext and redirects
// to the correct home page if the URL and mode are mismatched.
// This keeps the URL and the mode switcher in sync when returning to the site.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSite } from "../context/SiteContext";

export default function ModeRedirect({ targetMode, children }) {
  const { mode, setMode, MODES } = useSite();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user landed on "/" but localStorage says "business" → go to /business
    // If the user landed on "/business" but localStorage says "homes" → go to /
    if (mode !== targetMode) {
      if (mode === MODES.business) {
        navigate("/business", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, []); // run once on mount only — no deps to avoid redirect loops

  // If mode matches, render the page normally
  // If mode mismatches, render nothing while the redirect fires (avoids flash)
  if (mode !== targetMode) return null;

  return children;
}

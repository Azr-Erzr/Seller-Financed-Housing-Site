// src/components/ScrollToTop.jsx
// Scrolls to top on every route change.
// Place inside <Router> in App.jsx.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

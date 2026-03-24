// src/components/FadeIn.jsx
// Scroll-triggered fade + lift animation using IntersectionObserver.
// Respects prefers-reduced-motion — skips animation if user has set that preference.
// Usage: <FadeIn><YourSection /></FadeIn>
//        <FadeIn delay={150}><Card /></FadeIn>

import React, { useEffect, useRef, useState } from "react";

export default function FadeIn({ children, delay = 0, className = "" }) {
  const ref     = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    // Respect user's motion preference
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setVis(true); return; }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); observer.unobserve(el); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

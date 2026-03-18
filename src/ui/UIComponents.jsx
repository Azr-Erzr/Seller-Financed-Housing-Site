// src/ui/UIComponents.jsx
import React, { useState } from "react";

/* -----------------------------
   Brand & Helpers
   ----------------------------- */
export const BRAND = {
  name: "Sel-Fi",
  colors: {
    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    accent: "#F97316",
    accentHover: "#EA580C",
    bg: "#F9FAFB",
    ink: "#111827",
  },
};

export const cls = (...a) => a.filter(Boolean).join(" ");

export const money = (n, currency = "CAD") =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export const pct = (n) =>
  new Intl.NumberFormat("en-CA", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

/* -----------------------------
   Buttons
   NOTE: Tailwind requires full class strings — no template literals.
   ----------------------------- */
export const Btn = ({
  children,
  variant,
  tone,        // alias for variant (used by Navbar)
  className = "",
  ...props
}) => {
  const v = variant || tone || "primary";

  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:   "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    accent:    "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400",
    ghost:     "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    chip:      "rounded-full px-4 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300 shadow-none",
  };

  return (
    <button className={cls(base, variants[v] || variants.primary, className)} {...props}>
      {children}
    </button>
  );
};

/* -----------------------------
   Badge
   ----------------------------- */
export const Badge = ({ children, tone = "neutral", className = "" }) => {
  const tones = {
    neutral: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger:  "bg-red-100 text-red-800",
    accent:  "bg-orange-100 text-orange-800",
    info:    "bg-blue-100 text-blue-700",
    purple:  "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={cls(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone] || tones.neutral,
        className
      )}
    >
      {children}
    </span>
  );
};

/* -----------------------------
   Card
   ----------------------------- */
export const Card = ({ children, hover = true, className = "" }) => (
  <div
    className={cls(
      "bg-white rounded-xl border border-gray-200 shadow-sm p-4",
      hover && "transition-transform hover:scale-[1.01] hover:shadow-md",
      className
    )}
  >
    {children}
  </div>
);

/* -----------------------------
   Stat — label + value pair used in detail pages
   ----------------------------- */
export const Stat = ({ label, value, className = "" }) => (
  <div className={cls("flex flex-col gap-0.5", className)}>
    <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
    <span className="font-semibold text-gray-900">{value ?? "—"}</span>
  </div>
);

/* -----------------------------
   LockValue (for gated info)
   ----------------------------- */
export const LockValue = ({ masked, children }) =>
  masked ? (
    <span
      className="inline-flex items-center gap-1 text-gray-400 text-sm"
      title="Sign the NDA to unlock"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5Zm3 8H9V7a3 3 0 016 0v3Z" />
      </svg>
      Locked — sign NDA to view
    </span>
  ) : (
    <>{children}</>
  );

/* -----------------------------
   Image (with placeholder fallback)
   ----------------------------- */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Cpath d='M80 320h440v-24H80v24Zm48-56h344l-86-96-98 110-36-42-124 138z' fill='%239ca3af'/%3E%3C/svg%3E";

export const Img = ({ src, alt = "", className = "", ratio = "4/3" }) => {
  const [ok, setOk] = useState(true);
  return (
    <img
      src={ok && src ? src : PLACEHOLDER}
      alt={alt}
      onError={() => setOk(false)}
      loading="lazy"
      className={cls("object-cover", className)}
    />
  );
};

/* -----------------------------
   Logo
   ----------------------------- */
export const Logo = ({ size = 40 }) => (
  <div className="flex items-center gap-2 select-none" aria-label="Sel-Fi logo">
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="roof" x1="0" x2="1">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="#fff" />
      <path d="M10 24L24 12l14 12v12H10V24z" fill="url(#roof)" />
      <rect x="18" y="26" width="8" height="10" fill="#111827" fillOpacity=".9" />
    </svg>
    <span className="text-2xl font-extrabold tracking-tight">
      <span className="text-orange-500">Home</span>
      <span className="text-blue-600">Match</span>
    </span>
  </div>
);

/* -----------------------------
   Match Score Ring
   ----------------------------- */
export const MatchBadge = ({ score }) => {
  if (!score) return null;
  const color =
    score >= 80 ? "text-green-600 bg-green-50 ring-green-200" :
    score >= 50 ? "text-blue-600 bg-blue-50 ring-blue-200" :
                  "text-gray-500 bg-gray-50 ring-gray-200";
  return (
    <span className={cls(
      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ring-1",
      color
    )}>
      ⚡ {score}% match
    </span>
  );
};

/* -----------------------------
   Form Inputs
   ----------------------------- */
export const Input = ({ label, hint, className = "", ...props }) => (
  <label className="block">
    {label && <div className="text-sm font-medium mb-1">{label}</div>}
    <input
      className={cls(
        "w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 outline-none transition",
        className
      )}
      {...props}
    />
    {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
  </label>
);

export const Select = ({ label, options = [], className = "", ...props }) => (
  <label className="block">
    {label && <div className="text-sm font-medium mb-1">{label}</div>}
    <select
      className={cls(
        "w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 bg-white outline-none transition",
        className
      )}
      {...props}
    >
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>{o}</option>
        ) : (
          <option key={o.value} value={o.value}>{o.label}</option>
        )
      )}
    </select>
  </label>
);

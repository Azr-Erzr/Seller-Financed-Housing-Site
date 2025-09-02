import React, { useState } from "react";

/* -----------------------------
   Brand & Helpers
   ----------------------------- */
const BRAND = {
  name: "HomeMatch",
  colors: {
    primary: "#2563EB",   // Zillow-like blue
    primaryHover: "#1D4ED8",
    accent: "#F97316",    // warm orange for CTAs
    accentHover: "#EA580C",
    bg: "#F9FAFB",
    ink: "#111827",
  },
};

const cls = (...a) => a.filter(Boolean).join(" ");
const money = (n, currency = "USD") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

/* -----------------------------
   Buttons
   ----------------------------- */
const Btn = ({ children, variant = "primary", className = "", ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: `bg-[${BRAND.colors.primary}] text-white hover:bg-[${BRAND.colors.primaryHover}] focus:ring-blue-500`,
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    accent: `bg-[${BRAND.colors.accent}] text-white hover:bg-[${BRAND.colors.accentHover}] focus:ring-orange-500`,
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  };

  return (
    <button className={cls(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

/* -----------------------------
   Badge
   ----------------------------- */
const Badge = ({ children, tone = "neutral", className = "" }) => {
  const tones = {
    neutral: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    accent: "bg-orange-100 text-orange-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={cls(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
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
const Card = ({ children, hover = true, className = "" }) => (
  <div
    className={cls(
      "bg-white rounded-xl border border-gray-200 shadow-sm p-4",
      hover && "transition-transform transform hover:scale-[1.01] hover:shadow-md",
      className
    )}
  >
    {children}
  </div>
);

/* -----------------------------
   LockValue (for gated info)
   ----------------------------- */
const LockValue = ({ masked, children }) =>
  masked ? (
    <span
      className="inline-flex items-center gap-1 text-gray-500 text-sm"
      title="Restricted — unlock to view"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5Zm3 8H9V7a3 3 0 016 0v3Z" />
      </svg>
      Hidden
    </span>
  ) : (
    <>{children}</>
  );

/* -----------------------------
   Image (with placeholder fallback)
   ----------------------------- */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Cpath d='M80 320h440v-24H80v24Zm48-56h344l-86-96-98 110-36-42-124 138z' fill='%239ca3af'/%3E%3C/svg%3E";

const Img = ({ src, alt = "", className = "", w = 1200, ratio = "4/3" }) => {
  const [ok, setOk] = useState(true);
  const [a, b] = ratio.split("/").map(Number);

  return (
    <img
      src={ok && src ? src : PLACEHOLDER}
      alt={alt}
      onError={() => setOk(false)}
      width={w}
      height={Math.round(w / (a / b))}
      loading="lazy"
      className={cls("rounded-lg object-cover", className)}
    />
  );
};

/* -----------------------------
   Logo
   ----------------------------- */
const Logo = ({ size = 42 }) => (
  <div className="flex items-center gap-2 select-none" aria-label="logo">
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="roof" x1="0" x2="1">
          <stop offset="0%" stopColor={BRAND.colors.accent} />
          <stop offset="100%" stopColor={BRAND.colors.primary} />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="#fff" />
      <path d="M10 24L24 12l14 12v12H10V24z" fill="url(#roof)" />
      <rect
        x="18"
        y="26"
        width="8"
        height="10"
        fill={BRAND.colors.ink}
        fillOpacity=".9"
      />
    </svg>
    <span className="text-2xl md:text-[28px] font-extrabold tracking-tight">
      <span style={{ color: BRAND.colors.accent }}>Home</span>
      <span style={{ color: BRAND.colors.primary }}>Match</span>
    </span>
  </div>
);

/* -----------------------------
   Form Inputs
   ----------------------------- */
const Input = ({ label, hint, className = "", ...props }) => (
  <label className="block">
    {label && <div className="text-sm font-medium mb-1">{label}</div>}
    <input
      className={cls(
        "w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2",
        className
      )}
      {...props}
    />
    {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
  </label>
);

const Select = ({ label, options = [], className = "", ...props }) => (
  <label className="block">
    {label && <div className="text-sm font-medium mb-1">{label}</div>}
    <select
      className={cls(
        "w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 bg-white",
        className
      )}
      {...props}
    >
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>
            {o}
          </option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )
      )}
    </select>
  </label>
);

export { BRAND, cls, money, Btn, Badge, Card, LockValue, Img, Logo, Input, Select };
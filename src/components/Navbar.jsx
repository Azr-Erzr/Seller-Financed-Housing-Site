// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Map, Home, Building2, User } from "lucide-react";
import { useSite } from "../context/SiteContext";

export default function Navbar() {
  const loc      = useLocation();
  const navigate = useNavigate();
  const { mode, setMode, config, MODES } = useSite();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [loc.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isHomes    = mode === MODES.homes;
  const isBusiness = mode === MODES.business;

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    navigate(newMode === MODES.business ? "/business" : "/");
  };

  const HOMES_LINKS = [
    { to: "/listings",     label: "Browse Homes" },
    { to: "/map",          label: "Map", icon: <Map className="w-3.5 h-3.5" /> },
    { to: "/profiles",     label: "Browse Buyers" },
    { to: "/partners",     label: "Find a Pro" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/about",        label: "About" },
  ];

  const BUSINESS_LINKS = [
    { to: "/business/listings",  label: "Browse Properties" },
    { to: "/business/map",       label: "Map", icon: <Map className="w-3.5 h-3.5" /> },
    { to: "/business/profiles",  label: "Browse Buyers" },
    { to: "/partners",           label: "Find a Pro" },
    { to: "/how-it-works",       label: "How It Works" },
    { to: "/about",              label: "About" },
  ];

  const NAV_LINKS = isHomes ? HOMES_LINKS : BUSINESS_LINKS;

  const activeNavCls = ({ isActive }) =>
    `flex items-center gap-1 text-sm font-medium transition-colors ${
      isActive
        ? isBusiness ? "text-emerald-600" : "text-blue-600"
        : "text-gray-600 hover:text-gray-900"
    }`;

  // CTA button classes — explicit text + hover so browser never bleeds blue
  const outlineCta = "border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400";
  const primaryCta = isBusiness
    ? "bg-amber-500 hover:bg-amber-600 text-white hover:text-white"
    : "bg-orange-500 hover:bg-orange-600 text-white hover:text-white";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">

        {/* Brand + mode switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <Link to={isHomes ? "/" : "/business"}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity no-underline">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${config.logoGradient} flex items-center justify-center shrink-0`}>
              {isHomes
                ? <Home className="w-[18px] h-[18px] text-white" />
                : <Building2 className="w-[18px] h-[18px] text-white" />
              }
            </div>
            <span className="text-lg font-extrabold text-gray-900 tracking-tight hidden sm:block">LandMatch</span>
          </Link>

          {/* Mode pill */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-1">
            <button
              onClick={() => handleModeSwitch(MODES.homes)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                isHomes ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Home className="w-3 h-3" />
              <span>Homes</span>
            </button>
            <button
              onClick={() => handleModeSwitch(MODES.business)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                isBusiness ? "bg-white shadow text-emerald-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Business</span>
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 ml-2">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={activeNavCls}>
              {icon}{label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2 ml-auto">

          {/* Saved / Account link */}
          <Link
            to={isHomes ? "/saved" : "/business/saved"}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${outlineCta}`}
          >
            Saved
          </Link>

          {/* Sign in */}
          <Link
            to="/account"
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${outlineCta}`}
          >
            <User className="w-3.5 h-3.5" />
            Sign In
          </Link>

          {/* Primary CTA */}
          <Link
            to={isHomes ? "/list-home" : "/business/list-property"}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${primaryCta}`}
          >
            {isHomes ? "List a Home" : "List a Property"}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors ml-auto"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-5 space-y-1">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 py-3 text-sm font-medium border-b border-gray-50 last:border-0 ${
                  isActive
                    ? isBusiness ? "text-emerald-600" : "text-blue-600"
                    : "text-gray-700"
                }`
              }
            >
              {icon}{label}
            </NavLink>
          ))}
          <div className="pt-4 flex flex-col gap-2">
            <Link to="/account"
              className="w-full text-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              Sign In / Create Account
            </Link>
            <Link to={isHomes ? "/saved" : "/business/saved"}
              className="w-full text-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              My Saved
            </Link>
            <Link
              to={isHomes ? "/list-home" : "/business/list-property"}
              className={`w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${primaryCta}`}
            >
              {isHomes ? "List a Home" : "List a Property"}
            </Link>
          </div>
        </div>
      )}

      {/* Subbanner */}
      {(loc.pathname === "/" || loc.pathname === "/business") && (
        <div className={`border-t text-center text-xs py-1.5 font-medium ${config.subbannerBg}`}>
          {config.subbanner}
        </div>
      )}
    </header>
  );
}

// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Home, Menu, X } from "lucide-react";

export default function Navbar() {
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [loc.pathname]);

  // Scroll lock when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const linkCls = ({ isActive }) =>
    isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-gray-900 transition-colors";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">HomeMatch</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <NavLink to="/listings"     className={linkCls}>Browse Homes</NavLink>
          <NavLink to="/profiles"     className={linkCls}>Browse Buyers</NavLink>
          <NavLink to="/how-it-works" className={linkCls}>How It Works</NavLink>
          <NavLink to="/about"        className={linkCls}>About</NavLink>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/create-profile" className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Create Profile
          </Link>
          <Link to="/list-home" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
            List a Home
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-5 space-y-1">
          {[
            { to: "/listings",     label: "Browse Homes" },
            { to: "/profiles",     label: "Browse Buyers" },
            { to: "/how-it-works", label: "How It Works" },
            { to: "/about",        label: "About" },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `block py-3 text-sm font-medium border-b border-gray-50 last:border-0 ${isActive ? "text-blue-600" : "text-gray-700"}`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-4 flex flex-col gap-2">
            <Link to="/create-profile" className="w-full text-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Create Profile
            </Link>
            <Link to="/list-home" className="w-full text-center px-4 py-2.5 bg-orange-500 rounded-lg text-sm font-medium text-white hover:bg-orange-600">
              List a Home
            </Link>
          </div>
        </div>
      )}

      {/* Homepage subbanner */}
      {loc.pathname === "/" && (
        <div className="bg-blue-50 border-t border-blue-100 text-center text-xs text-blue-600 py-1.5 font-medium">
          Seller-financed &amp; rent-to-own matches — no bank required
        </div>
      )}
    </header>
  );
}

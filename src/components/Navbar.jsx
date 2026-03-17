// src/components/Navbar.jsx
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Home } from "lucide-react";

export default function Navbar() {
  const loc = useLocation();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">HomeMatch</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <NavLink
            to="/listings"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900 transition-colors"
            }
          >
            Browse Homes
          </NavLink>
          <NavLink
            to="/profiles"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900 transition-colors"
            }
          >
            Browse Buyers
          </NavLink>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
            How It Works
          </a>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Create Profile
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
            List a Home
          </button>
        </div>
      </div>

      {/* Homepage subbanner */}
      {loc.pathname === "/" && (
        <div className="bg-blue-50 border-t border-blue-100 text-center text-xs text-blue-600 py-1.5">
          Seller-financed &amp; rent-to-own matches — no bank required
        </div>
      )}
    </header>
  );
}

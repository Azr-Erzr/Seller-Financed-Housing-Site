// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Home, Menu, X } from "lucide-react";

export default function Navbar() {
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <NavLink to="/listings"    className={({ isActive }) => isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900 transition-colors"}>Browse Homes</NavLink>
          <NavLink to="/profiles"    className={({ isActive }) => isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900 transition-colors"}>Browse Buyers</NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900 transition-colors"}>How It Works</NavLink>
          <NavLink to="/about"       className={({ isActive }) => isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900 transition-colors"}>About</NavLink>
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
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 text-sm font-medium">
          <NavLink to="/listings"    onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600">Browse Homes</NavLink>
          <NavLink to="/profiles"    onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600">Browse Buyers</NavLink>
          <NavLink to="/how-it-works" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600">How It Works</NavLink>
          <NavLink to="/about"       onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600">About</NavLink>
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/create-profile" onClick={() => setMobileOpen(false)} className="w-full text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Create Profile</Link>
            <Link to="/list-home"      onClick={() => setMobileOpen(false)} className="w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">List a Home</Link>
          </div>
        </div>
      )}

      {/* Homepage subbanner */}
      {loc.pathname === "/" && (
        <div className="bg-blue-50 border-t border-blue-100 text-center text-xs text-blue-600 py-1.5">
          Seller-financed &amp; rent-to-own matches — no bank required
        </div>
      )}
    </header>
  );
}

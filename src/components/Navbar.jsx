// src/components/Navbar.jsx
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo, Btn } from "../ui/UIComponents.jsx";

export default function Navbar() {
  const loc = useLocation();
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="ml-6 hidden md:flex items-center gap-5 text-sm">
          <NavLink
            to="/listings"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-blue-600"
                : "text-neutral-600 hover:text-black transition-colors"
            }
          >
            Homes
          </NavLink>
          <NavLink
            to="/profiles"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-blue-600"
                : "text-neutral-600 hover:text-black transition-colors"
            }
          >
            Buyers
          </NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Btn variant="chip" className="hidden sm:inline-flex">Create profile</Btn>
          <Btn variant="accent">List a home</Btn>
        </div>
      </div>

      {/* Subnav banner on homepage only */}
      {loc.pathname === "/" && (
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 text-center text-xs text-gray-500 py-1.5">
          Seller-financed &amp; rent-to-own matches — no bank required
        </div>
      )}
    </header>
  );
}

import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo, Btn } from "../ui/UIComponents.jsx";

export default function Navbar() {
  const loc = useLocation();
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="ml-6 hidden md:flex items-center gap-4 text-sm">
          <NavLink to="/listings" className={({isActive})=> isActive ? "font-semibold" : "text-neutral-600 hover:text-black"}>Homes</NavLink>
          <NavLink to="/profiles" className={({isActive})=> isActive ? "font-semibold" : "text-neutral-600 hover:text-black"}>Buyers</NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Btn variant="chip" className="border hidden sm:inline">Create profile</Btn>
          <Btn variant="chip" tone="accent">List a home</Btn>
        </div>
      </div>
      {/* subnav hint */}
      {loc.pathname === "/" && (
        <div className="bg-gradient-to-r from-brand-blue/5 to-brand-orange/5 text-center text-xs py-1">
          Seller-financed & rent-to-own matches. No bank needed.
        </div>
      )}
    </header>
  );
}
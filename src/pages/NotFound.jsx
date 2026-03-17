// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, Users, Building2 } from "lucide-react";
import { useSite } from "../context/SiteContext";

export default function NotFound() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;

  const primaryBtnCls = isBusiness
    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className={`text-8xl font-extrabold select-none mb-2 ${isBusiness ? "text-emerald-100" : "text-blue-100"}`}>
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={isBusiness ? "/business" : "/"}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 font-medium rounded-lg transition-colors ${primaryBtnCls}`}
          >
            {isBusiness ? <Building2 className="w-4 h-4" /> : <Home className="w-4 h-4" />}
            {isBusiness ? "LandMatch Business" : "Go Home"}
          </Link>
          <Link
            to={isBusiness ? "/business/listings" : "/listings"}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            {isBusiness ? "Browse Properties" : "Browse Homes"}
          </Link>
          <Link
            to={isBusiness ? "/business/profiles" : "/profiles"}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            Browse Buyers
          </Link>
        </div>

        {/* Switch mode hint */}
        <p className="mt-8 text-xs text-gray-400">
          Looking for {isBusiness ? "residential homes" : "commercial properties"}?{" "}
          <Link
            to={isBusiness ? "/" : "/business"}
            className={`font-medium ${isBusiness ? "text-blue-600 hover:underline" : "text-emerald-600 hover:underline"}`}
          >
            Switch to LandMatch {isBusiness ? "Homes" : "Business"} →
          </Link>
        </p>
      </div>
    </div>
  );
}

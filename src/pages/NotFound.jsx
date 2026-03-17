// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, Users } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <div className="text-8xl font-extrabold text-blue-100 select-none mb-2">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* Quick links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link
            to="/listings"
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="w-4 h-4" /> Browse Homes
          </Link>
          <Link
            to="/profiles"
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-4 h-4" /> Browse Buyers
          </Link>
        </div>
      </div>
    </div>
  );
}

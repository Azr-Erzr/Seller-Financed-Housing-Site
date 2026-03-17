// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HomeMatch</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Connecting property sellers and buyers for seller-financed and
              rent-to-own housing deals. Find your perfect match without
              traditional bank financing.
            </p>
            <p className="text-xs text-gray-400 mt-4">
              © {new Date().getFullYear()} HomeMatch. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">For Buyers</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link to="/listings"       className="hover:text-blue-600 transition-colors">Browse Homes</Link></li>
              <li><Link to="/map"            className="hover:text-blue-600 transition-colors">Map Search</Link></li>
              <li><Link to="/create-profile" className="hover:text-blue-600 transition-colors">Create Profile</Link></li>
              <li><Link to="/how-it-works"   className="hover:text-blue-600 transition-colors">How It Works</Link></li>
              <li><Link to="/partners"       className="hover:text-blue-600 transition-colors">Find a Lawyer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">For Sellers</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link to="/list-home"    className="hover:text-blue-600 transition-colors">List Your Home</Link></li>
              <li><Link to="/profiles"     className="hover:text-blue-600 transition-colors">Find Buyers</Link></li>
              <li><Link to="/partners?category=stager"       className="hover:text-blue-600 transition-colors">Find a Stager</Link></li>
              <li><Link to="/partners?category=photographer" className="hover:text-blue-600 transition-colors">Find a Photographer</Link></li>
              <li><Link to="/partners?category=inspector"    className="hover:text-blue-600 transition-colors">Find an Inspector</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link to="/about"          className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link to="/partners"       className="hover:text-blue-600 transition-colors">Partner Directory</Link></li>
              <li><Link to="/partner-apply"  className="hover:text-blue-600 transition-colors">Become a Partner</Link></li>
              <li><Link to="/how-it-works"   className="hover:text-blue-600 transition-colors">FAQ</Link></li>
              <li><a href="mailto:hello@homematch.ca" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}

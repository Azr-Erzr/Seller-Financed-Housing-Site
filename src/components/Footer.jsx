// src/components/Footer.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Building2 } from "lucide-react";
import { useSite } from "../context/SiteContext";
import { useRequireAuth } from "../context/AuthContext";

export default function Footer() {
  const { mode, setMode, MODES, modeLocked } = useSite();
  const requireAuth = useRequireAuth();
  const isBusiness = mode === MODES.business;
  const navigate = useNavigate();

  const handleModeSwitch = () => {
    if (modeLocked) return;
    const newMode = isBusiness ? MODES.homes : MODES.business;
    setMode(newMode);
    navigate(newMode === MODES.business ? "/business" : "/");
  };

  // Links are emerald in business mode, blue in homes mode
  const linkCls = isBusiness
    ? "hover:text-emerald-600 transition-colors"
    : "hover:text-blue-600 transition-colors";

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to={isBusiness ? "/business" : "/"} className="flex items-center gap-2.5 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                isBusiness ? "from-emerald-600 to-emerald-800" : "from-blue-600 to-blue-800"
              }`}>
                {isBusiness
                  ? <Building2 className="w-5 h-5 text-white" />
                  : <Home className="w-5 h-5 text-white" />
                }
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">Sel-Fi</span>
                <span className={`ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isBusiness ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {isBusiness ? "Business" : "Homes"}
                </span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              {isBusiness
                ? "Connecting commercial property owners and buyers for direct seller-financed deals. Vacant land, farms, development parcels, and commercial buildings."
                : "Connecting property sellers and buyers for seller-financed and rent-to-own residential deals. No banks, no agents."
              }
            </p>
            <p className="text-xs text-gray-400 mt-4">
              © {new Date().getFullYear()} Sel-Fi. All rights reserved.
            </p>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">
              {isBusiness ? "Browse" : "For Buyers"}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              {isBusiness ? (
                <>
                  <li><Link to="/business/listings"      className={linkCls}>Browse Properties</Link></li>
                  <li><Link to="/business/map"           className={linkCls}>Map Search</Link></li>
                  <li><button onClick={() => requireAuth("/business/create-profile")} className={linkCls}>Buyer Profile</button></li>
                  <li><Link to="/how-it-works"           className={linkCls}>How It Works</Link></li>
                  <li><Link to="/partners"               className={linkCls}>Find a Lawyer</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/listings"       className={linkCls}>Browse Homes</Link></li>
                  <li><Link to="/map"            className={linkCls}>Map Search</Link></li>
                  <li><button onClick={() => requireAuth("/create-profile")} className={linkCls}>Create Profile</button></li>
                  <li><Link to="/how-it-works"   className={linkCls}>How It Works</Link></li>
                  <li><Link to="/partners"       className={linkCls}>Find a Lawyer</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">
              {isBusiness ? "Sell / List" : "For Sellers"}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              {isBusiness ? (
                <>
                  <li><button onClick={() => requireAuth("/business/list-property")} className={linkCls}>List a Property</button></li>
                  <li><Link to="/business/profiles"      className={linkCls}>Find Buyers</Link></li>
                  <li><Link to="/partners"               className={linkCls}>Find a Lawyer</Link></li>
                  <li><Link to="/partners"               className={linkCls}>Find an Inspector</Link></li>
                </>
              ) : (
                <>
                  <li><button onClick={() => requireAuth("/list-home")} className={linkCls}>List Your Home</button></li>
                  <li><Link to="/profiles"                       className={linkCls}>Find Buyers</Link></li>
                  <li><Link to="/partners?category=stager"       className={linkCls}>Find a Stager</Link></li>
                  <li><Link to="/partners?category=photographer" className={linkCls}>Find a Photographer</Link></li>
                  <li><Link to="/partners?category=inspector"    className={linkCls}>Find an Inspector</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Column 5 — Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link to="/about"         className={linkCls}>About Us</Link></li>
              <li><Link to="/partners"      className={linkCls}>Partner Directory</Link></li>
              <li><Link to="/partner-apply" className={linkCls}>Become a Partner</Link></li>
              <li><Link to="/how-it-works"  className={linkCls}>FAQ</Link></li>
              <li><Link to="/account"       className={linkCls}>Sign In</Link></li>
              {/* Mode switcher — hidden when mode is locked by subdomain */}
              {!modeLocked && (
                <li>
                  <button
                    onClick={handleModeSwitch}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                      isBusiness
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    }`}
                  >
                    {isBusiness
                      ? <><Home className="w-3 h-3" /> Switch to Sel-Fi Homes</>
                      : <><Building2 className="w-3 h-3" /> Switch to Sel-Fi Business</>
                    }
                  </button>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Legal bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            Sel-Fi facilitates introductions only. Not a brokerage, lender, or legal advisor.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link to="/terms" className={linkCls}>Terms of Use</Link>
            <Link to="/privacy" className={linkCls}>Privacy Policy</Link>
            <Link to="/accessibility" className={linkCls}>Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

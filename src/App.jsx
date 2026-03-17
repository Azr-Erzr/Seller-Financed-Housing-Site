// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SiteProvider } from "./context/SiteContext";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ── Homes ─────────────────────────────────────────────────────────────
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Profiles from "./pages/Profiles";
import ListingDetail from "./pages/ListingDetail";
import ProfileDetail from "./pages/ProfileDetail";
import ListHome from "./pages/ListHome";
import CreateProfile from "./pages/CreateProfile";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Partners from "./pages/Partners";
import PartnerDetail from "./pages/PartnerDetail";
import PartnerApply from "./pages/PartnerApply";
import MapSearch from "./pages/MapSearch";
import NotFound from "./pages/NotFound";

// ── Business ──────────────────────────────────────────────────────────
import BusinessHome from "./pages/business/BusinessHome";
import BusinessListings from "./pages/business/BusinessListings";
import BusinessProfiles from "./pages/business/BusinessProfiles";
import BusinessListingDetail from "./pages/business/BusinessListingDetail";
import BusinessProfileDetail from "./pages/business/BusinessProfileDetail";
import BusinessListHome from "./pages/business/BusinessListHome";
import BusinessCreateProfile from "./pages/business/BusinessCreateProfile";

export default function App() {
  return (
    <Router>
      <SiteProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* ── Homes ── */}
                <Route path="/"               element={<Home />} />
                <Route path="/listings"       element={<Listings />} />
                <Route path="/profiles"       element={<Profiles />} />
                <Route path="/listings/:id"   element={<ListingDetail />} />
                <Route path="/profiles/:id"   element={<ProfileDetail />} />
                <Route path="/list-home"      element={<ListHome />} />
                <Route path="/create-profile" element={<CreateProfile />} />
                <Route path="/about"          element={<About />} />
                <Route path="/how-it-works"   element={<HowItWorks />} />
                <Route path="/partners"       element={<Partners />} />
                <Route path="/partners/:id"   element={<PartnerDetail />} />
                <Route path="/partner-apply"  element={<PartnerApply />} />
                <Route path="/map"            element={<MapSearch />} />

                {/* ── Business ── */}
                <Route path="/business"                       element={<BusinessHome />} />
                <Route path="/business/listings"              element={<BusinessListings />} />
                <Route path="/business/profiles"              element={<BusinessProfiles />} />
                <Route path="/business/listings/:id"          element={<BusinessListingDetail />} />
                <Route path="/business/profiles/:id"          element={<BusinessProfileDetail />} />
                <Route path="/business/list-property"         element={<BusinessListHome />} />
                <Route path="/business/create-profile"        element={<BusinessCreateProfile />} />

                {/* ── Catch-all ── */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </SiteProvider>
    </Router>
  );
}

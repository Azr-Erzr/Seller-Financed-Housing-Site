// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/"                element={<Home />} />
              <Route path="/listings"        element={<Listings />} />
              <Route path="/profiles"        element={<Profiles />} />
              <Route path="/listings/:id"    element={<ListingDetail />} />
              <Route path="/profiles/:id"    element={<ProfileDetail />} />
              <Route path="/list-home"       element={<ListHome />} />
              <Route path="/create-profile"  element={<CreateProfile />} />
              <Route path="/about"           element={<About />} />
              <Route path="/how-it-works"    element={<HowItWorks />} />
              <Route path="/partners"        element={<Partners />} />
              <Route path="/partners/:id"    element={<PartnerDetail />} />
              <Route path="/partner-apply"   element={<PartnerApply />} />
              <Route path="/map"             element={<MapSearch />} />
              <Route path="*"               element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </Router>
  );
}

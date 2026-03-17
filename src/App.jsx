// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/listings"       element={<Listings />} />
            <Route path="/profiles"       element={<Profiles />} />
            <Route path="/listings/:id"   element={<ListingDetail />} />
            <Route path="/profiles/:id"   element={<ProfileDetail />} />
            <Route path="/list-home"      element={<ListHome />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/about"          element={<About />} />
            <Route path="/how-it-works"   element={<HowItWorks />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

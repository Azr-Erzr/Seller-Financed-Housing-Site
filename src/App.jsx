import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Profiles from "./pages/Profiles";
import ListingDetail from "./pages/ListingDetail";
import ProfileDetail from "./pages/ProfileDetail";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/profile/:id" element={<ProfileDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
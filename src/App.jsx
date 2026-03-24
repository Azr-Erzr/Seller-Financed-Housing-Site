// src/App.jsx
// Mega-Batch C — Added /business/category/:slug route.
// Builds on Mega-Batch A (FloatingProvider) + Mega-Batch B (CityPage, TopicCluster).

import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SiteProvider } from "./context/SiteContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import { FloatingProvider } from "./components/FloatingActionManager";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ModeRedirect from "./components/ModeRedirect";
import AuthModal from "./components/AuthModal";
import ScrollToTop from "./components/ScrollToTop";
import ChatAgentGlobal from "./components/ChatAgentGlobal";

// ── Lazy-loaded pages — Homes ───────────────────────────────────────
const Home              = lazy(() => import("./pages/Home.jsx"));
const Listings          = lazy(() => import("./pages/Listings.jsx"));
const Profiles          = lazy(() => import("./pages/Profiles.jsx"));
const ListingDetail     = lazy(() => import("./pages/ListingDetail.jsx"));
const ProfileDetail     = lazy(() => import("./pages/ProfileDetail.jsx"));
const ListHome          = lazy(() => import("./pages/ListHome.jsx"));
const CreateProfile     = lazy(() => import("./pages/CreateProfile.jsx"));
const About             = lazy(() => import("./pages/About.jsx"));
const HowItWorks        = lazy(() => import("./pages/HowItWorks.jsx"));
const Partners          = lazy(() => import("./pages/Partners.jsx"));
const PartnerDetail     = lazy(() => import("./pages/PartnerDetail.jsx"));
const PartnerApply      = lazy(() => import("./pages/PartnerApply.jsx"));
const MapSearch         = lazy(() => import("./pages/MapSearch.jsx"));
const Saved             = lazy(() => import("./pages/Saved.jsx"));
const Account           = lazy(() => import("./pages/Account.jsx"));
const Guide             = lazy(() => import("./pages/Guide.jsx"));
const GuideArticle      = lazy(() => import("./pages/GuideArticle.jsx"));
const NotFound          = lazy(() => import("./pages/NotFound.jsx"));

// ── Lazy-loaded pages — Legal ───────────────────────────────────────
const TermsOfUse        = lazy(() => import("./pages/TermsOfUse.jsx"));
const PrivacyPolicy     = lazy(() => import("./pages/PrivacyPolicy.jsx"));
const Accessibility     = lazy(() => import("./pages/Accessibility.jsx"));
const Pricing           = lazy(() => import("./pages/Pricing.jsx"));

// ── Lazy-loaded pages — Tools ───────────────────────────────────────
const BuyerReadiness    = lazy(() => import("./pages/tools/BuyerReadiness.jsx"));
const SellerAssessment  = lazy(() => import("./pages/tools/SellerAssessment.jsx"));
const NewcomerGuide     = lazy(() => import("./pages/tools/NewcomerGuide.jsx"));
const ForeignBuyerGuide = lazy(() => import("./pages/tools/ForeignBuyerGuide.jsx"));
const InvestorOnboarding= lazy(() => import("./pages/tools/InvestorOnboarding.jsx"));

// ── Lazy-loaded pages — SEO (Mega-Batch B) ──────────────────────────
const CityPage          = lazy(() => import("./pages/CityPage.jsx"));
const TopicCluster      = lazy(() => import("./pages/TopicCluster.jsx"));

// ── Lazy-loaded pages — Business ────────────────────────────────────
const BusinessHome            = lazy(() => import("./pages/business/BusinessHome.jsx"));
const BusinessListings        = lazy(() => import("./pages/business/BusinessListings.jsx"));
const BusinessProfiles        = lazy(() => import("./pages/business/BusinessProfiles.jsx"));
const BusinessListingDetail   = lazy(() => import("./pages/business/BusinessListingDetail.jsx"));
const BusinessProfileDetail   = lazy(() => import("./pages/business/BusinessProfileDetail.jsx"));
const BusinessListHome        = lazy(() => import("./pages/business/BusinessListHome.jsx"));
const BusinessCreateProfile   = lazy(() => import("./pages/business/BusinessCreateProfile.jsx"));
const BusinessMapSearch       = lazy(() => import("./pages/business/BusinessMapSearch.jsx"));
const BusinessSaved           = lazy(() => import("./pages/business/BusinessSaved.jsx"));

// ── Lazy-loaded pages — Business Category (Mega-Batch C) ────────────
const CategoryPage            = lazy(() => import("./pages/business/CategoryPage.jsx"));

// ── Lazy-loaded pages — Pro Dashboard (G4) ──────────────────────────
const ProRegister             = lazy(() => import("./pages/pro/ProRegister.jsx"));
const ProDashboard            = lazy(() => import("./pages/pro/ProDashboard.jsx"));

function PageLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <SiteProvider>
          <ToastProvider>
            <FloatingProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Suspense fallback={<PageLoading />}>
                    <Routes>
                      {/* ── Homes ── */}
                      <Route path="/" element={<ModeRedirect targetMode="homes"><Home/></ModeRedirect>}/>
                      <Route path="/listings"         element={<Listings/>}/>
                      <Route path="/profiles"         element={<Profiles/>}/>
                      <Route path="/listings/:id"     element={<ListingDetail/>}/>
                      <Route path="/profiles/:id"     element={<ProfileDetail/>}/>
                      <Route path="/list-home"        element={<ListHome/>}/>
                      <Route path="/create-profile"   element={<CreateProfile/>}/>
                      <Route path="/about"            element={<About/>}/>
                      <Route path="/how-it-works"     element={<HowItWorks/>}/>
                      <Route path="/partners"         element={<Partners/>}/>
                      <Route path="/partners/:id"     element={<PartnerDetail/>}/>
                      <Route path="/partner-apply"    element={<PartnerApply/>}/>
                      <Route path="/map"              element={<MapSearch/>}/>
                      <Route path="/saved"            element={<Saved/>}/>
                      <Route path="/account"          element={<Account/>}/>
                      <Route path="/guide"            element={<Guide/>}/>
                      <Route path="/guide/:id"        element={<GuideArticle/>}/>

                      {/* ── Legal ── */}
                      <Route path="/terms"            element={<TermsOfUse/>}/>
                      <Route path="/privacy"          element={<PrivacyPolicy/>}/>
                      <Route path="/accessibility"    element={<Accessibility/>}/>
                      <Route path="/pricing"          element={<Pricing/>}/>

                      {/* ── Tools ── */}
                      <Route path="/tools/buyer-readiness"    element={<BuyerReadiness/>}/>
                      <Route path="/tools/seller-assessment"  element={<SellerAssessment/>}/>
                      <Route path="/tools/newcomer-guide"     element={<NewcomerGuide/>}/>
                      <Route path="/tools/foreign-buyer-guide" element={<ForeignBuyerGuide/>}/>
                      <Route path="/tools/investor-onboarding" element={<InvestorOnboarding/>}/>

                      {/* ── SEO Pages ── */}
                      <Route path="/city/:slug"       element={<CityPage/>}/>
                      <Route path="/topics/:slug"     element={<TopicCluster/>}/>

                      {/* ── Business ── */}
                      <Route path="/business" element={<ModeRedirect targetMode="business"><BusinessHome/></ModeRedirect>}/>
                      <Route path="/business/listings"         element={<BusinessListings/>}/>
                      <Route path="/business/profiles"         element={<BusinessProfiles/>}/>
                      <Route path="/business/listings/:id"     element={<BusinessListingDetail/>}/>
                      <Route path="/business/profiles/:id"     element={<BusinessProfileDetail/>}/>
                      <Route path="/business/list-property"    element={<BusinessListHome/>}/>
                      <Route path="/business/create-profile"   element={<BusinessCreateProfile/>}/>
                      <Route path="/business/map"              element={<BusinessMapSearch/>}/>
                      <Route path="/business/saved"            element={<BusinessSaved/>}/>
                      <Route path="/business/category/:slug"   element={<CategoryPage/>}/>

                      {/* ── Pro Dashboard (G4) ── */}
                      <Route path="/pro/register"  element={<ProRegister/>}/>
                      <Route path="/pro/dashboard" element={<ProDashboard/>}/>

                      {/* ── Catch-all ── */}
                      <Route path="*" element={<NotFound/>}/>
                    </Routes>
                  </Suspense>
                </main>
                <Footer/>
                <AuthModal/>
                <ChatAgentGlobal/>
              </div>
            </FloatingProvider>
          </ToastProvider>
        </SiteProvider>
      </AuthProvider>
    </Router>
  );
}

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
const Home              = lazy(() => import("./pages/Home"));
const Listings          = lazy(() => import("./pages/Listings"));
const Profiles          = lazy(() => import("./pages/Profiles"));
const ListingDetail     = lazy(() => import("./pages/ListingDetail"));
const ProfileDetail     = lazy(() => import("./pages/ProfileDetail"));
const ListHome          = lazy(() => import("./pages/ListHome"));
const CreateProfile     = lazy(() => import("./pages/CreateProfile"));
const About             = lazy(() => import("./pages/About"));
const HowItWorks        = lazy(() => import("./pages/HowItWorks"));
const Partners          = lazy(() => import("./pages/Partners"));
const PartnerDetail     = lazy(() => import("./pages/PartnerDetail"));
const PartnerApply      = lazy(() => import("./pages/PartnerApply"));
const MapSearch         = lazy(() => import("./pages/MapSearch"));
const Saved             = lazy(() => import("./pages/Saved"));
const Account           = lazy(() => import("./pages/Account"));
const Guide             = lazy(() => import("./pages/Guide"));
const GuideArticle      = lazy(() => import("./pages/GuideArticle"));
const NotFound          = lazy(() => import("./pages/NotFound"));

// ── Lazy-loaded pages — Legal ───────────────────────────────────────
const TermsOfUse        = lazy(() => import("./pages/TermsOfUse"));
const PrivacyPolicy     = lazy(() => import("./pages/PrivacyPolicy"));
const Accessibility     = lazy(() => import("./pages/Accessibility"));
const Pricing           = lazy(() => import("./pages/Pricing"));

// ── Lazy-loaded pages — Tools ───────────────────────────────────────
const BuyerReadiness    = lazy(() => import("./pages/tools/BuyerReadiness"));
const SellerAssessment  = lazy(() => import("./pages/tools/SellerAssessment"));
const NewcomerGuide     = lazy(() => import("./pages/tools/NewcomerGuide"));
const ForeignBuyerGuide = lazy(() => import("./pages/tools/ForeignBuyerGuide"));
const InvestorOnboarding= lazy(() => import("./pages/tools/InvestorOnboarding"));

// ── Lazy-loaded pages — SEO (Mega-Batch B) ──────────────────────────
const CityPage          = lazy(() => import("./pages/CityPage"));
const TopicCluster      = lazy(() => import("./pages/TopicCluster"));

// ── Lazy-loaded pages — Business ────────────────────────────────────
const BusinessHome            = lazy(() => import("./pages/business/BusinessHome"));
const BusinessListings        = lazy(() => import("./pages/business/BusinessListings"));
const BusinessProfiles        = lazy(() => import("./pages/business/BusinessProfiles"));
const BusinessListingDetail   = lazy(() => import("./pages/business/BusinessListingDetail"));
const BusinessProfileDetail   = lazy(() => import("./pages/business/BusinessProfileDetail"));
const BusinessListHome        = lazy(() => import("./pages/business/BusinessListHome"));
const BusinessCreateProfile   = lazy(() => import("./pages/business/BusinessCreateProfile"));
const BusinessMapSearch       = lazy(() => import("./pages/business/BusinessMapSearch"));
const BusinessSaved           = lazy(() => import("./pages/business/BusinessSaved"));

// ── Lazy-loaded pages — Business Category (Mega-Batch C) ────────────
const CategoryPage            = lazy(() => import("./pages/business/CategoryPage"));

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

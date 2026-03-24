// src/pages/business/BusinessHome.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Wheat, Hammer, Building2, Factory, Droplets, TreePine, Hotel, Star, DollarSign, BarChart3, Landmark, Zap, Sprout, Timer, HeartHandshake } from "lucide-react";
import DealStructureExplorer from "../../components/DealStructureExplorer";
import { BUSINESS_SCENARIOS } from "../../data/businessDealScenarios";
import FadeIn from "../../components/FadeIn";
const ARTICLE_ICON_MAP = {
  hammer: Hammer, chart: BarChart3, search: Search,
};
import { getAllCommListings, getAllCommProfiles } from "../../lib/commercial-storage";
import { useRequireAuth } from "../../context/AuthContext";
import CommListingCard from "../../components/business/CommListingCard";
import CommProfileCard from "../../components/business/CommProfileCard";
import SavingsCalculator from "../../components/SavingsCalculator";
import { ARTICLES_BUSINESS } from "../../data/guide-articles";
import { usePageMeta, PAGE_META } from "../../hooks/usePageMeta";

const CATEGORIES = [
  { Icon: Wheat, label: "Farmland",    cat: "Agricultural / Farm"         },
  { Icon: Hammer, label: "Development", cat: "Development Land"             },
  { Icon: Building2, label: "Commercial",  cat: "Commercial Building"           },
  { Icon: Factory, label: "Industrial",  cat: "Industrial / Warehouse"        },
  { Icon: Droplets, label: "Waterfront",  cat: "Waterfront / Recreational"     },
  { Icon: TreePine, label: "Vacant Land", cat: "Vacant Land"                   },
  { Icon: Hotel, label: "Multi-Unit",  cat: "Multi-Unit / Apartment"        },
  { Icon: Star, label: "Special Use", cat: "Special Purpose"               },
];

export default function BusinessHome() {
  const [listings, setListings] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [search,   setSearch]   = useState("");
  const navigate   = useNavigate();
  const requireAuth = useRequireAuth();
  usePageMeta(PAGE_META.businessHome.title, PAGE_META.businessHome.desc);

  useEffect(() => {
    getAllCommListings().then((l) => setListings(l.slice(0, 3)));
    getAllCommProfiles().then((p) => setProfiles(p.slice(0, 3)));
  }, []);

  const handleSearch = () => {
    const q = search.trim();
    navigate(q ? `/business/listings?q=${encodeURIComponent(q)}` : "/business/listings");
  };

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-emerald-700 to-emerald-900 pt-16 pb-20 overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #6ee7b7, transparent 70%)" }} />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Hammer className="w-4 h-4" /> Sel-Fi Business
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-5" style={{color:"#fff"}}>
            Commercial &amp; Land Deals,<br/>
            <span className="text-amber-400">Direct from Owner</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8" style={{color:"#a7f3d0"}}>
            Vacant land, farms, development parcels, commercial buildings, and industrial properties —
            with direct vendor financing, flexible terms, and professional support.
          </p>
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex gap-2 max-w-2xl mx-auto mb-8">
            <div className="flex-1 flex items-center gap-2 px-4">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input type="text" placeholder="City, county, or property type..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 text-gray-800 text-sm outline-none bg-transparent" />
            </div>
            <button onClick={handleSearch}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-colors">
              Search
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/business/listings"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors">
              <Building2 className="w-4 h-4" /> Browse Properties
            </Link>
            <Link to="/business/profiles"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors">
              <Search className="w-4 h-4" /> Browse Buyers
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-emerald-600 py-6">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { stat: "Established practice", label: "VTB is standard in commercial RE"    },
              { stat: "Bank-optional",        label: "for land, farm & development deals"  },
              { stat: "30–90 days faster",    label: "typical close vs. institutional financing" },
              { stat: "Cap gains deferral",   label: "may be available via payment structure" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="text-lg font-extrabold text-white">{stat}</p>
                <p className="text-xs text-emerald-200 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category quick-links ── */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATEGORIES.map(({ Icon, label, cat }) => (
              <Link key={cat} to={`/business/listings?category=${encodeURIComponent(cat)}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-emerald-700 text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

   {/* ── Deal Structure Explorer ── */}
<DealStructureExplorer scenarios={BUSINESS_SCENARIOS} isBusiness={true} />

      {/* ── For Buyers ── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              For Commercial Buyers and Investors
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Traditional bank financing for land, development parcels, and agricultural properties
              can be restrictive or slow. Vendor financing often offers more flexibility on terms,
              timelines, and deal structures.
            </p>
          </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { Icon: Wheat, title: "Farm & Agricultural Land", body: "Bank financing for raw agricultural land can be difficult without production history. Vendors familiar with the land may offer more workable terms." },
              { Icon: Hammer, title: "Development Parcels", body: "Pre-zoning or rezoning-dependent parcels are often challenging to finance through institutions. VTB can bridge that gap." },
              { Icon: Timer, title: "Time-Sensitive Deals", body: "Commercial bank approvals often take 60–90 days. Motivated parties using VTB can sometimes close significantly faster." },
              { Icon: HeartHandshake, title: "Flexible Structures", body: "Balloon terms, interest-only periods, and negotiated rates — structures that can be tailored to both sides' needs." },
            ].map(({ Icon, title, body }, i) => (
              <FadeIn key={title} delay={i * 70}>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
              </FadeIn>
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => requireAuth("/business/create-profile")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors">
              Create a Buyer Profile <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured Properties ── */}
      {listings.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
                <p className="text-gray-500 mt-1">Seller-financed commercial and land opportunities</p>
              </div>
              <Link to="/business/listings" className="text-emerald-600 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listings.map((l) => <CommListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Deal Calculator ── */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Model Your Deal</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Vendor advantage, comparative financing, and capital gains deferral — modelled at commercial deal sizes.
            </p>
          </div>
          <SavingsCalculator />
        </div>
      </section>

      {/* ── Active Buyers ── */}
      {profiles.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Active Commercial Buyers</h2>
                <p className="text-gray-500 mt-1">Investors and developers looking for seller-financed deals</p>
              </div>
              <Link to="/business/profiles" className="text-emerald-600 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((p) => <CommProfileCard key={p.id} profile={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Guide teasers ── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Commercial Deal Guides</h2>
              <p className="text-gray-500 mt-1">VTB structure, tax strategy, and due diligence for commercial transactions</p>
            </div>
            <Link to="/guide" className="text-emerald-600 text-sm font-medium hover:underline flex items-center gap-1">
              All guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {ARTICLES_BUSINESS.slice(0, 3).map((article) => (
              <Link key={article.id} to={`/guide/${article.id}`}
                className="group block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className={`h-16 bg-gradient-to-br ${article.heroColor} flex items-center justify-center`}>
                  {(() => { const I = ARTICLE_ICON_MAP[article.icon]; return I ? <I className="w-8 h-8 text-white/80" /> : null; })()}
                </div>
                <div className="p-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${article.categoryColor}`}>
                    {article.category}
                  </span>
                  <p className="font-semibold text-gray-900 text-sm mt-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {article.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{article.readTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative bg-gradient-to-br from-emerald-700 to-emerald-900 py-16 overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #6ee7b7, transparent 70%)" }} />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{color:"#fff"}}>Ready to Make Your Move?</h2>
          <p className="mb-8" style={{color:"#a7f3d0"}}>
            List a commercial property, create a buyer profile, or connect with a commercial real estate lawyer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => requireAuth("/business/list-property")}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors">
              List a Property
            </button>
            <button onClick={() => requireAuth("/business/create-profile")}
              className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors">
              Buyer Profile
            </button>
            <Link to="/partners?category=lawyer"
              className="px-8 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Find a Lawyer
            </Link>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-xs text-gray-400 leading-relaxed text-center">
          Sel-Fi facilitates introductions between property vendors and buyers. Sel-Fi is not a real estate
          brokerage, mortgage broker, lender, or legal advisor. All financial figures are estimates and will
          vary by deal structure. Capital gains deferral depends on individual tax circumstances — consult
          a licensed accountant. Consult a licensed Ontario real estate lawyer before entering any agreement.{" "}
          <a href="/terms" className="text-emerald-500 hover:underline">Terms of Use</a>{" · "}
          <a href="/privacy" className="text-emerald-500 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

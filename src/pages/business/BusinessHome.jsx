// src/pages/business/BusinessHome.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { getAllCommListings, getAllCommProfiles } from "../../lib/commercial-storage";
import CommListingCard from "../../components/business/CommListingCard";
import CommProfileCard from "../../components/business/CommProfileCard";
import SavingsCalculator from "../../components/SavingsCalculator";
import { ARTICLES_BUSINESS } from "../../data/guide-articles";

const CATEGORIES = [
  { icon: "🌾", label: "Farmland",    cat: "Agricultural / Farm"         },
  { icon: "🏗️", label: "Development", cat: "Development Land"             },
  { icon: "🏢", label: "Commercial",  cat: "Commercial Building"           },
  { icon: "🏭", label: "Industrial",  cat: "Industrial / Warehouse"        },
  { icon: "💧", label: "Waterfront",  cat: "Waterfront / Recreational"     },
  { icon: "🌿", label: "Vacant Land", cat: "Vacant Land"                   },
  { icon: "🏘️", label: "Multi-Unit",  cat: "Multi-Unit / Apartment"        },
  { icon: "⭐", label: "Special Use", cat: "Special Purpose"               },
];

export default function BusinessHome() {
  const [listings, setListings] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [search,   setSearch]   = useState("");
  const navigate   = useNavigate();

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
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 pt-16 pb-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🏗️ LandMatch Business
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-5" style={{color:"#fff"}}>
            Commercial &amp; Land Deals,<br/>
            <span className="text-amber-400">Direct from Owner</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8" style={{color:"#a7f3d0"}}>
            Vacant land, farms, development parcels, commercial buildings, and industrial properties —
            seller-financed, no banks, no agents.
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
              🏢 Browse Properties
            </Link>
            <Link to="/business/profiles"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors">
              👥 Browse Buyers
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
              { stat: "0 banks required",     label: "for land, farm & development deals"  },
              { stat: "30–90 days faster",    label: "close vs. institutional financing"   },
              { stat: "Cap gains deferral",   label: "available via payment term structure" },
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
            {CATEGORIES.map(({ icon, label, cat }) => (
              <Link key={cat} to={`/business/listings?category=${encodeURIComponent(cat)}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 transition-all group">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-medium text-gray-600 group-hover:text-emerald-700 text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vendor advantage ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Vendors Choose Seller Financing
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Commercial VTB isn't new — it's how land, farms, and development parcels have always
                transacted when institutional financing doesn't fit. LandMatch simply gives vendors and
                buyers a structured marketplace to find each other directly.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "💰", title: "Avoid the commission",          body: "On a $2M deal at 3% + HST that's $67,800 you keep. On a $5M deal it's $169,500." },
                  { icon: "📊", title: "Defer capital gains",           body: "Spread recognition over the payment term via the CRA capital gains reserve. Your CPA can model the structure." },
                  { icon: "🏦", title: "Earn secured investment income", body: "8% on a $1.5M VTB is $120,000/year in interest — secured against property you know well." },
                  { icon: "⚡", title: "Close faster",                  body: "No bank underwriting, environmental sign-offs, or 90-day approval delays. Qualified buyer, motivated vendor, deal done." },
                ].map(({ icon, title, body }) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{title}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/business/list-property"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors">
                List a Property <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick deal comparison */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="font-bold text-gray-900 text-lg mb-1">Vendor on a $2,000,000 Property</p>
              <p className="text-sm text-gray-500 mb-5">LandMatch VTB vs. traditional brokered sale</p>
              <div className="space-y-3 text-sm">
                {[
                  { l: "Vendor commission (3% + HST)",    t: "-$67,800", m: "$0",          win: true  },
                  { l: "Bank approval delays",             t: "60–90 days", m: "0 days",   win: true  },
                  { l: "Interest earned (8%, 3yr term)",   t: "$0",      m: "+$276,000",   win: true  },
                  { l: "Capital gains recognition",        t: "Year 1",  m: "Spread 3 yrs",win: true  },
                  { l: "Legal fees",                       t: "~$3,000", m: "~$3,000",     win: false },
                ].map(({ l, t, m, win }) => (
                  <div key={l} className="grid grid-cols-3 gap-2 items-center text-xs">
                    <span className="text-gray-500 col-span-1">{l}</span>
                    <span className="text-center text-gray-400 line-through">{t}</span>
                    <span className={`text-center font-bold ${win ? "text-emerald-600" : "text-gray-600"}`}>{m}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-3 grid grid-cols-3 gap-2 items-center">
                  <span className="font-bold text-gray-900 text-xs">Net advantage</span>
                  <span className="text-center text-xs text-gray-400">Traditional</span>
                  <span className="text-center font-extrabold text-lg text-emerald-700">+$343K</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">*Estimates. 20yr amort, 3yr term, 25% down. Tax advice not included.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Buyers ── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              For Commercial Buyers and Investors
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Bank financing on land, development parcels, and agricultural properties is restrictive, slow,
              and often unavailable entirely. Direct vendor financing moves deals faster and on terms
              both sides actually want.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { icon: "🌾", title: "Farm &amp; Agricultural Land", body: "Banks rarely finance raw agricultural land without production income. Vendors who know the land can finance it directly." },
              { icon: "🏗️", title: "Development Parcels", body: "Pre-zoning or rezoning-dependent parcels are nearly impossible to bank-finance. Vendor financing bridges the gap." },
              { icon: "⏱️", title: "Time-Sensitive Deals", body: "Commercial bank approvals take 60–90 days. A motivated vendor can close in weeks with a qualified buyer." },
              { icon: "🤝", title: "Flexible Structures", body: "Balloon terms, interest-only periods, and negotiated rates — structures a bank would never offer." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="text-2xl mb-3" dangerouslySetInnerHTML={{__html: icon}} />
                <p className="font-semibold text-gray-900 text-sm mb-1" dangerouslySetInnerHTML={{__html: title}} />
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/business/create-profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors">
              Create a Buyer Profile <ArrowRight className="w-4 h-4" />
            </Link>
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
                <div className={`h-16 bg-gradient-to-br ${article.heroColor} flex items-center px-4`}>
                  <span className="text-3xl">{article.icon}</span>
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
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{color:"#fff"}}>Ready to Make Your Move?</h2>
          <p className="mb-8" style={{color:"#a7f3d0"}}>
            List a commercial property, create a buyer profile, or connect with a commercial real estate lawyer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/business/list-property"
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors">
              List a Property
            </Link>
            <Link to="/business/create-profile"
              className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors">
              Buyer Profile
            </Link>
            <Link to="/partners?category=lawyer"
              className="px-8 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Find a Lawyer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

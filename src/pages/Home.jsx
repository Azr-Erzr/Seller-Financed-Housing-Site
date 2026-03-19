// src/pages/Home.jsx — Sel-Fi Homes redesign
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Banknote, Landmark, CheckCircle, Scale, Wrench, Globe, RefreshCw, BarChart3, Building, HeartHandshake, Lock, FileText, PenLine, Home as HomeIcon, KeyRound, Hammer } from "lucide-react";

const ARTICLE_ICON_MAP = {
  home: HomeIcon, banknote: Banknote, landmark: Landmark, key: KeyRound,
  pen: PenLine, scale: Scale, hammer: Hammer, chart: BarChart3, search: Search,
};
import { getAllListings, getAllProfiles } from "../lib/storage";
import { useRequireAuth } from "../context/AuthContext";
import ListingCard from "../components/ListingCard";
import ProfileCard from "../components/ProfileCard";
import { ListingsSkeleton } from "../components/LoadingSkeleton";
import SavingsCalculator from "../components/SavingsCalculator";
import { ARTICLES } from "../data/guide-articles";

export default function Home() {
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();

  useEffect(() => {
    Promise.all([
      getAllListings().then((l) => setListings(l.slice(0, 3))),
      getAllProfiles().then((p) => setProfiles(p.slice(0, 3))),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    const q = search.trim();
    navigate(q ? `/listings?location=${encodeURIComponent(q)}` : "/listings");
  };

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 pt-16 pb-20">
        <div className="max-w-5xl mx-auto px-6 text-center">

          {/* Value proposition */}
          <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Direct seller-to-buyer deals. Agent-optional. Bank-optional.
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-5" style={{color:"#fff"}}>
            Sell Direct. Save <span className="text-orange-400">$30,000+</span><br/>in Commissions.
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-8" style={{color:"#bfdbfe"}}>
            Sel-Fi connects property sellers and buyers for direct deals — seller-financed,
            rent-to-own, and private sale. Sellers keep their commission and earn interest.
            Buyers get flexible paths to ownership. Both sides engage their own professionals.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex gap-2 max-w-2xl mx-auto mb-8">
            <div className="flex-1 flex items-center gap-2 px-4">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by city or area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 text-gray-800 text-sm outline-none bg-transparent"
              />
            </div>
            <button onClick={handleSearch}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-colors">
              Search Homes
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/listings"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors">
              Browse Homes
            </Link>
            <Link to="/profiles"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors">
              Browse Buyers
            </Link>
            <Link to="/map"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors">
              Map Search
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-blue-600 py-6">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { stat: "$30K–$45K", label: "Typical commission savings" },
              { stat: "5–12%",     label: "Interest earned by sellers" },
              { stat: "100%",      label: "Seller sets the terms" },
              { stat: "Flexible",  label: "Bank-optional structures" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="text-2xl font-extrabold text-white">{stat}</p>
                <p className="text-xs text-blue-200 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Sellers: key benefits ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sell Direct and Earn More</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                When you list on Sel-Fi, you sell directly to the buyer and hold a registered mortgage
                on the property. You set the interest rate, choose your buyer, and receive monthly
                payments — income that would normally go to a bank. You may also save on agent commissions
                by managing the listing yourself.
              </p>
              <div className="space-y-4">
                {[
                  { Icon: Banknote, title: "Save on agent commissions", body: "Sellers who list directly can save the listing-side commission — typically 2.5% + HST. Buyers can still use their own agent if they choose." },
                  { Icon: Landmark, title: "Earn interest on the mortgage", body: "At 7% on a $480K VTB, a seller could earn approximately $150K in interest over 5 years. Actual returns depend on deal terms." },
                  { Icon: CheckCircle, title: "Choose your buyer", body: "Review buyer profiles, see financial details they've chosen to share, and decide who you're comfortable working with." },
                  { Icon: Scale, title: "Legal protection on title", body: "Your VTB mortgage is registered on title — the same legal framework as any bank mortgage. Power of Sale remedies apply if a buyer defaults." },
                ].map(({ Icon, title, body }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{title}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => requireAuth("/list-home")}
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">
                List Your Home <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="font-bold text-gray-900 text-lg mb-1">Seller on a $650,000 Home</p>
              <p className="text-sm text-gray-500 mb-5">Sel-Fi vs. traditional agent sale</p>
              <div className="space-y-3">
                {[
                  { label: "Listing agent commission (2.5%)", trad: "-$16,250", lm: "$0", win: true },
                  { label: "Buyer's agent commission (2.5%)", trad: "-$16,250", lm: "$0", win: true },
                  { label: "HST on commissions", trad: "-$4,225", lm: "$0", win: true },
                  { label: "Interest income (7%, 5 yrs, 20% down)", trad: "$0", lm: "+$163K", win: true },
                ].map(({ label, trad, lm, win }) => (
                  <div key={label} className="grid grid-cols-3 gap-2 text-sm items-center">
                    <span className="text-gray-600 col-span-1 text-xs">{label}</span>
                    <span className="text-red-500 font-semibold text-center">{trad}</span>
                    <span className={`font-bold text-center ${win ? "text-green-600" : "text-gray-700"}`}>{lm}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-3 grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-900 font-bold text-xs">Total difference</span>
                  <span className="text-center text-xs text-gray-400">Traditional</span>
                  <span className="text-center font-extrabold text-xl text-green-600">+$199K</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">*Estimates. Actual numbers vary by deal terms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Buyers ── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">More Paths to Homeownership</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Traditional bank financing works for most buyers — but not all. If your situation
              doesn't fit a standard mortgage formula, seller financing may create another path.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { Icon: Wrench, title: "Self-Employed", body: "Variable income can make bank qualification difficult. A seller can consider your full financial picture beyond a T4." },
              { Icon: Globe, title: "New to Canada", body: "While newcomer mortgage programs exist, some buyers still face documentation or credit history gaps. Seller financing can offer additional flexibility." },
              { Icon: RefreshCw, title: "Career Change", body: "A new role or industry switch can reset your qualification timeline at a bank. Sellers can evaluate your current situation directly." },
              { Icon: BarChart3, title: "Near the Threshold", body: "If you're close to qualifying but fall short on the stress test, a seller-financed structure may bridge that gap." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Buyers can work with their own realtor, lawyer, or mortgage broker — Sel-Fi supports hybrid deals.</p>
            <button onClick={() => requireAuth("/create-profile")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Create a Buyer Profile <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Trust Signals ── */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { Icon: Scale, title: "Backed by Ontario Law", body: "VTB mortgages are registered on title under the same legal framework as any bank mortgage." },
              { Icon: Building, title: "Lawyer Required", body: "Every deal closes through a licensed Ontario real estate lawyer. No exceptions." },
              { Icon: HeartHandshake, title: "Agent-Compatible", body: "Buyers can bring their own realtor. Sellers can engage listing support. Sel-Fi works alongside professionals, not against them." },
              { Icon: Lock, title: "Income Privacy", body: "Financial data is protected by default. Buyers choose what to share and when." },
            ].map(({ Icon, title, body }) => (
              <div key={title}>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-500">Three steps to a deal — whether you're buying or selling.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: 1, Icon: FileText, title: "List or Create a Profile", body: "Sellers post their home with financing terms. Buyers create a profile with budget, income, and deal preferences. Both take about 5 minutes." },
              { num: 2, Icon: Search, title: "Match and Connect", body: "Sel-Fi scores compatibility across 5 financial dimensions. Browse matches, sign NDAs to share documents, and connect directly." },
              { num: 3, Icon: CheckCircle, title: "Negotiate and Close", body: "Agree on terms directly with the other party. A licensed real estate lawyer registers the mortgage and transfers title. Both sides are professionally represented." },
            ].map(({ num, Icon, title, body }) => (
              <div key={num} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">{num}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/how-it-works" className="text-sm text-blue-600 hover:underline">
              Full explanation — including legal steps and what to expect →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Homes ── */}
      {(loading || listings.length > 0) && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Homes</h2>
                <p className="text-gray-500 mt-1">Seller-financed homes available now in Durham Region</p>
              </div>
              <Link to="/listings" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {loading ? (
              <ListingsSkeleton count={3} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Savings Calculator ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Run Your Own Numbers</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              See exactly what you'd save as a seller — or what a VTB mortgage costs compared to a bank.
            </p>
          </div>
          <SavingsCalculator />
        </div>
      </section>

      {/* ── Active Buyers ── */}
      {profiles.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Active Buyers</h2>
                <p className="text-gray-500 mt-1">Buyers with profiles on Sel-Fi looking for seller-financed deals</p>
              </div>
              <Link to="/profiles" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profiles.map((p) => <ProfileCard key={p.id} profile={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Guide teasers ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">The Sel-Fi Guide</h2>
              <p className="text-gray-500 mt-1">Everything you need to understand seller financing</p>
            </div>
            <Link to="/guide" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              All guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {ARTICLES.slice(0, 3).map((article) => (
              <Link key={article.id} to={`/guide/${article.id}`} className="group block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className={`h-16 bg-gradient-to-br ${article.heroColor} flex items-center justify-center`}>
                  {(() => { const I = ARTICLE_ICON_MAP[article.icon]; return I ? <I className="w-8 h-8 text-white/80" /> : null; })()}
                </div>
                <div className="p-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${article.categoryColor}`}>{article.category}</span>
                  <p className="font-semibold text-gray-900 text-sm mt-2 group-hover:text-blue-600 transition-colors line-clamp-2">{article.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{article.readTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{color:"#fff"}}>
            Ready to Make Your Move?
          </h2>
          <p className="mb-8" style={{color:"#bfdbfe"}}>
            Whether you're selling and want to keep your commission, or buying and exploring
            flexible financing options — Sel-Fi is the place to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => requireAuth("/list-home")} className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors">
              List Your Home
            </button>
            <button onClick={() => requireAuth("/create-profile")} className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors">
              Create Buyer Profile
            </button>
            <Link to="/guide" className="px-8 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Read the Guide
            </Link>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-xs text-gray-400 leading-relaxed text-center">
          Sel-Fi facilitates introductions between property sellers and buyers. Sel-Fi is not a real estate
          brokerage, mortgage broker, lender, or legal advisor. All financial figures on this page are
          estimates based on typical scenarios and will vary by deal structure. Consult a licensed Ontario
          real estate lawyer and accountant before entering any agreement.{" "}
          <a href="/terms" className="text-blue-500 hover:underline">Terms of Use</a>{" · "}
          <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

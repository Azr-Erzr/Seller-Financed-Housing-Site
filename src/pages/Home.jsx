// src/pages/Home.jsx — LandMatch Homes redesign
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { getAllListings, getAllProfiles } from "../lib/storage";
import ListingCard from "../components/ListingCard";
import ProfileCard from "../components/ProfileCard";
import SavingsCalculator from "../components/SavingsCalculator";
import { ARTICLES } from "../data/guide-articles";

export default function Home() {
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllListings().then((l) => setListings(l.slice(0, 3)));
    getAllProfiles().then((p) => setProfiles(p.slice(0, 3)));
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
            No banks. No agents. Keep what's yours.
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-5" style={{color:"#fff"}}>
            Keep <span className="text-orange-400">$30,000+</span><br/>When You Sell Your Home
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-8" style={{color:"#bfdbfe"}}>
            LandMatch connects sellers and buyers directly — no listing agent, no buyer's agent,
            no bank approval required. Sellers earn interest. Buyers get access. Everyone saves.
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
              { stat: "$30K–$45K", label: "Avg. commission saved per sale" },
              { stat: "5–12%",     label: "Interest earned by seller" },
              { stat: "0 banks",   label: "Required for approval" },
              { stat: "100%",      label: "Seller controls terms" },
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">You Are the Bank — and That's Powerful</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                When you sell on LandMatch, you don't just sell your home — you become the lender.
                You hold a registered mortgage, set the interest rate, and receive monthly payments
                directly from the buyer. That's income a bank would normally take. Now you take it instead.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "💸", title: "Keep both sides of the commission", body: "Typically 5% + HST — that's $33,900 saved on a $600K home." },
                  { icon: "🏦", title: "Earn interest like a bank", body: "At 7% on a $480K VTB, you collect ~$150K in interest over 5 years." },
                  { icon: "✅", title: "You choose your buyer", body: "Review profiles, see income and DTI ratios, and decide who gets to buy your home." },
                  { icon: "⚖️", title: "You're legally protected", body: "Your mortgage is registered on title. If the buyer defaults, you have Power of Sale — the same right any bank has." },
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
              <Link to="/list-home"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">
                List Your Home <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="font-bold text-gray-900 text-lg mb-1">Seller on a $650,000 Home</p>
              <p className="text-sm text-gray-500 mb-5">LandMatch vs. traditional agent sale</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-3">The Bank Said No. We Say Yes.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Banks use rigid formulas. Sellers can use judgment. If you're self-employed, new to Canada,
              or simply don't fit the bank's mold — there's a seller on LandMatch who can say yes.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { icon: "👷", title: "Self-Employed", body: "Banks reject you because of T4 variability. Sellers can see your actual income and stability." },
              { icon: "🌍", title: "New to Canada", body: "Banks want 2 years of Canadian credit history. Sellers can consider your full financial picture." },
              { icon: "🔄", title: "Career Change", body: "New job, new income — but banks want 2 years at the same employer. Sellers are more flexible." },
              { icon: "📊", title: "Just Below Threshold", body: "If you're close but not quite there on the stress test, a seller can make the call a bank won't." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="text-2xl mb-3">{icon}</div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">Buyers can also use their own realtor — we support hybrid deals.</p>
            <Link to="/create-profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Create a Buyer Profile <ArrowRight className="w-4 h-4" />
            </Link>
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
              { num: 1, icon: "📝", title: "List or Create a Profile", body: "Sellers post their home with financing terms. Buyers create a profile with budget, income, and deal preferences. Both take about 5 minutes." },
              { num: 2, icon: "🔍", title: "Match and Connect", body: "LandMatch scores compatibility across 5 financial dimensions. Browse matches, sign NDAs to share documents, and connect directly." },
              { num: 3, icon: "✅", title: "Negotiate and Close", body: "Agree on terms directly. A real estate lawyer registers the mortgage and transfers title. No bank approval, no commission." },
            ].map(({ num, icon, title, body }) => (
              <div key={num} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-4">{icon}</div>
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
      {listings.length > 0 && (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
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
                <p className="text-gray-500 mt-1">Pre-qualified buyers ready to make a deal</p>
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
              <h2 className="text-3xl font-bold text-gray-900">The LandMatch Guide</h2>
              <p className="text-gray-500 mt-1">Everything you need to understand seller financing</p>
            </div>
            <Link to="/guide" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              All guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {ARTICLES.slice(0, 3).map((article) => (
              <Link key={article.id} to={`/guide/${article.id}`} className="group block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className={`h-16 bg-gradient-to-br ${article.heroColor} flex items-center px-4`}>
                  <span className="text-3xl">{article.icon}</span>
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
            Whether you're selling and want to keep your commission, or buying and need a path the banks blocked —
            LandMatch has a place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/list-home" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors">
              List Your Home
            </Link>
            <Link to="/create-profile" className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors">
              Create Buyer Profile
            </Link>
            <Link to="/guide" className="px-8 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Read the Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// src/pages/Guide.jsx — mode-reactive education hub
import React from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { ARTICLES_HOMES, ARTICLES_BUSINESS } from "../data/guide-articles";
import SavingsCalculator from "../components/SavingsCalculator";
import { ArrowRight, BookOpen } from "lucide-react";

export default function Guide() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;

  const heroBg    = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const badgeBg   = isBusiness ? "bg-white/10 text-emerald-100" : "bg-white/10 text-blue-100";
  const subColor  = isBusiness ? "#a7f3d0" : "#bfdbfe";
  const ctaBg1    = isBusiness ? "bg-amber-500 hover:bg-amber-600" : "bg-orange-500 hover:bg-orange-600";
  const ctaBg2    = isBusiness ? "bg-white text-emerald-700 hover:bg-emerald-50" : "bg-white text-blue-700 hover:bg-blue-50";
  const ctaBd     = isBusiness ? "border-white/30 text-white hover:bg-white/10" : "border-white/30 text-white hover:bg-white/10";

  const articles = isBusiness ? ARTICLES_BUSINESS : ARTICLES_HOMES;

  const HOMES_STATS = [
    { icon: "💸", stat: "$30,000–$45,000", label: "Typical commission savings",       sub: "on a $600K–$900K home vs. traditional sale" },
    { icon: "🏦", stat: "5–12%",           label: "Interest income for sellers",      sub: "earned on the VTB mortgage they hold" },
    { icon: "🔑", stat: "No bank. No formula.", label: "Buyers qualify on their full story", sub: "self-employed, new to Canada, unconventional income" },
  ];

  const BUSINESS_STATS = [
    { icon: "📋", stat: "Common practice", label: "VTB is standard in commercial RE", sub: "land, farms, development parcels transact this way routinely" },
    { icon: "📊", stat: "Up to 5 years",   label: "Capital gains can be deferred",   sub: "by spreading recognition over the payment term" },
    { icon: "⚡", stat: "30–90 days faster", label: "Close without institutional delays", sub: "no bank underwriting, environmental review, or covenant checklist" },
  ];

  const stats = isBusiness ? BUSINESS_STATS : HOMES_STATS;

  const heroTitle = isBusiness
    ? "Structure Deals That Close"
    : "Everything You Need to Know";

  const heroSub = isBusiness
    ? "Commercial VTB is established practice. We cover the mechanics, tax strategy, due diligence, and deal structures that matter for vendors, buyers, and investors."
    : "Seller financing is unfamiliar to most people — and that's exactly why we wrote this. Plain-English guides, real numbers, and honest explanations of how this works and why it's worth it.";

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className={`bg-gradient-to-br ${heroBg} py-16`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-5 ${badgeBg}`}>
            <BookOpen className="w-4 h-4" /> LandMatch Guide {isBusiness ? "— Business Edition" : ""}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color:"#fff"}}>
            {heroTitle}
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{color:subColor}}>
            {heroSub}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {stats.map(({ icon, stat, label, sub }) => (
              <div key={label} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <div className="text-3xl mb-3">{icon}</div>
                <p className="text-xl font-extrabold text-gray-900 mb-1">{stat}</p>
                <p className="font-semibold text-gray-700 text-sm mb-1">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business mode callout */}
      {isBusiness && (
        <section className="py-8 bg-emerald-50 border-b border-emerald-100">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl shrink-0">🏗️</span>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Commercial Real Estate Context</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Unlike residential buyers, most commercial vendors and buyers already understand VTB financing.
                  These guides focus on the mechanics that matter in commercial deals: balloon structures, capital gains
                  deferral, environmental due diligence, and deal structuring for land, farms, and development parcels.
                  The fundamentals are assumed; the details are here.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article grid */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isBusiness ? "Commercial Deal Guides" : "Read the Guides"}
          </h2>
          <p className="text-gray-500 mb-10">
            {isBusiness
              ? "VTB structure, tax strategy, due diligence, and closing mechanics for commercial transactions."
              : "Everything from the basics to advanced deal structures, explained clearly."
            }
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.id} to={`/guide/${article.id}`} className="group block">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
                  <div className={`h-24 bg-gradient-to-br ${article.heroColor} flex items-center justify-center`}>
                    <span className="text-5xl">{article.icon}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${article.categoryColor}`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-400">{article.readTime}</span>
                    </div>
                    <h3 className={`font-bold text-gray-900 text-base leading-snug mb-2 transition-colors ${isBusiness ? "group-hover:text-emerald-600" : "group-hover:text-blue-600"}`}>
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className={`mt-4 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all ${isBusiness ? "text-emerald-600" : "text-blue-600"}`}>
                      Read more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isBusiness ? "Model Your Deal" : "Run Your Own Numbers"}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {isBusiness
                ? "Vendor advantage, comparative financing, and capital gains deferral — modelled for commercial deal sizes."
                : "See exactly what you'd save as a seller — or what a VTB mortgage costs compared to a bank."
              }
            </p>
          </div>
          <SavingsCalculator />
        </div>
      </section>

      {/* CTA */}
      <section className={`bg-gradient-to-br ${heroBg} py-16`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{color:"#fff"}}>
            {isBusiness ? "Ready to List or Make a Deal?" : "Ready to Make Your Move?"}
          </h2>
          <p className="mb-8" style={{color:subColor}}>
            {isBusiness
              ? "List your commercial property, create a buyer profile, or find a commercial real estate lawyer to get started."
              : "Now that you understand how it works — list your home, create a buyer profile, or find a lawyer to get started."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={isBusiness ? "/business/list-property" : "/list-home"}
              className={`px-8 py-3 text-white font-semibold rounded-lg transition-colors ${ctaBg1}`}>
              {isBusiness ? "List a Property" : "List Your Home"}
            </Link>
            <Link to={isBusiness ? "/business/create-profile" : "/create-profile"}
              className={`px-8 py-3 font-semibold rounded-lg transition-colors ${ctaBg2}`}>
              {isBusiness ? "Buyer Profile" : "Create Buyer Profile"}
            </Link>
            <Link to="/partners?category=lawyer"
              className={`px-8 py-3 border font-semibold rounded-lg transition-colors ${ctaBd}`}>
              Find a Lawyer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

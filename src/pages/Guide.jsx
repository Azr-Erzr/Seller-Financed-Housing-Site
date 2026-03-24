// src/pages/Guide.jsx — mode-reactive education hub
// G5: hero mesh overlay, stat card hover lift, article card left accent borders, FadeIn
import React from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { useRequireAuth } from "../context/AuthContext";
import { ARTICLES_HOMES, ARTICLES_BUSINESS } from "../data/guide-articles";
import SavingsCalculator from "../components/SavingsCalculator";
import FadeIn from "../components/FadeIn";
import { ArrowRight, BookOpen, Banknote, Landmark, KeyRound, ClipboardList, BarChart3, Zap, Hammer, Home as HomeIcon, PenLine, Scale, Search as SearchIcon } from "lucide-react";

const ARTICLE_ICON_MAP = {
  home: HomeIcon, banknote: Banknote, landmark: Landmark, key: KeyRound,
  pen: PenLine, scale: Scale, hammer: Hammer, chart: BarChart3, search: SearchIcon,
};

const HERO_TO_BORDER = {
  "from-blue-600": "border-blue-500", "from-blue-700": "border-blue-600",
  "from-emerald-600": "border-emerald-500", "from-emerald-700": "border-emerald-600",
  "from-purple-600": "border-purple-500", "from-amber-600": "border-amber-500",
  "from-teal-600": "border-teal-500", "from-rose-600": "border-rose-500",
  "from-indigo-600": "border-indigo-500", "from-green-600": "border-green-500",
  "from-orange-600": "border-orange-500",
};
function getArticleBorder(heroColor = "") {
  return HERO_TO_BORDER[heroColor.split(" ")[0]] || "border-blue-400";
}

export default function Guide() {
  const { mode, MODES } = useSite();
  const requireAuth = useRequireAuth();
  const isBusiness = mode === MODES.business;

  const heroBg        = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const badgeBg       = isBusiness ? "bg-white/10 text-emerald-100" : "bg-white/10 text-blue-100";
  const subColor      = isBusiness ? "#a7f3d0" : "#bfdbfe";
  const ctaBg1        = isBusiness ? "bg-amber-500 hover:bg-amber-600" : "bg-orange-500 hover:bg-orange-600";
  const ctaBg2        = isBusiness ? "bg-white text-emerald-700 hover:bg-emerald-50" : "bg-white text-blue-700 hover:bg-blue-50";
  const iconBg        = isBusiness ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600";
  const hoverAccent   = isBusiness ? "group-hover:text-emerald-600" : "group-hover:text-blue-600";
  const readMoreColor = isBusiness ? "text-emerald-600" : "text-blue-600";
  const meshColor1    = isBusiness ? "radial-gradient(circle, #6ee7b7, transparent 70%)" : "radial-gradient(circle, #93c5fd, transparent 70%)";
  const meshColor2    = isBusiness ? "radial-gradient(circle, #10b981, transparent 70%)" : "radial-gradient(circle, #3b82f6, transparent 70%)";

  const articles = isBusiness ? ARTICLES_BUSINESS : ARTICLES_HOMES;

  const HOMES_STATS = [
    { Icon: Banknote,      stat: "$30,000–$45,000",     label: "Potential listing-side savings",        sub: "on a $600K–$900K home vs. a traditional agent sale" },
    { Icon: Landmark,      stat: "5–12%",               label: "Interest sellers may earn",              sub: "on the VTB mortgage they hold over the term" },
    { Icon: KeyRound,      stat: "No bank. No formula.", label: "Buyers qualify on their full story",    sub: "self-employed, new to Canada, unconventional income" },
  ];
  const BUSINESS_STATS = [
    { Icon: ClipboardList, stat: "Common practice",     label: "VTB is standard in commercial RE",      sub: "land, farms, development parcels transact this way routinely" },
    { Icon: BarChart3,     stat: "Up to 5 years",       label: "Capital gains may be deferred",         sub: "by spreading recognition over the payment term — confirm with your accountant" },
    { Icon: Zap,           stat: "30–90 days faster",   label: "May close without institutional delays", sub: "no bank underwriting, environmental review, or covenant checklist" },
  ];
  const stats     = isBusiness ? BUSINESS_STATS : HOMES_STATS;
  const heroTitle = isBusiness ? "Structure Deals That Close" : "Everything You Need to Know";
  const heroSub   = isBusiness
    ? "Commercial VTB is established practice. We cover the mechanics, tax strategy, due diligence, and deal structures that matter for vendors, buyers, and investors."
    : "Seller financing is unfamiliar to most people — and that's exactly why we wrote this. Plain-English guides, real numbers, and honest explanations of how this works and why it's worth it.";

  return (
    <div className="bg-white">

      {/* Hero with mesh */}
      <section className={`relative bg-gradient-to-br ${heroBg} py-16 overflow-hidden`}>
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: meshColor1 }} />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: meshColor2 }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-5 ${badgeBg}`}>
            <BookOpen className="w-4 h-4" /> Sel-Fi Guide {isBusiness ? "— Business Edition" : ""}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#fff" }}>{heroTitle}</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: subColor }}>{heroSub}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {stats.map(({ Icon, stat, label, sub }, i) => (
              <FadeIn key={label} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-xl font-extrabold text-gray-900 mb-1">{stat}</p>
                  <p className="font-semibold text-gray-700 text-sm mb-1">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Business callout */}
      {isBusiness && (
        <FadeIn>
          <section className="py-8 bg-emerald-50 border-b border-emerald-100">
            <div className="max-w-4xl mx-auto px-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Commercial Real Estate Context</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Unlike residential buyers, most commercial vendors and buyers already understand VTB financing.
                  These guides focus on the mechanics that matter in commercial deals: balloon structures, capital gains
                  deferral, environmental due diligence, and deal structuring for land, farms, and development parcels.
                </p>
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* Article grid */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isBusiness ? "Commercial Deal Guides" : "Read the Guides"}
            </h2>
            <p className="text-gray-500 mb-10">
              {isBusiness
                ? "VTB structure, tax strategy, due diligence, and closing mechanics for commercial transactions."
                : "Everything from the basics to advanced deal structures, explained clearly."
              }
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <FadeIn key={article.id} delay={i * 60}>
                <Link to={`/guide/${article.id}`} className="group block h-full">
                  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden h-full flex flex-col border-l-4 ${getArticleBorder(article.heroColor)}`}>
                    <div className={`h-24 bg-gradient-to-br ${article.heroColor} flex items-center justify-center`}>
                      {(() => { const Icon = ARTICLE_ICON_MAP[article.icon]; return Icon ? <Icon className="w-10 h-10 text-white/80" /> : null; })()}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${article.categoryColor}`}>{article.category}</span>
                        <span className="text-xs text-gray-400">{article.readTime}</span>
                      </div>
                      <h3 className={`font-bold text-gray-900 text-base leading-snug mb-2 transition-colors ${hoverAccent}`}>{article.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{article.summary}</p>
                      <div className={`mt-4 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all ${readMoreColor}`}>
                        Read more <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <FadeIn>
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {isBusiness ? "Model Your Deal" : "Run Your Own Numbers"}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                {isBusiness
                  ? "Vendor advantage, comparative financing, and capital gains deferral — modelled for commercial deal sizes."
                  : "See what you might save as a seller — or what a VTB mortgage could cost compared to a bank."
                }
              </p>
            </div>
            <SavingsCalculator />
          </div>
        </section>
      </FadeIn>

      {/* CTA */}
      <section className={`relative bg-gradient-to-br ${heroBg} py-16 overflow-hidden`}>
        <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full opacity-15"
          style={{ background: meshColor1 }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#fff" }}>
            {isBusiness ? "Ready to List or Make a Deal?" : "Ready to Make Your Move?"}
          </h2>
          <p className="mb-8" style={{ color: subColor }}>
            {isBusiness
              ? "List your commercial property, create a buyer profile, or find a commercial real estate lawyer to get started."
              : "Now that you understand how it works — list your home, create a buyer profile, or find a lawyer to get started."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => requireAuth(isBusiness ? "/business/list-property" : "/list-home")}
              className={`px-8 py-3 text-white font-semibold rounded-lg transition-colors ${ctaBg1}`}>
              {isBusiness ? "List a Property" : "List Your Home"}
            </button>
            <button onClick={() => requireAuth(isBusiness ? "/business/create-profile" : "/create-profile")}
              className={`px-8 py-3 font-semibold rounded-lg transition-colors ${ctaBg2}`}>
              {isBusiness ? "Buyer Profile" : "Create Buyer Profile"}
            </button>
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

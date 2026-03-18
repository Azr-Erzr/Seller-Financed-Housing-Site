// src/pages/Partners.jsx
import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PARTNERS } from "../data/partners";
import { useSite } from "../context/SiteContext";
import { Star, MapPin, Shield, CheckCircle, ArrowRight, Phone, ExternalLink } from "lucide-react";

// ── Category definitions ──────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "all",
    label: "All Pros",
    icon: "🏆",
    description: null,
  },
  {
    id: "lawyer",
    label: "Real Estate Lawyers",
    icon: "⚖️",
    description: "A real estate lawyer is not optional in a seller-financed deal — it's the foundation. They register your VTB mortgage on title, draft the Agreement of Purchase and Sale with proper default provisions, conduct the title search, and handle the closing. Without proper registration, your charge is unenforceable. Every deal on Sel-Fi should involve a lawyer on both sides.",
    whyNeed: [
      "Registers your VTB mortgage charge on the buyer's title",
      "Drafts default provisions and enforcement rights into the agreement",
      "Conducts title search to confirm no prior encumbrances",
      "Handles title transfer and closing on both sides",
      "Advises on first vs. second mortgage position risk",
    ],
  },
  {
    id: "inspector",
    label: "Home Inspectors",
    icon: "🔍",
    description: "A home inspection protects the buyer and gives the seller credibility. In a seller-financed deal, the seller has extra reason to want a clean inspection — it supports the property's value and reduces the chance of post-closing disputes about undisclosed defects.",
    whyNeed: [
      "Identifies structural, electrical, and plumbing issues before closing",
      "Supports the agreed purchase price with documented condition",
      "Reduces post-closing disputes about undisclosed defects",
      "Gives buyers confidence to proceed — and sellers peace of mind",
    ],
  },
  {
    id: "stager",
    label: "Home Stagers",
    icon: "🛋️",
    description: "Without a listing agent, you control your staging budget. You hire the stager directly — no referral kickbacks, no inflated invoices. Well-staged homes sell faster and at higher prices. On Sel-Fi, that means more buyers reaching out sooner.",
    whyNeed: [
      "Faster buyer interest — staged homes get more enquiries",
      "Higher perceived value supports your asking price",
      "You hire directly — no agent markup or kickback",
      "Professional photos of a staged home outperform empty room shots",
    ],
  },
  {
    id: "photographer",
    label: "Photographers",
    icon: "📸",
    description: "Your listing photos are your first impression. On Sel-Fi, you upload photos directly — which means the quality of your photos determines how many buyers contact you. A professional photographer pays for themselves in buyer interest.",
    whyNeed: [
      "First impression in a buyer's search results is your photos",
      "Professional photos get 3-4x more enquiries than phone shots",
      "Drone footage shows lot, neighbourhood, and scale",
      "You own the photos — no agent holding them hostage",
    ],
  },
  {
    id: "broker",
    label: "Mortgage Brokers",
    icon: "🏦",
    description: "In a hybrid deal where the buyer also has a bank mortgage, a mortgage broker helps the buyer structure the bank portion alongside the seller's VTB. They also help sellers understand the implications of holding a second-position mortgage.",
    whyNeed: [
      "Helps buyers structure bank + VTB combined financing",
      "Advises on mortgage position risk for sellers",
      "Can confirm first-lender consent for VTB arrangements",
      "Useful when the seller's VTB is a partial, not full, financing",
    ],
  },
  {
    id: "mover",
    label: "Verified Movers",
    icon: "🚚",
    description: "All movers in our directory are CVOR registered, carry cargo insurance, and hold WSIB coverage. When you hire through our directory, you know exactly who's handling your belongings — no fly-by-night operators.",
    whyNeed: [
      "CVOR registered — legal to operate commercially in Ontario",
      "Cargo insurance — your belongings are covered during the move",
      "WSIB coverage — workers are protected, you're not liable",
      "Vetted by Sel-Fi — not random marketplace listings",
    ],
  },
];

// ── Partner card ──────────────────────────────────────────────────────
function PartnerCard({ partner, isBusiness }) {
  const accent    = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg  = isBusiness ? "bg-emerald-50" : "bg-blue-50";
  const accentBtn = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";

  const initials = partner.name.split(" ").slice(0,2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="shrink-0">
          {partner.avatar ? (
            <img src={partner.avatar} alt={partner.name}
              className="w-16 h-16 rounded-2xl object-cover"/>
          ) : (
            <div className={`w-16 h-16 rounded-2xl ${accentBg} flex items-center justify-center text-xl font-bold ${accent}`}>
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">{partner.name}</h3>
              {partner.firm && <p className="text-xs text-gray-500 mt-0.5">{partner.firm}</p>}
            </div>
            {partner.verified && (
              <div className="flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border border-green-200">
                <CheckCircle className="w-3 h-3"/> Verified
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-gray-400"/>
            <span className="text-xs text-gray-400">{partner.location}</span>
          </div>
          {partner.rating && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
              <span className="text-xs font-semibold text-gray-700">{partner.rating}</span>
              {partner.reviewCount && <span className="text-xs text-gray-400">({partner.reviewCount} reviews)</span>}
            </div>
          )}
        </div>
      </div>

      {partner.bio && (
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{partner.bio}</p>
      )}

      {/* Specialties */}
      {partner.specialties?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {partner.specialties.map((s) => (
            <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
          ))}
        </div>
      )}

      {/* Mover credentials */}
      {partner.cvor_registered && (
        <div className="mb-4 bg-green-50 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold text-green-700 mb-1.5 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5"/> Verified Credentials
          </p>
          {[
            { label: "CVOR Registered", val: partner.cvor_registered },
            { label: "Cargo Insurance",  val: partner.cargo_insured },
            { label: "WSIB Coverage",    val: partner.wsib_covered },
          ].map(({ label, val }) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              {val
                ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0"/>
                : <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"/>
              }
              <span className={val ? "text-green-700 font-medium" : "text-gray-400"}>{label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto flex gap-2">
        <Link to={`/partners/${partner.id}`}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors ${accentBtn}`}>
          View Profile <ArrowRight className="w-4 h-4"/>
        </Link>
        {partner.phone && (
          <a href={`tel:${partner.phone}`}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Phone className="w-4 h-4 text-gray-500"/>
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────
export default function Partners() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery,    setSearchQuery]    = useState("");

  const categoryDef = CATEGORIES.find((c) => c.id === activeCategory);

  const filtered = useMemo(() => {
    let p = PARTNERS;
    if (activeCategory !== "all") p = p.filter((p) => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      p = p.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.bio?.toLowerCase().includes(q) ||
        p.specialties?.some((s) => s.toLowerCase().includes(q))
      );
    }
    return p;
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setSearchParams(catId === "all" ? {} : { category: catId });
  };

  const accent    = isBusiness ? "text-emerald-600" : "text-blue-600";
  const heroBg    = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-700 to-blue-900";
  const activePill = isBusiness
    ? "bg-emerald-600 text-white"
    : "bg-blue-600 text-white";

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <section className={`bg-gradient-to-br ${heroBg} py-14`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-3" style={{color:"#fff"}}>Find the Right Professional</h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{color:"#bfdbfe"}}>
            Every professional in our directory has been vetted for their experience with seller-financed deals.
            Choose who you work with. No referral fees. No agent kickbacks.
          </p>

          {/* Search */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1.5 flex max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search by name, city, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/50 text-sm px-4 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Category pills */}
      <div className="bg-white border-b border-gray-100 sticky top-[73px] z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => handleCategoryChange(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === id
                    ? activePill
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span>{icon}</span> {label}
              </button>
            ))}
            <Link to="/partner-apply"
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 whitespace-nowrap transition-colors">
              + Become a Partner
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Category explainer */}
        {categoryDef?.description && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl shrink-0">{categoryDef.icon}</div>
              <div>
                <h2 className="font-bold text-gray-900 text-xl mb-2">Why You Need a {categoryDef.label.replace(/s$/, "")}</h2>
                <p className="text-gray-600 leading-relaxed text-sm mb-4">{categoryDef.description}</p>
                {categoryDef.whyNeed && (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {categoryDef.whyNeed.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${accent}`}/>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Verified banner for movers */}
        {activeCategory === "mover" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-600 shrink-0"/>
            <div>
              <p className="font-semibold text-green-800 text-sm">All listed movers are CVOR registered, carry cargo insurance, and hold WSIB coverage</p>
              <p className="text-xs text-green-600 mt-0.5">We verify credentials before listing. Never hire an uninsured mover.</p>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {filtered.length} {filtered.length === 1 ? "professional" : "professionals"} found
            {activeCategory !== "all" ? ` in ${categoryDef?.label}` : ""}
          </p>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium text-gray-600 text-lg mb-2">No professionals found</p>
            <p className="text-sm mb-4">Try adjusting your search or selecting a different category</p>
            <Link to="/partner-apply"
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-white font-medium rounded-lg text-sm transition-colors ${isBusiness?"bg-emerald-600 hover:bg-emerald-700":"bg-blue-600 hover:bg-blue-700"}`}>
              Apply to Join the Directory
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <PartnerCard key={p.id} partner={p} isBusiness={isBusiness}/>
            ))}
          </div>
        )}

        {/* CTA to apply */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <h3 className="font-bold text-gray-900 text-xl mb-2">Are You a Real Estate Professional?</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
            Join the Sel-Fi Partner Directory to connect with buyers and sellers in the Durham Region
            who specifically need your expertise in seller-financed transactions.
          </p>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
            Sel-Fi does not charge referral fees or take commissions from professionals listed in this directory.
            Our directory is free, unbiased, and based solely on expertise in seller-financed deals.
          </p>
          <Link to="/partner-apply"
            className={`inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-colors ${isBusiness?"bg-emerald-600 hover:bg-emerald-700":"bg-blue-600 hover:bg-blue-700"}`}>
            Apply to Join <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>
    </div>
  );
}

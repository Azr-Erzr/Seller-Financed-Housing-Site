// src/pages/HowItWorks.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileText, CheckCircle, ChevronDown, ChevronUp, Building2, Tractor, ShieldCheck } from "lucide-react";
import { useSite } from "../context/SiteContext";

function FAQItem({ q, a, isBusiness }) {
  const [open, setOpen] = useState(false);
  const ring = isBusiness ? "focus:ring-emerald-300" : "focus:ring-blue-300";
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors">
        <span className="font-medium text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && <div className="px-6 pb-5 bg-white text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{a}</div>}
    </div>
  );
}

const FAQS_HOMES_BUYERS = [
  { q: "What is seller financing / VTB?", a: "Seller financing (Vendor Take-Back mortgage) is when the person selling the home acts as the bank. You make monthly payments directly to the seller at a negotiated rate. The home transfers to you; the seller holds a mortgage as security." },
  { q: "Who qualifies for a seller-financed deal?", a: "That's largely up to the individual seller. Unlike a bank, they can take your full story into account — not just a credit score. Self-employed buyers, newcomers, and people with non-traditional income are often better served this way." },
  { q: "What is a match score?", a: "Your match score rates compatibility between a buyer profile and a listing across five factors: deal type alignment, interest rate fit, down payment capacity, monthly payment affordability, and location. It's a starting point — not a guarantee." },
  { q: "What is rent-to-own?", a: "You rent the property for 1–3 years with an option to buy at a pre-agreed price. A portion of rent is credited toward the purchase. It gives buyers time to build savings or improve their financial picture." },
  { q: "Do I need a lawyer?", a: "Yes — always. A real estate lawyer drafts the promissory note, ensures the title transfer is clean, and protects both parties. Use our Partner Directory to find a vetted lawyer in Durham Region." },
];

const FAQS_HOMES_SELLERS = [
  { q: "Why seller-finance instead of selling normally?", a: "You get a steady income stream at a rate you set — often far above GIC or savings returns. You may attract more buyers and a higher sale price. And if you own the home outright, you may spread capital gains over the payment years." },
  { q: "What if the buyer stops paying?", a: "You'd need to go through a legal process to enforce the mortgage and potentially reclaim the property. This is why thorough buyer vetting and proper legal documentation are essential before any deal." },
  { q: "What is the NDA feature?", a: "When you list, you can lock financial documents behind an NDA. Buyers sign a short non-disclosure agreement before accessing those documents — protecting your sensitive information until you have a committed party." },
];

const FAQS_BUSINESS_BUYERS = [
  { q: "What kinds of properties are on LandMatch Business?", a: "Vacant land, agricultural farmland, development parcels, commercial buildings (retail, office, mixed-use), industrial/warehouse, multi-unit residential, waterfront/recreational land, and special-purpose properties." },
  { q: "What is seller-financing on commercial property?", a: "The seller holds a first or second mortgage directly instead of requiring full cash or bank financing. Common in commercial real estate — especially with motivated sellers like retiring farmers, business owners, or long-time landowners. Terms, rates, and amortization are fully negotiable." },
  { q: "What filters can I use to find the right property?", a: "LandMatch Business offers filters unique to commercial and land deals: property category, zoning classification, acreage range, utilities on property (hydro, gas, water, sewer, well, septic), permitted uses, road access type, environmental status, and price. These are the details that actually matter for commercial transactions." },
  { q: "Do I need a lawyer for a commercial deal?", a: "Absolutely — commercial real estate transactions are more legally complex than residential. You need a real estate lawyer for the purchase agreement, any seller-finance documentation, and title transfer. For development land, you may also need a planner and environmental consultant." },
  { q: "What is a Phase 1 / Phase 2 environmental assessment?", a: "A Phase 1 is a desk review of historical site uses to identify potential contamination risks. A Phase 2 involves physical testing (soil samples, etc.) to confirm or rule out contamination. LandMatch listings show environmental status so you know what's been done before approaching the seller." },
];

const FAQS_BUSINESS_SELLERS = [
  { q: "Why list on LandMatch Business instead of using a broker?", a: "Commercial brokers typically charge 4–6% on both sides of a transaction. On a $2M property that's $80,000–$120,000 in commission. LandMatch lets you find and qualify buyers directly. A real estate lawyer closes the deal for a fraction of that cost." },
  { q: "What details should I include in a commercial listing?", a: "The more detail the better: zoning classification, acreage, road access, all utilities on the property, permitted uses, environmental assessment status, existing structures, and frontage measurements. Buyers filter specifically on these fields — the more you include, the more qualified leads you attract." },
  { q: "Can I seller-finance a commercial property?", a: "Yes — and it's common. A seller holding a first or second mortgage directly is often more attractive to buyers than conventional bank financing, especially for development land, farms, and smaller commercial properties. Your lawyer will draft the promissory note and mortgage document." },
  { q: "What is the NDA feature on LandMatch Business?", a: "You can lock surveys, environmental reports, and financial documents behind a short NDA. Buyers must agree to confidentiality terms before accessing those documents. This is especially important for commercial and development properties where sensitive financial or environmental data is involved." },
];

const FAQS_PARTNERS = [
  { q: "What is the LandMatch Partner program?", a: "Vetted local professionals list in our directory and connect directly with buyers and sellers. Partners appear at the top of category searches with a verified Partner badge. All applications are reviewed manually." },
  { q: "What credentials do you verify for movers?", a: "Moving companies must provide their Ontario CVOR number, active cargo insurance (min. $100K) with insurer and policy number, and a WSIB account number. All three are verified before approval. We do this because unlicensed movers cause real harm." },
  { q: "How do I apply to become a partner?", a: "Visit the Apply to Become a Partner page, fill out the form with your credentials and business details. We review all applications within 2–3 business days." },
];

// ── Steps shared component ────────────────────────────────────────────
function Steps({ isBusiness }) {
  const steps = isBusiness ? [
    { icon: <FileText className="w-8 h-8 text-emerald-600" />, bg: "bg-emerald-100", num: 1, numBg: "bg-emerald-600",
      title: "List or Create a Buyer Profile",
      body: "Sellers post their property with full details — zoning, acreage, utilities, permitted uses, environmental status, and financing terms. Buyers create a profile with budget, intended use, property categories, zoning needs, and acreage range." },
    { icon: <Search className="w-8 h-8 text-amber-600" />, bg: "bg-amber-100", num: 2, numBg: "bg-amber-500",
      title: "Filter, Match & Connect",
      body: "Use LandMatch Business's commercial-specific filters to find properties that match your criteria exactly. Request documents after signing an NDA. Contact sellers directly — no agent in the middle." },
    { icon: <CheckCircle className="w-8 h-8 text-green-600" />, bg: "bg-green-100", num: 3, numBg: "bg-green-600",
      title: "Negotiate & Close",
      body: "Agree on terms directly. Engage a real estate lawyer to draft the purchase agreement and any seller-finance documentation. Close without paying broker commissions on either side." },
  ] : [
    { icon: <Search className="w-8 h-8 text-blue-600" />, bg: "bg-blue-100", num: 1, numBg: "bg-blue-600",
      title: "Create a Profile or Listing",
      body: "Sellers post their property with financing terms — down payment minimum, interest rate range, and deal type. Buyers create a profile with budget, down payment, income, and deal preferences." },
    { icon: <FileText className="w-8 h-8 text-orange-500" />, bg: "bg-orange-100", num: 2, numBg: "bg-orange-500",
      title: "Get Matched & Connect",
      body: "Our matching engine scores each listing against each buyer profile across five financial dimensions. Request documents after signing an NDA and reach out directly." },
    { icon: <CheckCircle className="w-8 h-8 text-green-600" />, bg: "bg-green-100", num: 3, numBg: "bg-green-600",
      title: "Negotiate & Close",
      body: "Engage a real estate lawyer to draft the promissory note, mortgage document, and transfer paperwork. No bank approval, no commission agents." },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {steps.map(({ icon, bg, num, numBg, title, body }) => (
        <div key={title} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>{icon}</div>
          <div className={`w-8 h-8 ${numBg} text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold`}>{num}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
        </div>
      ))}
    </div>
  );
}

export default function HowItWorks() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;

  const heroBg  = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const subColor = isBusiness ? "#a7f3d0" : "#bfdbfe";
  const ctaBg    = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const btn1     = isBusiness ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-orange-500 hover:bg-orange-600 text-white";
  const btn2     = isBusiness ? "bg-white text-emerald-800 hover:bg-emerald-50" : "bg-white text-blue-700 hover:bg-blue-50";
  const btn3     = isBusiness ? "bg-white text-emerald-800 hover:bg-emerald-50" : "bg-white text-blue-700 hover:bg-blue-50";

  const listLink    = isBusiness ? "/business/list-property"     : "/list-home";
  const profileLink = isBusiness ? "/business/create-profile"    : "/create-profile";
  const applyLink   = "/partner-apply";

  const buyerFaqs  = isBusiness ? FAQS_BUSINESS_BUYERS  : FAQS_HOMES_BUYERS;
  const sellerFaqs = isBusiness ? FAQS_BUSINESS_SELLERS : FAQS_HOMES_SELLERS;

  return (
    <div className="bg-white">

      <section className={`bg-gradient-to-br ${heroBg} py-20`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          {isBusiness && (
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-emerald-100 mb-5">
              <Building2 className="w-4 h-4" /> LandMatch Business
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-5" style={{ color: "#fff" }}>
            How LandMatch {isBusiness ? "Business" : "Homes"} Works
          </h1>
          <p className="text-lg" style={{ color: subColor }}>
            {isBusiness
              ? "Three steps to a commercial or land deal — direct from seller to buyer."
              : "Three steps to a seller-financed residential deal — whether you're buying or selling."
            }
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <Steps isBusiness={isBusiness} />
        </div>
      </section>

      {/* Deal types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            {isBusiness ? "Property Categories" : "Deal Types Explained"}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {isBusiness ? [
              { tag: "Seller-Finance",  tc: "bg-emerald-100 text-emerald-700", title: "Seller-Financed (VTB)", body: "The seller holds a mortgage directly. The buyer makes payments of principal + interest to the seller at a negotiated rate. Common for farms, development land, and commercial buildings with motivated sellers.", best: "Best for buyers who can't get commercial bank financing and sellers who want steady income." },
              { tag: "Lease Option",    tc: "bg-amber-100 text-amber-700",     title: "Lease Option",          body: "Buyer pays an upfront option fee to lock in a purchase price, then leases the property for a set period. Option fee typically applies toward the purchase at the end of the term.", best: "Best for operators who want time to verify a commercial location works before buying." },
              { tag: "Private Sale",    tc: "bg-blue-100 text-blue-700",       title: "Private Sale",          body: "Standard purchase agreement between seller and buyer directly — no broker, no agent. Both parties arrange their own financing. A real estate lawyer handles the closing.", best: "Best for buyers with capital or traditional financing who simply want to avoid agent commissions." },
            ].map(({ tag, tc, title, body, best }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${tc}`}>{tag}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{body}</p>
                <p className="text-xs text-emerald-600 font-medium">{best}</p>
              </div>
            )) : [
              { tag: "Seller-Finance", tc: "bg-blue-100 text-blue-700",     title: "Seller-Financed (VTB)", body: "The seller acts as the lender. Monthly payments of principal + interest go directly to the seller. Title transfers immediately. Terms are fully negotiable.", best: "Best for buyers who can't get a traditional mortgage and sellers who want ongoing income." },
              { tag: "Rent-to-Own",    tc: "bg-purple-100 text-purple-700", title: "Rent-to-Own",           body: "Buyer rents the property for 1–3 years with an option to purchase at a pre-agreed price. A portion of rent is credited toward the eventual purchase.", best: "Best for buyers who need time before fully committing, and sellers who want a tenant-buyer." },
              { tag: "Lease Option",   tc: "bg-yellow-100 text-yellow-700", title: "Lease Option",          body: "Similar to rent-to-own, but the buyer pays an upfront option fee for the right — not the obligation — to purchase at the end of the lease period.", best: "Best for buyers who want flexibility and sellers who want committed, invested tenants." },
            ].map(({ tag, tc, title, body, best }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${tc}`}>{tag}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{body}</p>
                <p className="text-xs text-blue-600 font-medium">{best}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mover section */}
      {!isBusiness && (
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-teal-900 mb-1">Verified Movers on LandMatch</h3>
                <p className="text-sm text-teal-700 leading-relaxed mb-3">Every moving company on LandMatch is verified for CVOR registration, active cargo insurance (min. $100K), and WSIB coverage. Browse only vetted movers — no surprise charges, no held-hostage loads.</p>
                <Link to="/partners?category=mover" className="text-sm font-semibold text-teal-700 hover:text-teal-900 underline">Browse verified movers →</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Buyers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">FAQ — For Buyers</h2>
          <p className="text-gray-500 mb-8">Everything you need to know before creating a profile.</p>
          <div className="space-y-3">{buyerFaqs.map((f) => <FAQItem key={f.q} {...f} isBusiness={isBusiness} />)}</div>
        </div>
      </section>

      {/* FAQ Sellers */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">FAQ — For Sellers</h2>
          <p className="text-gray-500 mb-8">Key questions before you list {isBusiness ? "a property" : "your home"}.</p>
          <div className="space-y-3">{sellerFaqs.map((f) => <FAQItem key={f.q} {...f} isBusiness={isBusiness} />)}</div>
        </div>
      </section>

      {/* FAQ Partners */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">FAQ — For Partner Professionals</h2>
          <p className="text-gray-500 mb-8">Everything about joining the LandMatch Partner network.</p>
          <div className="space-y-3">{FAQS_PARTNERS.map((f) => <FAQItem key={f.q} {...f} isBusiness={isBusiness} />)}</div>
        </div>
      </section>

      <section className={`bg-gradient-to-br ${ctaBg} py-16`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#fff" }}>Ready to Find Your Match?</h2>
          <p className="mb-8" style={{ color: subColor }}>
            Join buyers, sellers, and professionals already using LandMatch {isBusiness ? "Business" : "Homes"}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={listLink}    className={`px-8 py-3 font-semibold rounded-lg transition-colors ${btn1}`}>{isBusiness ? "List a Property" : "List a Home"}</Link>
            <Link to={profileLink} className={`px-8 py-3 font-semibold rounded-lg transition-colors ${btn2}`}>Create a Profile</Link>
            <Link to={applyLink}   className={`px-8 py-3 font-semibold rounded-lg transition-colors ${btn3}`}>Apply as a Partner</Link>
          </div>
          <p className="mt-6 text-sm" style={{ color: subColor }}>
            {isBusiness ? "Looking for residential homes? " : "Looking for commercial & land deals? "}
            <Link to={isBusiness ? "/" : "/business"} className="underline font-medium text-white">
              Switch to LandMatch {isBusiness ? "Homes" : "Business"} →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

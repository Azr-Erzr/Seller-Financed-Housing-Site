// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { useRequireAuth } from "../context/AuthContext";
import { ArrowRight, Shield, Scale, DollarSign, Users, Building2, Home, CheckCircle, XCircle, Zap, Landmark, ScrollText } from "lucide-react";

export default function About() {
  const { mode, MODES } = useSite();
  const requireAuth = useRequireAuth();
  const isBusiness = mode === MODES.business;

  if (isBusiness) {
    return (
      <div className="bg-white">
        <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4" style={{color:"#fff"}}>About Sel-Fi Business</h1>
            <p className="text-lg max-w-2xl mx-auto" style={{color:"#a7f3d0"}}>
              Canada's marketplace for direct seller-financed commercial land, farm, and development deals.
              No intermediaries. No bank approval. Seller sets the terms.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-6 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Sel-Fi Business connects commercial property owners — landowners, farmers, developers, and investors —
              with qualified buyers who want to transact directly, without a bank in the middle. Every deal is seller-financed:
              the seller holds a registered mortgage on the property and receives monthly payments at a negotiated rate.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Buyers can also engage their own commercial real estate broker if they choose. The seller still saves
              their side of the commission — typically 2–3% of a multi-million-dollar transaction — and still earns
              interest on the VTB they hold. Both sides win.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Protections for Sellers</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A VTB mortgage on a commercial property is governed by Ontario's Mortgage Act and registered at the
              Land Registry Office. This gives the seller the same legal standing as any institutional lender.
              If a buyer defaults, the seller can pursue Power of Sale (selling the property to recover the outstanding balance)
              or foreclosure (reclaiming full title).
            </p>
            <p className="text-gray-600 leading-relaxed">
              These are not informal arrangements. Every deal on Sel-Fi Business should be documented by a
              real estate lawyer. The registered charge on title means the buyer cannot simply walk away — the
              consequences of default are real, enforceable, and well-established under Ontario law.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Link to="/business/listings" className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-colors">
              <Building2 className="w-6 h-6 text-emerald-600 mb-3"/>
              <p className="font-semibold text-gray-900">Browse Commercial Properties</p>
              <p className="text-sm text-gray-500 mt-1">Vacant land, farms, development parcels, and commercial buildings</p>
            </Link>
            <Link to="/partners?category=lawyer" className="p-6 bg-amber-50 rounded-xl border border-amber-100 hover:border-amber-300 transition-colors">
              <Scale className="w-6 h-6 text-amber-600 mb-3"/>
              <p className="font-semibold text-gray-900">Find a Real Estate Lawyer</p>
              <p className="text-sm text-gray-500 mt-1">Required for all VTB transactions — protect both sides</p>
            </Link>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-6">
            Sel-Fi facilitates introductions between buyers and sellers. We are not a mortgage broker, real estate agent, or legal advisor.
            All transactions require independent legal counsel. Consult a licensed Ontario real estate lawyer before entering any agreement.
          </p>
        </section>
      </div>
    );
  }

  // ── Homes mode ──────────────────────────────────────────────────────
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color:"#fff"}}>
            About Sel-Fi
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{color:"#bfdbfe"}}>
            We built the platform that cuts banks and listing agents out of the residential real estate transaction —
            and puts the money back where it belongs. In your pocket.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-14">

        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why We Exist</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            In a traditional real estate sale, a $600,000 home comes with roughly $33,900 in commission costs —
            paid by the seller, split between two agents, neither of whom owns the property or took the financial risk.
            The seller gets a cheque for less than they should have received. The buyer qualifies at a bank's rules or
            doesn't buy at all.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Sel-Fi was built on a different premise: two people who want to make a deal should be able to make it
            directly, with legal protections, without a bank or an agent in between. The technology to facilitate that
            exists. The legal framework for it has existed in Ontario for decades. We simply built the marketplace.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Seller financing — also called a Vendor Take-Back (VTB) mortgage — is not a loophole or a grey area.
            It is a registered, legally enforceable mortgage governed by Ontario's Mortgage Act. The seller registers
            a charge on the property's title, just like a bank. The buyer makes monthly payments, just like a bank mortgage.
            The difference is the seller sets the terms — and keeps the interest income the bank would have taken.
          </p>
        </section>

        {/* For sellers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">For Sellers: You Are the Bank</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            When you hold a VTB mortgage, you are in the same legal position as any lender. You hold a registered
            charge on the property's title. You receive monthly principal and interest payments. And if the buyer
            fails to meet their obligations, you have real, enforceable remedies:
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 space-y-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5"><Zap className="w-4 h-4" /></div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Power of Sale (Ontario's preferred remedy)</p>
                <p className="text-sm text-gray-600">If a buyer defaults, you issue a Notice of Default. After a minimum 35-day
                  redemption period — during which the buyer can bring the mortgage current — you can sell the property to
                  recover the outstanding balance, without going through a full court proceeding. Any surplus after your
                  costs are covered goes to the buyer.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5"><Landmark className="w-4 h-4" /></div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Foreclosure</p>
                <p className="text-sm text-gray-600">A longer court process that results in full title transfer back to you.
                  Less common in Ontario because Power of Sale is faster and achieves the same goal.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5"><ScrollText className="w-4 h-4" /></div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Writ of Possession</p>
                <p className="text-sm text-gray-600">If the buyer refuses to vacate, a court-issued Writ of Possession directs
                  the Sheriff to enforce your right to regain the property. This is the same mechanism a bank would use.</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            These are not empty threats on paper — they are the established legal infrastructure of Ontario mortgage law.
            Every deal on Sel-Fi should be documented by a licensed real estate lawyer to ensure your charge is
            properly registered and your remedies are clearly defined in the agreement.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mt-3">
            <strong>Note:</strong> If the buyer also has a first-position bank mortgage, the bank's claim is senior to yours
            in a default. This is why down payment size and deal structure matter — your lawyer will advise you on
            the right setup for your specific situation.
          </p>
        </section>

        {/* Realtor angle */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Realtors Are Welcome — on the Buy Side</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Sel-Fi is agent-optional, not anti-agent. Buyers on our platform can absolutely use a buyer's agent. In fact, we
            actively support hybrid deals: the seller lists and manages their side directly (potentially saving their listing commission),
            while the buyer engages a realtor for professional representation on their end.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-4">
            <p className="font-semibold text-gray-900 mb-3">How a hybrid deal works on a $650,000 home</p>
            <div className="space-y-2 text-sm">
              {[
                { role: "Seller pays", item: "Listing agent commission", traditional: "$16,250 (2.5%)", selfi: "$0 (self-listed)", highlight: true },
                { role: "Seller pays", item: "Buyer's agent commission", traditional: "$16,250 (2.5%)", selfi: "$0 — paid by buyer or negotiated", highlight: true },
                { role: "Seller earns", item: "Interest on VTB mortgage", traditional: "$0", selfi: "~$163K over 5 yrs at 7%*", highlight: true },
                { role: "Buyer gets", item: "Professional realtor representation", traditional: "Yes", selfi: "Yes — their choice", highlight: false },
              ].map(({ role, item, traditional, selfi, highlight }) => (
                <div key={item} className="grid grid-cols-4 gap-2 items-start py-1.5 border-b border-blue-100 last:border-0">
                  <span className="text-blue-500 text-xs font-medium">{role}</span>
                  <span className="text-gray-700 text-xs col-span-1">{item}</span>
                  <span className="text-gray-400 text-xs line-through">{traditional}</span>
                  <span className={`text-xs font-semibold ${highlight ? "text-green-600" : "text-gray-700"}`}>{selfi}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">
            For realtors reading this: Sel-Fi is a source of deals, not a competitor. If your buyer finds a
            seller-financed home on Sel-Fi, you can still represent them, earn your buyer-side commission, and
            provide value throughout the transaction. The seller has chosen to manage their listing side directly —
            your role on the buyer's side remains valuable and welcome.
          </p>
        </section>

        {/* For buyers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">For Buyers: When the Bank Said No</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Canada's mortgage stress test is designed to protect banks from defaults — not to help buyers get into
            homes. It disqualifies people who are genuinely creditworthy but don't fit a narrow formula: the self-employed,
            new Canadians, people with variable income, or anyone just below the threshold.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Seller-financed deals let sellers use judgment. They can ask for income documentation, bank statements,
            a reference letter, or a personal conversation. They can see a buyer's Sel-Fi profile — including
            calculated debt-to-income ratios and deal preferences — before ever speaking to them.
          </p>
          <p className="text-gray-600 leading-relaxed">
            A VTB mortgage is a real, registered mortgage. The buyer owns the home from closing day. The seller
            holds a charge on the title until the balance is paid. It is not a lease, a rent arrangement, or an
            informal agreement — it is secured lending with the same legal weight as any bank mortgage.
          </p>
        </section>

        {/* Team / values */}
        <section className="border-t border-gray-100 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Are (and Are Not)</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { Icon: CheckCircle, color: "text-green-600", title: "A marketplace", body: "We connect buyers and sellers. We provide tools to evaluate matches, share documents privately, and initiate contact." },
              { Icon: CheckCircle, color: "text-green-600", title: "An education platform", body: "We explain how seller financing works, what the legal framework looks like, and what both parties should expect." },
              { Icon: CheckCircle, color: "text-green-600", title: "A partner directory", body: "We vet and list real estate lawyers, inspectors, stagers, photographers, and movers — so you can build your team independently." },
              { Icon: XCircle, color: "text-red-500", title: "Not a mortgage broker", body: "We do not arrange financing, provide mortgage advice, or act as an intermediary in your transaction." },
              { Icon: XCircle, color: "text-red-500", title: "Not a real estate agent", body: "We are not licensed to represent buyers or sellers. All negotiations happen directly between parties." },
              { Icon: XCircle, color: "text-red-500", title: "Not a legal advisor", body: "We strongly recommend — and will repeatedly remind you — to engage a licensed Ontario real estate lawyer for every deal." },
            ].map(({ Icon, color, title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${color}`} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{color:"#fff"}}>Ready to Make Your Move?</h2>
          <p className="mb-6" style={{color:"#bfdbfe"}}>
            Read our guides, browse listings, or list your home today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/guide" className="px-6 py-2.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">Read the Guide</Link>
            <button onClick={() => requireAuth("/list-home")} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">List Your Home</button>
            <button onClick={() => requireAuth("/create-profile")} className="px-6 py-2.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">Create Buyer Profile</button>
          </div>
        </section>

        <p className="text-xs text-gray-400 leading-relaxed text-center">
          Sel-Fi facilitates introductions only. All financial, legal, and mortgage decisions should be made with
          qualified licensed professionals. Nothing on this site constitutes legal or financial advice.
          Consult a licensed Ontario real estate lawyer before signing any agreement.
        </p>
      </div>
    </div>
  );
}

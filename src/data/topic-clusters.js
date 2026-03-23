// src/data/topic-clusters.js
// Mega-Batch B — Hub-and-spoke topic cluster pages for SEO.
// Each cluster has a hub page at /topics/{slug} that links to related guide articles,
// city pages, tools, and listings.

export const TOPIC_CLUSTERS = [
  {
    slug: "seller-financing-ontario",
    title: "Seller Financing in Ontario",
    subtitle: "A Complete Guide to Vendor Take-Back (VTB) Mortgages",
    heroColor: "from-blue-600 to-blue-800",
    description:
      "Seller financing — also called a Vendor Take-Back mortgage (VTB) — is when the property seller acts as the lender instead of a bank. The buyer makes monthly payments directly to the seller at agreed-upon terms. In Ontario, this is a legally protected, registered mortgage with the same enforcement rights as a bank.",
    metaDesc:
      "Complete guide to seller financing (VTB mortgages) in Ontario. How it works, legal protections, costs, and how to get started. Sel-Fi marketplace.",
    sections: [
      {
        heading: "How Seller Financing Works",
        body: "In a seller-financed deal, the seller registers a charge on the property's title at the Ontario Land Registry Office — the same legal mechanism a bank uses. The buyer gets title on closing day and makes payments to the seller until the balance is paid or refinanced. Both parties should engage independent lawyers.",
      },
      {
        heading: "Why Ontario Sellers Choose VTB",
        body: "Sellers save the listing agent commission (typically 2.5% of sale price plus HST). They also earn interest income on the VTB mortgage — typically 5–12% annually. On a $600,000 home, combined commission savings and interest income can exceed $30,000.",
      },
      {
        heading: "Why Buyers Use Seller Financing",
        body: "Banks reject qualified people every day. The stress test, T4-only income verification, and rigid documentation requirements exclude self-employed professionals, newcomers to Canada, contract workers, and others with genuine ability to pay. Seller financing uses human judgment, not a formula.",
      },
      {
        heading: "Legal Framework in Ontario",
        body: "VTB mortgages in Ontario are governed by the same legal framework as bank mortgages. The seller's remedies include Power of Sale (35-day minimum notice period), foreclosure, and Writ of Possession. All VTB agreements should be drafted and registered by a licensed Ontario real estate lawyer.",
      },
    ],
    relatedArticles: ["what-is-seller-financing", "legal-protections-for-sellers", "the-true-cost-of-selling-with-an-agent"],
    relatedTools: ["/tools/buyer-readiness", "/tools/seller-assessment"],
    relatedCities: ["toronto", "ottawa", "hamilton", "kitchener-waterloo"],
    ctaLabel: "Browse Seller-Financed Homes",
    ctaPath: "/listings",
    faqs: [
      { question: "Is seller financing legal in Ontario?", answer: "Yes. Seller financing (VTB mortgages) is a standard, legal real estate transaction structure in Ontario. The mortgage is registered on title at the Land Registry Office, giving the seller the same legal protections as a bank." },
      { question: "How much can I save by selling without an agent?", answer: "On a $600,000 home, you may save approximately $30,000–$34,000 in commissions (both sides at 5% plus HST). Exact savings depend on what commission rate would have been negotiated with an agent." },
      { question: "What happens if the buyer stops paying?", answer: "The seller has the same legal remedies as a bank: Power of Sale (minimum 35-day notice period), foreclosure, and Writ of Possession. A real estate lawyer should be engaged before default proceedings." },
      { question: "Do I need a lawyer for a seller-financed deal?", answer: "Absolutely. Both the seller and buyer should have independent legal representation. The lawyer drafts the VTB agreement, registers the mortgage on title, and ensures both parties' rights are protected." },
    ],
  },
  {
    slug: "vtb-mortgage-ontario",
    title: "VTB Mortgage Guide — Ontario",
    subtitle: "Vendor Take-Back Mortgages Explained for Sellers and Buyers",
    heroColor: "from-indigo-600 to-indigo-800",
    description:
      "A Vendor Take-Back (VTB) mortgage is a loan provided by the property seller to the buyer as part of the sale transaction. The seller 'takes back' a mortgage from the buyer instead of receiving the full purchase price at closing. This guide covers how VTB mortgages work in Ontario, the legal framework, tax implications, and when they make sense.",
    metaDesc:
      "VTB mortgage guide for Ontario. How Vendor Take-Back mortgages work, legal requirements, tax benefits, and risks. Everything sellers and buyers need to know.",
    sections: [
      {
        heading: "What Is a VTB Mortgage?",
        body: "A VTB (Vendor Take-Back) mortgage is a loan from the property seller to the buyer. Instead of the buyer getting 100% of their financing from a bank, the seller provides part (or all) of the mortgage. The VTB is registered as a charge on the property's title — making it a real, enforceable mortgage with legal protections for the seller.",
      },
      {
        heading: "First Position vs. Second Position",
        body: "A first-position VTB means the seller's mortgage is the only mortgage on the property. A second-position VTB sits behind a bank's first mortgage. First position gives the seller priority in a default scenario. Second position carries more risk because the bank gets paid first. Most Sel-Fi deals are structured as first-position VTBs.",
      },
      {
        heading: "Tax Benefits for Sellers",
        body: "The Capital Gains Reserve provision under the Income Tax Act allows sellers to defer capital gains recognition when they receive payment over time through a VTB. Instead of paying tax on the full gain in the year of sale, the seller can spread the taxable gain over the payment period (up to 5 years for most properties, 10 years for qualifying farm property). Always consult a CPA.",
      },
      {
        heading: "VTB Interest Rates",
        body: "VTB rates in Ontario typically range from 5% to 12%, depending on the deal structure, down payment, buyer's profile, and market conditions. Rates are negotiated directly between seller and buyer — there is no regulated rate. Both parties should consider current bank rates as a reference point.",
      },
    ],
    relatedArticles: ["what-is-seller-financing", "legal-protections-for-sellers", "commercial-vtb-structuring", "capital-gains-deferral-vtb"],
    relatedTools: ["/tools/seller-assessment", "/tools/investor-onboarding"],
    relatedCities: ["toronto", "oshawa", "whitby"],
    ctaLabel: "Use the VTB Calculator",
    ctaPath: "/guide",
    faqs: [
      { question: "What interest rate should I charge on a VTB?", answer: "VTB rates typically range from 5–12% in Ontario. Consider the current bank rate as a floor, add a premium for the risk you're taking, and negotiate with the buyer. A mortgage broker or accountant can help you set a market-appropriate rate." },
      { question: "Can a VTB sit behind a bank mortgage?", answer: "Yes, this is called a second-position VTB. However, it carries more risk for the seller because the bank's first mortgage gets paid first in a default. Most sellers prefer first-position VTB where they are the only lender." },
      { question: "How long is a typical VTB term?", answer: "Residential VTB terms commonly range from 1 to 5 years, often with a balloon payment at the end. Commercial VTB terms may be 3 to 10 years. The amortization period (payment schedule) can be longer — 20 or 25 years — with the remaining balance due at term end." },
    ],
  },
  {
    slug: "sell-house-privately-ontario",
    title: "Sell Your House Privately in Ontario",
    subtitle: "How to Sell Without an Agent — FSBO Guide",
    heroColor: "from-orange-500 to-orange-700",
    description:
      "Selling your house privately (For Sale By Owner / FSBO) in Ontario is legal, common, and can save you tens of thousands in agent commissions. This guide covers the process, legal requirements, pricing strategy, and how to list on Sel-Fi to reach buyers directly.",
    metaDesc:
      "How to sell your house privately in Ontario without an agent. FSBO guide covering legal requirements, pricing, marketing, and commission savings.",
    sections: [
      {
        heading: "Why Sell Privately?",
        body: "The primary reason is cost. On a $600,000 home, the seller typically pays ~5% total commission (both sides) plus HST, totaling approximately $33,900. When you sell privately, you keep that money. Even if the buyer has their own agent (which they can), you only avoid your listing agent's side — still saving $15,000+.",
      },
      {
        heading: "Legal Requirements in Ontario",
        body: "There is no law requiring you to use a real estate agent in Ontario. You can sell your home directly to a buyer as long as both parties agree to the terms and a real estate lawyer handles the closing. The lawyer prepares the Agreement of Purchase and Sale, arranges title transfer, and manages the trust account.",
      },
      {
        heading: "What You Need to Handle Yourself",
        body: "Without an agent, you handle pricing (use comparable sales data from HouseSigma or Zoocasa), marketing (Sel-Fi listing, social media, signage), showings, and negotiation. Many private sellers hire a photographer ($200–$500) and a lawyer ($1,500–$2,500 for a standard closing) — still far less than commission.",
      },
      {
        heading: "When to Consider an Agent",
        body: "Private sale works best when you have time, comfort with negotiation, and a property in a market with active demand. If your property is difficult to sell, requires complex marketing, or you're uncomfortable with showings and negotiation, an agent may provide value. Sel-Fi's model is agent-optional, not anti-agent.",
      },
    ],
    relatedArticles: ["the-true-cost-of-selling-with-an-agent", "private-sale-vs-agent", "what-is-seller-financing"],
    relatedTools: ["/tools/seller-assessment"],
    relatedCities: ["toronto", "hamilton", "london", "oshawa"],
    ctaLabel: "List Your Home on Sel-Fi",
    ctaPath: "/list-home",
    faqs: [
      { question: "Do I need a lawyer to sell privately in Ontario?", answer: "Yes. While you don't need an agent, you do need a real estate lawyer to handle the Agreement of Purchase and Sale, title transfer, and closing. This typically costs $1,500–$2,500." },
      { question: "Can the buyer still use a real estate agent?", answer: "Yes. The buyer can have their own agent. The buyer's agent commission is a separate negotiation between the buyer and their agent — it doesn't come from you as the private seller." },
      { question: "How do I price my home without an agent?", answer: "Use comparable sales data from public sources like HouseSigma, Zoocasa, or MPAC property assessments. Consider hiring an independent appraiser ($300–$500) for a professional opinion. Price competitively based on recent sold prices for similar properties in your area." },
    ],
  },
  {
    slug: "rent-to-own-ontario",
    title: "Rent-to-Own in Ontario",
    subtitle: "How Rent-to-Own Programs Work and What to Watch For",
    heroColor: "from-purple-600 to-purple-800",
    description:
      "Rent-to-own (also called lease-to-own or lease option) is an arrangement where a tenant rents a home with the option to buy it at a predetermined price within a set time frame. A portion of each rent payment typically goes toward the eventual purchase. This guide covers how rent-to-own works in Ontario, the legal framework, and the risks to be aware of.",
    metaDesc:
      "Rent-to-own homes in Ontario explained. How lease-to-own programs work, legal protections, costs, and risks. Sel-Fi marketplace.",
    sections: [
      {
        heading: "How Rent-to-Own Works",
        body: "In a rent-to-own deal, the buyer (tenant) signs a lease with an option to purchase the property at a pre-agreed price. They pay an upfront option fee (typically 2–5% of the purchase price) and monthly rent that is usually above market rate. A portion of each rent payment — the 'rent credit' — is applied toward the eventual down payment.",
      },
      {
        heading: "Pros and Cons for Buyers",
        body: "The main advantage is time: rent-to-own gives you 1–3 years to build credit, save a larger down payment, or establish the income history that banks require. The risk is losing your option fee and rent credits if you can't complete the purchase. Always understand the terms before signing and have a lawyer review the agreement.",
      },
      {
        heading: "Pros and Cons for Sellers",
        body: "Sellers benefit from above-market rent, a motivated tenant who treats the property like their own, and a built-in buyer at a pre-agreed price. The risk is that the buyer walks away at the end of the option period — though the seller keeps the option fee and rent credits already paid.",
      },
    ],
    relatedArticles: ["rent-to-own-explained", "what-is-seller-financing", "seller-financing-if-you-dont-qualify"],
    relatedTools: ["/tools/buyer-readiness"],
    relatedCities: ["hamilton", "london", "barrie"],
    ctaLabel: "Browse Rent-to-Own Listings",
    ctaPath: "/listings",
    faqs: [
      { question: "How much is a typical rent-to-own option fee?", answer: "Option fees typically range from 2–5% of the agreed purchase price. This fee is usually non-refundable but is applied toward the purchase price if you complete the deal." },
      { question: "What happens if I can't buy at the end of the lease?", answer: "If you choose not to exercise the purchase option (or can't qualify for a mortgage), you typically forfeit the option fee and accumulated rent credits. This is the primary risk of rent-to-own for buyers." },
      { question: "Is rent-to-own regulated in Ontario?", answer: "Rent-to-own agreements involve elements of both landlord-tenant law and real estate law. The Residential Tenancies Act may apply to the rental portion. Both parties should have independent legal representation." },
    ],
  },
  {
    slug: "commercial-vendor-financing",
    title: "Commercial Vendor Financing in Ontario",
    subtitle: "VTB Structures for Land, Farms, and Business Properties",
    heroColor: "from-emerald-700 to-emerald-900",
    description:
      "Vendor financing is established practice in commercial real estate. Unlike residential transactions where bank financing is the default, commercial deals frequently involve VTB structures because institutional lenders move slowly, require extensive documentation, and impose rigid covenants. This guide covers commercial VTB structuring, tax implications, and risk management.",
    metaDesc:
      "Commercial vendor financing (VTB) in Ontario. How vendor take-back mortgages work for land, farms, development parcels, and commercial properties.",
    sections: [
      {
        heading: "Why VTB Is Common in Commercial",
        body: "Commercial bank financing typically takes 60–90 days, requires environmental assessments, appraisals, and rigid debt coverage ratios. Vendor financing can close in 30 days or less, with terms negotiated directly between the parties. For sellers, VTB earns interest income and defers capital gains. For buyers, it removes institutional friction.",
      },
      {
        heading: "Capital Gains Deferral",
        body: "The capital gains reserve under the Income Tax Act allows vendors to spread recognition of capital gains over the VTB payment term — up to 5 years for most commercial property, or 10 years for qualifying farm property. This can reduce the tax hit significantly compared to a lump-sum sale. Always confirm structuring with a CPA.",
      },
      {
        heading: "Risk Management for Vendors",
        body: "Commercial VTB sellers should: require a meaningful down payment (25%+ is standard), register the mortgage in first position, include environmental indemnification clauses, structure balloon payments at reasonable intervals, and maintain insurance requirements on the property. Legal counsel is essential.",
      },
    ],
    relatedArticles: ["commercial-vtb-structuring", "capital-gains-deferral-vtb", "due-diligence-commercial-land"],
    relatedTools: ["/tools/investor-onboarding", "/tools/seller-assessment"],
    relatedCities: ["toronto", "kitchener-waterloo", "oshawa"],
    ctaLabel: "Browse Commercial Properties",
    ctaPath: "/business/listings",
    faqs: [
      { question: "How much down payment should a vendor require?", answer: "Commercial VTB deals typically require 25% or more down. Higher down payments reduce risk for the vendor and demonstrate buyer commitment. The exact amount is negotiated between the parties." },
      { question: "Can I defer capital gains with a VTB?", answer: "Yes. The capital gains reserve provision allows vendors to spread gain recognition over the payment period, up to 5 years for most properties (10 for qualifying farms). Structure this with your CPA before closing." },
    ],
  },
];

export function getTopicBySlug(slug) {
  return TOPIC_CLUSTERS.find((t) => t.slug === slug) || null;
}

export const TOPIC_SLUGS = TOPIC_CLUSTERS.map((t) => t.slug);

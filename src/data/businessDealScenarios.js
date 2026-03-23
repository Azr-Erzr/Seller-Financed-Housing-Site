// src/data/businessDealScenarios.js
// Scenario definitions for the Business Deal Structure Explorer.

export const BUSINESS_SCENARIOS = [
  {
    id: "vendor-finance",
    label: "Vendor Financing",
    cardMode: "estimate",
    headline: "Carry part or all of the deal and earn secured income",
    body: "Vendor financing works especially well when institutional lending is slow, restrictive, or not a good fit for the asset. On Sel-Fi, vendors can market directly, negotiate terms, and structure a deal around timeline, risk, and buyer profile.",
    iconCards: [
      { icon: "DollarSign", title: "May reduce listing-side commission", desc: "Direct marketing may reduce or avoid traditional listing-side commission structures." },
      { icon: "TrendingUp", title: "Model vendor interest income", desc: "A vendor take-back can generate interest income over the term." },
      { icon: "Sliders", title: "Flexible structure", desc: "Rate, amortization, balloon, and security structure can be negotiated directly." },
      { icon: "Landmark", title: "Useful for harder-to-finance assets", desc: "Land, farm, development, and specialty assets often need more flexible deal structures." },
    ],
    estimateTitle: "Illustrative Vendor-Financing Example",
    mathFn: "sellerFinanceEstimate",
    defaults: { price: 1200000, downPct: 25, ratePct: 7, termYears: 5, commPct: 0.02, hstPct: 0.13 },
    assumptions: ["$1,200,000 sale price", "25% down payment", "7% interest rate", "5-year term", "2% listing-side commission"],
    includedRows: [
      { label: "Listing-side commission avoided", key: "commissionBase" },
      { label: "HST on commission avoided", key: "commissionHST" },
      { label: "Modeled interest income over term", key: "interestIncome" },
    ],
    totalLabel: "Estimated Gross Vendor Upside",
    totalKey: "grossUpside",
    notIncluded: ["Taxes", "Legal / accounting fees", "Default / enforcement costs", "Carrying costs"],
    primaryCta: { label: "List with Vendor Financing", path: "/business/list-property" },
    secondaryCta: { label: "Browse Vendor-Finance Properties", path: "/business/listings" },
  },
  {
    id: "direct-private",
    label: "Direct Private Sale",
    cardMode: "estimate",
    headline: "Market directly without a full brokerage path",
    body: "Some commercial owners already know how they want to market a site and simply need a place to present the opportunity, define the structure, and reach niche buyers without a traditional brokered process.",
    iconCards: [
      { icon: "FileText", title: "Private direct listing", desc: "Create the listing directly on Sel-Fi." },
      { icon: "MessageSquare", title: "Control deal narrative", desc: "Lead with use case, zoning context, or specialty value." },
      { icon: "Briefcase", title: "Optional professionals", desc: "Bring in a broker, lawyer, planner, or accountant only where needed." },
      { icon: "Building2", title: "Supports specialty inventory", desc: "Useful for medical office, small mixed-use, farmland, or niche local opportunities." },
    ],
    estimateTitle: "Illustrative Direct Private Sale Example",
    mathFn: "privateSaleEstimate",
    defaults: { price: 1200000, commPct: 0.02, hstPct: 0.13 },
    assumptions: ["$1,200,000 sale price", "2% listing-side commission"],
    includedRows: [
      { label: "Listing-side commission potentially avoided", key: "commissionBase" },
      { label: "HST on commission avoided", key: "commissionHST" },
    ],
    totalLabel: "Estimated Direct-Sale Savings",
    totalKey: "commissionSaved",
    notIncluded: ["Buyer-side broker may still appear", "Closing timeline depends on buyer financing", "Legal / accounting fees not included"],
    primaryCta: { label: "List Privately", path: "/business/list-property" },
    secondaryCta: { label: "Browse Private Commercial Listings", path: "/business/listings" },
  },
  {
    id: "broker-assisted",
    label: "Broker-Assisted",
    cardMode: "workflow",
    headline: "Use a broker when you want reach, support, or system entry",
    body: "Some vendors want Sel-Fi's niche audience but still want broker support, broader distribution, or platform entry through traditional channels. This path keeps Sel-Fi as the marketplace layer while the broker handles representation.",
    iconCards: [
      { icon: "UserCheck", title: "Broker handles representation", desc: "The broker manages the listing agreement and system entry." },
      { icon: "Globe", title: "Sel-Fi adds niche visibility", desc: "The listing targets flexible-finance and direct-deal demand on Sel-Fi." },
      { icon: "ArrowRightLeft", title: "Lead routing can be configured", desc: "Leads go to the broker, vendor, or both." },
      { icon: "HeartHandshake", title: "Works for conventional vendors", desc: "Best for vendors who want support but still want Sel-Fi's differentiated audience." },
    ],
    workflowTitle: "How Broker-Assisted Listings Work",
    workflowSteps: [
      "Vendor chooses broker-assisted path",
      "Broker confirms representation",
      "Broker supplies approved listing data",
      "Sel-Fi publishes listing with broker-assisted badge",
      "Lead routing follows partner settings",
    ],
    primaryCta: { label: "Find a Broker Partner", path: "/partners" },
    secondaryCta: { label: "I Already Have a Broker", path: "/partner-apply" },
  },
];

// Business niche chips — swap examples/copy inside selected structure
export const BUSINESS_NICHE_CHIPS = [
  { id: "medical", label: "Medical" },
  { id: "farm", label: "Farm" },
  { id: "land", label: "Land" },
  { id: "development", label: "Development" },
  { id: "mixed-use", label: "Mixed-Use" },
];

// src/data/city-data.js
// Mega-Batch B — Template-driven city page data for SEO landing pages.
// Each city gets a page at /city/{slug} with filtered listings, local context, and guide links.

export const CITIES = [
  {
    slug: "toronto",
    name: "Toronto",
    region: "Greater Toronto Area",
    lat: 43.6532,
    lng: -79.3832,
    population: "2.8M+",
    avgHomePrice: "$1,100,000",
    description:
      "Toronto is Ontario's largest real estate market. With average home prices above $1M and the strictest stress test requirements in Canada, many qualified buyers are locked out of conventional financing. Seller financing and direct private sales offer an alternative path to ownership — especially for self-employed professionals, newcomers, and small co-purchase groups.",
    whySellerFinance: [
      "High prices mean larger commission savings — $50K+ on a typical home",
      "Dense condo market creates opportunities for private VTB deals",
      "Large immigrant and newcomer population who face bank documentation barriers",
      "Active investor community familiar with VTB structures",
    ],
    localContext:
      "Toronto's market has been cooling from pandemic peaks but remains expensive by national standards. Condos in particular have seen longer days on market, making sellers more open to creative deal structures. The GTA's diversity also creates a large pool of buyers who may not fit conventional lending criteria but have genuine ability to service a mortgage.",
    relatedArticles: ["what-is-seller-financing", "seller-financing-if-you-dont-qualify", "the-true-cost-of-selling-with-an-agent"],
    neighborhoodHighlights: ["Scarborough", "North York", "Etobicoke", "East York", "Downtown Core"],
  },
  {
    slug: "ottawa",
    name: "Ottawa",
    region: "National Capital Region",
    lat: 45.4215,
    lng: -75.6972,
    population: "1.0M+",
    avgHomePrice: "$650,000",
    description:
      "Ottawa combines stable government-sector employment with a growing tech industry. The market is more affordable than Toronto but still challenging for first-time buyers. Seller financing works well here for government contractors and self-employed tech workers whose income is real but doesn't fit bank formulas.",
    whySellerFinance: [
      "Government contractors often have strong income but non-traditional documentation",
      "Tech sector workers with stock-based compensation face stress test challenges",
      "Moderate prices mean realistic VTB deal sizes",
      "Bilingual market with unique buyer pools",
    ],
    localContext:
      "Ottawa's real estate market is driven by federal government employment, the tech sector (Kanata/Nepean), and the university community. The city's steady demand and relatively predictable market make it a lower-risk environment for both VTB sellers and buyers.",
    relatedArticles: ["what-is-seller-financing", "private-sale-vs-agent"],
    neighborhoodHighlights: ["Kanata", "Barrhaven", "Orleans", "Centretown", "Westboro"],
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    region: "Hamilton-Wentworth",
    lat: 43.2557,
    lng: -79.8711,
    population: "580K+",
    avgHomePrice: "$750,000",
    description:
      "Hamilton has transformed from a steel town to a diversified city with growing arts, healthcare, and tech sectors. It's drawn significant GTA spillover, pushing prices up but remaining more accessible than Toronto. The city's diverse housing stock — from downtown condos to Stoney Creek detached homes — creates varied opportunities for seller-financed deals.",
    whySellerFinance: [
      "GTA spillover buyers priced out of Toronto but earning Toronto incomes",
      "Diverse housing stock from $400K condos to $1.5M detached homes",
      "Growing investor interest in rental property VTB deals",
      "McMaster University area creates steady rental demand",
    ],
    localContext:
      "Hamilton's Waterfall Capital rebranding, the LRT project, and proximity to Toronto have made it one of Ontario's fastest-growing real estate markets. The mix of established neighbourhoods and revitalizing areas means sellers can find motivated buyers at many price points.",
    relatedArticles: ["what-is-seller-financing", "the-true-cost-of-selling-with-an-agent", "rent-to-own-explained"],
    neighborhoodHighlights: ["Westdale", "Stoney Creek", "Ancaster", "Dundas", "Downtown Hamilton"],
  },
  {
    slug: "kitchener-waterloo",
    name: "Kitchener-Waterloo",
    region: "Waterloo Region",
    lat: 43.4516,
    lng: -80.4925,
    population: "600K+",
    avgHomePrice: "$700,000",
    description:
      "Kitchener-Waterloo is Ontario's tech corridor, home to major companies and two universities. The tech sector's prevalence of stock compensation, contractor income, and startup founders creates a large pool of qualified buyers who don't fit bank formulas. Seller financing is a natural fit.",
    whySellerFinance: [
      "Tech workers with RSU/stock-based income that banks discount or ignore",
      "Startup founders with real revenue but no T4 salary",
      "University-adjacent investment properties suit VTB structures",
      "More affordable than GTA with strong appreciation potential",
    ],
    localContext:
      "The Waterloo Region's tech ecosystem (Communitech, UW, WLU) has created a concentration of high-earning professionals whose income structures don't fit conventional mortgage qualification. This is one of the strongest markets for seller financing in Ontario.",
    relatedArticles: ["what-is-seller-financing", "seller-financing-if-you-dont-qualify"],
    neighborhoodHighlights: ["Uptown Waterloo", "Downtown Kitchener", "Beechwood", "Doon", "Cambridge"],
  },
  {
    slug: "london",
    name: "London",
    region: "Southwestern Ontario",
    lat: 42.9849,
    lng: -81.2453,
    population: "420K+",
    avgHomePrice: "$580,000",
    description:
      "London offers some of the most accessible home prices in Southern Ontario, making it attractive for both first-time buyers and investors. Western University and a growing healthcare sector drive demand. The more moderate prices mean seller-financed deals are achievable with lower down payments.",
    whySellerFinance: [
      "Moderate prices make VTB deals accessible with lower capital",
      "Healthcare sector creates steady, reliable buyer demand",
      "University creates rental investment opportunities",
      "Growing commuter interest from GTA remote workers",
    ],
    localContext:
      "London has benefited from remote work trends, with GTA professionals relocating for more affordable housing. This influx has pushed prices up but also created opportunities for sellers to offer VTB terms to buyers who may have sold a Toronto property and want flexible terms on their next purchase.",
    relatedArticles: ["what-is-seller-financing", "rent-to-own-explained", "private-sale-vs-agent"],
    neighborhoodHighlights: ["Byron", "Old South", "Wortley Village", "Masonville", "Lambeth"],
  },
  {
    slug: "oshawa",
    name: "Oshawa",
    region: "Durham Region",
    lat: 43.8971,
    lng: -78.8658,
    population: "180K+",
    avgHomePrice: "$700,000",
    description:
      "Oshawa and Durham Region offer a compelling mix of relative affordability (compared to Toronto) and growing economic diversification beyond automotive. Ontario Tech University and the growing healthcare sector bring steady demand. The GO Transit expansion has made Durham increasingly attractive for GTA commuters.",
    whySellerFinance: [
      "More affordable entry point than Toronto for first-time buyers",
      "Strong rental demand from university students and young professionals",
      "Active cottage and recreational property market in nearby Kawarthas",
      "Growing commercial/industrial corridor along Highway 401/407",
    ],
    localContext:
      "Durham Region is one of the fastest-growing areas in the GTA, with Oshawa at its centre. The combination of the university, hospital expansion, and transit improvements has created a market where demand often outpaces supply — making creative deal structures increasingly relevant.",
    relatedArticles: ["what-is-seller-financing", "the-true-cost-of-selling-with-an-agent"],
    neighborhoodHighlights: ["Taunton", "Windfields", "Samac", "Kedron", "Northwood"],
  },
  {
    slug: "barrie",
    name: "Barrie",
    region: "Simcoe County",
    lat: 44.3894,
    lng: -79.6903,
    population: "155K+",
    avgHomePrice: "$680,000",
    description:
      "Barrie sits at the gateway to cottage country and has grown rapidly as GTA commuters seek more affordable housing. The GO Transit line makes it a viable commuter city, while its proximity to Muskoka and Georgian Bay adds recreational property demand. Inherited cottages and second homes are a natural fit for seller financing.",
    whySellerFinance: [
      "Inherited cottages and second homes are prime VTB candidates",
      "GTA commuters with Toronto income, Barrie budgets",
      "Recreational property market where banks are more cautious",
      "Growing commercial corridor along Highway 400",
    ],
    localContext:
      "Barrie's dual identity — commuter city and cottage country gateway — makes it unique in Ontario. Many cottage and recreational property transactions already involve some form of owner financing or creative structuring because banks are more conservative with seasonal or recreational properties.",
    relatedArticles: ["what-is-seller-financing", "private-sale-vs-agent"],
    neighborhoodHighlights: ["South Barrie", "Allandale", "Holly", "Painswick", "Midhurst"],
  },
  {
    slug: "whitby",
    name: "Whitby",
    region: "Durham Region",
    lat: 43.8975,
    lng: -78.9429,
    population: "140K+",
    avgHomePrice: "$850,000",
    description:
      "Whitby is one of Durham Region's most desirable communities, offering a balance of suburban family living and growing commercial activity. The Whitby GO station makes it a popular commuter destination. Higher average prices create meaningful commission savings for direct sellers.",
    whySellerFinance: [
      "Higher home prices = $40K+ potential commission savings",
      "Family-oriented market with steady demand",
      "Growing Brooklin and north Whitby development creates new inventory",
      "Active move-up buyer market from Ajax/Oshawa",
    ],
    localContext:
      "Whitby's combination of excellent schools, lakefront access, and GO Transit commuting has made it a premium Durham Region community. Sellers of $800K+ homes can save substantial commissions through direct sale, and buyers benefit from negotiating flexible terms directly with sellers.",
    relatedArticles: ["what-is-seller-financing", "the-true-cost-of-selling-with-an-agent", "legal-protections-for-sellers"],
    neighborhoodHighlights: ["Downtown Whitby", "Brooklin", "Blue Grass Meadows", "Port Whitby", "Williamsburg"],
  },
  {
    slug: "ajax",
    name: "Ajax",
    region: "Durham Region",
    lat: 43.8509,
    lng: -79.0204,
    population: "125K+",
    avgHomePrice: "$800,000",
    description:
      "Ajax offers waterfront living on Lake Ontario with strong transit connections to Toronto. It's one of the most diverse communities in Durham Region, creating a large pool of potential buyers whose income structures may not fit conventional bank formulas but who are genuinely qualified for homeownership.",
    whySellerFinance: [
      "Highly diverse community — newcomers often face documentation barriers at banks",
      "Waterfront and lakeside properties command premium prices, bigger savings",
      "Strong family formation demand from first-time buyers",
      "Close proximity to Toronto for commuters",
    ],
    localContext:
      "Ajax's diversity is one of its greatest assets for the seller financing model. A significant portion of residents are newcomers to Canada whose income is real and growing but who face the 2-year documentation requirements at traditional banks. Seller financing bridges that gap.",
    relatedArticles: ["what-is-seller-financing", "seller-financing-if-you-dont-qualify", "rent-to-own-explained"],
    neighborhoodHighlights: ["South Ajax", "Pickering Village", "Audley", "Salem", "Carruthers Creek"],
  },
];

export function getCityBySlug(slug) {
  return CITIES.find((c) => c.slug === slug) || null;
}

export const CITY_SLUGS = CITIES.map((c) => c.slug);

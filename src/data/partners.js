// src/data/partners.js
// Seed data for the HomeMatch Partner directory.
// Replace with real partners as they sign up.

export const PARTNER_CATEGORIES = [
  { value: "lawyer",       label: "Real Estate Lawyers",      icon: "⚖️",  desc: "Essential for closing any seller-financed deal" },
  { value: "stager",       label: "Home Stagers",             icon: "🛋️",  desc: "Traditional and AI staging services" },
  { value: "photographer", label: "Photographers & Video",    icon: "📸",  desc: "Photos, drone footage, virtual tours" },
  { value: "inspector",    label: "Home Inspectors",          icon: "🔍",  desc: "Pre-sale and buyer due diligence inspections" },
  { value: "broker",       label: "Mortgage Brokers",         icon: "🏦",  desc: "For buyers exploring all financing options" },
];

export const PARTNERS = [
  // ── Real Estate Lawyers ───────────────────────────────────────────
  {
    id: "law1",
    category: "lawyer",
    name: "Durham Real Estate Law",
    contact: "Sarah Okonkwo, LLB",
    city: "Whitby",
    region: "Durham Region",
    phone: "(905) 555-0101",
    email: "info@durhamrelaw.ca",
    website: "https://durhamrelaw.ca",
    bio: "Specializing in residential real estate, seller-financed transactions, and vendor take-back mortgages for over 15 years. We make complex deals simple.",
    services: ["Seller-Finance Agreements", "Promissory Notes", "Title Transfers", "Purchase & Sale", "NDA Drafting"],
    badge: "HomeMatch Partner",
    featured: true,
    avatar: "",
  },
  {
    id: "law2",
    category: "lawyer",
    name: "Oshawa Property Law Group",
    contact: "Marcus Webb, LLB",
    city: "Oshawa",
    region: "Durham Region",
    phone: "(905) 555-0202",
    email: "mwebb@osplaw.ca",
    website: "https://osplaw.ca",
    bio: "Full-service real estate law firm covering the Durham Region. Experienced with private sales, rent-to-own agreements, and lease options.",
    services: ["Private Sales", "Rent-to-Own Contracts", "Lease Options", "Title Insurance", "Closing Services"],
    badge: "HomeMatch Partner",
    featured: true,
    avatar: "",
  },
  {
    id: "law3",
    category: "lawyer",
    name: "Ajax Legal Services",
    contact: "Priya Sharma, JD",
    city: "Ajax",
    region: "Durham Region",
    phone: "(905) 555-0303",
    email: "priya@ajaxlegal.ca",
    website: "https://ajaxlegal.ca",
    bio: "Boutique real estate practice focused on non-traditional transactions. Flat-fee pricing for seller-finance closings.",
    services: ["Seller-Finance Closings", "Flat-Fee Pricing", "Same-Week Availability", "Bilingual Services"],
    badge: null,
    featured: false,
    avatar: "",
  },

  // ── Home Stagers ──────────────────────────────────────────────────
  {
    id: "stg1",
    category: "stager",
    name: "Staged to Sell Durham",
    contact: "Melissa Park",
    city: "Whitby",
    region: "Durham Region",
    phone: "(905) 555-0401",
    email: "melissa@stagedtosell.ca",
    website: "https://stagedtosell.ca",
    bio: "Award-winning staging studio serving the Durham Region. Traditional staging and AI-enhanced virtual staging available. Homes we stage sell 38% faster on average.",
    services: ["Full Home Staging", "Virtual AI Staging", "Furniture Rental", "Consultation Only", "Vacant Home Staging"],
    badge: "HomeMatch Partner",
    featured: true,
    avatar: "",
  },
  {
    id: "stg2",
    category: "stager",
    name: "VirtualStage Pro",
    contact: "James Tran",
    city: "Oshawa",
    region: "Durham Region",
    phone: "(905) 555-0402",
    email: "james@virtualstagepro.ca",
    website: "https://virtualstagepro.ca",
    bio: "AI-powered virtual staging delivered in 24 hours. Upload your empty room photos and get back photorealistic furnished versions. Starting at $30/room.",
    services: ["AI Virtual Staging", "24-Hour Turnaround", "Multiple Style Options", "Before/After Sets"],
    badge: null,
    featured: false,
    avatar: "",
  },

  // ── Photographers ─────────────────────────────────────────────────
  {
    id: "phot1",
    category: "photographer",
    name: "SkyView Real Estate Media",
    contact: "Devon Ali",
    city: "Whitby",
    region: "Durham Region",
    phone: "(905) 555-0501",
    email: "devon@skyviewmedia.ca",
    website: "https://skyviewmedia.ca",
    bio: "Full real estate media production — HDR photography, drone footage, Matterport 3D tours, and cinematic walkthrough videos. Serving all of Durham Region.",
    services: ["HDR Photography", "Drone Video", "Matterport 3D Tours", "Cinematic Walkthroughs", "Same-Day Delivery"],
    badge: "HomeMatch Partner",
    featured: true,
    avatar: "",
  },
  {
    id: "phot2",
    category: "photographer",
    name: "Clear Light Photography",
    contact: "Nadia Rossi",
    city: "Ajax",
    region: "Durham Region",
    phone: "(905) 555-0502",
    email: "nadia@clearlight.ca",
    website: "https://clearlight.ca",
    bio: "Residential real estate photographer with 10 years experience. Clean, bright photography that makes homes shine online. Fast 24-hour delivery.",
    services: ["Interior Photography", "Exterior & Twilight Shots", "Floor Plans", "Quick Turnaround"],
    badge: null,
    featured: false,
    avatar: "",
  },

  // ── Home Inspectors ───────────────────────────────────────────────
  {
    id: "insp1",
    category: "inspector",
    name: "Durham Home Inspections",
    contact: "Rick Holloway, RHI",
    city: "Oshawa",
    region: "Durham Region",
    phone: "(905) 555-0601",
    email: "rick@durhamhomeinspect.ca",
    website: "https://durhamhomeinspect.ca",
    bio: "Registered Home Inspector with 20 years experience. Thorough written reports within 24 hours. Pre-listing inspections help sellers price with confidence.",
    services: ["Pre-Listing Inspections", "Buyer Inspections", "Written Reports", "Thermal Imaging", "Radon Testing"],
    badge: "HomeMatch Partner",
    featured: true,
    avatar: "",
  },
  {
    id: "insp2",
    category: "inspector",
    name: "Ajax & Whitby Inspections",
    contact: "Tom Kowalski, RHI",
    city: "Ajax",
    region: "Durham Region",
    phone: "(905) 555-0602",
    email: "tom@awcinspect.ca",
    website: "https://awcinspect.ca",
    bio: "Flat-rate home inspections for buyers and sellers. Available 7 days a week. Digital reports delivered same day.",
    services: ["Flat-Rate Pricing", "7-Day Availability", "Digital Reports", "Pre-Listing & Buyer Inspections"],
    badge: null,
    featured: false,
    avatar: "",
  },

  // ── Mortgage Brokers ──────────────────────────────────────────────
  {
    id: "mort1",
    category: "broker",
    name: "Durham Mortgage Solutions",
    contact: "Angela Chen, AMP",
    city: "Whitby",
    region: "Durham Region",
    phone: "(905) 555-0701",
    email: "angela@durhammortsolutions.ca",
    website: "https://durhammortsolutions.ca",
    bio: "Independent mortgage broker with access to 40+ lenders. Specializing in self-employed, new-to-Canada, and non-traditional income buyers who've been turned down by banks.",
    services: ["Self-Employed Mortgages", "New-to-Canada", "Bad Credit Solutions", "First-Time Buyers", "Refinancing"],
    badge: "HomeMatch Partner",
    featured: true,
    avatar: "",
  },
];

export function getPartnersByCategory(category) {
  return PARTNERS.filter((p) => p.category === category);
}

export function getPartnerById(id) {
  return PARTNERS.find((p) => p.id === id) || null;
}

export function getFeaturedPartners() {
  return PARTNERS.filter((p) => p.featured);
}

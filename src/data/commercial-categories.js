// src/data/commercial-categories.js
// Mega-Batch C (Batch 18) — Specialty commercial categories with category-specific fields.
// This supplements commercial-seed.js PROPERTY_CATEGORIES.
// New categories: Medical/Dental, Daycare, Auto Service, Self-Storage, Marina.

import {
  Building, Wheat, Hammer, Factory, Waves, MapPin, Store, Stethoscope,
  Baby, Car, Package, Anchor, Home,
} from "lucide-react";

// ── Extended category list (replaces PROPERTY_CATEGORIES in commercial-seed.js) ──
export const COMMERCIAL_CATEGORIES = [
  // Original categories
  { value: "Vacant Land",                 label: "Vacant Land",          icon: MapPin,       color: "#84cc16" },
  { value: "Agricultural / Farm",         label: "Agricultural / Farm",  icon: Wheat,        color: "#16a34a" },
  { value: "Development Land",            label: "Development Land",     icon: Hammer,       color: "#d97706" },
  { value: "Commercial Building",         label: "Commercial Building",  icon: Building,     color: "#2563eb" },
  { value: "Industrial / Warehouse",      label: "Industrial / Warehouse", icon: Factory,    color: "#475569" },
  { value: "Multi-Unit / Apartment",      label: "Multi-Unit / Apartment", icon: Home,       color: "#7c3aed" },
  { value: "Waterfront / Recreational",   label: "Waterfront / Recreational", icon: Waves,   color: "#0891b2" },
  { value: "Special Purpose",             label: "Special Purpose",      icon: Store,        color: "#059669" },
  // New specialty categories (Batch 18a)
  { value: "Medical / Dental Office",     label: "Medical / Dental Office", icon: Stethoscope, color: "#dc2626" },
  { value: "Daycare / Child Care",        label: "Daycare / Child Care", icon: Baby,         color: "#ec4899" },
  { value: "Auto Service / Repair",       label: "Auto Service / Repair", icon: Car,         color: "#6366f1" },
  { value: "Self-Storage",               label: "Self-Storage",          icon: Package,      color: "#f59e0b" },
  { value: "Marina / Recreational",       label: "Marina / Recreational", icon: Anchor,      color: "#0284c7" },
];

// Legacy-compatible string array
export const PROPERTY_CATEGORIES_EXTENDED = COMMERCIAL_CATEGORIES.map((c) => c.value);

// Icon lookup by category value
export const CATEGORY_ICON_MAP = {};
COMMERCIAL_CATEGORIES.forEach((c) => { CATEGORY_ICON_MAP[c.value] = c.icon; });

// Color lookup
export function getCategoryColorExtended(cat) {
  const found = COMMERCIAL_CATEGORIES.find((c) => c.value === cat);
  if (found) return found.color;
  return "#059669";
}

// ── Category-specific fields (Batch 18b) ─────────────────────────────
// Conditional fields shown on BusinessListHome form when a specific category is selected.
// Each field has: key (for form state), label, type, placeholder, hint.
export const CATEGORY_FIELDS = {
  "Medical / Dental Office": [
    { key: "examRooms", label: "Number of Exam Rooms", type: "number", placeholder: "e.g. 6" },
    { key: "hasMedicalGas", label: "Medical Gas Installed", type: "boolean" },
    { key: "accessibleEntrance", label: "Accessible Entrance (AODA)", type: "boolean" },
    { key: "waitingAreaSqft", label: "Waiting Area (sqft)", type: "number", placeholder: "e.g. 400" },
    { key: "plumbedChairs", label: "Plumbed Dental Chairs", type: "number", placeholder: "e.g. 4", hint: "Dental offices only" },
    { key: "xrayRoom", label: "X-Ray / Imaging Room", type: "boolean" },
  ],
  "Daycare / Child Care": [
    { key: "licensedCapacity", label: "Licensed Capacity", type: "number", placeholder: "e.g. 50", hint: "Max children per license" },
    { key: "hasOutdoorPlay", label: "Outdoor Play Area", type: "boolean" },
    { key: "outdoorSqft", label: "Outdoor Area (sqft)", type: "number", placeholder: "e.g. 2000" },
    { key: "ageGroupsServed", label: "Age Groups Served", type: "text", placeholder: "e.g. Infant, Toddler, Preschool" },
    { key: "licenseIncluded", label: "License Included in Sale", type: "boolean" },
    { key: "kitchenFacility", label: "Commercial Kitchen", type: "boolean" },
  ],
  "Auto Service / Repair": [
    { key: "bayCount", label: "Number of Service Bays", type: "number", placeholder: "e.g. 4" },
    { key: "liftType", label: "Lift Type", type: "select", options: ["None", "2-Post", "4-Post", "Scissor", "In-Ground", "Multiple Types"] },
    { key: "hasSprayBooth", label: "Spray / Paint Booth", type: "boolean" },
    { key: "environmentalCompliance", label: "Environmental Compliance Status", type: "select", options: ["Compliant", "Needs Assessment", "Remediation Required", "Not Assessed"] },
    { key: "floorDrains", label: "Floor Drain / Oil Separator", type: "boolean" },
    { key: "compressedAir", label: "Compressed Air System", type: "boolean" },
  ],
  "Self-Storage": [
    { key: "unitCount", label: "Total Number of Units", type: "number", placeholder: "e.g. 120" },
    { key: "climateControlled", label: "Climate-Controlled Units", type: "boolean" },
    { key: "climateControlledPct", label: "% Climate Controlled", type: "number", placeholder: "e.g. 30", hint: "Percentage of units" },
    { key: "driveUpAccess", label: "Drive-Up Access Units", type: "boolean" },
    { key: "securitySystem", label: "Security System", type: "select", options: ["None", "Keypad Entry", "Camera + Keypad", "24hr Staffed", "Smart Lock"] },
    { key: "occupancyRate", label: "Current Occupancy Rate (%)", type: "number", placeholder: "e.g. 92" },
    { key: "avgRentPerUnit", label: "Avg Rent per Unit ($/month)", type: "number", placeholder: "e.g. 175" },
  ],
  "Marina / Recreational": [
    { key: "slipCount", label: "Number of Slips / Berths", type: "number", placeholder: "e.g. 60" },
    { key: "maxBoatLength", label: "Max Boat Length (ft)", type: "number", placeholder: "e.g. 40" },
    { key: "dryStorage", label: "Dry Storage Available", type: "boolean" },
    { key: "boatLaunch", label: "Boat Launch", type: "boolean" },
    { key: "fuelDock", label: "Fuel Dock", type: "boolean" },
    { key: "waterDepth", label: "Minimum Water Depth (ft)", type: "number", placeholder: "e.g. 6" },
    { key: "seasonalOrYearRound", label: "Operating Season", type: "select", options: ["Year-Round", "Seasonal (May-Oct)", "Seasonal (Apr-Nov)"] },
  ],
};

// ── Category landing page data (Batch 18c) ──────────────────────────
export const CATEGORY_PAGES = {
  "Medical / Dental Office": {
    slug: "medical-office",
    title: "Medical & Dental Offices for Sale — Ontario",
    metaDesc: "Medical and dental office spaces for sale in Ontario. Seller-financed and private sale options on Sel-Fi Business.",
    heroColor: "from-red-600 to-red-800",
    intro: "Medical and dental offices represent a specialized commercial real estate niche with steady demand, long-term tenants, and strong revenue potential. Seller financing is common in healthcare property transactions because buyers are typically professionals with strong income but limited time to navigate bank bureaucracy.",
    highlights: [
      "Healthcare professionals often have high income but complex tax structures — VTB bypasses bank rigidity",
      "Medical office leases are typically long-term (5-10 years), making VTB deals lower-risk for sellers",
      "Specialized build-outs (plumbing, gas, accessible entrances) add value that appraisals may undercount",
      "Ontario has a growing need for medical space — particularly family medicine and dental clinics",
    ],
  },
  "Self-Storage": {
    slug: "self-storage",
    title: "Self-Storage Facilities for Sale — Ontario",
    metaDesc: "Self-storage facilities and businesses for sale in Ontario. Direct from vendor. Sel-Fi Business marketplace.",
    heroColor: "from-amber-600 to-amber-800",
    intro: "Self-storage is one of the most recession-resistant commercial real estate asset classes. Facilities generate predictable monthly revenue, require minimal staffing, and benefit from growing demand in suburban and small-city markets. Vendor financing is common because the income stream provides built-in security for the VTB mortgage.",
    highlights: [
      "Predictable monthly cash flow makes VTB deals attractive — income secures the mortgage",
      "Low operating costs and minimal staffing requirements",
      "Growing demand in Ontario suburbs as population density increases",
      "Climate-controlled units command premium rents and attract higher-quality tenants",
    ],
  },
  "Daycare / Child Care": {
    slug: "daycare",
    title: "Daycare & Child Care Centres for Sale — Ontario",
    metaDesc: "Licensed daycare and child care centres for sale in Ontario. Including license and business. Sel-Fi Business.",
    heroColor: "from-pink-600 to-pink-800",
    intro: "Licensed childcare centres are in extreme demand across Ontario. The combination of federal and provincial childcare subsidy programs ($10/day initiative) and chronic undersupply of licensed spaces makes childcare one of the most compelling small business acquisitions. Vendor financing helps qualified operators acquire facilities faster than bank timelines allow.",
    highlights: [
      "Federal $10/day childcare program has dramatically increased demand for licensed spaces",
      "License is the highest-value asset — some sales include the license transfer",
      "Stable, government-subsidized revenue stream supports VTB payment obligations",
      "Ontario has a multi-year waitlist crisis — new capacity is urgently needed",
    ],
  },
  "Auto Service / Repair": {
    slug: "auto-service",
    title: "Auto Service & Repair Shops for Sale — Ontario",
    metaDesc: "Auto service and repair shops for sale in Ontario. Includes bays, lifts, and equipment. Sel-Fi Business.",
    heroColor: "from-indigo-600 to-indigo-800",
    intro: "Auto service properties combine specialized real estate with an operating business. Buyers need facilities with bays, lifts, environmental compliance, and appropriate zoning. Banks are often cautious with auto service properties due to environmental risk — making vendor financing a practical path for qualified operators to acquire these businesses.",
    highlights: [
      "Environmental compliance is the key issue — clean Phase 1/2 dramatically increases value",
      "Specialized equipment (lifts, spray booths) often included in sale price",
      "Growing EV market creates transition opportunities (EV service conversion)",
      "Banks are cautious with auto properties — VTB fills the financing gap",
    ],
  },
  "Marina / Recreational": {
    slug: "marina",
    title: "Marinas & Recreational Properties for Sale — Ontario",
    metaDesc: "Marinas, boat slips, and recreational waterfront properties for sale in Ontario. Sel-Fi Business.",
    heroColor: "from-cyan-600 to-cyan-800",
    intro: "Ontario's extensive waterfront — from the Great Lakes to the Kawarthas, Muskoka, and the Thousand Islands — supports a vibrant marina and recreational property market. These properties are seasonal by nature, which makes bank financing more conservative. Vendor financing is well-established in recreational waterfront transactions.",
    highlights: [
      "Seasonal revenue pattern makes banks conservative — VTB is the standard financing path",
      "Ontario waterfront properties have shown consistent long-term appreciation",
      "Cottage country demand continues to grow post-pandemic",
      "Marinas with fuel docks and dry storage command premium valuations",
    ],
  },
};

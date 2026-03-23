// src/data/partner-categories.js
// Mega-Batch D (Batch 19a, 19d) — Extended partner categories with credentialing fields.
// Adds: Accountant, Appraiser, Contractor, Environmental, Surveyor, Insurance Broker.
// Each category defines what credentials should be collected and displayed.

import {
  Scale, Camera, Search, Landmark, Truck, Palette, Calculator,
  ClipboardCheck, HardHat, Leaf, Ruler, Shield,
} from "lucide-react";

export const PARTNER_CATEGORIES_EXTENDED = [
  // Original categories
  {
    value: "lawyer",
    label: "Real Estate Lawyers",
    icon: Scale,
    desc: "Essential for closing any seller-financed deal",
    licensingBody: "Law Society of Ontario",
    credentialFields: [
      { key: "licenseNumber", label: "LSO License Number", required: true },
      { key: "yearsExperience", label: "Years of Real Estate Experience", type: "number" },
      { key: "languages", label: "Languages", type: "multi-text", placeholder: "English, French, Mandarin" },
      { key: "specialties", label: "Specialties", type: "multi-select", options: ["Seller Financing", "Private Sale", "Rent-to-Own", "Commercial VTB", "Title", "Foreclosure"] },
    ],
  },
  {
    value: "inspector",
    label: "Home Inspectors",
    icon: Search,
    desc: "Pre-sale and buyer due diligence inspections",
    licensingBody: "Ontario Association of Home Inspectors (OAHI)",
    credentialFields: [
      { key: "licenseNumber", label: "OAHI Registration #", required: true },
      { key: "certifications", label: "Certifications", type: "multi-select", options: ["RHI", "NHI", "ASHI", "InterNACHI", "WETT"] },
      { key: "insuranceProvider", label: "E&O Insurance Provider" },
      { key: "yearsExperience", label: "Years of Experience", type: "number" },
    ],
  },
  {
    value: "broker",
    label: "Mortgage Brokers",
    icon: Landmark,
    desc: "For buyers exploring all financing options",
    licensingBody: "Financial Services Regulatory Authority (FSRA)",
    credentialFields: [
      { key: "licenseNumber", label: "FSRA License Number", required: true },
      { key: "yearsExperience", label: "Years in Practice", type: "number" },
      { key: "specialties", label: "Specialties", type: "multi-select", options: ["Private Lending", "Alternative Financing", "Commercial", "Newcomer Programs", "Self-Employed"] },
    ],
  },
  {
    value: "stager",
    label: "Home Stagers",
    icon: Palette,
    desc: "Traditional and AI staging services",
    licensingBody: null,
    credentialFields: [
      { key: "yearsExperience", label: "Years of Experience", type: "number" },
      { key: "servicesOffered", label: "Services", type: "multi-select", options: ["Traditional Staging", "Virtual Staging", "AI Staging", "Consultation Only"] },
    ],
  },
  {
    value: "photographer",
    label: "Photographers & Video",
    icon: Camera,
    desc: "Photos, drone footage, virtual tours",
    licensingBody: null,
    credentialFields: [
      { key: "servicesOffered", label: "Services", type: "multi-select", options: ["Photography", "Drone Aerial", "Video Tour", "Matterport 3D", "Floor Plans"] },
      { key: "portfolioUrl", label: "Portfolio URL" },
    ],
  },
  {
    value: "mover",
    label: "Licensed Movers",
    icon: Truck,
    desc: "CVOR-registered movers with cargo insurance",
    licensingBody: "Ontario Ministry of Transportation",
    credentialFields: [
      { key: "cvorNumber", label: "CVOR Certificate #", required: true },
      { key: "cargoInsurance", label: "Cargo Insurance Provider", required: true },
      { key: "wsibNumber", label: "WSIB Account #", required: true },
      { key: "serviceArea", label: "Service Area", type: "multi-text", placeholder: "GTA, Durham Region, Eastern Ontario" },
    ],
  },
  // ── New categories (Batch 19d) ──────────────────────────────────────
  {
    value: "accountant",
    label: "Accountants & CPAs",
    icon: Calculator,
    desc: "Tax planning for VTB deals, capital gains deferral",
    licensingBody: "CPA Ontario",
    credentialFields: [
      { key: "licenseNumber", label: "CPA License Number", required: true },
      { key: "specialties", label: "Specialties", type: "multi-select", options: ["Capital Gains", "Real Estate Tax", "VTB Structuring", "Corporate Tax", "Estate Planning"] },
      { key: "yearsExperience", label: "Years of Experience", type: "number" },
    ],
  },
  {
    value: "appraiser",
    label: "Appraisers",
    icon: ClipboardCheck,
    desc: "Independent property valuations",
    licensingBody: "Appraisal Institute of Canada (AIC)",
    credentialFields: [
      { key: "designation", label: "Designation", type: "select", options: ["AACI", "CRA", "P.App"] },
      { key: "licenseNumber", label: "AIC Member #", required: true },
      { key: "propertyTypes", label: "Property Types", type: "multi-select", options: ["Residential", "Commercial", "Agricultural", "Industrial", "Development Land"] },
    ],
  },
  {
    value: "contractor",
    label: "Contractors & Renovation",
    icon: HardHat,
    desc: "Pre-sale repairs, renovation estimates, inspections",
    licensingBody: null,
    credentialFields: [
      { key: "wsibNumber", label: "WSIB Account #" },
      { key: "liabilityInsurance", label: "Liability Insurance Provider" },
      { key: "specialties", label: "Specialties", type: "multi-select", options: ["General Renovation", "Structural", "Electrical", "Plumbing", "Roofing", "Foundation"] },
      { key: "yearsExperience", label: "Years of Experience", type: "number" },
    ],
  },
  {
    value: "environmental",
    label: "Environmental Assessors",
    icon: Leaf,
    desc: "Phase 1 & 2 ESA, remediation consulting",
    licensingBody: "Ontario Ministry of the Environment",
    credentialFields: [
      { key: "designation", label: "Professional Designation", type: "select", options: ["P.Eng", "P.Geo", "QP (Qualified Person)"] },
      { key: "servicesOffered", label: "Services", type: "multi-select", options: ["Phase 1 ESA", "Phase 2 ESA", "Remediation", "Record of Site Condition", "Risk Assessment"] },
      { key: "yearsExperience", label: "Years of Experience", type: "number" },
    ],
  },
  {
    value: "surveyor",
    label: "Surveyors",
    icon: Ruler,
    desc: "Boundary surveys, topographic surveys, title surveys",
    licensingBody: "Association of Ontario Land Surveyors (AOLS)",
    credentialFields: [
      { key: "licenseNumber", label: "AOLS License #", required: true },
      { key: "servicesOffered", label: "Services", type: "multi-select", options: ["Boundary Survey", "Topographic", "Title", "Construction Layout", "Subdivision"] },
    ],
  },
  {
    value: "insurance",
    label: "Insurance Brokers",
    icon: Shield,
    desc: "Property insurance, title insurance, liability",
    licensingBody: "Registered Insurance Brokers of Ontario (RIBO)",
    credentialFields: [
      { key: "licenseNumber", label: "RIBO License #", required: true },
      { key: "specialties", label: "Specialties", type: "multi-select", options: ["Property Insurance", "Title Insurance", "Commercial", "Liability", "Builder's Risk"] },
      { key: "yearsExperience", label: "Years of Experience", type: "number" },
    ],
  },
];

// Legacy-compatible label/value array for filter dropdowns
export const PARTNER_CATEGORY_VALUES = PARTNER_CATEGORIES_EXTENDED.map(({ value, label, icon }) => ({
  value, label, icon,
}));

export function getPartnerCategory(value) {
  return PARTNER_CATEGORIES_EXTENDED.find((c) => c.value === value) || null;
}

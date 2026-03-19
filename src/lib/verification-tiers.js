// src/lib/verification-tiers.js
// Defines the verification badge system for Sel-Fi profiles.
// These tiers are voluntary trust signals — NOT creditworthiness assessments.
//
// verification_status shape (stored as JSONB on profiles):
// { identity: "none"|"pending"|"verified", funds: "none"|"pending"|"verified", income: "none"|"pending"|"verified" }

export const VERIFICATION_TIERS = {
  identity: {
    key: "identity", label: "Identity Verified", shortLabel: "ID",
    description: "Submitted a valid government-issued photo ID.",
    whatItMeans: "Name and identity confirmed via government-issued photo identification.",
    whatItDoesNot: "Does not verify financial capacity, creditworthiness, or suitability for any transaction.",
    documents: ["Government-issued photo ID (Ontario driver's license, passport, or Ontario photo card)"],
    color: "blue", bgClass: "bg-blue-100 text-blue-700", dotClass: "bg-blue-500",
  },
  funds: {
    key: "funds", label: "Funds Verified", shortLabel: "Funds",
    description: "Submitted proof that down payment funds exist.",
    whatItMeans: "Documentation showing available funds was provided and appeared legitimate at time of review.",
    whatItDoesNot: "Does not verify the amount is sufficient for any specific property.",
    documents: ["Bank statement excerpt showing balance", "Mortgage pre-approval letter", "Lawyer's trust account confirmation"],
    color: "green", bgClass: "bg-green-100 text-green-700", dotClass: "bg-green-500",
  },
  income: {
    key: "income", label: "Income Verified", shortLabel: "Income",
    description: "Submitted documentation of income or employment.",
    whatItMeans: "Income or employment documentation was provided and appeared legitimate at time of review.",
    whatItDoesNot: "Does not verify ongoing employment or ability to service any specific payment.",
    documents: ["CRA Notice of Assessment (1-2 years)", "Letter of employment", "Business registration + NOA (self-employed)"],
    color: "purple", bgClass: "bg-purple-100 text-purple-700", dotClass: "bg-purple-500",
  },
};

export const TIER_ORDER = ["identity", "funds", "income"];

export const DEFAULT_VERIFICATION = { identity: "none", funds: "none", income: "none" };

export function countVerified(status) {
  if (!status) return 0;
  return TIER_ORDER.filter((k) => status[k] === "verified").length;
}

export function getVerificationLevel(status) {
  const n = countVerified(status);
  if (n === 0) return null;
  if (n === 1) return "Basic Verified";
  if (n === 2) return "Verified";
  return "Fully Verified";
}

export function getVerifiedTiers(status) {
  if (!status) return [];
  return TIER_ORDER.filter((k) => status[k] === "verified");
}

export function getPendingTiers(status) {
  if (!status) return [];
  return TIER_ORDER.filter((k) => status[k] === "pending");
}

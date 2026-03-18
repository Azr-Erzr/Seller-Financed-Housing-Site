// src/lib/alias.js
// Generates friendly buyer aliases for privacy-protected profiles.

const ADJECTIVES = [
  "Maple", "Cedar", "Lakeshore", "Summit", "Granite", "Harbour",
  "Oakwood", "Ridgeway", "Brookside", "Pinecrest", "Stonegate", "Birchwood",
  "Westfield", "Eastview", "Northwind", "Southridge", "Clearwater", "Ironwood",
];

/**
 * Generate a random 4-character alphanumeric code.
 */
function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 to avoid confusion
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/**
 * Generate a friendly alias like "Maple Buyer #7K4M"
 * @param {"buyer"|"vendor"} role
 * @returns {string}
 */
export function generateAlias(role = "buyer") {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const label = role === "vendor" ? "Vendor" : "Buyer";
  return `${adj} ${label} #${randomCode()}`;
}

// src/hooks/usePageMeta.js
// Mega-Batch B — Enhanced for full SEO: canonical URL, noindex, JSON-LD.
// Still lightweight (no React Helmet), just DOM manipulation.

import { useEffect } from "react";

const DEFAULT_TITLE = "Sel-Fi — Seller-Financed Real Estate in Ontario";
const DEFAULT_DESC = "Sel-Fi connects property sellers and buyers for direct deals — seller-financed, rent-to-own, and private sale. Ontario, Canada.";
const CANONICAL_BASE = "https://sel-fi.ca";

/**
 * Set page-level SEO metadata.
 * @param {string} title - Page title
 * @param {string} description - Meta description
 * @param {object} [options] - Additional SEO options
 * @param {string} [options.canonical] - Canonical path (e.g. "/about")
 * @param {boolean} [options.noindex] - Set robots noindex
 * @param {object|object[]} [options.jsonLd] - JSON-LD structured data object(s)
 */
export function usePageMeta(title, description, options = {}) {
  useEffect(() => {
    const { canonical, noindex, jsonLd } = options;

    // ── Title ──
    const prevTitle = document.title;
    if (title) document.title = title;

    // ── Meta description ──
    let meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content");
    if (description && meta) meta.setAttribute("content", description);

    // ── OG tags ──
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (title && ogTitle) ogTitle.setAttribute("content", title);
    if (description && ogDesc) ogDesc.setAttribute("content", description);

    // ── Canonical URL ──
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonicalEl?.getAttribute("href");
    if (canonical) {
      const fullUrl = canonical.startsWith("http") ? canonical : `${CANONICAL_BASE}${canonical}`;
      if (canonicalEl) {
        canonicalEl.setAttribute("href", fullUrl);
      } else {
        canonicalEl = document.createElement("link");
        canonicalEl.rel = "canonical";
        canonicalEl.href = fullUrl;
        document.head.appendChild(canonicalEl);
      }
      if (ogUrl) ogUrl.setAttribute("content", fullUrl);
    }

    // ── Noindex ──
    let robotsMeta = document.querySelector('meta[name="robots"]');
    const prevRobots = robotsMeta?.getAttribute("content");
    if (noindex && robotsMeta) {
      robotsMeta.setAttribute("content", "noindex, nofollow");
    }

    // ── JSON-LD ──
    const ldScripts = [];
    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((data) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(data);
        script.dataset.selfiSeo = "true";
        document.head.appendChild(script);
        ldScripts.push(script);
      });
    }

    // ── Cleanup ──
    return () => {
      document.title = prevTitle || DEFAULT_TITLE;
      if (meta && prevDesc) meta.setAttribute("content", prevDesc || DEFAULT_DESC);
      if (ogTitle) ogTitle.setAttribute("content", DEFAULT_TITLE);
      if (ogDesc) ogDesc.setAttribute("content", DEFAULT_DESC);
      if (canonicalEl && prevCanonical) canonicalEl.setAttribute("href", prevCanonical);
      if (ogUrl) ogUrl.setAttribute("content", `${CANONICAL_BASE}/`);
      if (robotsMeta && prevRobots) robotsMeta.setAttribute("content", prevRobots);
      ldScripts.forEach((s) => s.remove());
    };
  }, [title, description, options.canonical, options.noindex, options.jsonLd]);
}

// ── Pre-built page meta ─────────────────────────────────────────────
export const PAGE_META = {
  home:         { title: "Sel-Fi — Seller-Financed Homes in Ontario",           desc: "Sell direct. Save on commissions. Earn interest. Seller-financed, rent-to-own, and private sale homes in Ontario." },
  businessHome: { title: "Sel-Fi Business — Commercial & Land Deals",           desc: "Seller-financed commercial properties, land, farms, and development parcels. Direct from vendor. Ontario, Canada." },
  about:        { title: "About Sel-Fi — Direct Real Estate, Agent-Optional",   desc: "Sel-Fi facilitates introductions between property sellers and buyers. Agent-optional, bank-optional." },
  howItWorks:   { title: "How Sel-Fi Works — Step by Step",                     desc: "How seller financing works in Ontario. Steps for sellers and buyers, legal framework, and risk awareness." },
  guide:        { title: "The Sel-Fi Guide — Seller Financing Education",       desc: "Everything you need to understand seller financing, VTB mortgages, rent-to-own, and private sales in Ontario." },
  listings:     { title: "Browse Homes — Sel-Fi",                               desc: "Seller-financed homes available in Ontario. Filter by price, deal type, and location." },
  bizListings:  { title: "Browse Properties — Sel-Fi Business",                 desc: "Seller-financed commercial properties, land, and farms in Ontario." },
  partners:     { title: "Professional Partners — Sel-Fi",                      desc: "Real estate lawyers, home inspectors, and mortgage brokers who work with seller-financed deals." },
  pricing:      { title: "Pricing — Sel-Fi",                                    desc: "Flat-fee listing plans for sellers and premium profiles for partners. No commissions." },
  saved:        { title: "My Saved — Sel-Fi",                                   desc: "Your bookmarked listings and buyer profiles." },
  account:      { title: "My Account — Sel-Fi",                                 desc: "Manage your Sel-Fi account, saved searches, and preferences." },
  terms:        { title: "Terms of Use — Sel-Fi",                               desc: "Terms governing the use of the Sel-Fi marketplace." },
  privacy:      { title: "Privacy Policy — Sel-Fi",                             desc: "How Sel-Fi collects, uses, and protects your personal information. PIPEDA-compliant." },
  accessibility:{ title: "Accessibility — Sel-Fi",                              desc: "Sel-Fi's commitment to accessibility under Ontario's AODA." },
};

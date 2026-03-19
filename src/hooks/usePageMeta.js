// src/hooks/usePageMeta.js
// Lightweight page-level SEO — sets document.title and meta description.
// No external dependencies (no React Helmet needed).
//
// Usage:
//   import { usePageMeta } from "../hooks/usePageMeta";
//   usePageMeta("About — Sel-Fi", "Learn how Sel-Fi connects sellers and buyers directly.");
//
// On unmount, title reverts to the default.

import { useEffect } from "react";

const DEFAULT_TITLE = "Sel-Fi — Seller-Financed Real Estate in Ontario";
const DEFAULT_DESC  = "Sel-Fi connects property sellers and buyers for direct deals — seller-financed, rent-to-own, and private sale. Ontario, Canada.";

export function usePageMeta(title, description) {
  useEffect(() => {
    // Set title
    const prev = document.title;
    if (title) document.title = title;

    // Set meta description
    let meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content");
    if (description && meta) {
      meta.setAttribute("content", description);
    }

    // Set og:title and og:description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc  = document.querySelector('meta[property="og:description"]');
    if (title && ogTitle) ogTitle.setAttribute("content", title);
    if (description && ogDesc) ogDesc.setAttribute("content", description);

    return () => {
      document.title = prev || DEFAULT_TITLE;
      if (meta && prevDesc) meta.setAttribute("content", prevDesc || DEFAULT_DESC);
      if (ogTitle) ogTitle.setAttribute("content", DEFAULT_TITLE);
      if (ogDesc) ogDesc.setAttribute("content", DEFAULT_DESC);
    };
  }, [title, description]);
}

// Pre-built page meta for common pages — import and spread
export const PAGE_META = {
  home:         { title: "Sel-Fi — Seller-Financed Homes in Ontario",           desc: "Sell direct. Save on commissions. Earn interest. Seller-financed, rent-to-own, and private sale homes in Ontario." },
  businessHome: { title: "Sel-Fi Business — Commercial & Land Deals",           desc: "Seller-financed commercial properties, land, farms, and development parcels. Direct from vendor. Ontario, Canada." },
  about:        { title: "About Sel-Fi — Direct Real Estate, Agent-Optional",   desc: "Sel-Fi facilitates introductions between property sellers and buyers. Agent-optional, bank-optional." },
  howItWorks:   { title: "How Sel-Fi Works — Step by Step",                     desc: "How seller financing works in Ontario. Steps for sellers and buyers, legal framework, and risk awareness." },
  guide:        { title: "The Sel-Fi Guide — Seller Financing Education",       desc: "Everything you need to understand seller financing, VTB mortgages, rent-to-own, and private sales in Ontario." },
  listings:     { title: "Browse Homes — Sel-Fi",                               desc: "Seller-financed homes available in Ontario. Filter by price, deal type, and location." },
  bizListings:  { title: "Browse Properties — Sel-Fi Business",                 desc: "Seller-financed commercial properties, land, and farms in Ontario." },
  partners:     { title: "Professional Partners — Sel-Fi",                      desc: "Real estate lawyers, home inspectors, and mortgage brokers who work with seller-financed deals." },
  saved:        { title: "My Saved — Sel-Fi",                                   desc: "Your bookmarked listings and buyer profiles." },
  account:      { title: "My Account — Sel-Fi",                                 desc: "Manage your Sel-Fi account, saved searches, and preferences." },
  terms:        { title: "Terms of Use — Sel-Fi",                               desc: "Terms governing the use of the Sel-Fi marketplace." },
  privacy:      { title: "Privacy Policy — Sel-Fi",                             desc: "How Sel-Fi collects, uses, and protects your personal information. PIPEDA-compliant." },
  accessibility:{ title: "Accessibility — Sel-Fi",                              desc: "Sel-Fi's commitment to accessibility under Ontario's AODA." },
};

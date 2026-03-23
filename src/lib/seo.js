// src/lib/seo.js
// Mega-Batch B — JSON-LD structured data generators.
// Each returns a plain object ready for JSON.stringify in usePageMeta's jsonLd option.

const SITE_URL = "https://sel-fi.ca";
const SITE_NAME = "Sel-Fi";
const LOGO_URL = `${SITE_URL}/favicon.svg`;

// ── Organization (homepage) ──────────────────────────────────────────
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    description:
      "Sel-Fi is a marketplace for direct and flexible real estate transactions in Ontario. Seller-financed, rent-to-own, and private sale.",
    sameAs: [],
    areaServed: {
      "@type": "State",
      name: "Ontario",
      containedInPlace: { "@type": "Country", name: "Canada" },
    },
  };
}

// ── WebSite (homepage — enables sitelinks search box) ────────────────
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/listings?location={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// ── BreadcrumbList ───────────────────────────────────────────────────
// items: [{ name, path }] — e.g. [{ name: "Guide", path: "/guide" }, { name: "Article Title", path: "/guide/article-id" }]
export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    ],
  };
}

// ── Article (guide articles) ─────────────────────────────────────────
export function articleSchema({ title, description, path, datePublished, dateModified, readTime }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description || "",
    url: `${SITE_URL}${path}`,
    datePublished: datePublished || "2026-03-01",
    dateModified: dateModified || "2026-03-23",
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: LOGO_URL } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${path}` },
    ...(readTime ? { timeRequired: `PT${parseInt(readTime)}M` } : {}),
  };
}

// ── FAQ (HowItWorks, Pricing, guide articles with Q&A) ──────────────
// faqs: [{ question, answer }]
export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

// ── RealEstateListing (listing detail pages) ─────────────────────────
export function listingSchema(listing) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.description || "",
    url: `${SITE_URL}/listings/${listing.id}`,
    ...(listing.image ? { image: listing.image } : {}),
    ...(listing.price
      ? {
          offers: {
            "@type": "Offer",
            price: listing.price,
            priceCurrency: "CAD",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address || "",
      addressLocality: listing.city || "",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    ...(listing.lat && listing.lng
      ? { geo: { "@type": "GeoCoordinates", latitude: listing.lat, longitude: listing.lng } }
      : {}),
    ...(listing.bedrooms ? { numberOfRooms: listing.bedrooms } : {}),
    ...(listing.sqft
      ? { floorSize: { "@type": "QuantitativeValue", value: listing.sqft, unitCode: "FTK" } }
      : {}),
  };
}

// ── Commercial listing (business detail pages) ───────────────────────
export function commercialListingSchema(listing) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.description || "",
    url: `${SITE_URL}/business/listings/${listing.id}`,
    ...(listing.image ? { image: listing.image } : {}),
    ...(listing.price
      ? {
          offers: {
            "@type": "Offer",
            price: listing.price,
            priceCurrency: "CAD",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address || "",
      addressLocality: listing.city || "",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    ...(listing.lat && listing.lng
      ? { geo: { "@type": "GeoCoordinates", latitude: listing.lat, longitude: listing.lng } }
      : {}),
  };
}

// ── Local content page (city pages) ──────────────────────────────────
export function cityPageSchema({ city, path, description }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Seller Financing in ${city} — Sel-Fi`,
    description,
    url: `${SITE_URL}${path}`,
    about: {
      "@type": "City",
      name: city,
      containedInPlace: { "@type": "State", name: "Ontario" },
    },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

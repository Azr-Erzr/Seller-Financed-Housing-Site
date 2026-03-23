// src/pages/business/CategoryPage.jsx
// Mega-Batch C (Batch 18c) — Category-specific landing pages.
// Route: /business/category/:slug — e.g. /business/category/medical-office
// Shows: category description, highlights, filtered listings, partner recommendations.

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CATEGORY_PAGES, COMMERCIAL_CATEGORIES, getCategoryColorExtended } from "../../data/commercial-categories";
import { getAllCommListings } from "../../lib/commercial-storage";
import CommListingCard from "../../components/business/CommListingCard";
import { usePageMeta } from "../../hooks/usePageMeta";
import { breadcrumbSchema } from "../../lib/seo";
import { ArrowLeft, ArrowRight, Check, Building2 } from "lucide-react";

export default function CategoryPage() {
  const { slug } = useParams();
  const [listings, setListings] = useState([]);

  // Find the category page data
  const pageData = Object.entries(CATEGORY_PAGES).find(([, v]) => v.slug === slug);
  const categoryValue = pageData?.[0];
  const page = pageData?.[1];

  // Find category metadata
  const categoryMeta = COMMERCIAL_CATEGORIES.find((c) => c.value === categoryValue);
  const CategoryIcon = categoryMeta?.icon || Building2;
  const categoryColor = categoryMeta?.color || "#059669";

  useEffect(() => {
    if (!categoryValue) return;
    getAllCommListings().then((all) => {
      const filtered = all.filter((l) => l.propertyCategory === categoryValue).slice(0, 6);
      setListings(filtered);
    });
  }, [categoryValue]);

  const pageTitle = page ? page.title : "Category Not Found";
  const pageDesc = page?.metaDesc || "";

  usePageMeta(pageTitle, pageDesc, {
    canonical: page ? `/business/category/${slug}` : undefined,
    jsonLd: page
      ? [breadcrumbSchema([
          { name: "Business", path: "/business" },
          { name: "Properties", path: "/business/listings" },
          { name: categoryMeta?.label || categoryValue, path: `/business/category/${slug}` },
        ])]
      : undefined,
  });

  if (!page) {
    return (
      <div className="py-20 text-center text-gray-500">
        Category not found.{" "}
        <Link to="/business/listings" className="text-emerald-600 underline">Browse All Properties</Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className={`bg-gradient-to-br ${page.heroColor} py-14 sm:py-20`}>
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/business/listings" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Browse All Properties
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <CategoryIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/70 font-medium">Sel-Fi Business</p>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">{categoryMeta?.label || categoryValue}</h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-white/80 max-w-3xl mt-4">
            {page.intro}
          </p>
        </div>
      </section>

      {/* Highlights */}
      {page.highlights?.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Why This Category Works for Vendor Financing
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {page.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Listings */}
      {listings.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Available {categoryMeta?.label || ""} Properties
              </h2>
              <Link to="/business/listings" className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((l) => (
                <CommListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {listings.length === 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-gray-500 mb-4">No {categoryMeta?.label} listings available yet.</p>
            <Link to="/business/list-property"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors">
              List a {categoryMeta?.label} Property
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Have a {categoryMeta?.label} property to sell?
          </h2>
          <p className="text-gray-500 mb-6 max-w-xl mx-auto">
            List it directly on Sel-Fi Business. Reach buyers who understand vendor financing
            and are ready to close without bank delays.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/business/list-property"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors">
              List a Property
            </Link>
            <Link to="/partners"
              className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold rounded-xl transition-colors">
              Find a Professional
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="border-t border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            Sel-Fi facilitates introductions only — not a mortgage broker, real estate agent, or legal advisor.
            Consult a licensed Ontario real estate lawyer before entering any agreement. Category information
            is for educational purposes and may not reflect current market conditions.
          </p>
        </div>
      </div>
    </div>
  );
}

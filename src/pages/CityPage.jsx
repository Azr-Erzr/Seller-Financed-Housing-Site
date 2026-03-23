// src/pages/CityPage.jsx
// Mega-Batch B — Template-driven city landing page.
// Route: /city/:slug — e.g. /city/toronto, /city/oshawa
// Each page shows: city description, why seller financing works here,
// filtered listings, related guide articles, and local context.

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCityBySlug } from "../data/city-data";
import { getArticleById } from "../data/guide-articles";
import { getAllListings } from "../lib/storage";
import { useSite } from "../context/SiteContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { cityPageSchema, breadcrumbSchema } from "../lib/seo";
import ListingCard from "../components/ListingCard";
import { MapPin, ArrowRight, BookOpen, Home, Check, ArrowLeft } from "lucide-react";

export default function CityPage() {
  const { slug } = useParams();
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  const city = getCityBySlug(slug);

  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (!city) return;
    getAllListings().then((all) => {
      const cityListings = all.filter((l) =>
        l.city?.toLowerCase() === city.name.toLowerCase()
      ).slice(0, 6);
      setListings(cityListings);
    });
  }, [city]);

  const pageTitle = city ? `Seller Financing in ${city.name} — Sel-Fi` : "City Not Found";
  const pageDesc = city?.description?.slice(0, 160) || "";

  usePageMeta(pageTitle, pageDesc, {
    canonical: city ? `/city/${slug}` : undefined,
    jsonLd: city
      ? [
          cityPageSchema({ city: city.name, path: `/city/${slug}`, description: pageDesc }),
          breadcrumbSchema([{ name: "Cities", path: "/city" }, { name: city.name, path: `/city/${slug}` }]),
        ]
      : undefined,
  });

  if (!city) {
    return (
      <div className="py-20 text-center text-gray-500">
        City not found.{" "}
        <Link to="/" className="text-blue-600 underline">Back to Home</Link>
      </div>
    );
  }

  const accent = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-600" : "bg-blue-600";
  const heroBg = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const ctaBg = isBusiness ? "bg-amber-500 hover:bg-amber-600" : "bg-orange-500 hover:bg-orange-600";

  const relatedArticles = (city.relatedArticles || [])
    .map((id) => getArticleById(id))
    .filter(Boolean);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className={`bg-gradient-to-br ${heroBg} py-14 sm:py-20`}>
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Sel-Fi
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-white/80" />
            <span className="text-sm text-white/70 font-medium">{city.region}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4" style={{ color: "#fff" }}>
            Seller Financing in {city.name}
          </h1>
          <p className="text-base sm:text-lg max-w-3xl" style={{ color: isBusiness ? "#a7f3d0" : "#bfdbfe" }}>
            {city.description}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-white/10 rounded-lg px-4 py-2 text-sm text-white">
              Population: <strong>{city.population}</strong>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2 text-sm text-white">
              Avg. Home Price: <strong>{city.avgHomePrice}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Why seller financing works here */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-1 h-6 rounded-full ${accentBg}`} />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Why Seller Financing Works in {city.name}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {city.whySellerFinance.map((reason, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <Check className={`w-5 h-5 ${accent} shrink-0 mt-0.5`} />
                <p className="text-sm text-gray-700 leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
          {city.localContext && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Local Market Context</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{city.localContext}</p>
            </div>
          )}
        </div>
      </section>

      {/* Listings in this city */}
      {listings.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Available in {city.name}
              </h2>
              <Link to={`/listings?location=${encodeURIComponent(city.name)}`}
                className={`text-sm font-medium ${accent} flex items-center gap-1`}>
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related guide articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className={`w-5 h-5 ${accent}`} />
              <h2 className="text-xl font-bold text-gray-900">Helpful Guides</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedArticles.map((article) => (
                <Link key={article.id} to={`/guide/${article.id}`}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${article.categoryColor} min-h-auto`}>
                    {article.category}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 mt-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Neighbourhoods */}
      {city.neighborhoodHighlights?.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Neighbourhoods in {city.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {city.neighborhoodHighlights.map((n) => (
                <span key={n} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to explore {city.name}?
          </h2>
          <p className="text-gray-500 mb-6">
            Browse available seller-financed properties or list your own home directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/listings" className={`px-6 py-3 rounded-xl text-white font-semibold ${ctaBg} transition-colors`}>
              Browse Homes in {city.name}
            </Link>
            <Link to="/map" className={`px-6 py-3 rounded-xl border-2 font-semibold transition-colors ${
              isBusiness ? "border-emerald-600 text-emerald-600 hover:bg-emerald-50" : "border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}>
              View on Map
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="border-t border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            Market data is approximate and may not reflect current conditions. Average home prices
            are based on publicly available data and are provided for illustration only. Always consult
            a licensed Ontario real estate lawyer before entering any agreement. Sel-Fi facilitates
            introductions only — not a mortgage broker, real estate agent, or legal advisor.
          </p>
        </div>
      </div>
    </div>
  );
}

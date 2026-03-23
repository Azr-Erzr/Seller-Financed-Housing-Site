// src/pages/TopicCluster.jsx
// Mega-Batch B — SEO hub page for topic clusters.
// Route: /topics/:slug — e.g. /topics/seller-financing-ontario
// Includes: article sections, FAQ accordion with JSON-LD, related links,
// internal links to guides/tools/cities.

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTopicBySlug } from "../data/topic-clusters";
import { getArticleById } from "../data/guide-articles";
import { getCityBySlug } from "../data/city-data";
import { useSite } from "../context/SiteContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { faqSchema, breadcrumbSchema } from "../lib/seo";
import {
  ArrowLeft, ArrowRight, BookOpen, Wrench, MapPin, ChevronDown, ChevronUp,
} from "lucide-react";

function FAQAccordion({ faqs, accent }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
            {openIdx === i
              ? <ChevronUp className={`w-4 h-4 ${accent} shrink-0`} />
              : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
            }
          </button>
          {openIdx === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TopicCluster() {
  const { slug } = useParams();
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  const topic = getTopicBySlug(slug);

  const pageTitle = topic ? `${topic.title} — Sel-Fi` : "Topic Not Found";
  const pageDesc = topic?.metaDesc || "";

  const jsonLdItems = [];
  if (topic) {
    jsonLdItems.push(breadcrumbSchema([{ name: "Topics", path: "/topics" }, { name: topic.title, path: `/topics/${slug}` }]));
    if (topic.faqs?.length) jsonLdItems.push(faqSchema(topic.faqs));
  }

  usePageMeta(pageTitle, pageDesc, {
    canonical: topic ? `/topics/${slug}` : undefined,
    jsonLd: jsonLdItems.length ? jsonLdItems : undefined,
  });

  if (!topic) {
    return (
      <div className="py-20 text-center text-gray-500">
        Topic not found.{" "}
        <Link to="/" className="text-blue-600 underline">Back to Home</Link>
      </div>
    );
  }

  const accent = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-600" : "bg-blue-600";
  const ctaBg = isBusiness ? "bg-amber-500 hover:bg-amber-600" : "bg-orange-500 hover:bg-orange-600";

  const relatedArticles = (topic.relatedArticles || []).map((id) => getArticleById(id)).filter(Boolean);
  const relatedCities = (topic.relatedCities || []).map((s) => getCityBySlug(s)).filter(Boolean);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className={`bg-gradient-to-br ${topic.heroColor} py-14 sm:py-20`}>
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Sel-Fi
          </Link>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4" style={{ color: "#fff" }}>
            {topic.title}
          </h1>
          <p className="text-base sm:text-lg max-w-3xl" style={{ color: "#e2e8f0" }}>
            {topic.subtitle}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gray-700 leading-relaxed text-base">{topic.description}</p>
        </div>
      </section>

      {/* Content sections */}
      <section className="pb-12">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          {topic.sections.map((section, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-1 h-6 rounded-full ${accentBg}`} />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{section.heading}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {topic.faqs?.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <FAQAccordion faqs={topic.faqs} accent={accent} />
          </div>
        </section>
      )}

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className={`w-5 h-5 ${accent}`} />
              <h2 className="text-xl font-bold text-gray-900">Related Guides</h2>
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
                  <p className="text-xs text-gray-500 mt-1">{article.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related tools */}
      {topic.relatedTools?.length > 0 && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className={`w-5 h-5 ${accent}`} />
              <h2 className="text-lg font-bold text-gray-900">Interactive Tools</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {topic.relatedTools.map((path) => (
                <Link key={path} to={path}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    isBusiness ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50" : "border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}>
                  {path.split("/").pop().replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related cities */}
      {relatedCities.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className={`w-5 h-5 ${accent}`} />
              <h2 className="text-lg font-bold text-gray-900">Explore by City</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {relatedCities.map((city) => (
                <Link key={city.slug} to={`/city/${city.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:shadow-sm transition-shadow">
                  {city.name} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link to={topic.ctaPath}
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold ${ctaBg} transition-colors`}>
            {topic.ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="border-t border-gray-100 py-6">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            This content is for educational purposes only and does not constitute legal, financial, or
            mortgage advice. Consult a licensed Ontario real estate lawyer before entering any agreement.
            Sel-Fi facilitates introductions only — not a mortgage broker, real estate agent, or legal advisor.
          </p>
        </div>
      </div>
    </div>
  );
}

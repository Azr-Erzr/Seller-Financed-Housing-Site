// src/pages/GuideArticle.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { getArticleById, ARTICLES } from "../data/guide-articles";
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react";

export default function GuideArticle() {
  const { id } = useParams();
  const article = getArticleById(id);

  if (!article) {
    return (
      <div className="py-20 text-center text-gray-500">
        Article not found. <Link to="/guide" className="text-blue-600 underline">Back to Guide</Link>
      </div>
    );
  }

  const currentIndex = ARTICLES.findIndex((a) => a.id === id);
  const prev = ARTICLES[currentIndex - 1];
  const next = ARTICLES[currentIndex + 1];

  return (
    <div className="bg-white">

      {/* Hero */}
      <div className={`bg-gradient-to-br ${article.heroColor} py-16`}>
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/guide" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to LandMatch Guide
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${article.categoryColor}`}>
              {article.category}
            </span>
            <span className="text-white/60 text-xs flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{color:"#fff"}}>{article.title}</h1>
          <p className="text-lg" style={{color:"rgba(255,255,255,0.75)"}}>{article.subtitle}</p>
        </div>
      </div>

      {/* Summary box */}
      <div className="max-w-3xl mx-auto px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Quick Summary</p>
              <p className="text-gray-700 leading-relaxed">{article.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-10">
          {article.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
              <div className="prose prose-gray max-w-none">
                {section.body.split("\n\n").map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
          <strong>Disclaimer:</strong> This guide is for educational purposes only and does not constitute legal, financial, or mortgage advice.
          Seller-financed transactions are legally complex. Always consult a licensed real estate lawyer and, where appropriate, an accountant
          or mortgage professional before entering any agreement. LandMatch facilitates introductions only — all legal and financial decisions
          are yours to make with qualified professionals.
        </div>

        {/* CTA */}
        {article.cta && (
          <div className="mt-8 text-center">
            <Link to={article.cta.href}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              {article.cta.label} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Related articles nav */}
      <div className="border-t border-gray-100 bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">Continue Reading</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {prev && (
              <Link to={`/guide/${prev.id}`} className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Previous</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{prev.title}</p>
                </div>
              </Link>
            )}
            {next && (
              <Link to={`/guide/${next.id}`} className="group flex items-center justify-end gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow sm:text-right">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Next</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{next.title}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors shrink-0" />
              </Link>
            )}
          </div>
          <div className="text-center mt-6">
            <Link to="/guide" className="text-sm text-blue-600 hover:underline">← View all guides</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/pages/Guide.jsx — LandMatch educational content hub
import React from "react";
import { Link } from "react-router-dom";
import { ARTICLES } from "../data/guide-articles";
import SavingsCalculator from "../components/SavingsCalculator";
import { ArrowRight, BookOpen } from "lucide-react";

export default function Guide() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            <BookOpen className="w-4 h-4" /> LandMatch Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color:"#fff"}}>
            Everything You Need to Know
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{color:"#bfdbfe"}}>
            Seller financing is unfamiliar to most people — and that's exactly why we wrote this.
            Plain-English guides, real numbers, and honest explanations of how this works and why it's worth it.
          </p>
        </div>
      </section>

      {/* Value proposition summary cards */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: "💸",
                stat: "$30,000–$45,000",
                label: "Typical commission savings",
                sub: "on a $600K–$900K home vs. traditional sale",
              },
              {
                icon: "🏦",
                stat: "5–12%",
                label: "Interest income for sellers",
                sub: "earned on the VTB mortgage they hold",
              },
              {
                icon: "🔑",
                stat: "No bank. No formula.",
                label: "Buyers qualify on their full story",
                sub: "self-employed, new to Canada, unconventional income",
              },
            ].map(({ icon, stat, label, sub }) => (
              <div key={label} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <div className="text-3xl mb-3">{icon}</div>
                <p className="text-2xl font-extrabold text-gray-900 mb-1">{stat}</p>
                <p className="font-semibold text-gray-700 text-sm mb-1">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Article grid */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Read the Guides</h2>
          <p className="text-gray-500 mb-10">Everything from the basics to advanced deal structures, explained clearly.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((article) => (
              <Link key={article.id} to={`/guide/${article.id}`} className="group block">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
                  {/* Color header */}
                  <div className={`h-24 bg-gradient-to-br ${article.heroColor} flex items-center justify-center`}>
                    <span className="text-5xl">{article.icon}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${article.categoryColor}`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-400">{article.readTime}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                      Read more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Savings calculator section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Run Your Own Numbers</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              See exactly what you'd save as a seller — or compare VTB and bank mortgage costs as a buyer.
            </p>
          </div>
          <SavingsCalculator />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{color:"#fff"}}>Ready to Make Your Move?</h2>
          <p className="mb-8" style={{color:"#bfdbfe"}}>
            Now that you understand how it works — list your home, create a buyer profile, or find a lawyer to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/list-home" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">List Your Home</Link>
            <Link to="/create-profile" className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">Create Buyer Profile</Link>
            <Link to="/partners?category=lawyer" className="px-8 py-3 border border-white/40 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">Find a Lawyer</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

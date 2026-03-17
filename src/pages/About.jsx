// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Shield, Users, TrendingUp, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5" style={{ color: "#ffffff" }}>
            About HomeMatch
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#bfdbfe" }}>
            We built HomeMatch because the traditional mortgage system locks out too many good people
            from homeownership — and leaves too many sellers with no good way to pass on property
            they've spent a lifetime building equity in.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem We're Solving</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Banks approve or reject buyers based on rigid formulas — credit scores, employment type,
                income documentation. They don't account for context. A self-employed person with real
                income gets rejected. A family that's been saving for years can't qualify because they
                can't show two years of T4s.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Meanwhile, sellers — especially older homeowners who've owned their homes outright for
                decades — have no good platform to find the right buyer. They end up on Facebook
                Marketplace, or listing with an agent who pushes them toward a conventional sale,
                even though holding the mortgage themselves would earn them far better returns.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Seller financing — also called a Vendor Take-Back (VTB) mortgage — solves both problems.
                The seller becomes the bank. The buyer gets a path to ownership that the traditional
                system closed. Terms are negotiated directly, human to human.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The problem is there's never been a dedicated, safe, organized place to make these
                connections. Until now.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-blue-600" />,   bg: "bg-blue-100",   title: "Trust & Safety",  text: "Verified profiles, NDA-protected documents, and transparent terms before any conversation happens." },
              { icon: <Users  className="w-6 h-6 text-green-600" />,  bg: "bg-green-100",  title: "Access",          text: "Homeownership should not be gated by a bank's algorithm. We create a path for people who've been shut out." },
              { icon: <TrendingUp className="w-6 h-6 text-orange-600" />, bg: "bg-orange-100", title: "Fairness",    text: "No realtors taking commissions on both sides. No outside investors inflating prices. Direct deals between people." },
              { icon: <Heart  className="w-6 h-6 text-purple-600" />, bg: "bg-purple-100", title: "Community",       text: "Housing moves wealth between generations. We want that movement to stay local and benefit real people." },
            ].map(({ icon, bg, title, text }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Are & Aren't */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What HomeMatch Is — and Isn't</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-green-800 mb-4">✓ What we are</h3>
              <ul className="space-y-2.5 text-sm text-green-700">
                <li>A marketplace connecting sellers and buyers directly</li>
                <li>A matching system that surfaces compatible deals</li>
                <li>A safe space with NDA-protected document sharing</li>
                <li>A tool for organizing and comparing deal terms</li>
                <li>A home for private sales, rent-to-own, and seller-finance deals</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-semibold text-red-800 mb-4">✗ What we are not</h3>
              <ul className="space-y-2.5 text-sm text-red-700">
                <li>A licensed mortgage broker or lender</li>
                <li>A law firm or legal advisor</li>
                <li>A financial advisor</li>
                <li>A guarantor of any transaction</li>
                <li>A title search or due diligence service</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800 leading-relaxed">
            <strong>Important:</strong> Seller-financed real estate transactions are legally complex.
            We strongly recommend that both parties engage a real estate lawyer before signing any agreement.
            HomeMatch facilitates introductions and deal discovery — the legal and financial due diligence is yours to complete.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#ffffff" }}>Ready to Get Started?</h2>
          <p className="mb-8" style={{ color: "#bfdbfe" }}>
            Whether you own a home and want to pass it on your terms, or you're a buyer who's been
            shut out by the banks — there's a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/list-home"      className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">List Your Home</Link>
            <Link to="/create-profile" className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">Create Buyer Profile</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

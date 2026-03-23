// src/pages/tools/BuyerReadiness.jsx
// Batch 11 — "Am I ready for seller financing?" diagnostic tool.
// Educational only — NOT a financial assessment. Explicit disclaimers throughout.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import { usePageMeta } from "../../hooks/usePageMeta";
import {
  CheckCircle, XCircle, AlertTriangle, ArrowRight, ArrowLeft,
  DollarSign, Briefcase, Home, Shield, HelpCircle, RotateCcw
} from "lucide-react";

const QUESTIONS = [
  {
    id: "income",
    question: "Do you have a stable source of income?",
    hint: "Employment, self-employment, pension, investment income, etc.",
    icon: Briefcase,
    options: [
      { label: "Yes — steady employment or reliable self-employment income", score: 2, flag: null },
      { label: "Yes — but it's variable (commissions, gig work, seasonal)", score: 1, flag: "variable" },
      { label: "Currently between jobs or income is uncertain", score: 0, flag: "noIncome" },
    ],
  },
  {
    id: "downPayment",
    question: "Do you have funds available for a down payment?",
    hint: "Seller-financed deals typically require 10–30% down.",
    icon: DollarSign,
    options: [
      { label: "Yes — I have 20% or more of my target price saved", score: 2, flag: null },
      { label: "I have 10–20% saved", score: 1, flag: null },
      { label: "I have less than 10% or no savings for a down payment", score: 0, flag: "lowDown" },
    ],
  },
  {
    id: "monthlyBudget",
    question: "Can you afford monthly mortgage payments with room to spare?",
    hint: "VTB rates are typically 5–12%, higher than bank rates. Use our calculator to estimate.",
    icon: Home,
    options: [
      { label: "Yes — payments would be well within my budget (under 30% of income)", score: 2, flag: null },
      { label: "It would be tight but manageable (30–40% of income)", score: 1, flag: "tight" },
      { label: "It would stretch my budget significantly (over 40%)", score: 0, flag: "stretched" },
    ],
  },
  {
    id: "bankSituation",
    question: "What's your situation with traditional bank financing?",
    hint: "Understanding why helps determine if VTB is the right alternative.",
    icon: Shield,
    options: [
      { label: "I was declined — self-employed, newcomer, or non-standard income", score: 2, flag: "goodFit" },
      { label: "I haven't tried — I'm exploring all options", score: 1, flag: null },
      { label: "I was declined due to debt levels or credit issues", score: 1, flag: "debtIssue" },
      { label: "I can get bank financing — just comparing options", score: 0, flag: "hasBank" },
    ],
  },
  {
    id: "legalReady",
    question: "Are you prepared to engage a real estate lawyer?",
    hint: "Every VTB deal requires a lawyer. This is non-negotiable.",
    icon: Shield,
    options: [
      { label: "Yes — I understand I'll need legal representation", score: 2, flag: null },
      { label: "I hadn't thought about that but I'm open to it", score: 1, flag: null },
      { label: "I'd prefer to do this without a lawyer", score: 0, flag: "noLawyer" },
    ],
  },
  {
    id: "timeline",
    question: "What's your timeline for buying?",
    hint: "VTB deals can close faster than bank deals, but due diligence still takes time.",
    icon: HelpCircle,
    options: [
      { label: "Within 3–6 months — I'm actively looking", score: 2, flag: null },
      { label: "Within a year — exploring my options", score: 1, flag: null },
      { label: "No firm timeline — just learning for now", score: 0, flag: null },
    ],
  },
];

const FLAGS = {
  noIncome:   { type: "warning", text: "Without stable income, making consistent monthly payments will be very difficult. Seller financing doesn't bypass the need for real affordability." },
  lowDown:    { type: "warning", text: "Most sellers require 10–30% down as security. Building your down payment first may be a necessary step." },
  tight:      { type: "caution", text: "If payments would be tight, factor in property taxes, insurance, maintenance, and a financial buffer. VTB rates are higher than bank rates." },
  stretched:  { type: "warning", text: "If a VTB payment would stretch your budget past 40% of income, this is a significant financial risk. Consider whether the timing is right." },
  debtIssue:  { type: "caution", text: "If debt levels are the issue, seller financing won't reduce your overall obligations — it adds a new one. Consider whether reducing existing debt first would put you in a stronger position." },
  noLawyer:   { type: "warning", text: "A real estate lawyer is required for every VTB transaction in Ontario. The mortgage registration, title transfer, and agreement drafting all require legal expertise. This is non-negotiable." },
  hasBank:    { type: "info",    text: "If you can qualify for bank financing, compare the total cost carefully. Bank rates are typically lower than VTB rates. Seller financing is most valuable when traditional options aren't available." },
  goodFit:    { type: "positive",text: "Self-employed buyers, newcomers, and people with non-standard income are often strong candidates for seller financing — you have real income that a bank's formula doesn't capture well." },
  variable:   { type: "caution", text: "Variable income can work with seller financing, but you'll need to demonstrate to the seller that your average income supports the payments. Documentation like CRA Notices of Assessment can help." },
};

export default function BuyerReadiness() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  usePageMeta("Buyer Readiness Diagnostic — Sel-Fi", "An interactive self-assessment to help you understand if seller financing may be right for your situation.");

  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone]       = useState(false);

  const primary   = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const accent    = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg  = isBusiness ? "bg-emerald-50" : "bg-blue-50";
  const heroBg    = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";

  const handleAnswer = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setTimeout(() => setDone(true), 200);
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setDone(false); };

  const totalScore = Object.values(answers).reduce((s, a) => s + a.score, 0);
  const maxScore   = QUESTIONS.length * 2;
  const pct        = Math.round((totalScore / maxScore) * 100);
  const flags      = Object.values(answers).filter((a) => a.flag).map((a) => FLAGS[a.flag]).filter(Boolean);

  const getResult = () => {
    if (pct >= 75) return { level: "strong", color: "text-green-600", bg: "bg-green-50 border-green-200", title: "You may be well-positioned for seller financing", body: "Based on your responses, your financial situation and readiness level align well with what seller-financed deals typically require. The next step is to browse listings and connect with a real estate lawyer." };
    if (pct >= 45) return { level: "moderate", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", title: "Seller financing may work — with preparation", body: "Your situation has some strong elements but also areas that may need attention before proceeding. Review the specific notes below, and consider speaking with a real estate lawyer about your options." };
    return { level: "early", color: "text-red-600", bg: "bg-red-50 border-red-200", title: "You may want to prepare further before pursuing seller financing", body: "Based on your responses, there are foundational areas (income stability, down payment, budget capacity) that may need strengthening first. Seller financing doesn't bypass the need for genuine affordability — it provides a different path when traditional financing doesn't fit." };
  };

  const q = QUESTIONS[step];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className={`bg-gradient-to-br ${heroBg} py-12`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#fff" }}>
            Am I Ready for Seller Financing?
          </h1>
          <p className="text-lg" style={{ color: isBusiness ? "#a7f3d0" : "#bfdbfe" }}>
            A quick self-assessment to help you think through your readiness.
            This is educational — not financial advice.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {!done ? (
          <>
            {/* Progress */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${isBusiness ? "bg-emerald-500" : "bg-blue-500"}`}
                  style={{ width: `${((step + (answers[q?.id] ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 font-medium">{step + 1} / {QUESTIONS.length}</span>
            </div>

            {/* Question */}
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${accentBg} ${accent} flex items-center justify-center shrink-0`}>
                  <q.icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{q.question}</h2>
                  <p className="text-sm text-gray-500 mt-1">{q.hint}</p>
                </div>
              </div>

              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const selected = answers[q.id]?.label === opt.label;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(q.id, opt)}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                        selected
                          ? `${isBusiness ? "border-emerald-500 bg-emerald-50" : "border-blue-500 bg-blue-50"}`
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <span className={`text-sm font-medium ${selected ? (isBusiness ? "text-emerald-700" : "text-blue-700") : "text-gray-700"}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Back button */}
              {step > 0 && (
                <button onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Previous question
                </button>
              )}
            </div>
          </>
        ) : (
          /* ── Results ── */
          <>
            {(() => {
              const result = getResult();
              return (
                <div className="space-y-6">
                  {/* Score summary */}
                  <div className={`rounded-2xl border p-6 ${result.bg}`}>
                    <h2 className={`text-xl font-bold ${result.color} mb-2`}>{result.title}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{result.body}</p>
                  </div>

                  {/* Score bar */}
                  <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Readiness score</span>
                      <span className={`text-sm font-bold ${result.color}`}>{totalScore} / {maxScore}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          pct >= 75 ? "bg-green-500" : pct >= 45 ? "bg-amber-500" : "bg-red-400"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Flags */}
                  {flags.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Things to consider</h3>
                      {flags.map((f, i) => {
                        const IconMap = { warning: XCircle, caution: AlertTriangle, info: HelpCircle, positive: CheckCircle };
                        const colorMap = { warning: "text-red-500 bg-red-50 border-red-200", caution: "text-amber-500 bg-amber-50 border-amber-200", info: "text-blue-500 bg-blue-50 border-blue-200", positive: "text-green-500 bg-green-50 border-green-200" };
                        const Icon = IconMap[f.type] || HelpCircle;
                        return (
                          <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${colorMap[f.type]}`}>
                            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 leading-relaxed">{f.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Next steps */}
                  <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900">Suggested next steps</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Read our <Link to="/guide/what-is-seller-financing" className={`${accent} font-medium hover:underline`}>plain-English guide</Link> to understand how VTB deals work.</p>
                      <p className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Use the <Link to={isBusiness ? "/business" : "/"} className={`${accent} font-medium hover:underline`}>savings calculator</Link> to model real numbers for your budget.</p>
                      <p className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Browse <Link to={isBusiness ? "/business/listings" : "/listings"} className={`${accent} font-medium hover:underline`}>available listings</Link> to see what's on the market.</p>
                      <p className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Find a <Link to="/partners?category=lawyer" className={`${accent} font-medium hover:underline`}>real estate lawyer</Link> before entering any negotiations.</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors">
                      <RotateCcw className="w-4 h-4" /> Retake
                    </button>
                    <Link to={isBusiness ? "/business/listings" : "/listings"}
                      className={`flex items-center gap-2 px-5 py-2.5 text-white rounded-lg font-medium text-sm transition-colors ${primary}`}>
                      Browse Listings <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {/* Disclaimer */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            This diagnostic is for educational purposes only. It does not constitute financial, legal, or mortgage advice,
            and Sel-Fi does not assess your creditworthiness or eligibility for any specific property or deal.
            Always consult a licensed Ontario real estate lawyer and, where appropriate, a financial advisor before
            entering into any real estate transaction.
          </p>
        </div>
      </div>
    </div>
  );
}

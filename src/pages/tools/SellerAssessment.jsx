// src/pages/tools/SellerAssessment.jsx
// Batch 11 — "Is VTB right for my property?" seller risk assessment.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import { usePageMeta } from "../../hooks/usePageMeta";
import {
  CheckCircle, XCircle, AlertTriangle, ArrowRight, ArrowLeft,
  Home, DollarSign, Shield, Scale, Clock, RotateCcw, HelpCircle
} from "lucide-react";

const QUESTIONS = [
  {
    id: "equity",
    question: "Do you own the property free and clear?",
    hint: "If there's an existing mortgage, it typically must be discharged at closing.",
    icon: Home,
    options: [
      { label: "Yes — no existing mortgage", score: 2, flag: "freeAndClear" },
      { label: "Yes — but there's still a mortgage that would be paid from sale proceeds", score: 1, flag: null },
      { label: "The mortgage balance is close to or exceeds what I'd sell for", score: 0, flag: "underwater" },
    ],
  },
  {
    id: "cashNeeds",
    question: "Do you need the full sale price immediately?",
    hint: "VTB means receiving payments over time, not a lump sum.",
    icon: DollarSign,
    options: [
      { label: "No — I'm comfortable receiving payments over several years", score: 2, flag: null },
      { label: "I need a large down payment but can receive the rest over time", score: 1, flag: null },
      { label: "I need the full amount at closing for my next purchase or expense", score: 0, flag: "needsCash" },
    ],
  },
  {
    id: "riskComfort",
    question: "How comfortable are you with lending risk?",
    hint: "If the buyer defaults, you have legal remedies — but they take time and cost money.",
    icon: Shield,
    options: [
      { label: "I understand the risks and am comfortable with them", score: 2, flag: null },
      { label: "I'm cautious but willing with the right buyer and legal protections", score: 1, flag: null },
      { label: "I'm not comfortable with any risk of non-payment", score: 0, flag: "riskAverse" },
    ],
  },
  {
    id: "buyerEval",
    question: "Are you willing to evaluate buyers yourself?",
    hint: "You'll review financial profiles, ask questions, and decide who you trust.",
    icon: Scale,
    options: [
      { label: "Yes — I'm comfortable assessing a buyer's situation", score: 2, flag: null },
      { label: "With guidance from a lawyer, yes", score: 1, flag: null },
      { label: "I'd prefer someone else to handle buyer qualification", score: 0, flag: "wantsAgent" },
    ],
  },
  {
    id: "taxSituation",
    question: "Have you considered the tax implications?",
    hint: "VTB interest income is taxable. Capital gains deferral may apply but depends on your situation.",
    icon: DollarSign,
    options: [
      { label: "Yes — I've spoken to an accountant about VTB structuring", score: 2, flag: "taxReady" },
      { label: "Not yet — but I plan to before proceeding", score: 1, flag: null },
      { label: "I hadn't considered tax implications", score: 0, flag: "taxUnaware" },
    ],
  },
  {
    id: "lawyerReady",
    question: "Will you engage a real estate lawyer to draft the agreement?",
    hint: "Non-negotiable. The VTB mortgage must be properly registered on title.",
    icon: Scale,
    options: [
      { label: "Absolutely — I understand this is required", score: 2, flag: null },
      { label: "I will if needed", score: 1, flag: null },
      { label: "I'd prefer to handle the paperwork ourselves", score: 0, flag: "noLawyer" },
    ],
  },
];

const FLAGS = {
  freeAndClear: { type: "positive", text: "Owning free and clear is the simplest VTB scenario. You hold first position on title, giving you maximum legal protection." },
  underwater:   { type: "warning",  text: "If your mortgage balance is close to the sale price, there may not be enough equity to structure a VTB. Consult a lawyer about your specific situation." },
  needsCash:    { type: "warning",  text: "VTB is structured around receiving payments over time. If you need the full amount at closing, a traditional sale may be more appropriate." },
  riskAverse:   { type: "caution",  text: "Seller financing inherently involves lending risk. While legal protections exist (Power of Sale, foreclosure), they take time and money to enforce. If you're not comfortable with any risk, a traditional sale may be better for you." },
  wantsAgent:   { type: "info",     text: "You can still list on Sel-Fi and engage a realtor to help evaluate buyers. The platform is agent-optional — some sellers prefer professional support, and that's perfectly fine." },
  taxReady:     { type: "positive", text: "Having professional tax advice before structuring a VTB is the smart approach. Capital gains reserve, interest income reporting, and HST implications all affect your outcome." },
  taxUnaware:   { type: "warning",  text: "VTB interest income is taxable, and the capital gains treatment depends on how the deal is structured. Speak to an accountant before committing to any deal terms." },
  noLawyer:     { type: "warning",  text: "A real estate lawyer is required to register the VTB mortgage on title, draft the agreement, and protect your interests. This is non-negotiable under Ontario law." },
};

export default function SellerAssessment() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  usePageMeta("Seller Risk Assessment — Sel-Fi", "Understand if a Vendor Take-Back mortgage is right for your property and situation.");

  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone]       = useState(false);

  const primary  = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const accent   = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-50" : "bg-blue-50";
  const heroBg   = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const sellerWord = isBusiness ? "Vendor" : "Seller";

  const handleAnswer = (qId, opt) => {
    setAnswers((prev) => ({ ...prev, [qId]: opt }));
    if (step < QUESTIONS.length - 1) setTimeout(() => setStep(step + 1), 200);
    else setTimeout(() => setDone(true), 200);
  };

  const reset = () => { setStep(0); setAnswers({}); setDone(false); };

  const totalScore = Object.values(answers).reduce((s, a) => s + a.score, 0);
  const maxScore   = QUESTIONS.length * 2;
  const pct        = Math.round((totalScore / maxScore) * 100);
  const flags      = Object.values(answers).filter((a) => a.flag).map((a) => FLAGS[a.flag]).filter(Boolean);

  const getResult = () => {
    if (pct >= 75) return { color: "text-green-600", bg: "bg-green-50 border-green-200", title: "VTB may be a strong option for your situation", body: "Based on your responses, you have the equity, risk comfort, and professional readiness that VTB deals typically require. The next step is to list your property and consult a lawyer about structuring." };
    if (pct >= 45) return { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", title: "VTB could work — with preparation and professional advice", body: "Your situation has promising elements but also areas to address. Review the specific notes below and consult both a lawyer and accountant before proceeding." };
    return { color: "text-red-600", bg: "bg-red-50 border-red-200", title: "A traditional sale may be more appropriate right now", body: "Based on your responses, some foundational requirements for VTB (equity position, cash needs, risk tolerance, or professional support) may not align with your current situation." };
  };

  const q = QUESTIONS[step];

  return (
    <div className="bg-white min-h-screen">
      <section className={`bg-gradient-to-br ${heroBg} py-12`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#fff" }}>
            Is VTB Right for My Property?
          </h1>
          <p className="text-lg" style={{ color: isBusiness ? "#a7f3d0" : "#bfdbfe" }}>
            A {sellerWord.toLowerCase()}'s self-assessment for seller financing readiness.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {!done ? (
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-300 ${isBusiness ? "bg-emerald-500" : "bg-blue-500"}`}
                  style={{ width: `${((step + (answers[q?.id] ? 1 : 0)) / QUESTIONS.length) * 100}%` }} />
              </div>
              <span className="text-sm text-gray-500 font-medium">{step + 1} / {QUESTIONS.length}</span>
            </div>

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
                    <button key={i} onClick={() => handleAnswer(q.id, opt)}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                        selected ? `${isBusiness ? "border-emerald-500 bg-emerald-50" : "border-blue-500 bg-blue-50"}` : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}>
                      <span className={`text-sm font-medium ${selected ? (isBusiness ? "text-emerald-700" : "text-blue-700") : "text-gray-700"}`}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Previous question
                </button>
              )}
            </div>
          </>
        ) : (
          (() => {
            const result = getResult();
            return (
              <div className="space-y-6">
                <div className={`rounded-2xl border p-6 ${result.bg}`}>
                  <h2 className={`text-xl font-bold ${result.color} mb-2`}>{result.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.body}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Readiness score</span>
                    <span className={`text-sm font-bold ${result.color}`}>{totalScore} / {maxScore}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div className={`h-3 rounded-full transition-all ${pct >= 75 ? "bg-green-500" : pct >= 45 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>

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

                <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Suggested next steps</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Read our <Link to="/guide/legal-protections-for-sellers" className={`${accent} font-medium hover:underline`}>seller protections guide</Link>.</p>
                    <p className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Find a <Link to="/partners?category=lawyer" className={`${accent} font-medium hover:underline`}>real estate lawyer</Link> experienced with VTB deals.</p>
                    <p className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Consult an accountant about tax implications before listing.</p>
                    <p className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> <Link to={isBusiness ? "/business/list-property" : "/list-home"} className={`${accent} font-medium hover:underline`}>List your property</Link> when you're ready.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors">
                    <RotateCcw className="w-4 h-4" /> Retake
                  </button>
                  <Link to={isBusiness ? "/business/list-property" : "/list-home"} className={`flex items-center gap-2 px-5 py-2.5 text-white rounded-lg font-medium text-sm transition-colors ${primary}`}>
                    List Your Property <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })()
        )}

        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            This assessment is for educational purposes only. It does not constitute financial, legal, or real estate advice.
            Sel-Fi does not evaluate properties or recommend specific deal structures. Always consult a licensed Ontario
            real estate lawyer and accountant before entering into any VTB arrangement.
          </p>
        </div>
      </div>
    </div>
  );
}

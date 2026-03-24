// src/pages/pro/ProRegister.jsx
// Professional registration form.
// Requires auth — mounts with guard. Submits application to `professionals` table
// with status = 'pending'. Manual review required before approval.
// Rule 8: Sel-Fi remains a marketplace — pros input data, Sel-Fi does not act as agent.

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSite } from "../../context/SiteContext";
import { supabase } from "../../lib/supabase";
import {
  Briefcase, CheckCircle, AlertTriangle, User, Phone, Globe,
  FileText, MapPin, ChevronDown, ChevronUp, Info,
} from "lucide-react";

const SPECIALTIES = [
  "Seller Financing / VTB",
  "Private Sales / FSBO",
  "Commercial & Land",
  "Agricultural / Farm",
  "Investment Properties",
  "Rent-to-Own",
  "Development Land",
  "Residential Resale",
];

const SERVICE_AREAS = [
  "Toronto", "Durham Region", "York Region", "Peel Region",
  "Halton Region", "Hamilton", "Ottawa", "Kingston",
  "Barrie", "London", "Kitchener-Waterloo", "Niagara Region",
  "Province-Wide (Ontario)",
];

const LANGUAGES = ["English", "French", "Mandarin", "Cantonese", "Hindi", "Punjabi", "Arabic", "Urdu", "Spanish", "Portuguese"];

export default function ProRegister() {
  const { user, isPro } = useAuth();
  const { mode, MODES } = useSite();
  const navigate = useNavigate();
  const isBusiness = mode === MODES.business;

  const primary    = isBusiness ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700";
  const accent     = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg   = isBusiness ? "bg-emerald-50 border-emerald-200" : "bg-blue-50 border-blue-200";
  const ring       = isBusiness ? "focus:ring-emerald-400" : "focus:ring-blue-400";

  const [form, setForm] = useState({
    display_name: "",
    license_number: "",
    brokerage_name: "",
    brokerage_license: "",
    reco_registration: "",
    bio: "",
    phone: "",
    website: "",
    specialties: [],
    service_area: [],
    languages: ["English"],
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!user) navigate("/account");
    if (isPro) navigate("/pro/dashboard");
  }, [user, isPro, navigate]);

  const toggle = (field, value) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.display_name.trim()) { setError("Display name is required."); return; }
    if (!form.license_number.trim()) { setError("License number is required."); return; }
    if (!form.brokerage_name.trim()) { setError("Brokerage name is required."); return; }
    if (form.specialties.length === 0) { setError("Select at least one specialty."); return; }
    if (form.service_area.length === 0) { setError("Select at least one service area."); return; }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from("professionals").insert({
        user_id:           user.id,
        display_name:      form.display_name.trim(),
        license_number:    form.license_number.trim(),
        brokerage_name:    form.brokerage_name.trim(),
        brokerage_license: form.brokerage_license.trim(),
        reco_registration: form.reco_registration.trim(),
        bio:               form.bio.trim(),
        phone:             form.phone.trim(),
        website:           form.website.trim(),
        specialties:       form.specialties,
        service_area:      form.service_area,
        languages:         form.languages,
        status:            "pending",
      });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("You've already submitted a professional application.");
        } else {
          setError(insertError.message);
        }
        return;
      }
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Application submitted</h1>
          <p className="text-gray-500 mb-2">
            Your professional application is under review. We'll email you at <strong>{user?.email}</strong> once approved — typically within 1–2 business days.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Once approved, you'll have access to the Pro Dashboard where you can manage listings, view inquiries, and update your professional profile.
          </p>
          <Link to="/" className={`inline-flex px-6 py-3 rounded-xl text-white font-semibold text-sm transition-colors ${primary}`}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-5">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border ${accentBg} ${accent}`}>
            <Briefcase className="w-3.5 h-3.5" /> Professional Application
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for a Pro account</h1>
          <p className="text-gray-500 leading-relaxed">
            Pro accounts allow licensed professionals to manage listings, receive inquiries, and display their brokerage credentials on Sel-Fi.
            Applications are reviewed manually — typically within 1–2 business days.
          </p>
        </div>

        {/* What Pro means */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-700"
          >
            <span className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /> What does a Pro account include?</span>
            {showDetails ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showDetails && (
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              {[
                "Pro Dashboard — view and edit listings you're assigned to",
                "Inquiry management — see all inquiries for your listings in one place",
                "Brokerage badge — your brokerage name appears on listing cards",
                "Professional profile — visible in the Find a Pro directory",
                "Agent-entered label — listings you input are marked 'Agent-entered', not MLS data",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 leading-relaxed flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Sel-Fi remains a marketplace only. Pro accounts do not make Sel-Fi a brokerage or agent. All data entered by professionals is agent-entered, not an MLS feed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

          {/* Identity */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Your Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Display Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" value={form.display_name} placeholder="Jane Smith"
                  onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
                  className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input
                  type="tel" value={form.phone} placeholder="905-555-0100"
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring}`}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
              <input
                type="url" value={form.website} placeholder="https://yoursite.ca"
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring}`}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Bio</label>
              <textarea
                value={form.bio} rows={3} placeholder="Brief professional background (2–3 sentences)"
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring} resize-none`}
              />
            </div>
          </div>

          {/* Credentials */}
          <div className="border-t border-gray-50 pt-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Credentials</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  License Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" value={form.license_number} placeholder="RECO license #"
                  onChange={(e) => setForm((f) => ({ ...f, license_number: e.target.value }))}
                  className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">RECO Registration #</label>
                <input
                  type="text" value={form.reco_registration} placeholder="Optional"
                  onChange={(e) => setForm((f) => ({ ...f, reco_registration: e.target.value }))}
                  className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Brokerage Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" value={form.brokerage_name} placeholder="ABC Realty Inc."
                  onChange={(e) => setForm((f) => ({ ...f, brokerage_name: e.target.value }))}
                  className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Brokerage License #</label>
                <input
                  type="text" value={form.brokerage_license} placeholder="Optional"
                  onChange={(e) => setForm((f) => ({ ...f, brokerage_license: e.target.value }))}
                  className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring}`}
                />
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="border-t border-gray-50 pt-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
              Specialties <span className="text-red-400">*</span>
            </h2>
            <p className="text-xs text-gray-400 mb-4">Select all that apply.</p>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => (
                <button
                  key={s} type="button"
                  onClick={() => toggle("specialties", s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    form.specialties.includes(s)
                      ? isBusiness ? "bg-emerald-600 text-white border-emerald-600" : "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Service Area */}
          <div className="border-t border-gray-50 pt-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">
              Service Area <span className="text-red-400">*</span>
            </h2>
            <p className="text-xs text-gray-400 mb-4">Select all regions you serve.</p>
            <div className="flex flex-wrap gap-2">
              {SERVICE_AREAS.map((a) => (
                <button
                  key={a} type="button"
                  onClick={() => toggle("service_area", a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    form.service_area.includes(a)
                      ? isBusiness ? "bg-emerald-600 text-white border-emerald-600" : "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="border-t border-gray-50 pt-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l} type="button"
                  onClick={() => toggle("languages", l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    form.languages.includes(l)
                      ? isBusiness ? "bg-emerald-600 text-white border-emerald-600" : "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-gray-50 pt-5">
            <p className="text-xs text-gray-400 leading-relaxed">
              By submitting, you confirm that the information provided is accurate and that you hold valid RECO registration (or equivalent).
              Sel-Fi facilitates introductions only — applying for a Pro account does not create an agency or brokerage relationship with Sel-Fi.
              Applications are subject to manual review and may be declined without explanation.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit" disabled={submitting}
            className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors ${primary} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

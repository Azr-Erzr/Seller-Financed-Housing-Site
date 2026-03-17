// src/pages/PartnerApply.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useToast } from "../components/Toast";
import { CheckCircle, Star, Shield, Users, TrendingUp } from "lucide-react";

const CATEGORIES = [
  { value: "lawyer",       label: "Real Estate Lawyer / Notary" },
  { value: "stager",       label: "Home Stager" },
  { value: "photographer", label: "Real Estate Photographer / Videographer" },
  { value: "inspector",    label: "Home Inspector" },
  { value: "broker",       label: "Mortgage Broker" },
  { value: "other",        label: "Other" },
];

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-900 placeholder-gray-400";

function Field({ label, hint, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint  && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function PartnerApply() {
  const { toast } = useToast();
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]         = useState({});

  const [form, setForm] = useState({
    business_name: "", contact_name: "", category: "",
    city: "", region: "Durham Region", phone: "", email: "", website: "",
    credentials: "", license_number: "", years_experience: "",
    hourly_rate: "", service_area: "", bio: "", services: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.business_name.trim()) e.business_name = "Required";
    if (!form.contact_name.trim())  e.contact_name  = "Required";
    if (!form.category)             e.category      = "Please select a category";
    if (!form.city.trim())          e.city          = "Required";
    if (!form.email.trim())         e.email         = "Required";
    if (!form.bio.trim())           e.bio           = "Please tell us about your business";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        years_experience: form.years_experience ? Number(form.years_experience) : null,
        status: "pending",
      };

      if (supabase) {
        const { error } = await supabase.from("partner_applications").insert(payload);
        if (error) throw error;
      }

      setSubmitted(true);
      toast.success("Application submitted! We'll review it within 2–3 business days.");
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please email us directly at partners@homematch.ca");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 px-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h1>
        <p className="text-gray-500 mb-2">
          Thank you for applying to the HomeMatch Partner network. We review all applications manually to ensure quality.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          You'll hear back from us at <strong>{form.email}</strong> within 2–3 business days.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/partners" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            View Partner Directory
          </Link>
          <Link to="/" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Back to HomeMatch
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-7 h-7 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Become a HomeMatch Partner</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Join our network of trusted real estate professionals and connect with buyers and sellers
            who need your expertise. All applications are reviewed manually.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: <Users className="w-5 h-5 text-blue-600" />, bg: "bg-blue-100", title: "Direct Exposure", body: "Your profile reaches every buyer and seller using HomeMatch in your area." },
            { icon: <Star className="w-5 h-5 text-orange-500" />, bg: "bg-orange-100", title: "Partner Badge", body: "Verified partners appear at the top of search results with a visible trust badge." },
            { icon: <TrendingUp className="w-5 h-5 text-green-600" />, bg: "bg-green-100", title: "Growing Network", body: "As HomeMatch grows, so does your referral pipeline — no ongoing effort required." },
          ].map(({ icon, bg, title, body }) => (
            <div key={title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
              <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center mx-auto mb-3`}>{icon}</div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Business Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-base">Business Information</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Business / Firm Name" required error={errors.business_name}>
                <input className={inputCls} value={form.business_name}
                  onChange={(e) => set("business_name", e.target.value)} placeholder="Durham Real Estate Law" />
              </Field>
              <Field label="Your Name" required error={errors.contact_name}>
                <input className={inputCls} value={form.contact_name}
                  onChange={(e) => set("contact_name", e.target.value)} placeholder="Sarah Okonkwo" />
              </Field>
            </div>

            <Field label="Professional Category" required error={errors.category}>
              <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
                <option value="">Select your profession...</option>
                {CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="City" required error={errors.city}>
                <input className={inputCls} value={form.city}
                  onChange={(e) => set("city", e.target.value)} placeholder="Whitby" />
              </Field>
              <Field label="Service Area" hint="e.g. Durham Region, GTA, Ontario-wide">
                <input className={inputCls} value={form.service_area}
                  onChange={(e) => set("service_area", e.target.value)} placeholder="Durham Region" />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Phone">
                <input className={inputCls} type="tel" value={form.phone}
                  onChange={(e) => set("phone", e.target.value)} placeholder="(905) 555-0100" />
              </Field>
              <Field label="Email" required error={errors.email}>
                <input className={inputCls} type="email" value={form.email}
                  onChange={(e) => set("email", e.target.value)} placeholder="you@yourfirm.ca" />
              </Field>
            </div>

            <Field label="Website">
              <input className={inputCls} type="url" value={form.website}
                onChange={(e) => set("website", e.target.value)} placeholder="https://yourfirm.ca" />
            </Field>
          </div>

          {/* Credentials */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900 text-base">Credentials &amp; Experience</h2>
            </div>
            <p className="text-sm text-gray-500">
              This information is used to verify your qualifications. All applications are reviewed before approval.
            </p>

            <Field label="Credentials / Designations" hint="e.g. LLB, Called to Bar 2010, OREA member, RHI, AMP">
              <input className={inputCls} value={form.credentials}
                onChange={(e) => set("credentials", e.target.value)}
                placeholder="LLB, Called to Bar 2010" />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="License / Registration Number" hint="If applicable">
                <input className={inputCls} value={form.license_number}
                  onChange={(e) => set("license_number", e.target.value)}
                  placeholder="e.g. LSO #12345" />
              </Field>
              <Field label="Years of Experience">
                <input className={inputCls} type="number" min="0" value={form.years_experience}
                  onChange={(e) => set("years_experience", e.target.value)}
                  placeholder="10" />
              </Field>
            </div>

            <Field label="Fee Structure" hint="Give buyers and sellers an idea of what to expect.">
              <input className={inputCls} value={form.hourly_rate}
                onChange={(e) => set("hourly_rate", e.target.value)}
                placeholder="e.g. Flat fee $1,500 for closings · $350/hr for consulting" />
            </Field>
          </div>

          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-base">About Your Business</h2>

            <Field label="Business Bio" required error={errors.bio}
              hint="This will appear on your public profile. Tell HomeMatch users what makes you the right choice.">
              <textarea className={`${inputCls} h-32 resize-none`} value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="We've been serving the Durham Region for 15 years, specializing in seller-financed transactions and VTB mortgages..." />
            </Field>

            <Field label="Services Offered" hint="Comma-separated list. e.g. Title Transfers, Promissory Notes, NDA Drafting">
              <textarea className={`${inputCls} h-20 resize-none`} value={form.services}
                onChange={(e) => set("services", e.target.value)}
                placeholder="Seller-Finance Closings, Promissory Notes, Title Transfers, NDA Drafting" />
            </Field>
          </div>

          {/* Terms */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
            <strong>Review Process:</strong> All partner applications are reviewed manually by the HomeMatch team.
            Approval typically takes 2–3 business days. We verify credentials and may contact you for additional
            documentation. Approved partners receive the HomeMatch Partner badge and featured placement in the
            directory. Partner listings are subject to our terms of service.
          </div>

          <div className="flex gap-3 pb-8">
            <button type="submit" disabled={submitting}
              className="flex-1 sm:flex-none px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
            <Link to="/partners" className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

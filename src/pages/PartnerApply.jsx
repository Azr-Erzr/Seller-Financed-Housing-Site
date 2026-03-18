// src/pages/PartnerApply.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useToast } from "../components/Toast";
import { CheckCircle, Star, Shield, Users, TrendingUp, Truck, AlertTriangle } from "lucide-react";

const CATEGORIES = [
  { value: "lawyer",       label: "Real Estate Lawyer / Notary" },
  { value: "stager",       label: "Home Stager" },
  { value: "photographer", label: "Real Estate Photographer / Videographer" },
  { value: "inspector",    label: "Home Inspector" },
  { value: "broker",       label: "Mortgage Broker" },
  { value: "mover",        label: "Licensed & Insured Moving Company" },
  { value: "other",        label: "Other" },
];

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white text-gray-900 placeholder-gray-400";

function Field({ label, hint, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint  && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── Mover-specific credentials section ───────────────────────────────
function MoverCredentials({ form, set, errors }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 text-base">Moving Company Requirements</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Sel-Fi only lists movers who meet all three requirements below.
            Applications missing any of these will not be approved.
          </p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Why we require this:</strong> The moving industry has documented issues with
          unlicensed operators, surprise charges, and held-hostage loads. All Sel-Fi-listed
          movers must be CVOR-registered, carry active cargo insurance, and be WSIB-covered.
          We verify this before approval and display verified badges on your profile.
        </p>
      </div>

      {/* CVOR */}
      <div className="border border-gray-100 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">CVOR Registration (Required)</h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Commercial Vehicle Operator's Registration issued by the Ontario Ministry of Transportation.
          Required for any commercial moving vehicle over 4,500kg GVWR in Ontario.
        </p>
        <Field label="CVOR Number" required error={errors.cvor_number}
          hint="Your Ontario MTO CVOR certificate number (e.g. 12345678-0)">
          <input className={inputCls} value={form.cvor_number}
            onChange={(e) => set("cvor_number", e.target.value)}
            placeholder="e.g. 12345678-0" />
        </Field>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={form.cvor_confirmed}
            onChange={(e) => set("cvor_confirmed", e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
          <span className="text-sm text-gray-700">
            I confirm this business holds a valid, active CVOR certificate and operates in compliance with Ontario transportation regulations.
          </span>
        </label>
        {errors.cvor_confirmed && <p className="text-xs text-red-500">{errors.cvor_confirmed}</p>}
      </div>

      {/* Cargo Insurance */}
      <div className="border border-gray-100 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">2</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Cargo Insurance (Required)</h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Active cargo/goods-in-transit insurance protecting customer belongings during the move.
          Minimum $100,000 coverage required.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Insurance Company" required error={errors.cargo_insurer}>
            <input className={inputCls} value={form.cargo_insurer}
              onChange={(e) => set("cargo_insurer", e.target.value)}
              placeholder="e.g. Intact Insurance" />
          </Field>
          <Field label="Policy Number" required error={errors.cargo_policy_num}>
            <input className={inputCls} value={form.cargo_policy_num}
              onChange={(e) => set("cargo_policy_num", e.target.value)}
              placeholder="e.g. POL-123456" />
          </Field>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={form.cargo_confirmed}
            onChange={(e) => set("cargo_confirmed", e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
          <span className="text-sm text-gray-700">
            I confirm this business holds active cargo/goods-in-transit insurance with minimum $100,000 coverage.
          </span>
        </label>
        {errors.cargo_confirmed && <p className="text-xs text-red-500">{errors.cargo_confirmed}</p>}
      </div>

      {/* WSIB */}
      <div className="border border-gray-100 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">3</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">WSIB Coverage (Required)</h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Workplace Safety and Insurance Board coverage for all employees. Protects both your workers
          and your customers from liability during the move.
        </p>
        <Field label="WSIB Account Number" required error={errors.wsib_account}
          hint="Your Ontario WSIB account number">
          <input className={inputCls} value={form.wsib_account}
            onChange={(e) => set("wsib_account", e.target.value)}
            placeholder="e.g. 1234567" />
        </Field>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={form.wsib_confirmed}
            onChange={(e) => set("wsib_confirmed", e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
          <span className="text-sm text-gray-700">
            I confirm this business is registered with and in good standing with the WSIB.
          </span>
        </label>
        {errors.wsib_confirmed && <p className="text-xs text-red-500">{errors.wsib_confirmed}</p>}
      </div>

      {/* Fleet size */}
      <Field label="Fleet Size" hint="How many vehicles does your company operate?">
        <input className={inputCls} type="number" min="1" value={form.fleet_size}
          onChange={(e) => set("fleet_size", e.target.value)} placeholder="e.g. 4" />
      </Field>
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
    // Mover-specific
    cvor_number: "", cvor_confirmed: false,
    cargo_insurer: "", cargo_policy_num: "", cargo_confirmed: false,
    wsib_account: "", wsib_confirmed: false,
    fleet_size: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const isMover = form.category === "mover";

  const validate = () => {
    const e = {};
    if (!form.business_name.trim()) e.business_name = "Required";
    if (!form.contact_name.trim())  e.contact_name  = "Required";
    if (!form.category)             e.category      = "Please select a category";
    if (!form.city.trim())          e.city          = "Required";
    if (!form.email.trim())         e.email         = "Required";
    if (!form.bio.trim())           e.bio           = "Please tell us about your business";

    // Mover-specific validation
    if (isMover) {
      if (!form.cvor_number.trim())     e.cvor_number     = "CVOR number is required";
      if (!form.cvor_confirmed)         e.cvor_confirmed  = "You must confirm your CVOR status";
      if (!form.cargo_insurer.trim())   e.cargo_insurer   = "Insurance company is required";
      if (!form.cargo_policy_num.trim()) e.cargo_policy_num = "Policy number is required";
      if (!form.cargo_confirmed)        e.cargo_confirmed = "You must confirm your cargo insurance";
      if (!form.wsib_account.trim())    e.wsib_account    = "WSIB account number is required";
      if (!form.wsib_confirmed)         e.wsib_confirmed  = "You must confirm your WSIB status";
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        business_name:    form.business_name,
        contact_name:     form.contact_name,
        category:         form.category,
        city:             form.city,
        region:           form.region,
        phone:            form.phone,
        email:            form.email,
        website:          form.website,
        credentials:      form.credentials,
        license_number:   form.license_number,
        years_experience: form.years_experience ? Number(form.years_experience) : null,
        hourly_rate:      form.hourly_rate,
        service_area:     form.service_area,
        bio:              form.bio,
        services:         form.services,
        status:           "pending",
        is_mover:         isMover,
        // Mover fields
        cvor_number:      isMover ? form.cvor_number : null,
        cargo_insurance:  isMover ? form.cargo_confirmed : false,
        cargo_insurer:    isMover ? form.cargo_insurer : null,
        cargo_policy_num: isMover ? form.cargo_policy_num : null,
        wsib_account:     isMover ? form.wsib_account : null,
        wsib_covered:     isMover ? form.wsib_confirmed : false,
        fleet_size:       isMover && form.fleet_size ? Number(form.fleet_size) : null,
      };

      if (supabase) {
        const { error } = await supabase.from("partner_applications").insert(payload);
        if (error) throw error;
      }

      setSubmitted(true);
      toast.success("Application submitted! We'll review it within 2–3 business days.");
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please email us at partners@homematch.ca");
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
          Thank you for applying to the Sel-Fi Partner network. We review all applications manually to ensure quality.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          You'll hear from us at <strong>{form.email}</strong> within 2–3 business days.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/partners" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            View Partner Directory
          </Link>
          <Link to="/" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Back to Sel-Fi
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
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Become a Sel-Fi Partner</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Join our network of trusted real estate professionals and connect with buyers and sellers
            who need your expertise. All applications are reviewed manually before approval.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: <Users className="w-5 h-5 text-blue-600" />,      bg: "bg-blue-100",   title: "Direct Exposure",   body: "Your profile reaches every buyer and seller using Sel-Fi in your area." },
            { icon: <Star className="w-5 h-5 text-orange-500" />,     bg: "bg-orange-100", title: "Partner Badge",      body: "Verified partners appear at the top of search results with a visible trust badge." },
            { icon: <TrendingUp className="w-5 h-5 text-green-600" />, bg: "bg-green-100", title: "Growing Network",   body: "As Sel-Fi grows, so does your referral pipeline — no ongoing effort required." },
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

            {/* Mover requirements notice */}
            {isMover && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Moving company requirements:</strong> Sel-Fi requires CVOR registration,
                  active cargo insurance (min. $100K), and WSIB coverage for all listed movers.
                  You'll be asked to provide these details below.
                </p>
              </div>
            )}

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

          {/* Mover-specific credentials — only shown when category = mover */}
          {isMover && <MoverCredentials form={form} set={set} errors={errors} />}

          {/* Standard credentials — shown for non-movers */}
          {!isMover && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900 text-base">Credentials &amp; Experience</h2>
              </div>
              <p className="text-sm text-gray-500">
                Used to verify your qualifications. All applications are reviewed before approval.
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
                    onChange={(e) => set("years_experience", e.target.value)} placeholder="10" />
                </Field>
              </div>

              <Field label="Fee Structure" hint="Give buyers and sellers an idea of what to expect.">
                <input className={inputCls} value={form.hourly_rate}
                  onChange={(e) => set("hourly_rate", e.target.value)}
                  placeholder="e.g. Flat fee $1,500 for closings · $350/hr for consulting" />
              </Field>
            </div>
          )}

          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-base">About Your Business</h2>

            <Field label="Business Bio" required error={errors.bio}
              hint="This appears on your public profile. Tell Sel-Fi users what makes you the right choice.">
              <textarea className={`${inputCls} h-32 resize-none`} value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder={isMover
                  ? "Family-run moving company serving the Durham Region since 2012. We treat every move with care..."
                  : "We've been serving the Durham Region for 15 years, specializing in seller-financed transactions..."
                } />
            </Field>

            <Field label="Services Offered" hint="Comma-separated list.">
              <textarea className={`${inputCls} h-20 resize-none`} value={form.services}
                onChange={(e) => set("services", e.target.value)}
                placeholder={isMover
                  ? "Local Residential Moves, Commercial Moves, Packing Services, Piano Moving, Storage"
                  : "Seller-Finance Closings, Promissory Notes, Title Transfers, NDA Drafting"
                } />
            </Field>
          </div>

          {/* Review process */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
            <strong>Review Process:</strong> All partner applications are reviewed manually by the Sel-Fi team.
            Approval typically takes 2–3 business days. We may contact you for additional documentation.
            {isMover && " For moving companies, we verify CVOR, insurance, and WSIB before any approval."}
            {" "}Approved partners receive the Sel-Fi Partner badge and featured placement in the directory.
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

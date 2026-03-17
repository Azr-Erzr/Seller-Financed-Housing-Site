// src/pages/PartnerDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { getPartnerById, PARTNER_CATEGORIES, getFeaturedPartners } from "../data/partners";
import { MapPin, Phone, Globe, Mail, Star, ChevronRight, ArrowLeft } from "lucide-react";
import { useSite } from "../context/SiteContext";

const avatarColors = {
  lawyer:       "from-blue-500 to-blue-700",
  stager:       "from-purple-500 to-purple-700",
  photographer: "from-orange-400 to-orange-600",
  inspector:    "from-green-500 to-green-700",
  broker:       "from-yellow-500 to-yellow-600",
  mover:        "from-teal-500 to-teal-700",
};
const categoryColors = {
  lawyer:       "bg-blue-100 text-blue-700",
  stager:       "bg-purple-100 text-purple-700",
  photographer: "bg-orange-100 text-orange-700",
  inspector:    "bg-green-100 text-green-700",
  broker:       "bg-yellow-100 text-yellow-700",
  mover:        "bg-teal-100 text-teal-700",
};

const getInitials = (name) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export default function PartnerDetail() {
  const { id } = useParams();
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  const partner = getPartnerById(id);

  // All mode-specific styles derived here — no inline conditionals scattered through JSX
  const primaryBtnCls  = isBusiness
    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";
  const linkColorCls   = isBusiness ? "text-emerald-600 hover:text-emerald-700" : "text-blue-600 hover:text-blue-700";
  const iconBgCls      = isBusiness ? "bg-emerald-100" : "bg-blue-100";
  const iconTextCls    = isBusiness ? "text-emerald-600" : "text-blue-600";
  const contactHoverCls = isBusiness
    ? "hover:bg-emerald-50 hover:border-emerald-200"
    : "hover:bg-blue-50 hover:border-blue-200";
  const contactValueHoverCls = isBusiness ? "group-hover:text-emerald-600" : "group-hover:text-blue-600";
  const heroBg = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";

  if (!partner) {
    return (
      <div className="p-12 text-center text-gray-500">
        Partner not found.{" "}
        <Link to="/partners" className={linkColorCls}>Back to directory</Link>
      </div>
    );
  }

  const categoryLabel = PARTNER_CATEGORIES.find((c) => c.value === partner.category)?.label || "";
  const categoryIcon  = PARTNER_CATEGORIES.find((c) => c.value === partner.category)?.icon || "";
  const related = getFeaturedPartners()
    .filter((p) => p.category === partner.category && p.id !== partner.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">

        <Link to="/partners" className={`inline-flex items-center gap-1.5 text-sm transition-colors text-gray-500 ${linkColorCls}`}>
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>

        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${avatarColors[partner.category]} flex items-center justify-center text-white font-bold text-3xl shrink-0`}>
              {getInitials(partner.name)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
                {partner.badge && (
                  <span className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3" /> LandMatch Partner
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-2">{partner.contact}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[partner.category]}`}>
                  {categoryIcon} {categoryLabel}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {partner.city} · {partner.region}
                </span>
              </div>
            </div>
          </div>
          {partner.bio && (
            <p className="mt-6 pt-6 border-t border-gray-100 text-gray-600 leading-relaxed">
              {partner.bio}
            </p>
          )}
        </div>

        {/* Two-col layout */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Services */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 text-lg mb-4">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {partner.services.map((s) => (
                <span key={s} className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
            <h2 className="font-semibold text-gray-900 text-lg">Contact</h2>

            {[
              { href: `tel:${partner.phone}`, icon: <Phone className="w-4 h-4" />, label: "Phone", value: partner.phone },
              { href: `mailto:${partner.email}`, icon: <Mail className="w-4 h-4" />, label: "Email", value: partner.email },
              ...(partner.website
                ? [{ href: partner.website, icon: <Globe className="w-4 h-4" />, label: "Website", value: "Visit website ↗", external: true }]
                : []
              ),
            ].map(({ href, icon, label, value, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-transparent transition-all group ${contactHoverCls}`}
              >
                <div className={`w-8 h-8 ${iconBgCls} rounded-lg flex items-center justify-center shrink-0`}>
                  <span className={iconTextCls}>{icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className={`text-sm font-medium text-gray-800 truncate transition-colors ${contactValueHoverCls}`}>
                    {value}
                  </p>
                </div>
              </a>
            ))}

            <a
              href={`mailto:${partner.email}?subject=LandMatch Inquiry`}
              className={`w-full flex items-center justify-center gap-2 py-3 font-semibold text-sm rounded-xl transition-colors mt-2 ${primaryBtnCls}`}
            >
              Send a Message
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
          <strong>Note:</strong> LandMatch lists these professionals as a convenience for users.
          We do not endorse or guarantee any professional's services. Always verify credentials
          and conduct your own due diligence before engaging any professional.
          Partner status indicates a verified, paid listing placement only.
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-900 mb-4">
              Other {categoryLabel} in the Area
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/partners/${p.id}`}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColors[p.category]} flex items-center justify-center text-white font-bold shrink-0`}>
                    {getInitials(p.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.city}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pb-4">
          <Link to="/partners" className={`text-sm ${linkColorCls}`}>
            ← View all professionals
          </Link>
        </div>
      </div>
    </div>
  );
}

// src/pages/Accessibility.jsx
// Batch 6 — AODA-aligned accessibility statement.

import React from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { Accessibility as AccessibilityIcon, Eye, Keyboard, Monitor, MessageSquare } from "lucide-react";

export default function Accessibility() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  const accent = isBusiness ? "text-emerald-600" : "text-blue-600";
  const heroBg = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const heroSub = isBusiness ? "#a7f3d0" : "#bfdbfe";
  const bar = isBusiness ? "bg-emerald-600" : "bg-blue-600";
  const cardBorder = isBusiness ? "border-emerald-100" : "border-blue-100";
  const iconBg = isBusiness ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600";

  const updated = "March 19, 2026";

  return (
    <div className="bg-white">
      <section className={`bg-gradient-to-br ${heroBg} py-14`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#fff" }}>Accessibility</h1>
          <p className="text-sm" style={{ color: heroSub }}>Last updated: {updated}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-14">

        <p className="text-gray-600 text-sm leading-relaxed mb-10">
          Sel-Fi is committed to providing an accessible platform for all users, including people with
          disabilities. We are working toward compliance with the Accessibility for Ontarians with
          Disabilities Act (AODA) and the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {[
            { Icon: Keyboard, title: "Keyboard Navigation", desc: "We are working to ensure all interactive elements — buttons, links, forms, and modals — are accessible via keyboard alone." },
            { Icon: Eye, title: "Screen Reader Support", desc: "We use semantic HTML, ARIA labels, and meaningful alt text to support screen readers and assistive technologies." },
            { Icon: Monitor, title: "Responsive Design", desc: "The platform is designed to work across screen sizes, from mobile phones to large desktop monitors." },
            { Icon: MessageSquare, title: "Clear Language", desc: "We aim to write in plain, understandable language, especially for legal and financial content that affects real decisions." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className={`border ${cardBorder} rounded-xl p-5`}>
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className={`w-1 h-5 rounded-full ${bar}`} />
            Known Limitations
          </h2>
          <div className="text-gray-600 text-sm leading-relaxed space-y-3">
            <p>
              Sel-Fi is an early-stage platform and we acknowledge that our accessibility implementation
              is not yet complete. Areas where we know improvements are needed include:
            </p>
            <p>
              Some interactive map features may not be fully accessible to screen readers or keyboard-only users.
              Complex filter interfaces on browse pages may benefit from additional ARIA labeling.
              The AI chat assistant interface may not yet meet full WCAG 2.1 AA standards for focus management.
              Some form validation messages may not be announced consistently to assistive technologies.
              Mobile layouts for dense forms and data views are still being optimized.
            </p>
            <p>
              We are actively working to address these limitations and welcome feedback on specific
              barriers you encounter.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className={`w-1 h-5 rounded-full ${bar}`} />
            Our Commitment
          </h2>
          <div className="text-gray-600 text-sm leading-relaxed space-y-3">
            <p>
              We are committed to improving accessibility on an ongoing basis. Our roadmap includes
              a full keyboard navigation audit, screen reader testing across major assistive technologies,
              focus management improvements for modals and dynamic content, and a plain-language review
              of all legal and financial content.
            </p>
            <p>
              Accessibility is not a one-time task — it is a continuous practice that we integrate
              into every product decision.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className={`w-1 h-5 rounded-full ${bar}`} />
            Feedback and Accommodation
          </h2>
          <div className="text-gray-600 text-sm leading-relaxed space-y-3">
            <p>
              If you encounter an accessibility barrier on Sel-Fi, or if you need content in an
              alternative format, please contact us. We want to hear from you and we will do our
              best to accommodate your needs.
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:accessibility@sel-fi.ca" className={`${accent} hover:underline font-medium`}>accessibility@sel-fi.ca</a>
            </p>
            <p>
              We aim to respond to accessibility feedback within 5 business days and to implement
              reasonable accommodations as quickly as possible.
            </p>
          </div>
        </section>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Sel-Fi. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-3 text-xs text-gray-400">
            <Link to="/terms" className="hover:text-gray-600">Terms of Use</Link>
            <span>·</span>
            <Link to="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

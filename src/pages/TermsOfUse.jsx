// src/pages/TermsOfUse.jsx
// Batch 6 — Legal surface. Marketplace-only terms.

import React from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { FileText, AlertTriangle } from "lucide-react";

export default function TermsOfUse() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  const accent = isBusiness ? "text-emerald-600" : "text-blue-600";
  const accentBg = isBusiness ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100";
  const heroBg = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const heroSub = isBusiness ? "#a7f3d0" : "#bfdbfe";

  const updated = "March 19, 2026";

  const Section = ({ title, children }) => (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <span className={`w-1 h-5 rounded-full ${isBusiness ? "bg-emerald-600" : "bg-blue-600"}`} />
        {title}
      </h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );

  return (
    <div className="bg-white">
      <section className={`bg-gradient-to-br ${heroBg} py-14`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#fff" }}>Terms of Use</h1>
          <p className="text-sm" style={{ color: heroSub }}>Last updated: {updated}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-14">

        <div className={`${accentBg} border rounded-xl p-5 mb-10`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${accent}`} />
            <p className="text-sm text-gray-700">
              Sel-Fi is a marketplace platform that facilitates introductions between property sellers and buyers.
              Sel-Fi is <strong>not</strong> a real estate brokerage, mortgage broker, lender, legal advisor, or financial institution.
              By using this platform, you agree to these terms.
            </p>
          </div>
        </div>

        <Section title="1. What Sel-Fi Is">
          <p>
            Sel-Fi ("we," "us," "our") operates an online marketplace at sel-fi.com and sel-fi.ca
            that connects property sellers and prospective buyers who may wish to explore seller-financed,
            rent-to-own, lease-option, or private-sale real estate transactions in Ontario, Canada.
          </p>
          <p>
            We provide listing tools, buyer profiles, educational content, a professional partner directory,
            and an AI-powered assistant to help users explore their options. We do not participate in,
            negotiate, arrange, broker, or guarantee any real estate or mortgage transaction.
          </p>
        </Section>

        <Section title="2. What Sel-Fi Is Not">
          <p>Sel-Fi is not any of the following, and does not hold any related license or registration:</p>
          <p>
            A real estate brokerage or sales representative under the Real Estate and Business Brokers Act (REBBA).
            A mortgage brokerage, broker, or agent under the Mortgage Brokerages, Lenders and Administrators Act (MBLAA).
            A mortgage lender or administrator. A financial institution regulated by OSFI or FSRA.
            A legal advisor or law firm. An investment advisor or securities dealer.
          </p>
          <p>
            Any information on this platform — including educational content, calculator outputs, guide articles,
            and AI assistant responses — is provided for general informational purposes only and does not
            constitute legal, financial, tax, investment, or mortgage advice.
          </p>
        </Section>

        <Section title="3. User Responsibilities">
          <p>By creating an account or using Sel-Fi, you agree that:</p>
          <p>
            You are at least 18 years of age and legally capable of entering into binding agreements.
            All information you provide (listings, profiles, financial details) is accurate and truthful to the best of your knowledge.
            You will not use the platform for fraudulent, deceptive, or unlawful purposes.
            You will engage a licensed Ontario real estate lawyer before entering into any purchase agreement, mortgage, or other binding contract.
            You are solely responsible for conducting your own due diligence on any property or counterparty.
            You understand that Sel-Fi does not verify the accuracy of listings, profiles, or user-provided information unless explicitly stated via a verification badge.
          </p>
        </Section>

        <Section title="4. Verification Badges">
          <p>
            Sel-Fi may offer optional verification badges (such as "Identity Verified" or "Funds Verified")
            that indicate a user has submitted certain documents for review. These badges mean only that
            specific documentation was provided and appeared legitimate at the time of review.
          </p>
          <p>
            Verification badges do not constitute an assessment of creditworthiness, financial capacity,
            legal eligibility, or suitability for any specific transaction. They do not guarantee the
            accuracy of any user's claims. Sellers and buyers should always conduct their own independent
            due diligence.
          </p>
        </Section>

        <Section title="5. Listings and Content">
          <p>
            Listings on Sel-Fi are created by individual users, not by Sel-Fi. We do not guarantee the
            accuracy, completeness, or availability of any listing. Property details, pricing, photos,
            and terms are provided by the listing owner and may change without notice.
          </p>
          <p>
            Sample listings may appear on the platform for demonstration purposes and are clearly
            marked as "Sample Listing." These do not represent real properties or real offers.
          </p>
          <p>
            We reserve the right to remove or modify any listing or profile that violates these terms,
            appears fraudulent, contains misleading information, or is reported by another user.
          </p>
        </Section>

        <Section title="6. AI Assistant">
          <p>
            Sel-Fi provides an AI-powered assistant to help users explore listings, understand concepts,
            and navigate the platform. The AI assistant is not a licensed professional of any kind.
            Its responses are generated by a large language model and may contain errors, omissions,
            or outdated information.
          </p>
          <p>
            Do not rely on AI assistant responses as legal, financial, tax, or mortgage advice.
            Always verify important information with a qualified professional.
          </p>
        </Section>

        <Section title="7. Professional Partner Directory">
          <p>
            Sel-Fi maintains a directory of professional service providers (lawyers, inspectors, appraisers, etc.)
            for user convenience. Listing in the directory does not imply endorsement, affiliation, or
            vetting by Sel-Fi unless a specific verification badge is displayed with defined criteria.
          </p>
          <p>
            Users are responsible for independently verifying the credentials, licensing, and suitability
            of any professional they engage through the directory.
          </p>
        </Section>

        <Section title="8. Inquiries and Communication">
          <p>
            Sel-Fi provides an inquiry system that allows users to send messages to listing owners or
            profile holders. These inquiries are delivered as form submissions, not real-time messaging.
            Sel-Fi does not guarantee delivery, response, or response time.
          </p>
          <p>
            Users must not use the inquiry system to send spam, abusive content, discriminatory messages,
            or solicitations unrelated to the platform's purpose.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Sel-Fi and its owners, operators, and
            contributors shall not be liable for any direct, indirect, incidental, consequential, or
            punitive damages arising from your use of the platform, reliance on platform content,
            or any transaction entered into through or as a result of the platform.
          </p>
          <p>
            Sel-Fi does not guarantee that any transaction will be completed, that any counterparty will
            act in good faith, or that any property will meet your expectations. Real estate transactions
            carry inherent risk, and seller-financed transactions carry additional complexity that
            requires professional legal guidance.
          </p>
        </Section>

        <Section title="10. Account Termination">
          <p>
            We may suspend or terminate your account at any time if we reasonably believe you have
            violated these terms, engaged in fraudulent activity, or used the platform in a manner
            that could harm other users or Sel-Fi's reputation.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These terms are governed by the laws of the Province of Ontario and the federal laws of
            Canada applicable therein. Any disputes arising from these terms or your use of the
            platform shall be resolved in the courts of Ontario.
          </p>
        </Section>

        <Section title="12. Changes to These Terms">
          <p>
            We may update these terms from time to time. Material changes will be communicated via
            the platform. Continued use of Sel-Fi after changes are posted constitutes acceptance
            of the updated terms.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            Questions about these terms? Contact us at{" "}
            <a href="mailto:hello@sel-fi.ca" className={`${accent} hover:underline font-medium`}>hello@sel-fi.ca</a>.
          </p>
        </Section>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Sel-Fi. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-3 text-xs text-gray-400">
            <Link to="/privacy" className={`hover:${accent.replace("text-", "text-")}`}>Privacy Policy</Link>
            <span>·</span>
            <Link to="/accessibility" className={`hover:${accent.replace("text-", "text-")}`}>Accessibility</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

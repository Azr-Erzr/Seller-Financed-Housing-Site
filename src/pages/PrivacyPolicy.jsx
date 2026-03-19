// src/pages/PrivacyPolicy.jsx
// Batch 6 — PIPEDA-aligned privacy policy for Sel-Fi.

import React from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  const accent = isBusiness ? "text-emerald-600" : "text-blue-600";
  const heroBg = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-600 to-blue-800";
  const heroSub = isBusiness ? "#a7f3d0" : "#bfdbfe";
  const bar = isBusiness ? "bg-emerald-600" : "bg-blue-600";

  const updated = "March 19, 2026";

  const Section = ({ title, children }) => (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <span className={`w-1 h-5 rounded-full ${bar}`} />
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
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#fff" }}>Privacy Policy</h1>
          <p className="text-sm" style={{ color: heroSub }}>Last updated: {updated}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-14">

        <p className="text-gray-600 text-sm leading-relaxed mb-10">
          Sel-Fi ("we," "us," "our") respects your privacy and is committed to protecting the personal
          information you share with us. This policy explains what we collect, why, how we protect it,
          and your rights under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA).
        </p>

        <Section title="1. Information We Collect">
          <p><strong>Account information:</strong> When you create an account, we collect your email address and password (hashed — we never store plaintext passwords). If you sign in via magic link, we collect your email address.</p>
          <p><strong>Profile information:</strong> If you create a buyer profile or listing, we collect the details you provide: name (or alias), city, budget, income, deal preferences, property details, photos, and descriptions. You control what you share.</p>
          <p><strong>Verification documents:</strong> If you opt into our verification badge system, you may upload documents such as government-issued photo ID, proof of funds, or employment letters. These are stored securely and used solely for verification purposes.</p>
          <p><strong>Inquiry messages:</strong> When you send an inquiry through the platform, we collect the content of that message along with your name and email.</p>
          <p><strong>Usage data:</strong> We collect basic analytics data such as pages visited, browser type, and general location (city-level, not precise). We do not use invasive tracking or third-party advertising cookies.</p>
          <p><strong>AI interactions:</strong> Conversations with our AI assistant are processed by our service provider (Anthropic) to generate responses. We do not use your chat content for advertising or sell it to third parties.</p>
        </Section>

        <Section title="2. Why We Collect It">
          <p>We collect personal information for the following purposes:</p>
          <p>
            To create and manage your account.
            To display your listing or buyer profile to other users.
            To process and deliver inquiries between users.
            To provide verification badges that build trust between parties.
            To power our AI assistant with relevant listing context.
            To improve the platform and fix technical issues.
            To communicate with you about your account or platform updates.
          </p>
          <p>We will not use your information for any purpose beyond what is described here without obtaining your consent.</p>
        </Section>

        <Section title="3. Consent">
          <p>
            We obtain your consent when you create an account, submit a listing or profile, upload verification
            documents, or send an inquiry. By using these features, you consent to the collection and use
            of your information as described in this policy.
          </p>
          <p>
            You may withdraw consent at any time by deleting your account, removing your listing or profile,
            or contacting us. Withdrawing consent may limit your ability to use certain platform features.
          </p>
          <p>
            Financial information (income, budget, savings) is considered sensitive under PIPEDA.
            We collect it only with your express consent and only for the specific purposes stated above.
          </p>
        </Section>

        <Section title="4. How We Store and Protect Your Information">
          <p>
            Your data is stored on Supabase, a SOC 2 Type 2 certified infrastructure provider.
            All data is encrypted at rest using AES-256 encryption and encrypted in transit using TLS.
          </p>
          <p>
            Verification documents are stored in private storage buckets with row-level security policies.
            Access is restricted to the document owner and authorized review processes. Documents are
            accessible only via time-limited signed URLs — there are no permanent public links to sensitive files.
          </p>
          <p>
            Our website is served through Cloudflare, which provides DDoS protection, SSL/TLS encryption,
            and edge caching. Cloudflare does not have access to your database or stored documents.
          </p>
          <p>
            We implement appropriate technical and organizational safeguards proportionate to the sensitivity
            of the information. However, no system is completely secure, and we cannot guarantee absolute
            security of your data.
          </p>
        </Section>

        <Section title="5. Third-Party Service Providers">
          <p>We use the following third-party services to operate the platform:</p>
          <p>
            <strong>Supabase</strong> (database, authentication, file storage) — SOC 2 Type 2 certified, data encrypted at rest and in transit.
            <strong> Cloudflare</strong> (hosting, CDN, DNS, SSL) — enterprise-grade security infrastructure.
            <strong> Anthropic</strong> (AI assistant) — processes chat messages to generate responses; does not retain conversation data for training.
            <strong> Resend</strong> (email delivery) — sends transactional emails such as saved-search alerts and account notifications.
          </p>
          <p>
            We do not sell, rent, or trade your personal information to any third party. Our service providers
            process data only on our behalf and under contractual obligations to protect it.
          </p>
        </Section>

        <Section title="6. Retention">
          <p>
            We retain your account information for as long as your account is active.
            Listing and profile data is retained for as long as the listing or profile is published,
            plus a reasonable period after deletion for backup and dispute resolution purposes.
          </p>
          <p>
            Verification documents are retained for 90 days after verification is complete, then permanently
            deleted. If verification is denied, documents are deleted within 30 days.
          </p>
          <p>
            Inquiry messages are retained for 12 months, then automatically deleted.
          </p>
          <p>
            You may request deletion of your data at any time by contacting us.
          </p>
        </Section>

        <Section title="7. Your Rights Under PIPEDA">
          <p>You have the right to:</p>
          <p>
            <strong>Access</strong> — Request a copy of the personal information we hold about you.
            <strong> Correction</strong> — Request correction of inaccurate or incomplete information.
            <strong> Withdrawal of consent</strong> — Withdraw your consent to the collection, use, or disclosure of your information.
            <strong> Deletion</strong> — Request deletion of your personal information, subject to legal retention requirements.
            <strong> Complaint</strong> — File a complaint with the Office of the Privacy Commissioner of Canada if you believe your privacy rights have been violated.
          </p>
          <p>
            To exercise any of these rights, contact our privacy officer at the address below.
            We will respond within 30 days.
          </p>
        </Section>

        <Section title="8. Cookies and Local Storage">
          <p>
            Sel-Fi uses browser local storage (not cookies) to remember your mode preference (Homes vs. Business),
            saved listings, and filter settings. This data stays on your device and is not transmitted to our servers.
          </p>
          <p>
            We do not use advertising cookies, tracking pixels, or third-party analytics that profile your
            behavior across other websites. If we add analytics in the future, we will use privacy-respecting
            solutions that do not track individual users.
          </p>
        </Section>

        <Section title="9. Children">
          <p>
            Sel-Fi is not intended for use by anyone under the age of 18. We do not knowingly collect
            personal information from minors. If we become aware that we have collected information from
            someone under 18, we will delete it promptly.
          </p>
        </Section>

        <Section title="10. Breach Notification">
          <p>
            In the event of a security breach that creates a real risk of significant harm to you,
            we will notify the Office of the Privacy Commissioner of Canada and affected individuals
            as soon as feasible, as required by PIPEDA's breach notification provisions.
          </p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>
            We may update this policy from time to time. Material changes will be posted on this page
            with an updated revision date. We encourage you to review this policy periodically.
          </p>
        </Section>

        <Section title="12. Privacy Officer">
          <p>
            Sel-Fi's privacy officer can be reached at:
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:privacy@sel-fi.ca" className={`${accent} hover:underline font-medium`}>privacy@sel-fi.ca</a>
          </p>
          <p>
            <strong>Office of the Privacy Commissioner of Canada:</strong>{" "}
            <a href="https://www.priv.gc.ca" className={`${accent} hover:underline font-medium`} target="_blank" rel="noopener noreferrer">www.priv.gc.ca</a>
            {" "}| 1-800-282-1376
          </p>
        </Section>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Sel-Fi. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-3 text-xs text-gray-400">
            <Link to="/terms" className="hover:text-gray-600">Terms of Use</Link>
            <span>·</span>
            <Link to="/accessibility" className="hover:text-gray-600">Accessibility</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

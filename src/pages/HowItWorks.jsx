// src/pages/HowItWorks.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileText, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors">
        <span className="font-medium text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 bg-white text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{a}</div>
      )}
    </div>
  );
};

const FAQS_BUYERS = [
  { q: "What is seller financing and how does it work?", a: "Seller financing (also called a Vendor Take-Back or VTB mortgage) is when the person selling the home acts as the bank. Instead of getting a mortgage from a lender, you make monthly payments directly to the seller. You negotiate the down payment, interest rate, and amortization period directly with them. The home legally transfers to you, and you hold the title — the seller holds a mortgage against the property as security until it's paid off." },
  { q: "Who qualifies for a seller-financed deal?", a: "That's largely up to the individual seller. Most sellers will want to see that you have a real down payment, stable income, and a genuine plan to keep up payments. Unlike a bank, they can take your full story into account — not just a credit score. Self-employed buyers, newcomers to Canada, and people with non-traditional income are often better served by seller financing than conventional mortgages." },
  { q: "What is a match score and how is it calculated?", a: "Your match score is a compatibility rating between a buyer profile and a listing. It's calculated based on five factors: deal type alignment, interest rate fit, down payment capacity, monthly payment affordability, and location proximity. Higher scores mean the deal's numbers are more likely to work for both sides — but it's a starting point for a conversation, not a guarantee." },
  { q: "What is rent-to-own?", a: "Rent-to-own means you rent the property for an agreed period (typically 1–3 years) with the option to buy at a pre-agreed price at the end of the term. A portion of your monthly rent is credited toward the future purchase price or down payment. It gives buyers time to build savings or improve their financial profile before completing the purchase." },
  { q: "Is my financial information safe?", a: "Your financial details are used for matching only. When you browse listings or profiles, only general details are visible publicly. Full financial information is only shared when you actively engage with a specific listing, and sensitive documents require both parties to sign a short NDA first. We never share your data with third parties." },
  { q: "Do I need a lawyer?", a: "Yes — we strongly recommend it. Seller-financed transactions are legally complex. A real estate lawyer will review or draft the promissory note (the loan agreement), ensure the title transfer is clean, and protect both parties. HomeMatch helps you find the right person and agree on terms — the legal paperwork needs a professional." },
];

const FAQS_SELLERS = [
  { q: "Why would I seller-finance instead of just selling normally?", a: "A few good reasons. First, you get a steady income stream — monthly payments at a rate you set, often well above what you'd earn in a savings account or GIC. Second, you may attract more buyers and a higher sale price by offering flexible terms. Third, if you own the home outright, you may be able to spread your capital gains over the years you receive payments rather than taking a large lump sum in one year." },
  { q: "What happens if the buyer stops paying?", a: "This is the key risk sellers need to understand. If you hold a mortgage and the buyer defaults, you'd need to go through a legal process to enforce the mortgage and potentially reclaim the property. This is why thorough vetting of buyers, proper legal documentation, and a real estate lawyer are essential." },
  { q: "What is the NDA feature?", a: "When you list a property, you can choose to lock your detailed financial documents behind an NDA. Interested buyers must agree to a short non-disclosure agreement before accessing those documents. This protects your sensitive financial and property information until you have a genuinely interested, committed party." },
  { q: "Can I list a private sale (no seller financing)?", a: "Yes. HomeMatch supports private sales where both parties prefer to handle their own financing. The platform is not exclusively for seller-financed deals — it's a home for any private real estate transaction that wants to cut out the middlemen." },
  { q: "How do I vet a buyer?", a: "Buyer profiles show their budget, down payment capacity, monthly income, existing debt load, and a calculated debt-to-income ratio. Before going further, we recommend requesting proof of down payment funds, a copy of their most recent Notice of Assessment (tax return), and employment confirmation. Then have your lawyer run any remaining checks." },
];

export default function HowItWorks() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5" style={{ color: "#ffffff" }}>
            How HomeMatch Works
          </h1>
          <p className="text-lg" style={{ color: "#bfdbfe" }}>
            Three steps to a seller-financed deal — whether you're buying or selling.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Search className="w-8 h-8 text-blue-600" />,      bg: "bg-blue-100",   num: 1, numBg: "bg-blue-600",   title: "Create a Profile or Listing",  body: "Sellers post their property with financing terms — down payment minimum, interest rate range, and deal type. Buyers create a profile with budget, down payment, income, and deal preferences." },
              { icon: <FileText className="w-8 h-8 text-orange-500" />,  bg: "bg-orange-100", num: 2, numBg: "bg-orange-500", title: "Get Matched & Connect",         body: "Our matching engine scores each listing against each buyer profile across five financial dimensions. When you find a match, request documents (after signing an NDA) and start a conversation." },
              { icon: <CheckCircle className="w-8 h-8 text-green-600" />, bg: "bg-green-100", num: 3, numBg: "bg-green-600",  title: "Negotiate & Close",            body: "Once both sides are aligned, engage a real estate lawyer to draft the promissory note, mortgage document, and transfer paperwork. No bank approval, no commission agents." },
            ].map(({ icon, bg, num, numBg, title, body }) => (
              <div key={title} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>{icon}</div>
                <div className={`w-8 h-8 ${numBg} text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold`}>{num}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Deal Types Explained</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tag: "Seller-Finance", tagColor: "bg-blue-100 text-blue-700",     title: "Seller-Financed (VTB)", body: "The seller acts as the lender. The buyer makes monthly payments of principal + interest directly to the seller. Title transfers immediately. The seller holds a mortgage as security. Terms are fully negotiable — rate, amortization, prepayment privileges.", best: "Best for buyers who can't get a traditional mortgage and sellers who want ongoing income." },
              { tag: "Rent-to-Own",    tagColor: "bg-purple-100 text-purple-700", title: "Rent-to-Own",           body: "Buyer rents the property for a set period (typically 1–3 years) with an option to purchase at a pre-agreed price. A portion of rent is credited toward the eventual purchase. Gives buyers time to save or improve their financial situation.", best: "Best for buyers who need time before they can fully commit, and sellers who want a tenant-buyer." },
              { tag: "Lease Option",   tagColor: "bg-yellow-100 text-yellow-700", title: "Lease Option",          body: "Similar to rent-to-own, but the buyer pays an upfront option fee for the right — not the obligation — to purchase at the end of the lease period. The option fee is typically applied to the purchase price if exercised.", best: "Best for buyers who want flexibility and sellers who want committed, invested tenants." },
            ].map(({ tag, tagColor, title, body, best }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${tagColor}`}>{tag}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{body}</p>
                <p className="text-xs text-blue-600 font-medium">{best}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Buyers */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">FAQ — For Buyers</h2>
          <p className="text-gray-500 mb-8">Everything you need to know before creating a profile.</p>
          <div className="space-y-3">{FAQS_BUYERS.map((faq) => <FAQItem key={faq.q} {...faq} />)}</div>
        </div>
      </section>

      {/* FAQ Sellers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">FAQ — For Sellers</h2>
          <p className="text-gray-500 mb-8">Key questions before you list your property.</p>
          <div className="space-y-3">{FAQS_SELLERS.map((faq) => <FAQItem key={faq.q} {...faq} />)}</div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#ffffff" }}>Ready to Find Your Match?</h2>
          <p className="mb-8" style={{ color: "#bfdbfe" }}>Join buyers and sellers already using HomeMatch in the Durham Region.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/list-home"      className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">List a Home</Link>
            <Link to="/create-profile" className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">Create a Profile</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

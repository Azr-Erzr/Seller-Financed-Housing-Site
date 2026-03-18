// src/pages/HowItWorks.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { ChevronDown, ChevronUp } from "lucide-react";

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="font-medium text-gray-900 text-sm pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0"/> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0"/>}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

const SELLER_STEPS = [
  {
    num: 1, icon: "📝", title: "Create Your Listing",
    body: "Fill out the listing form with your home's details, photos, and the financing terms you're willing to offer: down payment minimum, interest rate range, and deal type (VTB, Rent-to-Own, Lease Option, or Private Sale). Takes about 10 minutes.",
  },
  {
    num: 2, icon: "🔍", title: "Browse Matched Buyers",
    body: "Sel-Fi shows you buyer profiles scored against your terms — budget, down payment capacity, debt-to-income ratio, and deal preference alignment. You review them privately. No one contacts you without your permission.",
  },
  {
    num: 3, icon: "🤝", title: "Connect and Qualify",
    body: "When you find a promising match, use the Invite to Deal feature to start a conversation. Share financial documents behind a mutual NDA. Ask for what you need: income verification, bank statements, employment confirmation. You choose who to work with.",
  },
  {
    num: 4, icon: "⚖️", title: "Negotiate Directly",
    body: "Agree on the final terms: purchase price, down payment, interest rate, amortization period, and any special conditions. You're in charge of this negotiation — not an agent acting on your behalf.",
  },
  {
    num: 5, icon: "✍️", title: "Close With a Lawyer",
    body: "A real estate lawyer drafts the Agreement of Purchase and Sale (including VTB terms), conducts title search, registers your mortgage charge on the buyer's title, and handles the transfer. This registration is public record — your security is ironclad.",
  },
  {
    num: 6, icon: "💰", title: "Collect Monthly Payments",
    body: "After closing, the buyer sends you monthly principal and interest payments according to your agreed schedule. You are earning an investment return, secured against property you once owned. When the balance is paid, you discharge the mortgage from their title.",
  },
];

const BUYER_STEPS = [
  {
    num: 1, icon: "👤", title: "Create Your Buyer Profile",
    body: "Enter your budget, available down payment, maximum monthly payment, income, existing debt, and deal preferences. Your debt-to-income ratio is calculated automatically. Sellers see this — so make it accurate and complete.",
  },
  {
    num: 2, icon: "🗺️", title: "Browse and Search",
    body: "Use the map or list view to browse seller-financed listings filtered by price, location, deal type, and property type. Each listing shows the seller's terms so you know upfront what you're working with.",
  },
  {
    num: 3, icon: "📬", title: "Contact the Seller",
    body: "When a listing matches your profile, send a contact message directly to the seller. You can use a template or write your own. Sellers receive your profile alongside your message — make a good impression.",
  },
  {
    num: 4, icon: "📄", title: "Due Diligence",
    body: "Before committing to any deal, get a home inspection (find one in our Partner Directory), have a lawyer review the title, and confirm property taxes are current. The seller may ask you for income documentation and financial statements.",
  },
  {
    num: 5, icon: "✍️", title: "Close With a Lawyer",
    body: "Your lawyer reviews the Agreement of Purchase and Sale, confirms the VTB terms, and represents your interests at closing. Title transfers to you. The seller's mortgage charge is registered on your title. You own the home.",
  },
  {
    num: 6, icon: "🏡", title: "Make Your Monthly Payments",
    body: "Pay the seller monthly according to your agreement — principal and interest, directly. If you want to pay down the mortgage faster, your agreement may allow prepayments. When the balance reaches zero, the seller discharges the charge. The home is fully yours.",
  },
];

const SELLER_FAQS = [
  {
    q: "What if the buyer stops paying?",
    a: `If a buyer defaults on a VTB mortgage, you have the same legal remedies as any lender in Ontario. You issue a formal Notice of Default. The buyer then has a statutory redemption period — minimum 35 days — to bring the mortgage current. If they don't, you can initiate Power of Sale: the property is sold, you recover the outstanding balance plus your legal costs, and any surplus goes to the buyer. Alternatively, you can pursue foreclosure, which results in full title transfer back to you. These are established legal remedies under Ontario's Mortgage Act — the same rights a bank would have. This is why the deal must be documented by a real estate lawyer and your charge properly registered on title.`,
  },
  {
    q: "Does the buyer need bank approval?",
    a: `No — that's the point. In a pure seller-financed deal, you are the lender. You decide whether the buyer qualifies based on your own assessment of their income, down payment, and character. No stress test, no T4 requirement, no institutional approval process. If the buyer also has a bank mortgage for part of the purchase, the bank's qualification standards will apply to their portion. But if you're financing the full amount, it's your call.`,
  },
  {
    q: "What if the buyer uses a realtor?",
    a: `That's completely fine — and common. The buyer's realtor represents the buyer. Their commission is between the buyer and their agent; it does not come from you. You still save your listing agent commission (typically 2.5% + HST). You still earn interest on the VTB you hold. The buyer gets professional representation. Everyone wins.`,
  },
  {
    q: "Do I need to own my home free and clear?",
    a: `Not necessarily. But if you have an existing mortgage, it must typically be discharged (paid out) at closing from the sale proceeds — or your existing lender must consent to the VTB arrangement. Your lawyer will advise you on the specific requirements based on your situation.`,
  },
  {
    q: "How does this affect my taxes?",
    a: `VTB mortgages can have tax implications, particularly around capital gains deferral and how interest income is reported. Consult a CPA or tax advisor before finalizing any deal — the right structure can significantly affect your tax outcome.`,
  },
  {
    q: "Is the interest I earn taxed?",
    a: `Yes — interest income from a VTB mortgage is generally taxable in the year it's received. Some sellers structure VTBs to spread capital gains over multiple years. This is a conversation for your accountant, not Sel-Fi.`,
  },
];

const BUYER_FAQS = [
  {
    q: "I was rejected by the bank. Can I really use this?",
    a: `Yes — if you have a genuine income, a real down payment, and a stable situation that a bank's formula doesn't capture, a seller-financed deal may be right for you. Self-employed buyers, new Canadians, and people with unconventional income have successfully used VTB mortgages for decades in Ontario. The seller evaluates you as a person, not as a row in a spreadsheet.`,
  },
  {
    q: "Am I really buying the home, or just renting?",
    a: `In a VTB mortgage deal, you are buying the home. Title transfers to you at closing. You own the property. You pay property taxes and maintain insurance. The seller holds a registered mortgage charge on your title — exactly like a bank would — until you pay the balance in full. This is not a lease or rental arrangement.`,
  },
  {
    q: "What happens if I can't make a payment?",
    a: `Missing a payment triggers the default process. The seller can issue a Notice of Default, giving you a redemption period (minimum 35 days in Ontario) to bring the mortgage current. If you cannot, the seller can pursue Power of Sale or foreclosure. The consequences are real — just as they would be with a bank mortgage. Only enter a VTB arrangement if your monthly payment is genuinely affordable with room to spare.`,
  },
  {
    q: "Can I use a realtor to help me?",
    a: `Yes. You can have a buyer's agent represent you throughout the process. Their commission is your negotiation with them — it does not come from the seller. Having a realtor does not prevent the seller from using Sel-Fi or offering seller financing.`,
  },
  {
    q: "What interest rate should I expect?",
    a: `VTB mortgage rates are typically higher than bank rates to compensate the seller for lending risk. In Ontario, rates commonly range from 5% to 12% depending on the deal structure, down payment, and the buyer's financial profile. Use the calculator on our Guide page to compare VTB and bank mortgage costs side by side.`,
  },
];

const PARTNER_FAQS = [
  {
    q: "I'm a realtor. Can I work with Sel-Fi buyers?",
    a: `Absolutely. Sel-Fi supports buyer-side realtor representation. Your buyer finds a seller-financed home on Sel-Fi, you represent them, and you earn a buyer-side commission negotiated with your client. The seller saves their listing commission. You still get paid. Contact us to discuss how to refer your buyer clients to our platform.`,
  },
  {
    q: "I'm a real estate lawyer. How do I get listed?",
    a: `Apply through our Partner Directory. We vet all listed professionals and list you with your name, firm, areas of practice, and contact info. VTB transactions require a real estate lawyer — being visible on Sel-Fi puts you in front of sellers and buyers who specifically need your services.`,
  },
];

export default function HowItWorks() {
  const { mode, MODES } = useSite();
  const isBusiness = mode === MODES.business;
  const accent      = isBusiness ? "text-emerald-600" : "text-blue-600";
  const bg          = isBusiness ? "bg-emerald-600" : "bg-blue-600";
  const heroBg      = isBusiness ? "from-emerald-700 to-emerald-900" : "from-blue-700 to-blue-900";
  const heroCopy    = isBusiness
    ? "How Sel-Fi Business Works"
    : "How Sel-Fi Works";
  const heroSub     = isBusiness
    ? "Direct seller-financed commercial land deals — step by step."
    : "Seller financing in plain English — what happens, why it works, and what you need to know.";

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className={`bg-gradient-to-br ${heroBg} py-16`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4" style={{color:"#fff"}}>{heroCopy}</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{color:"#bfdbfe"}}>{heroSub}</p>
        </div>
      </section>

      {/* Core concept */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Core Concept</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              In a traditional sale, the buyer gets a mortgage from a bank. The bank lends the money,
              earns interest, and calls the shots on who qualifies. The seller gets a lump sum and walks away.
              The agents get their commissions. The bank gets the interest.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              In a seller-financed deal, the seller <em>is</em> the bank. The buyer makes monthly payments directly
              to the seller, at terms they both negotiated. The seller holds a registered mortgage on the property —
              the same legal protection any bank has — and earns interest income every month until the balance is paid.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                { icon: "🏦", label: "Seller becomes the lender" },
                { icon: "📋", label: "Mortgage registered on title" },
                { icon: "💰", label: "Seller earns interest income" },
              ].map(({ icon, label }) => (
                <div key={label} className="text-center bg-gray-50 rounded-xl p-4">
                  <div className="text-3xl mb-2">{icon}</div>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seller steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">For Sellers</h2>
          <p className="text-gray-500 mb-8">From listing to monthly payment — what the process looks like.</p>
          <div className="space-y-6">
            {SELLER_STEPS.map((step) => (
              <div key={step.num} className="flex gap-5 items-start">
                <div className="shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.num}
                </div>
                <div className="bg-gray-50 rounded-xl p-5 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{step.icon}</span>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Realtor hybrid callout */}
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Selling to a Buyer Who Uses a Realtor</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              If the buyer wants to use a buyer's agent, that's perfectly fine. The buyer's realtor represents the
              buyer — their commission comes from the buyer's side of the negotiation, not from you. You still save
              your listing commission. You still earn interest on the VTB. The buyer gets professional guidance.
              No conflict, no problem.
            </p>
            <p className="text-xs text-gray-400">
              Sel-Fi does not prohibit buyer-agent representation. We simply remove the listing agent from the equation.
            </p>
          </div>
        </div>
      </section>

      {/* Buyer steps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">For Buyers</h2>
          <p className="text-gray-500 mb-8">How to find a seller-financed home and get to closing.</p>
          <div className="space-y-6">
            {BUYER_STEPS.map((step) => (
              <div key={step.num} className="flex gap-5 items-start">
                <div className="shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.num}
                </div>
                <div className="bg-white rounded-xl p-5 flex-1 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{step.icon}</span>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal explainer */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">⚖️ The Legal Framework — What Both Sides Should Know</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "The mortgage is registered on title",
                body: "The seller's VTB charge is registered at Ontario's Land Registry Office — the same way any bank mortgage is. It is public record. It gives the seller a secured legal interest in the property until the balance is paid.",
              },
              {
                title: "Both parties need a real estate lawyer",
                body: "Not optional. A lawyer drafts the Agreement of Purchase and Sale (with VTB terms), conducts title searches, registers the charge, handles insurance, and transfers title. Use our Partner Directory to find one.",
              },
              {
                title: "Default has real consequences",
                body: "If the buyer stops paying, the seller can initiate Power of Sale — Ontario's standard mortgage enforcement process. After a 35-day notice period, the seller can sell the property to recover what's owed. Buyers who enter a VTB must be confident in their payment ability.",
              },
              {
                title: "Position matters in a stacked deal",
                body: "If the buyer has a first-position bank mortgage and the seller's VTB is second-position, the bank's claim is senior in a default. Your lawyer will advise on how to structure the deal to protect your interests appropriately.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="bg-white rounded-xl p-5 border border-amber-200">
                <p className="font-semibold text-gray-900 text-sm mb-2">{title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ — For Sellers</h2>
            <div className="space-y-3">
              {SELLER_FAQS.map((faq) => <FAQ key={faq.q} q={faq.q} a={faq.a}/>)}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ — For Buyers</h2>
            <div className="space-y-3">
              {BUYER_FAQS.map((faq) => <FAQ key={faq.q} q={faq.q} a={faq.a}/>)}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ — For Realtors and Professionals</h2>
            <div className="space-y-3">
              {PARTNER_FAQS.map((faq) => <FAQ key={faq.q} q={faq.q} a={faq.a}/>)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`bg-gradient-to-br ${heroBg} py-14`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{color:"#fff"}}>Have More Questions?</h2>
          <p className="mb-6" style={{color:"#bfdbfe"}}>
            Read our full guides, use the savings calculator, or reach out directly using the chat icon below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/guide" className="px-6 py-2.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">Read the Full Guide</Link>
            <Link to={isBusiness ? "/business/list-property" : "/list-home"}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">
              {isBusiness ? "List a Property" : "List Your Home"}
            </Link>
            <Link to="/partners?category=lawyer" className="px-6 py-2.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">Find a Lawyer</Link>
          </div>
        </div>
      </section>

      <p className="text-xs text-gray-400 leading-relaxed text-center py-6 px-6 max-w-3xl mx-auto">
        Sel-Fi is a marketplace only. Nothing on this site constitutes legal, financial, or mortgage advice.
        Always consult a licensed Ontario real estate lawyer and, where appropriate, a certified financial planner or
        accountant before entering into any real estate transaction.
      </p>
    </div>
  );
}

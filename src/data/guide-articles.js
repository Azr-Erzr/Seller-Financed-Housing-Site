// src/data/guide-articles.js

export const ARTICLES = [
  // ── Residential articles ───────────────────────────────────────────
  {
    id: "what-is-seller-financing",
    mode: "homes",
    category: "Basics",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "What Is Seller Financing? A Plain-English Guide",
    subtitle: "How direct seller-to-buyer real estate deals work in Ontario.",
    readTime: "5 min read",
    icon: "home",
    heroColor: "from-blue-600 to-blue-800",
    summary: "Seller financing (also called a Vendor Take-Back mortgage or VTB) is when the person selling a home acts as the bank. Instead of the buyer going to a bank for a mortgage, they make monthly payments directly to the seller — at a rate and on terms they negotiate together.",
    sections: [
      {
        heading: "The Basic Idea",
        body: `When most people buy a home, the process goes like this: find a house, apply for a mortgage at a bank, the bank approves (or rejects) the application, and money changes hands at closing. The bank owns the debt. The buyer owes the bank.

Seller financing cuts the bank out entirely. Instead of the bank lending the money, the seller lends it. The buyer still gets the home on closing day. Title still transfers. But instead of writing a cheque to the bank every month, the buyer sends payments directly to the seller.

The seller holds a registered mortgage on the property — the same kind of legal charge that a bank holds — until the balance is paid in full.`,
      },
      {
        heading: "What Makes It Legal and Binding",
        body: `A seller-financed deal is governed by the same legal framework as any mortgage in Ontario. The seller registers a charge against the property's title at the Land Registry Office. This registration is public record and gives the seller the same legal protections a bank has.

If the buyer defaults, the seller can pursue Power of Sale (selling the property to recover what's owed) or foreclosure (reclaiming ownership outright). Ontario law requires a notice period before these proceedings begin, giving the buyer a chance to correct the default first.

This is precisely why every Sel-Fi deal should involve a real estate lawyer. A lawyer registers the charge correctly, drafts the promissory note, and makes sure both parties' rights are protected.`,
      },
      {
        heading: "Can the Buyer Also Use a Realtor?",
        body: `Yes — and this is an important point. A buyer can absolutely use a buyer's agent in a Sel-Fi deal. The seller simply doesn't pay a listing agent commission (typically 2.5% of the sale price). If the buyer has a realtor, that realtor's commission is a separate negotiation between buyer and buyer's agent — it does not come from the seller.

This means a seller on Sel-Fi saves their side of the commission regardless of whether the buyer uses a realtor. And the buyer gets professional representation if they want it.`,
      },
    ],
    cta: { label: "Browse Available Listings", href: "/listings" },
  },

  {
    id: "the-true-cost-of-selling-with-an-agent",
    mode: "homes",
    category: "For Sellers",
    categoryColor: "bg-orange-100 text-orange-700",
    title: "The True Cost of Selling With an Agent",
    subtitle: "Understanding commission costs and what selling directly can save.",
    readTime: "6 min read",
    icon: "banknote",
    heroColor: "from-orange-500 to-orange-700",
    summary: "A traditional real estate sale costs the seller far more than most people realize going in. Between commissions, hidden fees, and the loss of control over your own negotiation, selling through an agent on a $600,000 home typically costs $30,000–$45,000 before you walk away.",
    sections: [
      {
        heading: "The Commission Math",
        body: `In a traditional sale, the seller typically pays commission on both sides of the transaction — their agent and the buyer's agent. In Ontario, this is commonly 5% total (2.5% per side).

On a $600,000 home: 5% commission = $30,000. Plus HST: $3,900. Total: approximately $33,900 — paid by you, from your proceeds.

On a $900,000 home that climbs to roughly $50,800.`,
      },
      {
        heading: "What You're Not Told About Referrals",
        body: `When your agent recommends a stager, a photographer, or a home inspector, there's something you may not know: there may be referral arrangements in place. On Sel-Fi, you find your own professionals from our vetted Partner Directory. You see exactly what you're paying and exactly who you're paying it to.`,
      },
      {
        heading: "What Sellers Actually Keep on Sel-Fi",
        body: `By selling on Sel-Fi instead of through a traditional agent:
• Listing agent commission saved (~2.5%): $15,000 on $600K
• Buyer's agent commission saved (~2.5%): $15,000
• HST on commissions: ~$3,900
• You choose your own service providers
• You control the negotiation

Total estimated savings: $30,000–$34,000 on a $600,000 home. Before the interest income from the VTB.`,
      },
    ],
    cta: { label: "List Your Home on Sel-Fi", href: "/list-home" },
  },

  {
    id: "become-the-bank",
    mode: "homes",
    category: "For Sellers",
    categoryColor: "bg-orange-100 text-orange-700",
    title: "How to Be Your Own Bank: The Seller as Lender",
    subtitle: "You've built equity. Now let it work for you.",
    readTime: "7 min read",
    icon: "landmark",
    heroColor: "from-purple-600 to-purple-800",
    summary: "When a seller holds a VTB mortgage, they don't just sell their property — they become an investor. The unpaid balance earns interest every month. On a $500,000 VTB at 7% over 5 years, a seller earns roughly $150,000 in interest payments. This is income a bank would normally capture.",
    sections: [
      {
        heading: "You Are the Lender",
        body: `When you hold a VTB mortgage, you are in exactly the same legal position as a bank. You have:
• A registered charge on the property's title
• The right to collect monthly principal and interest payments
• The right to enforce the mortgage if the buyer defaults
• Legal remedies including Power of Sale if payments stop`,
      },
      {
        heading: "The Interest Income Is Real",
        body: `On a $500,000 VTB at 7% over a 5-year term, 25-year amortization:
• Monthly payment: approximately $3,493
• Interest earned in 5 years: approximately $150,000

That is interest income the bank would normally take. You get it instead — every month, secured against a property you know intimately.`,
      },
      {
        heading: "Your Legal Protections",
        body: `If a buyer stops paying:
1. You send a formal Notice of Default
2. The buyer has a statutory redemption period (minimum 35 days in Ontario) to bring the mortgage current
3. If they fail, you can initiate Power of Sale — the property is sold, you recover the balance plus costs
4. Alternatively you can pursue foreclosure (full title transfer back to you)

One important note: if the buyer also has a first-position bank mortgage, that lender has priority in a default. Deal structure and your lawyer's advice are critical.`,
      },
    ],
    cta: { label: "Calculate Your Savings", href: "/guide" },
  },

  {
    id: "buyer-guide-vtb",
    mode: "homes",
    category: "For Buyers",
    categoryColor: "bg-green-100 text-green-700",
    title: "A Buyer's Complete Guide to VTB Mortgages",
    subtitle: "When traditional financing doesn't fit, here's how seller financing may create another path.",
    readTime: "8 min read",
    icon: "key",
    heroColor: "from-green-600 to-green-800",
    summary: "A Vendor Take-Back (VTB) mortgage is when the person selling the home lends you some or all of the purchase price directly. You still get the house. You still get the keys. You just make payments to the seller instead of the bank.",
    sections: [
      {
        heading: "Why Traditional Financing Doesn't Always Work",
        body: `Banks use a formula called the mortgage stress test to assess qualification. It emphasizes documented T4 employment income and established credit history. This means self-employed Canadians with variable income, newcomers still building a Canadian credit file, recent career changers, and people whose income falls just below the threshold may face challenges qualifying — even if they are otherwise financially responsible. Seller financing can sometimes provide an alternative path for these buyers, though it comes with its own costs and risks that should be carefully evaluated.`,
      },
      {
        heading: "What You're Actually Agreeing To",
        body: `A VTB mortgage is a real, registered mortgage. When you close:
• Title transfers to you — you own the home
• The seller registers a charge on your title
• You make monthly payments to the seller
• When the balance is fully paid, the seller discharges the charge

The terms are written into a legal document drafted by your lawyer. This is as binding as any bank mortgage.`,
      },
      {
        heading: "The Real Cost Comparison",
        body: `Bank mortgage at 6.8% on $480,000: ~$3,338/month
VTB at 7.5% on $480,000: ~$3,522/month

Difference: ~$184/month — or $2,208/year. In exchange, you avoid months of application process, potential rejection, and potentially losing the home to someone with better bank paperwork.`,
      },
    ],
    cta: { label: "Create Your Buyer Profile", href: "/create-profile" },
  },

  {
    id: "closing-without-a-bank",
    mode: "homes",
    category: "The Process",
    categoryColor: "bg-teal-100 text-teal-700",
    title: "The Closing Process Without a Bank",
    subtitle: "Step by step — what actually happens when you close a seller-financed deal.",
    readTime: "5 min read",
    icon: "pen",
    heroColor: "from-teal-600 to-teal-800",
    summary: "Closing a seller-financed deal uses the same legal process as any real estate transaction in Ontario — just without a bank in the middle. A real estate lawyer handles the paperwork, registers the mortgage, and transfers the title.",
    sections: [
      {
        heading: "Step 1–3: Match, Qualify, Negotiate",
        body: `Find each other on Sel-Fi. Exchange financials behind a mutual NDA. Negotiate terms directly: purchase price, down payment, interest rate, amortization, and any special conditions.`,
      },
      {
        heading: "Step 4: Agreement of Purchase and Sale",
        body: `Your lawyer drafts an APS that includes the VTB terms. Once signed by both parties it is legally binding. It specifies the property, purchase price, VTB terms, any conditions, and the closing date.`,
      },
      {
        heading: "Step 5: Closing Day",
        body: `Your lawyers:
1. Transfer title from seller to buyer
2. Register the VTB mortgage charge on the title in the seller's name
3. Handle any existing mortgage discharge
4. Register title insurance for both parties
5. Exchange funds

After closing, the buyer sends monthly payments to the seller. When the balance reaches zero, the seller signs a discharge. The buyer owns the property free and clear.`,
      },
    ],
    cta: { label: "Find a Real Estate Lawyer", href: "/partners?category=lawyer" },
  },

  {
    id: "rent-to-own-vs-seller-finance",
    mode: "homes",
    category: "Comparisons",
    categoryColor: "bg-purple-100 text-purple-700",
    title: "Rent-to-Own vs. Seller Finance: Which Is Right for You?",
    subtitle: "Two paths to homeownership without a bank.",
    readTime: "5 min read",
    icon: "scale",
    heroColor: "from-purple-600 to-purple-800",
    summary: "Both rent-to-own and seller financing let buyers get into a home without traditional bank approval. But they work very differently and suit different buyer situations.",
    sections: [
      {
        heading: "Seller Finance: You Own From Day One",
        body: `With a VTB mortgage, title transfers on closing day. You own the home. Every payment builds your equity. If the home appreciates, all of that is yours.`,
      },
      {
        heading: "Rent-to-Own: You Earn the Right to Buy",
        body: `You rent for 1–3 years with an option to purchase at a pre-agreed price. A portion of each payment credits toward the future purchase. During the rental period the seller still owns the home.

Consider rent-to-own if you need time to save a larger down payment or your credit situation is improving but not yet strong.`,
      },
    ],
    cta: { label: "Browse All Deal Types", href: "/listings" },
  },

  // ── Business / Commercial articles ────────────────────────────────
  {
    id: "commercial-vtb-fundamentals",
    mode: "business",
    category: "Commercial Basics",
    categoryColor: "bg-emerald-100 text-emerald-700",
    title: "VTB in Commercial Real Estate: Why Vendors Use It",
    subtitle: "Seller financing closes deals banks can't — and earns you a secured return.",
    readTime: "5 min read",
    icon: "hammer",
    heroColor: "from-emerald-600 to-emerald-800",
    summary: "Vendor Take-Back financing is far more common in commercial real estate than most residential buyers realize. Land, farms, development parcels, and commercial buildings regularly transact with the vendor holding a registered mortgage — because it benefits both sides and bypasses the delays and rigidity of institutional commercial lending.",
    sections: [
      {
        heading: "Why Commercial VTB Is Already Common",
        body: `Commercial banks apply their most conservative underwriting to land, development land, and agricultural properties. Environmental liability, zoning uncertainty, and the absence of income-producing improvements all reduce lender appetite. Many legitimate commercial transactions simply can't get conventional bank financing.

Vendor Take-Back fills this gap. The vendor (seller) knows the asset better than any bank does. They've owned it, farmed it, or developed it. They can assess the risk with more context than a lender in a downtown office. And they can structure terms that reflect that context.

This is not a workaround. VTB financing on commercial property has been used in Canadian real estate for decades and is fully supported by Ontario's Mortgage Act and standard commercial real estate practice.`,
      },
      {
        heading: "The Vendor's Position: Secured Lender",
        body: `When you hold a VTB mortgage on a commercial property, you register a charge on the title — the same charge a bank would register. Your security is the property itself. You have the same enforcement rights as any institutional lender: Power of Sale, foreclosure, and Writ of Possession.

On a $2M commercial transaction with 30% down and a 5-year VTB at 8%, you're earning approximately $91,000 per year in interest on a secured asset. That's better than most fixed-income investments — at a rate you negotiated.`,
      },
      {
        heading: "Balloon Structures and Exit Planning",
        body: `Commercial VTBs commonly use a balloon structure: the buyer makes monthly payments on a longer amortization (say 20 years) but the full balance comes due at the end of a shorter term (3–5 years). This gives the buyer time to develop the asset, secure conventional financing, or arrange a refinance — while giving the vendor a defined exit.

The balloon balance at term end is typically refinanced by the buyer. Your lawyer will ensure the mortgage terms clearly define what happens if the balloon isn't paid, and what your remedies are.`,
      },
      {
        heading: "When a Buyer Also Uses a Broker",
        body: `Commercial buyers frequently use their own broker or agent. This is entirely compatible with a Sel-Fi deal. You still save your side of the commission (typically 2–3% + HST on commercial transactions). The buyer's broker is the buyer's expense. You close faster because the buyer has professional deal support — and you keep your margin.`,
      },
    ],
    cta: { label: "List a Commercial Property", href: "/business/list-property" },
  },

  {
    id: "capital-gains-deferral-vtb",
    mode: "business",
    category: "Tax Strategy",
    categoryColor: "bg-amber-100 text-amber-700",
    title: "Capital Gains Deferral: The Vendor's Hidden Advantage",
    subtitle: "Structuring a VTB correctly can defer a significant tax liability over the payment term.",
    readTime: "6 min read",
    icon: "chart",
    heroColor: "from-amber-500 to-amber-700",
    summary: "Under Canada's Income Tax Act, a vendor who accepts payment for a property over multiple years may be able to use the 'capital gains reserve' to defer recognizing the full gain until proceeds are actually received. A VTB mortgage, by its nature, creates exactly this kind of installment structure.",
    sections: [
      {
        heading: "The Capital Gains Reserve",
        body: `When you sell a capital property (land, commercial building, farm) and don't receive the full proceeds in the year of sale, section 40(1)(a)(iii) of the Income Tax Act may allow you to claim a reserve — deferring a portion of the capital gain to future years as proceeds are received.

A VTB, by definition, is a structure where you don't receive full proceeds at closing. You receive a down payment, then installment payments (principal + interest) over the term. This can qualify for the reserve, allowing you to spread the taxable gain over up to 5 years.

This is a material advantage. On a $3M land sale with a $1.5M gain, proper structuring could defer $100,000+ in tax in Year 1 alone — while you're still earning interest on the balance.`,
      },
      {
        heading: "What the Reserve Doesn't Do",
        body: `The capital gains reserve defers tax — it does not eliminate it. Each year you receive proceeds, you recognize a proportionate share of the gain. You still pay tax, just spread over time.

Also: the reserve is not available in all situations. It doesn't apply if you sold to a corporation you controlled, or in certain arm's-length exceptions. And the maximum reserve period is 5 years for most properties (10 years for qualifying farm or fishing property and small business shares).

This is exactly why a CPA who understands real estate transactions is essential. The numbers are large enough that getting this wrong is expensive.`,
      },
      {
        heading: "Interest Income Is Separate",
        body: `The interest portion of your VTB payments is ordinary income — not capital gains. It's taxed at your marginal rate in the year received. Some vendors structure VTBs to optimize the split between interest income (taxed fully) and capital gain (50% inclusion). Your accountant can model the most tax-efficient structure for your situation.`,
      },
    ],
    cta: { label: "Use the Capital Gains Calculator", href: "/guide" },
  },

  {
    id: "due-diligence-commercial-land",
    mode: "business",
    category: "For Buyers",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "Commercial Land Due Diligence: What to Verify Before You Close",
    subtitle: "The bank would do all of this before approving a loan. You need to do it too.",
    readTime: "6 min read",
    icon: "search",
    heroColor: "from-blue-600 to-blue-800",
    summary: "In a seller-financed commercial land transaction, there's no bank forcing a Phase 1 ESA or title search. That means the buyer and their lawyer must drive the due diligence process. Here's what a responsible buyer verifies before closing on a VTB deal.",
    sections: [
      {
        heading: "Environmental Status",
        body: `Environmental liability is the single biggest risk in commercial land transactions. A Phase 1 Environmental Site Assessment (ESA) reviews historical land use records and identifies potential contamination risks without physical testing. If a Phase 1 identifies concerns, a Phase 2 involves physical sampling.

On Sel-Fi, sellers can indicate their environmental status (Phase 1 Complete — Clean, Phase 2 Required, No Assessment, etc.). But the buyer must independently verify. A Phase 1 costs $1,500–$4,000 and can save you from acquiring a remediation liability that exceeds the land value.`,
      },
      {
        heading: "Zoning and Permitted Uses",
        body: `Verify the current zoning with the municipality — not just what the seller's listing says. Zoning designations determine what you can build, operate, or do with the land. Also check:
• Official Plan designation (longer-term land use policy)
• Whether any rezoning or OPA is pending
• Whether existing structures are legal non-conforming
• Severance history and any restrictions on further division`,
      },
      {
        heading: "Title Search and Encumbrances",
        body: `Your lawyer conducts a title search before closing. This reveals:
• Any existing mortgages (which must be discharged at closing or consented to)
• Liens, judgments, or executions against the seller
• Easements and rights-of-way (utility corridors, drainage easements, road allowances)
• Conservation authority restrictions or floodplain designations
• Development charges or lot levies already attached

None of these are necessarily deal-killers — but all must be understood before you sign.`,
      },
      {
        heading: "Utilities and Access",
        body: `For vacant land and farms, confirm:
• Whether utilities are on-site or require extension (and who pays for that)
• Road access type (municipal road, private road, right-of-way only)
• Whether a road allowance exists but is unopened
• Well and septic status if applicable
• Power, natural gas, municipal water/sewer availability

A site that appears to have road frontage on a map may only have access via an unopened municipal road allowance — a critical distinction.`,
      },
    ],
    cta: { label: "Find a Commercial Real Estate Lawyer", href: "/partners?category=lawyer" },
  },
];

export const ARTICLES_HOMES    = ARTICLES.filter((a) => a.mode === "homes");
export const ARTICLES_BUSINESS = ARTICLES.filter((a) => a.mode === "business");

export function getArticleById(id) {
  return ARTICLES.find((a) => a.id === id) || null;
}

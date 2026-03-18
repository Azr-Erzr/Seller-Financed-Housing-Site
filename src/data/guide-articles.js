// src/data/guide-articles.js
// LandMatch Guide — educational articles explaining seller financing,
// VTB mortgages, buyer and seller benefits, and the legal framework.

export const ARTICLES = [
  {
    id: "what-is-seller-financing",
    category: "Basics",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "What Is Seller Financing? A Plain-English Guide",
    subtitle: "No banks, no agents — just two people making a deal.",
    readTime: "5 min read",
    icon: "🏡",
    heroColor: "from-blue-600 to-blue-800",
    summary: "Seller financing (also called a Vendor Take-Back mortgage or VTB) is when the person selling a home acts as the bank. Instead of the buyer going to a bank for a mortgage, they make monthly payments directly to the seller — at a rate and on terms they negotiate together.",
    sections: [
      {
        heading: "The Basic Idea",
        body: `When most people buy a home, the process goes like this: find a house, apply for a mortgage at a bank, the bank approves (or rejects) the application, and money changes hands at closing. The bank owns the debt. The buyer owes the bank.

Seller financing cuts the bank out entirely. Instead of the bank lending the money, the seller lends it. The buyer still gets the home on closing day. Title still transfers. But instead of writing a cheque to the bank every month, the buyer sends payments directly to the seller.

The seller holds a registered mortgage on the property — the same kind of legal charge that a bank holds — until the balance is paid in full. At that point, the seller discharges the mortgage from the title, just like a bank would.`,
      },
      {
        heading: "What Makes It Legal and Binding",
        body: `A seller-financed deal is governed by the same legal framework as any mortgage in Ontario. The seller registers a charge against the property's title at the Land Registry Office. This registration is public record and gives the seller the same legal protections a bank has.

If the buyer defaults — stops making payments, fails to maintain insurance, or doesn't pay property taxes — the seller can pursue the same remedies as any lender: Power of Sale (selling the property to recover what's owed) or foreclosure (reclaiming ownership outright). Ontario law requires a notice period before these proceedings begin, giving the buyer a chance to correct the default first.

This is precisely why every LandMatch deal should involve a real estate lawyer. A lawyer registers the charge correctly, drafts the promissory note, and makes sure both parties' rights are protected.`,
      },
      {
        heading: "Who Uses Seller Financing?",
        body: `Seller financing has been used in real estate for decades. It tends to show up in situations where:

• A buyer has real income but doesn't fit a bank's rigid approval formulas (self-employed, new to Canada, recent career change)
• A seller owns their home free and clear and prefers steady monthly income over a lump sum
• A property is unique — rural, commercial, or non-standard — and traditional financing is harder to get
• Both parties want to close faster and with fewer moving parts than a conventional bank deal requires

On LandMatch, seller financing is the default deal structure — but sellers can also offer Rent-to-Own, Lease Options, and Private Sales (where the buyer arranges their own financing).`,
      },
      {
        heading: "Can the Buyer Also Use a Realtor?",
        body: `Yes — and this is an important point. A buyer can absolutely use a buyer's agent in a LandMatch deal. The seller simply doesn't pay a listing agent commission (typically 2.5% of the sale price). If the buyer has a realtor, that realtor's commission is a separate negotiation between buyer and buyer's agent — it does not come from the seller.

This means a seller on LandMatch saves their side of the commission regardless of whether the buyer uses a realtor. And the buyer gets professional representation if they want it.`,
      },
    ],
    cta: { label: "Browse Available Listings", href: "/listings" },
  },

  {
    id: "the-true-cost-of-selling-with-an-agent",
    category: "For Sellers",
    categoryColor: "bg-orange-100 text-orange-700",
    title: "The True Cost of Selling With an Agent",
    subtitle: "The numbers most sellers don't see until it's too late.",
    readTime: "6 min read",
    icon: "💸",
    heroColor: "from-orange-500 to-orange-700",
    summary: "A traditional real estate sale costs the seller far more than most people realize going in. Between commissions, hidden fees, and the loss of control over your own negotiation, selling through an agent on a $600,000 home typically costs $30,000–$45,000 before you walk away.",
    sections: [
      {
        heading: "The Commission Math",
        body: `In a traditional sale, the seller typically pays commission on both sides of the transaction — their agent and the buyer's agent. In Ontario, this is commonly 5% total (2.5% per side), though it varies.

On a $600,000 home: 5% commission = $30,000. Plus HST on the commission: $30,000 × 13% = $3,900. Total commission cost: approximately $33,900.

That $33,900 comes out of your proceeds. It's not paid by the buyer — it's paid by you, from the money you receive at closing.

On a $900,000 home, that number climbs to roughly $50,800. On a $1.2M home, it's close to $68,000.`,
      },
      {
        heading: "What You're Not Told About Referrals",
        body: `When your agent recommends a stager, a photographer, or a home inspector, there's something you may not know: agents in Ontario are legally prohibited from receiving undisclosed referral fees. But "disclosed" can mean a line in a contract that most sellers never read.

On LandMatch, you find your own stager, photographer, and inspector from our vetted Partner Directory. You see exactly what you're paying and exactly who you're paying it to. No kickbacks, no hidden markups, no conflicts of interest.`,
      },
      {
        heading: "Control of Your Own Negotiation",
        body: `When you sell through an agent, every offer goes through them. They advise you on what to accept, what to counter, and when to walk away. That advice isn't necessarily wrong — but it's filtered through someone whose commission depends on the deal closing, not on you getting the best possible price.

On LandMatch, you set your own terms. You decide the minimum down payment, the interest rate range, and who you want to work with. You review buyer profiles directly. You choose who to engage with and who to pass on. The negotiation is yours.`,
      },
      {
        heading: "What Sellers Actually Keep on LandMatch",
        body: `By selling on LandMatch instead of through a traditional agent:

• You keep the listing commission (~2.5%): $15,000 on a $600K home
• You keep the buyer's side commission (~2.5%): $15,000
• You keep the HST on commissions: ~$3,900
• You choose your own service providers with no hidden referrals
• You control the negotiation from start to finish

Total estimated savings: $30,000–$34,000 on a $600,000 home. Before the interest income from the VTB.`,
      },
    ],
    cta: { label: "List Your Home on LandMatch", href: "/list-home" },
  },

  {
    id: "become-the-bank",
    category: "For Sellers",
    categoryColor: "bg-orange-100 text-orange-700",
    title: "How to Be Your Own Bank: The Seller as Lender",
    subtitle: "You've built equity. Now let it work for you.",
    readTime: "7 min read",
    icon: "🏦",
    heroColor: "from-purple-600 to-purple-800",
    summary: "When a seller holds a VTB mortgage, they don't just sell their property — they become an investor. The unpaid balance earns interest every month. On a $500,000 VTB at 7% over 5 years, a seller earns roughly $96,000 in interest payments. This is income that banks normally capture. You can capture it instead.",
    sections: [
      {
        heading: "You Are the Lender",
        body: `When you hold a VTB mortgage, you are in exactly the same legal position as a bank. You have:
• A registered charge on the property's title
• The right to collect monthly principal and interest payments
• The right to enforce the mortgage if the buyer defaults
• Legal remedies including Power of Sale if payments stop

The difference is you negotiated the rate, the terms, and the down payment — not a committee at a financial institution.`,
      },
      {
        heading: "The Interest Income Is Real",
        body: `Here's what most sellers don't realize until they sit down with a mortgage calculator.

On a $500,000 VTB at 7% interest over a 5-year term, with 25-year amortization:
• Monthly payment: approximately $3,493
• Total paid over 5 years: approximately $209,580
• Principal paid over 5 years: approximately $59,000
• Interest earned by the seller in 5 years: approximately $150,000

That is interest income the bank would normally take. You get it instead — every month, like clockwork, from a secured investment backed by a property you once owned.

Compared to a GIC or savings account, this return is exceptional. And unlike stocks, it's secured against real property that you know intimately.`,
      },
      {
        heading: "Your Legal Protections",
        body: `Ontario's Mortgage Act and the common law framework give sellers holding VTB mortgages the same enforcement tools as any lender. If a buyer stops paying:

1. The seller sends a formal Notice of Default
2. The buyer has a statutory redemption period (minimum 35 days in Ontario) to bring the mortgage current
3. If the buyer fails to remedy the default, the seller can initiate Power of Sale — the property is sold, the seller recovers the outstanding balance plus costs, and any surplus goes to the buyer
4. Alternatively, the seller can pursue foreclosure, which results in full title being transferred back to the seller

This is not an informal arrangement. It is a registered, legally enforceable mortgage. The buyer cannot simply walk away from it without consequences — just as they couldn't walk away from a bank mortgage.

One important note: if the buyer also has a first-position bank mortgage, that lender has priority in a default. This is why the deal structure — specifically the down payment and whether a bank is also involved — matters, and why your lawyer's role in structuring it is critical.`,
      },
      {
        heading: "Qualifying Your Buyer",
        body: `Unlike a bank, you get to use judgment. You can ask for:
• Proof of down payment funds (bank statements)
• Income documentation (pay stubs, NOAs, business financials)
• A reference letter from an employer or previous landlord
• A personal conversation to assess character and intent

LandMatch buyer profiles show you budget, down payment capacity, monthly income, existing debt load, and a calculated debt-to-income ratio. You can see who's financially capable before you ever speak to them. You can request an NDA and share financial documents in both directions privately. You decide who gets to buy your home.`,
      },
    ],
    cta: { label: "See How the Calculator Works", href: "/guide/seller-savings-calculator" },
  },

  {
    id: "buyer-guide-vtb",
    category: "For Buyers",
    categoryColor: "bg-green-100 text-green-700",
    title: "A Buyer's Complete Guide to VTB Mortgages",
    subtitle: "The bank said no. Here's your actual path to homeownership.",
    readTime: "8 min read",
    icon: "🔑",
    heroColor: "from-green-600 to-green-800",
    summary: "A Vendor Take-Back (VTB) mortgage is when the person selling the home lends you some or all of the purchase price directly. You still get the house. You still get the keys. You just make payments to the seller instead of the bank — and the seller can say yes when the bank says no.",
    sections: [
      {
        heading: "Why the Bank Said No",
        body: `Banks use a rigid formula called the mortgage stress test. It requires you to qualify at either 5.25% or your contract rate plus 2%, whichever is higher. It counts only T4 employment income. It ignores context.

That means:
• Self-employed Canadians with real income but variable T4s get rejected
• New Canadians without 2 years of Canadian credit history get rejected
• People who've recently changed careers get rejected
• People whose total income is just below the threshold get rejected

None of these people are bad risks. They simply don't fit the formula. Seller financing lets a human make the call instead.`,
      },
      {
        heading: "What You're Actually Agreeing To",
        body: `A VTB mortgage is a real, registered mortgage on the property. When you close:
• Title transfers to you — you own the home
• The seller registers a charge (mortgage) on your title
• You make monthly payments to the seller according to your agreed terms
• When the balance is fully paid, the seller discharges the charge and you own the home outright

The terms you negotiate — interest rate, down payment, amortization period, payment schedule — are all written into a legal document drafted by your lawyer. This is not informal. It is as binding as any bank mortgage.`,
      },
      {
        heading: "What Happens If You Can't Pay",
        body: `This is important to understand going in. If you default on a seller-financed mortgage, the seller has the same legal remedies as a bank. They can initiate Power of Sale (sell the property to recover what you owe) or pursue foreclosure (reclaim ownership entirely).

Ontario law gives you a redemption period — typically 35 days minimum after a formal Notice of Default — during which you can bring the mortgage current and stop the process. But if you cannot, the seller can move to sell the property.

This is why you should only enter a VTB arrangement if your monthly payment is genuinely within your budget with room to spare, and why independent legal advice for the buyer is not optional.`,
      },
      {
        heading: "The Real Cost Comparison",
        body: `People assume seller-financed deals are more expensive. They're often not.

Bank mortgage at 6.8% on $480,000 ($600K home, $120K down): ~$3,338/month
Seller-financed VTB at 7.5% on $480,000: ~$3,522/month

The difference is about $184/month — or $2,208/year. In exchange, you avoid:
• Months of mortgage application process
• Potential rejection
• The stress of not knowing whether you'll qualify
• Potentially losing the home you wanted to someone with better bank paperwork

For many buyers, that $2,208 is a bargain for certainty and access.`,
      },
      {
        heading: "Can I Use a Realtor?",
        body: `Yes. You can absolutely have a buyer's agent represent you in a LandMatch deal. Your agent helps you evaluate the property, negotiate terms, and understand the agreement. Their commission is between you and your agent — it doesn't come from the seller's side.

Having a buyer's agent doesn't change the seller's decision to use LandMatch or offer seller financing. The seller still saves their listing commission. You still get professional representation. Both sides win.`,
      },
    ],
    cta: { label: "Create Your Buyer Profile", href: "/create-profile" },
  },

  {
    id: "closing-without-a-bank",
    category: "The Process",
    categoryColor: "bg-teal-100 text-teal-700",
    title: "The Closing Process Without a Bank",
    subtitle: "Step by step — what actually happens when you close a seller-financed deal.",
    readTime: "5 min read",
    icon: "✍️",
    heroColor: "from-teal-600 to-teal-800",
    summary: "Closing a seller-financed deal uses the same legal process as any real estate transaction in Ontario — just without a bank in the middle. A real estate lawyer handles the paperwork, registers the mortgage, and transfers the title. Here's exactly what that looks like.",
    sections: [
      {
        heading: "Step 1: Find Your Match",
        body: `On LandMatch, sellers list their property with financing terms. Buyers create profiles with their financial details. The platform calculates a match score based on deal type alignment, interest rate compatibility, down payment capacity, monthly affordability, and location. When both sides are interested, they connect — optionally after signing a mutual NDA to protect financial details.`,
      },
      {
        heading: "Step 2: Negotiate Terms Directly",
        body: `Unlike a bank negotiation, seller-financed terms are flexible. You negotiate:
• Down payment amount (usually 10–30%)
• Interest rate (the seller's return on their investment)
• Amortization period (how long until the balance is fully paid)
• Term (how long before the mortgage comes up for renewal or balloon payment)
• Any special conditions (prepayment rights, renewal options, etc.)

Both parties should approach this with their own legal counsel present or available.`,
      },
      {
        heading: "Step 3: Agreement of Purchase and Sale",
        body: `Your lawyer drafts or reviews an Agreement of Purchase and Sale (APS) that includes the seller-financing terms as a condition. This document is legally binding once signed by both parties. The APS specifies:
• The property being sold
• The purchase price
• The VTB mortgage terms
• Any conditions (inspection, title search, etc.)
• The closing date`,
      },
      {
        heading: "Step 4: Due Diligence",
        body: `Before closing, the buyer should:
• Get a home inspection (use a vetted inspector from our Partner Directory)
• Have a lawyer conduct a title search
• Confirm property tax status
• Review any existing liens or encumbrances on the title

The seller should:
• Verify the buyer's income and financial capacity
• Review the buyer's LandMatch profile and DTI ratio
• Conduct their own financial due diligence`,
      },
      {
        heading: "Step 5: The Lawyer Closes It",
        body: `On closing day, your lawyers:
1. Transfer the title from seller to buyer
2. Register the VTB mortgage (charge) on the title in the seller's name
3. Handle any existing mortgage discharge (if the seller had a mortgage to pay out)
4. Register title insurance for both parties
5. Exchange funds — the buyer's down payment goes to the seller; the seller's registered mortgage secures their outstanding balance

After closing, the buyer sends monthly payments to the seller. When the balance reaches zero, the seller signs a discharge of mortgage, which removes their charge from the title. The buyer owns the property free and clear.`,
      },
    ],
    cta: { label: "Find a Real Estate Lawyer", href: "/partners?category=lawyer" },
  },

  {
    id: "rent-to-own-vs-seller-finance",
    category: "Comparisons",
    categoryColor: "bg-purple-100 text-purple-700",
    title: "Rent-to-Own vs. Seller Finance: Which One Is Right for You?",
    subtitle: "Two paths to homeownership without a bank. Different tools for different situations.",
    readTime: "5 min read",
    icon: "⚖️",
    heroColor: "from-purple-600 to-purple-800",
    summary: "Both rent-to-own and seller financing let buyers get into a home without traditional bank approval. But they work very differently, have different legal implications, and suit different buyer situations. Here's how to choose.",
    sections: [
      {
        heading: "Seller Finance (VTB): The Buyer Owns the Home at Closing",
        body: `With a VTB mortgage, title transfers to the buyer on closing day. You own the home. You pay property taxes. You maintain insurance. The seller holds a registered mortgage charge — but the home is yours.

This is the stronger path if you have a solid down payment and stable income, because ownership brings full equity building from day one. Every payment reduces your debt and builds your net worth. If the home appreciates, all of that appreciation is yours.`,
      },
      {
        heading: "Rent-to-Own: The Buyer Earns the Right to Purchase",
        body: `In a rent-to-own, the buyer rents the property for a set period (typically 1–3 years) and has the option (but not the obligation) to purchase at a pre-agreed price at the end of the term. A portion of each monthly payment is credited toward the eventual purchase price or down payment.

During the rental period, the seller still owns the home. You do not build equity in the traditional sense — you build a credit toward the future purchase. If you choose not to buy at the end of the term, you walk away (though you typically forfeit the credits accumulated).`,
      },
      {
        heading: "Which Buyer Suits Which Structure",
        body: `Consider seller financing (VTB) if:
• You have a meaningful down payment (10–30%)
• Your income is stable but perhaps not recognized by a bank
• You want full ownership from day one
• You're confident in your ability to maintain monthly payments

Consider rent-to-own if:
• You need time to save a larger down payment
• Your credit situation is improving but not yet strong
• You want to "test" the home and neighborhood before committing
• Your income may stabilize but isn't consistent today`,
      },
      {
        heading: "The Legal Difference Matters",
        body: `Because title transfers in a VTB deal, sellers have the stronger legal position. Their mortgage is registered on the title, and enforcement follows Ontario's established mortgage remedies.

Rent-to-own agreements are governed more by contract law than mortgage law. The buyer's rights depend heavily on how the agreement is drafted. This is another reason a real estate lawyer is essential — the way a rent-to-own agreement is written determines what happens if either party doesn't follow through.`,
      },
    ],
    cta: { label: "Browse Rent-to-Own and VTB Listings", href: "/listings" },
  },
];

export function getArticleById(id) {
  return ARTICLES.find((a) => a.id === id) || null;
}

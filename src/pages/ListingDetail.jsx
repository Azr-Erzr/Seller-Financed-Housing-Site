import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { LISTINGS, PROFILES } from "../data/seed";
import { Card, Btn, Badge, Img, money, Input } from "../ui/UIComponents.jsx";
import { monthlyPayment } from "../lib/finance";
import { scoreMatch } from "../lib/match";
import NDA from "../components/NDA";
import ProfileCard from "../components/ProfileCard";

export default function ListingDetail() {
  const { id } = useParams();
  const listing = LISTINGS.find(l => l.id === id) || LISTINGS[0];

  const [down, setDown] = useState(Math.round(listing.price * (listing.downMinPct || 0.1)));
  const [rate, setRate] = useState(((listing.interestRange?.[0] || 0.06) * 100).toFixed(2));
  const [term, setTerm] = useState(listing.termYears || 30);
  const [nda, setNda] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const monthly = useMemo(() =>
    monthlyPayment({ price: listing.price, down, rateAnnual: Number(rate)/100, termYears: term }), [listing.price, down, rate, term]);

  const matches = useMemo(() => {
    const scored = PROFILES.map(p => ({ p, score: scoreMatch({ listing, profile: p }) }));
    return scored.sort((a,b)=>b.score - a.score).slice(0,4);
  }, [listing]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid lg:grid-cols-[1.05fr,0.7fr] gap-6">
      {/* Left: gallery + description */}
      <section className="space-y-4">
        <Card className="p-0 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-1">
            <Img src={listing.images?.[0]} alt={listing.title} className="w-full h-full object-cover aspect-[4/3]" />
            <Img src={listing.images?.[1]} alt={listing.title} className="w-full h-full object-cover aspect-[4/3]" />
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl md:text-2xl font-bold">{listing.title}</h1>
            <div className="text-lg font-semibold">{money(listing.price)}</div>
          </div>
          <div className="text-sm text-neutral-600">{listing.address}, {listing.city} {listing.state}</div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {listing.dealTypes?.includes("rent-to-own") && <Badge color="#FFF7ED" text="#C2410C">Rent-to-Own</Badge>}
            {listing.dealTypes?.includes("seller-finance") && <Badge color="#ECFDF5" text="#065F46">Seller-Finance</Badge>}
            <Badge>Down ≥ {(listing.downMinPct*100).toFixed(0)}%</Badge>
            <Badge>Rate {((listing.interestRange?.[0]||0)*100).toFixed(1)}–{((listing.interestRange?.[1]||0)*100).toFixed(1)}%</Badge>
            <Badge>{listing.termYears}y term</Badge>
          </div>

          <p className="mt-4 text-neutral-700 text-sm leading-relaxed">{listing.description}</p>
        </Card>

        {/* Documents */}
        <Card>
          <div className="font-semibold mb-2">Documents</div>
          {!unlocked ? (
            <div className="text-sm text-neutral-600">
              <p>Inspection, title, financial projections, and seller disclosures are gated.</p>
              <Btn className="mt-3" tone="accent" onClick={()=>setNda(true)}>Sign NDA to unlock</Btn>
            </div>
          ) : (
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Inspection report (PDF)</li>
              <li>Title search summary</li>
              <li>Seller’s goal brief</li>
              <li>Sample amortization table (CSV)</li>
            </ul>
          )}
        </Card>

        <NDA open={nda} onClose={()=>setNda(false)} alias="the seller" onApprove={()=>setUnlocked(true)} />
      </section>

      {/* Right: finance + matches */}
      <aside className="space-y-4">
        <Card>
          <div className="font-semibold mb-2">Run your numbers</div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Down payment" type="number" value={down} onChange={e=>setDown(Number(e.target.value)||0)} />
            <Input label="Rate (%)" type="number" value={rate} step="0.01" onChange={e=>setRate(e.target.value)} />
            <Input label="Term (years)" type="number" value={term} onChange={e=>setTerm(Number(e.target.value)||30)} />
            <div className="flex items-end"><div className="text-sm text-neutral-600">Min down: {money(listing.price*listing.downMinPct)}</div></div>
          </div>
          <div className="mt-3 text-lg font-semibold">Est. payment: {money(monthly, "USD", 0)}/mo</div>
          <div className="mt-3 flex gap-2">
            <Btn tone="accent">Chat / Apply</Btn>
            <Btn className="border">Save</Btn>
          </div>
        </Card>

        <Card>
          <div className="font-semibold mb-3">Top buyer matches</div>
          <div className="space-y-3">
            {matches.map(({p, score}) => (
              <ProfileCard key={p.id} profile={p} listingForMatch={listing} />
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}
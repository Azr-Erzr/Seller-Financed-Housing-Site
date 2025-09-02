import React from "react";
import { Link } from "react-router-dom";
import { Badge, Btn, money } from "../ui/UIComponents.jsx";
import { scoreMatch } from "../lib/match";

const Avatar = ({ name }) => (
  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-orange/20 flex items-center justify-center">
    <span className="text-sm font-semibold">{name?.split(" ").map(s=>s[0]).join("").slice(0,2)}</span>
  </div>
);

export default function ProfileCard({ profile, listingForMatch }) {
  const p = profile || {};
  const match = listingForMatch ? scoreMatch({ listing: listingForMatch, profile: p }) : null;

  return (
    <article className="rounded-2xl bg-white ring-1 ring-black/10 p-4 hover:shadow-soft transition">
      <div className="flex items-center gap-3">
        <Avatar name={p.name} />
        <div className="min-w-0">
          <div className="font-semibold leading-tight">{p.name}</div>
          <div className="text-xs text-neutral-600">{p.location}</div>
        </div>
        <div className="ml-auto">{match !== null && <Badge color="#EEF2FF" text="#1D4ED8">Match {match}%</Badge>}</div>
      </div>

      <div className="mt-3 text-sm text-neutral-700">{p.bio}</div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <Badge>Down: {money(p.downBudget)}</Badge>
        <Badge>Interest ≤ {(p.interestMax*100).toFixed(1)}%</Badge>
        <Badge>Budget: {money(p.paymentBudget)}</Badge>
        {p.dealPreference?.includes("rent-to-own") && <Badge color="#FFF7ED" text="#C2410C">RTO</Badge>}
        {p.dealPreference?.includes("seller-finance") && <Badge color="#ECFDF5" text="#065F46">SF</Badge>}
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <Btn variant="chip" className="border"><Link to={`/profile/${p.id}`}>View</Link></Btn>
        <Btn variant="chip" tone="accent">Invite</Btn>
      </div>
    </article>
  );
}
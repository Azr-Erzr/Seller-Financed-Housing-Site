import React from "react";
import { Link } from "react-router-dom";
import { Img, Badge, Btn, money } from "../ui/UIComponents.jsx";
import { scoreMatch } from "../lib/match";

export default function ListingCard({ listing, profileForMatch }) {
  const l = listing || {};
  const match = profileForMatch ? scoreMatch({ listing: l, profile: profileForMatch }) : null;

  return (
    <article className="rounded-2xl overflow-hidden bg-white ring-1 ring-black/10 hover:shadow-soft transition">
      <Link to={`/listing/${l.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden">
          <Img src={l.images?.[0]} alt={l.title} className="h-full w-full object-cover" />
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base md:text-lg font-semibold leading-snug line-clamp-2">{l.title}</h3>
          {match !== null && (
            <Badge color="#EEF2FF" text="#1D4ED8" className="shrink-0">Match {match}%</Badge>
          )}
        </div>

        <div className="text-sm text-neutral-700">{money(l.price, "USD", 0)}</div>
        <div className="text-xs text-neutral-600 flex flex-wrap items-center gap-2">
          <span>{l.city}, {l.state}</span>·
          <span>{l.bedrooms} bd</span>·
          <span>{l.baths} ba</span>·
          <span>{l.sqft?.toLocaleString()} sqft</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {l.dealTypes?.includes("rent-to-own") && <Badge color="#FFF7ED" text="#C2410C">Rent-to-Own</Badge>}
          {l.dealTypes?.includes("seller-finance") && <Badge color="#ECFDF5" text="#065F46">Seller-Finance</Badge>}
          {l.badges?.map((b, i) => <Badge key={i}>{b}</Badge>)}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Btn variant="chip" className="border">
            <Link to={`/listing/${l.id}`}>View</Link>
          </Btn>
          <Btn variant="chip" tone="accent">Chat / Apply</Btn>
        </div>
      </div>
    </article>
  );
}
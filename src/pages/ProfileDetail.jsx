import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PROFILES, LISTINGS } from "../data/seed";
import { Card, Btn, Badge, money } from "../ui/UIComponents.jsx";
import { scoreMatch } from "../lib/match";
import ListingCard from "../components/ListingCard";

export default function ProfileDetail() {
  const { id } = useParams();
  const profile = PROFILES.find(p => p.id === id) || PROFILES[0];

  const matches = useMemo(() => {
    const scored = LISTINGS.map(l => ({ l, score: scoreMatch({ listing: l, profile }) }));
    return scored.sort((a,b)=>b.score - a.score).slice(0,4);
  }, [profile]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid lg:grid-cols-[0.8fr,1.2fr] gap-6">
      <aside className="space-y-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-orange/20 flex items-center justify-center">
              <span className="font-semibold">{profile.name.split(" ").map(s=>s[0]).join("").slice(0,2)}</span>
            </div>
            <div>
              <div className="text-lg font-semibold">{profile.name}</div>
              <div className="text-xs text-neutral-600">{profile.location}</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-neutral-700">{profile.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Badge>Down {money(profile.downBudget)}</Badge>
            <Badge>Interest ≤ {(profile.interestMax*100).toFixed(1)}%</Badge>
            <Badge>Budget {money(profile.paymentBudget)}</Badge>
            {profile.dealPreference?.includes("rent-to-own") && <Badge color="#FFF7ED" text="#C2410C">RTO</Badge>}
            {profile.dealPreference?.includes("seller-finance") && <Badge color="#ECFDF5" text="#065F46">SF</Badge>}
          </div>
          <div className="mt-4 flex gap-2">
            <Btn tone="accent">Invite to listing</Btn>
            <Btn className="border">Message</Btn>
          </div>
        </Card>
      </aside>

      <main className="space-y-4">
        <Card>
          <div className="font-semibold mb-3">Suggested listings</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.map(({l}) => <ListingCard key={l.id} listing={l} profileForMatch={profile} />)}
          </div>
        </Card>
      </main>
    </div>
  );
}
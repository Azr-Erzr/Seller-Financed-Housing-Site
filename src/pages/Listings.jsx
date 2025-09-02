import React, { useMemo, useState } from "react";
import { Input, Select, Card, Btn } from "../ui/UIComponents.jsx";
import ListingCard from "../components/ListingCard";
import { LISTINGS, PROFILES } from "../data/seed";

export default function Listings() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [deal, setDeal] = useState("any");
  const [q, setQ] = useState("");

  const homes = useMemo(() => {
    return LISTINGS.filter(l => {
      if (q && ![l.title, l.city, l.state].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
      if (deal !== "any" && !l.dealTypes?.includes(deal)) return false;
      if (minPrice && l.price < Number(minPrice)) return false;
      if (maxPrice && l.price > Number(maxPrice)) return false;
      return true;
    });
  }, [q, deal, minPrice, maxPrice]);

  const demoMatchProfile = PROFILES[0]; // to show "match" pill on cards

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-[280px,1fr] gap-6">
      <aside className="space-y-4">
        <Card>
          <div className="text-sm font-semibold mb-2">Filters</div>
          <div className="space-y-3">
            <Input label="Search" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="City, address…" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Min price" value={minPrice} onChange={e=>setMinPrice(e.target.value)} placeholder="250000" />
              <Input label="Max price" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="900000" />
            </div>
            <Select label="Deal type" value={deal} onChange={(e)=>setDeal(e.target.value)} options={[
              {value:"any",label:"Any"}, {value:"seller-finance",label:"Seller-finance"}, {value:"rent-to-own",label:"Rent-to-own"}
            ]}/>
            <Btn className="w-full border" onClick={() => { setQ(""); setDeal("any"); setMinPrice(""); setMaxPrice(""); }}>Reset</Btn>
          </div>
        </Card>
      </aside>

      <main className="min-w-0">
        <div className="mb-4 text-sm text-neutral-600">{homes.length} homes</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {homes.map(l => <ListingCard key={l.id} listing={l} profileForMatch={demoMatchProfile} />)}
        </div>
      </main>
    </div>
  );
}
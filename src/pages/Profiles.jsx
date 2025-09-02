import React, { useMemo, useState } from "react";
import { Input, Select, Card, Btn } from "../ui/UIComponents.jsx";
import ProfileCard from "../components/ProfileCard";
import { PROFILES, LISTINGS } from "../data/seed";

export default function Profiles() {
  const [q, setQ] = useState("");
  const [pref, setPref] = useState("any");

  const people = useMemo(() => {
    return PROFILES.filter(p => {
      if (q && ![p.name, p.location, p.bio].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
      if (pref !== "any" && !p.dealPreference?.includes(pref)) return false;
      return true;
    });
  }, [q, pref]);

  const demoListing = LISTINGS[0]; // for match pill

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-[280px,1fr] gap-6">
      <aside className="space-y-4">
        <Card>
          <div className="text-sm font-semibold mb-2">Filters</div>
          <div className="space-y-3">
            <Input label="Search" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Name, city, keywords…" />
            <Select label="Deal preference" value={pref} onChange={e=>setPref(e.target.value)} options={[
              {value:"any", label:"Any"},
              {value:"seller-finance", label:"Seller-finance"},
              {value:"rent-to-own", label:"Rent-to-own"}
            ]}/>
            <Btn className="w-full border" onClick={() => { setQ(""); setPref("any"); }}>Reset</Btn>
          </div>
        </Card>
      </aside>

      <main>
        <div className="mb-4 text-sm text-neutral-600">{people.length} buyers</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {people.map(p => <ProfileCard key={p.id} profile={p} listingForMatch={demoListing} />)}
        </div>
      </main>
    </div>
  );
}
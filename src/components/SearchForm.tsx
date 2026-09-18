"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PracticeArea } from "@/lib/types";

export default function SearchForm({ areas, defaultArea = "", defaultQ = "", compact = false }: { areas: PracticeArea[]; defaultArea?: string; defaultQ?: string; compact?: boolean }) {
  const router = useRouter();
  const [area, setArea] = useState(defaultArea);
  const [q, setQ] = useState(defaultQ);
  const [locating, setLocating] = useState(false);

  function go(params: Record<string, string>) {
    const sp = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
    router.push(`/search?${sp.toString()}`);
  }
  function nearMe() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => { setLocating(false); go({ area, lat: p.coords.latitude.toFixed(5), lng: p.coords.longitude.toFixed(5) }); },
      () => setLocating(false), { timeout: 8000 });
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); go({ area, q }); }} className={`grid gap-3 ${compact ? "md:grid-cols-[1fr_1fr_auto_auto]" : "md:grid-cols-[1.2fr_1fr_auto_auto]"}`}>
      <label className="grid gap-1 text-sm">
        <span>What do you need help with?</span>
        <select value={area} onChange={(e) => setArea(e.target.value)} className="border border-line bg-paper px-3 py-2.5 rounded-sm">
          <option value="">Any practice area</option>
          {areas.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span>Suburb, postcode or firm name</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Parramatta or 2548" className="border border-line bg-paper px-3 py-2.5 rounded-sm" />
      </label>
      <button type="submit" className="self-end bg-green text-paper px-5 py-2.5 rounded-sm hover:bg-green-deep">Search</button>
      <button type="button" onClick={nearMe} disabled={locating} className="self-end border border-green text-green px-4 py-2.5 rounded-sm hover:bg-stone disabled:opacity-60">{locating ? "Locating…" : "Near me"}</button>
    </form>
  );
}

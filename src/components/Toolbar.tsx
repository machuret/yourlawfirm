"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Clock, BadgeCheck, Star, HandCoins, Gift, List, Map as MapIcon, X } from "lucide-react";
const CHIPS = [{ k: "open", label: "Open now", I: Clock, tip: "Open right now, based on published hours" }, { k: "verified", label: "Verified", I: BadgeCheck, tip: "Phone confirmed on the firm’s site and Google" },
  { k: "top", label: "4★ and up", I: Star, tip: "Google rating 4.0+ from at least 3 reviews" }, { k: "free", label: "Free first consult", I: Gift, tip: "Advertises a free first consultation" }, { k: "nwnf", label: "No win, no fee", I: HandCoins, tip: "Mentions no win, no fee arrangements" }];
const LANGS = ["mandarin", "cantonese", "vietnamese", "arabic", "greek", "italian", "hindi", "punjabi", "spanish", "korean"];
export default function Toolbar({ count }: { count: number }) {
  const router = useRouter(); const path = usePathname(); const sp = useSearchParams(); const [pending, start] = useTransition();
  function set(k: string, v: string | null) { const u = new URLSearchParams(sp.toString()); if (v == null) u.delete(k); else u.set(k, v); u.delete("page"); start(() => router.push(`${path}${u.toString() ? `?${u}` : ""}`, { scroll: false })); }
  const active = CHIPS.some((c) => sp.get(c.k) === "1") || !!sp.get("lang");
  const view = sp.get("view") === "map" ? "map" : "list";
  return (
    <div className={`sticky top-14 z-30 -mx-[22px] border-b border-hair bg-glass px-[22px] py-3 backdrop-blur-xl transition-opacity ${pending ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-3">
        <div className="scroll-x flex-1">
          {CHIPS.map(({ k, label, I, tip }) => { const on = sp.get(k) === "1"; return (
            <button key={k} title={tip} aria-pressed={on} onClick={() => set(k, on ? null : "1")} className={`pill shrink-0 border ${on ? "border-accent bg-accent-soft text-accent-deep" : "border-transparent hover:bg-hair"}`}><I className="h-3.5 w-3.5" />{label}</button>); })}
          <select aria-label="Language" value={sp.get("lang") ?? ""} onChange={(e) => set("lang", e.target.value || null)} className={`pill shrink-0 min-w-[9.5rem] appearance-none border pr-2 !text-[14px] ${sp.get("lang") ? "border-accent bg-accent-soft text-accent-deep" : "border-transparent"}`}>
            <option value="">Any language</option>{LANGS.map((l) => <option key={l} value={l}>{l[0].toUpperCase() + l.slice(1)}</option>)}</select>
          {active ? <button onClick={() => { const u = new URLSearchParams(); for (const k of ["q", "sort", "view"]) { const v = sp.get(k); if (v) u.set(k, v); } start(() => router.push(`${path}${u.toString() ? `?${u}` : ""}`, { scroll: false })); }} className="pill shrink-0 text-muted hover:bg-hair"><X className="h-3.5 w-3.5" />Clear</button> : null}
        </div>
        <select aria-label="Sort" value={sp.get("sort") ?? "best"} onChange={(e) => set("sort", e.target.value === "best" ? null : e.target.value)} className="hidden appearance-none rounded-full border border-hair bg-paper px-4 py-1.5 text-[14px] sm:block">
          <option value="best">Best match</option><option value="rating">Highest rated</option><option value="reviews">Most reviewed</option><option value="name">Name A–Z</option></select>
        <div className="flex shrink-0 rounded-full bg-soft p-0.5" role="group" aria-label="View">
          <button aria-pressed={view === "list"} onClick={() => set("view", null)} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] ${view === "list" ? "bg-paper shadow-sm" : "text-muted"}`}><List className="h-3.5 w-3.5" />List</button>
          <button aria-pressed={view === "map"} onClick={() => set("view", "map")} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] ${view === "map" ? "bg-paper shadow-sm" : "text-muted"}`}><MapIcon className="h-3.5 w-3.5" />Map</button>
        </div>
      </div>
      <p className="mt-2 text-[13px] text-muted" aria-live="polite">{count.toLocaleString("en-AU")} {count === 1 ? "firm" : "firms"}{active ? " match your filters" : ""}</p>
    </div>
  );
}

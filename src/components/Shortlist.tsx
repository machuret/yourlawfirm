"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Heart, X, Scale } from "lucide-react";
type Item = { slug: string; name: string };
const KEY = "shortlist:v1"; const EVT = "shortlist-change";
function read(): Item[] { try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; } }
function write(v: Item[]) { try { localStorage.setItem(KEY, JSON.stringify(v.slice(0, 4))); window.dispatchEvent(new Event(EVT)); } catch {} }
function useList() {
  return useSyncExternalStore((cb) => { window.addEventListener(EVT, cb); window.addEventListener("storage", cb); return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); }; },
    () => localStorage.getItem(KEY) ?? "[]", () => "[]");
}
export function SaveButton({ slug, name }: { slug: string; name: string }) {
  const raw = useList(); const list: Item[] = JSON.parse(raw); const on = list.some((x) => x.slug === slug);
  return (
    <button type="button" aria-pressed={on} aria-label={on ? `Remove ${name} from shortlist` : `Add ${name} to shortlist`} title={on ? "Remove from shortlist" : "Add to shortlist to compare"}
      onClick={(e) => { e.preventDefault(); const cur = read(); write(on ? cur.filter((x) => x.slug !== slug) : [...cur.filter((x) => x.slug !== slug), { slug, name }]); }}
      className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition ${on ? "bg-[#ffe9ec] text-[#e11d48]" : "bg-soft text-muted hover:text-ink"}`}>
      <Heart className={`h-4 w-4 ${on ? "fill-current" : ""}`} />
    </button>
  );
}
export function CompareTray() {
  const raw = useList(); const list: Item[] = JSON.parse(raw); const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !list.length) return null;
  return (
    <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-3 md:bottom-6">
      <div className="flex max-w-full items-center gap-2 rounded-full border border-hair bg-[rgba(29,29,31,.92)] p-1.5 pl-4 text-white shadow-[0_12px_40px_rgba(0,0,0,.25)] backdrop-blur-xl">
        <Heart className="h-4 w-4 shrink-0 fill-current text-[#fb7185]" />
        <ul className="scroll-x max-w-[50vw] text-[13px]">{list.map((x) => <li key={x.slug} className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 py-1 pl-3 pr-1">{x.name.length > 22 ? x.name.slice(0, 21) + "…" : x.name}
          <button aria-label={`Remove ${x.name}`} onClick={() => write(read().filter((y) => y.slug !== x.slug))} className="rounded-full p-0.5 hover:bg-white/15"><X className="h-3 w-3" /></button></li>)}</ul>
        <Link href={`/compare?f=${list.map((x) => x.slug).join(",")}`} className={`btn !py-2 text-[13px] ${list.length > 1 ? "bg-white text-ink" : "pointer-events-none bg-white/20 text-white/60"}`} aria-disabled={list.length < 2}><Scale className="h-4 w-4" />Compare {list.length}</Link>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Suggestion } from "@/lib/types";
const KIND: Record<string, string> = { category: "Area of law", area: "Area of law", region: "Location", suburb: "Suburb", firm: "Law firm" };
export default function SearchBox({ size = "md", placeholder = "Search a legal issue, suburb or firm" }: { size?: "sm" | "md" | "lg"; placeholder?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(""); const [items, setItems] = useState<Suggestion[]>([]); const [open, setOpen] = useState(false); const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null); const id = useRef(`sb-${Math.random().toString(36).slice(2, 8)}`).current;
  useEffect(() => {
    if (q.trim().length < 2) { setItems([]); return; }
    const c = new AbortController();
    const t = setTimeout(() => { fetch(`/api/suggest?q=${encodeURIComponent(q)}`, { signal: c.signal }).then((r) => r.json()).then((d) => { setItems(d); setOpen(true); setActive(-1); }).catch(() => {}); }, 160);
    return () => { clearTimeout(t); c.abort(); };
  }, [q]);
  useEffect(() => { const h = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  function go(url: string) { setOpen(false); router.push(url); }
  function submit(e: React.FormEvent) { e.preventDefault(); if (active >= 0 && items[active]) return go(items[active].url); if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`); }
  function key(e: React.KeyboardEvent) {
    if (!open || !items.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % items.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a <= 0 ? items.length - 1 : a - 1)); }
    else if (e.key === "Escape") setOpen(false);
  }
  const pad = size === "lg" ? "py-4 pl-6 pr-32 text-[19px]" : size === "sm" ? "py-1.5 pl-4 pr-20 text-[14px]" : "py-3 pl-5 pr-28";
  return (
    <div ref={box} className="relative w-full">
      <form onSubmit={submit} role="search">
        <label htmlFor={id} className="sr-only">Search</label>
        <input id={id} value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => items.length && setOpen(true)} onKeyDown={key} placeholder={placeholder} autoComplete="off"
          role="combobox" aria-expanded={open} aria-controls={`${id}-list`} aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
          className={`w-full rounded-full border border-hair bg-paper text-ink shadow-[0_2px_12px_rgba(0,0,0,.06)] outline-none focus:border-accent ${pad}`} />
        <button type="submit" className={`absolute right-1.5 top-1/2 -translate-y-1/2 btn btn-primary ${size === "sm" ? "!px-3 !py-1 !text-[13px]" : ""}`}>Search</button>
      </form>
      {open && items.length ? (
        <ul id={`${id}-list`} role="listbox" className="absolute z-50 mt-2 max-h-96 w-full overflow-auto rounded-2xl border border-hair bg-paper p-1.5 text-left text-ink shadow-[0_20px_50px_rgba(0,0,0,.14)]">
          {items.map((s, i) => (
            <li key={s.url + i} id={`${id}-${i}`} role="option" aria-selected={i === active}>
              <button type="button" onMouseEnter={() => setActive(i)} onClick={() => go(s.url)} className={`flex w-full items-center justify-between gap-4 rounded-xl px-3.5 py-2.5 text-left ${i === active ? "bg-soft" : ""}`}>
                <span><span className="block font-medium">{s.label}</span>{s.sublabel ? <span className="block text-xs text-muted">{s.sublabel}</span> : null}</span>
                <span className="shrink-0 text-[12px] text-accent">{KIND[s.kind]}</span>
              </button>
            </li>))}
        </ul>) : null}
    </div>
  );
}

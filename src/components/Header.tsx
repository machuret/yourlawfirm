"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import SearchBox from "./SearchBox";
type G = { slug: string; name: string; areas: { slug: string; name: string }[] };
type R = { state: string; name: string; regions: { slug: string; name: string }[] };
export default function Header({ brand, groups, states }: { brand: string; groups: G[]; states: R[] }) {
  const [open, setOpen] = useState<null | "law" | "loc" | "mob">(null);
  const ref = useRef<HTMLElement>(null); const path = usePathname();
  useEffect(() => setOpen(null), [path]);
  useEffect(() => { const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(null); }; const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", h); document.addEventListener("keydown", k); return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); }; }, []);
  const tog = (k: "law" | "loc" | "mob") => setOpen((o) => (o === k ? null : k));
  return (
    <header ref={ref} className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="wrap flex items-center gap-6 py-3">
        <Link href="/" className="font-display text-2xl text-green-deep shrink-0">{brand}</Link>
        <nav className="hidden lg:flex items-center gap-1 text-sm" aria-label="Main">
          <button onClick={() => tog("law")} aria-expanded={open === "law"} className={`navbtn ${open === "law" ? "bg-stone" : ""}`}>Areas of law <span aria-hidden="true">▾</span></button>
          <button onClick={() => tog("loc")} aria-expanded={open === "loc"} className={`navbtn ${open === "loc" ? "bg-stone" : ""}`}>Locations <span aria-hidden="true">▾</span></button>
          <Link href="/search" className="navbtn">Find a lawyer</Link>
          <Link href="/claim" className="navbtn">For law firms</Link>
        </nav>
        <div className="ml-auto hidden md:block w-80"><SearchBox size="sm" placeholder="Search law, suburb or firm" /></div>
        <button className="lg:hidden ml-auto md:ml-0 navbtn" onClick={() => tog("mob")} aria-expanded={open === "mob"} aria-label="Menu">{open === "mob" ? "Close" : "Menu"}</button>
      </div>
      {open === "law" ? (
        <div className="absolute inset-x-0 top-full border-b border-line bg-paper shadow-xl">
          <div className="wrap grid gap-x-8 gap-y-6 py-8 md:grid-cols-4 max-h-[75vh] overflow-auto">
            {groups.map((g) => (
              <div key={g.slug}>
                <Link href={`/law/${g.slug}`} className="font-display text-lg text-green-deep hover:underline">{g.name}</Link>
                <ul className="mt-2 grid gap-1 text-sm">{g.areas.slice(0, 7).map((a) => <li key={a.slug}><Link href={`/law/${g.slug}/${a.slug}`} className="text-ink/80 hover:text-ink hover:underline">{a.name}</Link></li>)}
                  {g.areas.length > 7 ? <li><Link href={`/law/${g.slug}`} className="text-brass hover:underline">All {g.areas.length}</Link></li> : null}</ul>
              </div>))}
          </div>
        </div>) : null}
      {open === "loc" ? (
        <div className="absolute inset-x-0 top-full border-b border-line bg-paper shadow-xl">
          <div className="wrap grid gap-x-8 gap-y-6 py-8 sm:grid-cols-2 md:grid-cols-4 max-h-[75vh] overflow-auto">
            {states.map((s) => (
              <div key={s.state}>
                <p className="font-display text-lg text-green-deep">{s.name}</p>
                <ul className="mt-2 grid gap-1 text-sm">{s.regions.map((r) => <li key={r.slug}><Link href={`/locations/${r.slug}`} className="text-ink/80 hover:text-ink hover:underline">{r.name}</Link></li>)}</ul>
              </div>))}
          </div>
        </div>) : null}
      {open === "mob" ? (
        <div className="lg:hidden border-t border-line bg-paper">
          <div className="wrap py-4 grid gap-4">
            <SearchBox size="sm" />
            <details><summary className="cursor-pointer font-medium">Areas of law</summary>
              <ul className="mt-2 grid gap-1 pl-3 text-sm">{groups.map((g) => <li key={g.slug}><Link href={`/law/${g.slug}`}>{g.name}</Link></li>)}</ul></details>
            <details><summary className="cursor-pointer font-medium">Locations</summary>
              <ul className="mt-2 grid gap-1 pl-3 text-sm">{states.map((s) => <li key={s.state}><Link href={`/locations#${s.state}`}>{s.name}</Link></li>)}</ul></details>
            <Link href="/search" className="font-medium">Find a lawyer</Link>
            <Link href="/claim" className="font-medium">For law firms</Link>
          </div>
        </div>) : null}
    </header>
  );
}

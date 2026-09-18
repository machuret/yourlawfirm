import Link from "next/link";
type G = { slug: string; name: string }; type S = { state: string; name: string };
export default function Footer({ brand, groups, states, popular }: { brand: string; groups: G[]; states: S[]; popular: { href: string; name: string }[] }) {
  return (
    <footer className="mt-28 border-t border-hair bg-soft text-[13px] text-muted">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="display text-[19px] text-ink">{brand}</p>
          <p className="mt-3 leading-relaxed">An independent directory of Australian law firms, solicitors and conveyancers. We don’t give legal advice and we aren’t a law firm.</p>
        </div>
        <div><p className="text-ink font-semibold">Areas of law</p><ul className="mt-3 grid gap-1.5 text-[13px]">{groups.map((g) => <li key={g.slug}><Link href={`/law/${g.slug}`} className="hover:text-ink hover:underline">{g.name}</Link></li>)}</ul></div>
        <div><p className="text-ink font-semibold">Popular searches</p><ul className="mt-3 grid gap-1.5 text-[13px]">{popular.map((p) => <li key={p.href}><Link href={p.href} className="hover:text-ink hover:underline">{p.name}</Link></li>)}</ul></div>
        <div><p className="text-ink font-semibold">Locations</p><ul className="mt-3 grid gap-1.5 text-[13px]">{states.map((s) => <li key={s.state}><Link href={`/locations#${s.state}`} className="hover:text-ink hover:underline">{s.name}</Link></li>)}</ul></div>
        <div><p className="text-ink font-semibold">About</p><ul className="mt-3 grid gap-1.5 text-[13px]">
          <li><Link href="/about" className="hover:text-ink hover:underline">About this directory</Link></li>
          <li><Link href="/claim" className="hover:text-ink hover:underline">Claim or update a listing</Link></li>
          <li><Link href="/contact" className="hover:text-ink hover:underline">Contact</Link></li>
          <li><Link href="/privacy" className="hover:text-ink hover:underline">Privacy policy</Link></li>
          <li><Link href="/terms" className="hover:text-ink hover:underline">Terms of use</Link></li></ul></div>
      </div>
      <div className="border-t border-hair">
        <div className="wrap flex flex-wrap justify-between gap-4 py-6 text-[12px] text-muted">
          <p>© {new Date().getFullYear()} {brand}. Listings are compiled from public sources and firm websites and may be out of date. Always confirm details directly with the firm.</p>
          <p>Ratings and reviews marked “Google” are sourced from Google Maps.</p>
        </div>
      </div>
    </footer>
  );
}

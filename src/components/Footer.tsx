import Link from "next/link";
type G = { slug: string; name: string }; type S = { state: string; name: string };
export default function Footer({ brand, groups, states, popular }: { brand: string; groups: G[]; states: S[]; popular: { href: string; name: string }[] }) {
  return (
    <footer className="mt-24 bg-green-deep text-white/80">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="font-display text-2xl text-white">{brand}</p>
          <p className="mt-3 text-sm leading-relaxed">An independent directory of Australian law firms, solicitors and conveyancers. We don’t give legal advice and we aren’t a law firm.</p>
        </div>
        <div><p className="text-white font-semibold">Areas of law</p><ul className="mt-3 grid gap-1.5 text-sm">{groups.map((g) => <li key={g.slug}><Link href={`/law/${g.slug}`} className="hover:text-white hover:underline">{g.name}</Link></li>)}</ul></div>
        <div><p className="text-white font-semibold">Popular searches</p><ul className="mt-3 grid gap-1.5 text-sm">{popular.map((p) => <li key={p.href}><Link href={p.href} className="hover:text-white hover:underline">{p.name}</Link></li>)}</ul></div>
        <div><p className="text-white font-semibold">Locations</p><ul className="mt-3 grid gap-1.5 text-sm">{states.map((s) => <li key={s.state}><Link href={`/locations#${s.state}`} className="hover:text-white hover:underline">{s.name}</Link></li>)}</ul></div>
        <div><p className="text-white font-semibold">About</p><ul className="mt-3 grid gap-1.5 text-sm">
          <li><Link href="/about" className="hover:text-white hover:underline">About this directory</Link></li>
          <li><Link href="/claim" className="hover:text-white hover:underline">Claim or update a listing</Link></li>
          <li><Link href="/contact" className="hover:text-white hover:underline">Contact</Link></li>
          <li><Link href="/privacy" className="hover:text-white hover:underline">Privacy policy</Link></li>
          <li><Link href="/terms" className="hover:text-white hover:underline">Terms of use</Link></li></ul></div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-wrap justify-between gap-4 py-6 text-xs text-white/60">
          <p>© {new Date().getFullYear()} {brand}. Listings are compiled from public sources and firm websites and may be out of date. Always confirm details directly with the firm.</p>
          <p>Ratings and reviews marked “Google” are sourced from Google Maps.</p>
        </div>
      </div>
    </footer>
  );
}

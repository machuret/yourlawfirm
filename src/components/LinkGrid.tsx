import Link from "next/link";
export default function LinkGrid({ title, links, cols = 3 }: { title: string; links: { href: string; label: string; count?: number }[]; cols?: 2 | 3 | 4 }) {
  if (!links.length) return null;
  const c = cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section className="mt-16">
      <h2 className="text-[24px] font-semibold tracking-tight">{title}</h2>
      <ul className={`mt-4 grid gap-x-8 ${c}`}>
        {links.map((l) => <li key={l.href} className="border-b border-hair"><Link href={l.href} className="flex items-center justify-between gap-3 py-3 text-[15px] hover:text-accent"><span>{l.label}</span>{l.count != null ? <span className="text-[13px] text-muted tabular-nums">{l.count}</span> : null}</Link></li>)}
      </ul>
    </section>
  );
}

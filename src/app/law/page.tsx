import Link from "next/link";
import Hero from "@/components/Hero";
import { getGroups, getPracticeAreas, getAreaCounts, getGroupCounts } from "@/lib/queries";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
export const metadata = { title: "Areas of law", description: "Browse every area of law, from family and wills to criminal, injury, property, business and immigration.", ...canonical("/law") };
export default async function Law() {
  const [groups, areas, counts, gc] = await Promise.all([getGroups(), getPracticeAreas(), getAreaCounts(), getGroupCounts()]);
  return (<>
    <Hero title="Areas of law" intro="Choose the area that fits your problem. Each page explains what the lawyers do, common questions, and firms that practise in it." crumbs={[{ name: "Areas of law" }]} />
    <div className="wrap py-14 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (<section key={g.slug}>
        <h2 className="text-[22px] font-semibold tracking-tight"><Link href={`/law/${g.slug}`} className="hover:text-accent">{g.name}</Link> <span className="text-[15px] text-muted font-normal">{gc[g.slug] ?? 0}</span></h2>
        <ul className="mt-3 grid gap-1.5">{areas.filter((a) => a.group_slug === g.slug).map((a) => <li key={a.slug} className="flex justify-between gap-3 text-[15px] border-b border-hair py-2"><Link href={`/law/${g.slug}/${a.slug}`} className="hover:text-accent">{a.name}</Link><span className="text-muted tabular-nums">{counts[a.slug] ?? 0}</span></li>)}</ul>
      </section>))}
    </div></>);
}

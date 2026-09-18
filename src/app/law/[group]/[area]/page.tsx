import Link from "next/link";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import FaqList from "@/components/FaqList";
import ListingList from "@/components/ListingList";
import { getGroup, getPracticeArea, getPracticeAreas, getAreaCounts, listByAreas, getRegions } from "@/lib/queries";
import { areaMap } from "@/lib/format";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
type P = { params: Promise<{ group: string; area: string }>; searchParams: Promise<{ page?: string }> };
export async function generateMetadata({ params }: P) {
  const { group, area } = await params; const a = await getPracticeArea(area); if (!a || a.group_slug !== group) return {};
  return { title: `${a.name} lawyers in Australia`, description: a.meta_description ?? a.intro ?? undefined, ...canonical(`/law/${group}/${area}`), openGraph: { images: a.hero_image_url ? [a.hero_image_url] : [] } };
}
export default async function AreaPage({ params, searchParams }: P) {
  const [{ group, area }, sp] = await Promise.all([params, searchParams]);
  const [g, a] = await Promise.all([getGroup(group), getPracticeArea(area)]);
  if (!g || !a || a.group_slug !== g.slug) notFound();
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const [all, counts, { rows, count }, regions] = await Promise.all([getPracticeAreas(), getAreaCounts(), listByAreas([a.slug], { page }), getRegions()]);
  const siblings = all.filter((x) => x.group_slug === g.slug && x.slug !== a.slug);
  const regionHits = new Map<string, number>(); for (const l of rows) if (l.region_slug) regionHits.set(l.region_slug, (regionHits.get(l.region_slug) ?? 0) + 1);
  return (<>
    <Hero kicker={g.name} title={`${a.name} lawyers`} intro={a.intro} image={a.hero_image_url ?? g.hero_image_url} credit={a.hero_image_url ? a.hero_credit : g.hero_credit}
      crumbs={[{ name: "Areas of law", href: "/law" }, ...(g.name !== a.name ? [{ name: g.name, href: `/law/${g.slug}` }] : []), { name: a.name }]} />
    <div className="wrap py-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
      <div>
        <div className="prose-body"><p className="!mt-0 text-lg">{a.body}</p></div>
        <div className="mt-10 flex items-end justify-between gap-4"><h2 className="section-title">{(counts[a.slug] ?? count).toLocaleString("en-AU")} {a.name.toLowerCase()} {count === 1 ? "listing" : "listings"}</h2></div>
        <div className="mt-6"><ListingList rows={rows} areas={areaMap(all)} name={`${a.name} lawyers`} page={page} count={count} hrefFor={(p) => `/law/${g.slug}/${a.slug}${p > 1 ? `?page=${p}` : ""}`} /></div>
        <FaqList faq={[...(a.faq ?? []), ...(g.faq ?? []).slice(0, 2)]} />
      </div>
      <aside className="self-start lg:sticky lg:top-24 grid gap-4">
        <div className="card p-5"><h2 className="text-xl">{a.name} by location</h2>
          <ul className="mt-3 grid gap-1 text-sm max-h-[45vh] overflow-auto pr-2">{regions.map((r) => <li key={r.region_slug}><Link href={`/law/${g.slug}/${a.slug}/${r.region_slug}`} className="hover:underline">{r.region_name}, {r.state}</Link></li>)}</ul></div>
        {siblings.length ? <div className="card p-5"><h2 className="text-xl">Related areas</h2>
          <ul className="mt-3 grid gap-1 text-sm">{siblings.map((s) => <li key={s.slug} className="flex justify-between gap-2"><Link href={`/law/${g.slug}/${s.slug}`} className="hover:underline">{s.name}</Link><span className="text-muted">{counts[s.slug] ?? 0}</span></li>)}</ul></div> : null}
      </aside>
    </div></>);
}

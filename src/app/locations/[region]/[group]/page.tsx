import Link from "next/link";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import FaqList from "@/components/FaqList";
import ListingList from "@/components/ListingList";
import { getRegion, getGroup, getPracticeAreas, listByAreas, getRegionGroupCounts, getRegions } from "@/lib/queries";
import { areaMap } from "@/lib/format";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
type P = { params: Promise<{ region: string; group: string }>; searchParams: Promise<{ page?: string }> };
export async function generateMetadata({ params }: P) {
  const { region, group } = await params; const [r, g] = await Promise.all([getRegion(region), getGroup(group)]); if (!r || !g) return {};
  return { title: `${g.name} lawyers in ${r.region_name}, ${r.state}`, description: `${g.intro ?? ""} Compare ${g.name.toLowerCase()} firms in ${r.region_name}.`.trim().slice(0, 158), ...canonical(`/locations/${region}/${group}`) };
}
export default async function RegionGroup({ params, searchParams }: P) {
  const [{ region, group }, sp] = await Promise.all([params, searchParams]);
  const [r, g] = await Promise.all([getRegion(region), getGroup(group)]); if (!r || !g) notFound();
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const all = await getPracticeAreas(); const areas = all.filter((a) => a.group_slug === g.slug);
  const [{ rows, count }, rgc, regions] = await Promise.all([listByAreas(areas.map((a) => a.slug), { region: r.region_slug, page }), getRegionGroupCounts(r.region_slug), getRegions()]);
  return (<>
    <Hero kicker={r.state} title={`${g.name} lawyers in ${r.region_name}`} intro={g.intro} image={g.hero_image_url ?? r.hero_image_url} credit={g.hero_image_url ? g.hero_credit : r.hero_credit}
      crumbs={[{ name: "Locations", href: "/locations" }, { name: r.region_name, href: `/locations/${r.region_slug}` }, { name: g.name }]} />
    <div className="wrap py-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
      <div>
        <ul className="flex flex-wrap gap-2 text-sm">{areas.filter((a) => rgc.areas[a.slug]).map((a) => <li key={a.slug}><Link href={`/law/${g.slug}/${a.slug}/${r.region_slug}`} className="chip hover:bg-stone">{a.name} <span className="text-muted">{rgc.areas[a.slug]}</span></Link></li>)}</ul>
        <h2 className="section-title mt-10">{count.toLocaleString("en-AU")} firms</h2>
        <div className="mt-6"><ListingList rows={rows} areas={areaMap(all)} name={`${g.name} lawyers in ${r.region_name}`} page={page} count={count} hrefFor={(p) => `/locations/${r.region_slug}/${g.slug}${p > 1 ? `?page=${p}` : ""}`} /></div>
        <div className="prose-body mt-10"><p>{g.body}</p></div>
        <FaqList faq={g.faq} />
      </div>
      <aside className="self-start lg:sticky lg:top-24 card p-5"><h2 className="text-xl">{g.name} nearby</h2>
        <ul className="mt-3 grid gap-1 text-sm">{regions.filter((x) => x.state === r.state && x.region_slug !== r.region_slug).map((x) => <li key={x.region_slug}><Link href={`/locations/${x.region_slug}/${g.slug}`} className="hover:underline">{x.region_name}</Link></li>)}</ul></aside>
    </div></>);
}

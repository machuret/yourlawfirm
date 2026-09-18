import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import FaqList from "@/components/FaqList";
import ListingList from "@/components/ListingList";
import ContextCards from "@/components/ContextCards";
import LinkGrid from "@/components/LinkGrid";
import { getRegion, getGroup, getGroups, getPracticeAreas, listByAreas, getRegionGroupCounts, getRegions } from "@/lib/queries";
import { areaMap, lawyersTitle } from "@/lib/format";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
type P = { params: Promise<{ region: string; group: string }>; searchParams: Promise<{ page?: string }> };
export async function generateMetadata({ params }: P) {
  const { region, group } = await params; const [r, g] = await Promise.all([getRegion(region), getGroup(group)]); if (!r || !g) return {};
  return { title: `${lawyersTitle(g.name)} in ${r.region_name}, ${r.state}`, description: `Compare ${g.name.toLowerCase()} firms in ${r.region_name}, ${r.state}. ${g.intro ?? ""}`.slice(0, 158), ...canonical(`/locations/${region}/${group}`) };
}
export default async function RegionGroup({ params, searchParams }: P) {
  const [{ region, group }, sp] = await Promise.all([params, searchParams]);
  const [r, g] = await Promise.all([getRegion(region), getGroup(group)]); if (!r || !g) notFound();
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const all = await getPracticeAreas(); const areas = all.filter((a) => a.group_slug === g.slug);
  const [{ rows, count }, rgc, regions, groups] = await Promise.all([listByAreas(areas.map((a) => a.slug), { region: r.region_slug, page }), getRegionGroupCounts(r.region_slug), getRegions(), getGroups()]);
  return (<>
    <Hero kicker={r.region_name} title={`${lawyersTitle(g.name)} in ${r.region_name}`} intro={g.intro} crumbs={[{ name: "Locations", href: "/locations" }, { name: r.region_name, href: `/locations/${r.region_slug}` }, { name: g.name }]}>
      <div className="scroll-x">{areas.filter((a) => rgc.areas[a.slug]).map((a) => <a key={a.slug} href={`/law/${g.slug}/${a.slug}/${r.region_slug}`} className="pill hover:bg-hair">{a.name} <span className="text-muted">{rgc.areas[a.slug]}</span></a>)}</div>
    </Hero>
    <div className="wrap">
      <ListingList rows={rows} areas={areaMap(all)} name={`${g.name} lawyers in ${r.region_name}`} page={page} count={count} hrefFor={(p) => `/locations/${r.region_slug}/${g.slug}${p > 1 ? `?page=${p}` : ""}`} />
      <div className="mt-16"><ContextCards why={g.why} au={g.au_context} topic={g.short_name ?? g.name} /></div>
      <FaqList faq={g.faq} />
      <LinkGrid title={`${g.name} nearby`} cols={4} links={regions.filter((x) => x.state === r.state && x.region_slug !== r.region_slug).map((x) => ({ href: `/locations/${x.region_slug}/${g.slug}`, label: x.region_name }))} />
      <LinkGrid title={`Other lawyers in ${r.region_name}`} cols={4} links={groups.filter((x) => x.slug !== g.slug && (rgc.groups[x.slug] ?? 0) > 0).map((x) => ({ href: `/locations/${r.region_slug}/${x.slug}`, label: x.name, count: rgc.groups[x.slug] }))} />
    </div></>);
}

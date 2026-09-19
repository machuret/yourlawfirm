import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import { GuideNav, PracticeGuide } from "@/components/EditorialGuide";
import AreaTiles from "@/components/AreaTiles";
import FaqList from "@/components/FaqList";
import ListingList from "@/components/ListingList";
import ContextCards from "@/components/ContextCards";
import LogoCarousel from "@/components/LogoCarousel";
import LinkGrid from "@/components/LinkGrid";
import JsonLd from "@/components/JsonLd";
import { getGroup, getGroups, getPracticeAreas, getAreaCounts, listByAreas, getRegions, getGroupCounts, getLogos } from "@/lib/queries";
import { areaMap, lawyersTitle } from "@/lib/format";
import { canonical } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
export const revalidate = 3600;
type P = { params: Promise<{ group: string }> };
export async function generateMetadata({ params }: P) {
  const g = await getGroup((await params).group); if (!g) return {};
  return { title: `${lawyersTitle(g.name)} in Australia`, description: g.meta_description ?? g.intro ?? undefined, ...canonical(`/law/${g.slug}`) };
}
export default async function GroupPage({ params }: P) {
  const g = await getGroup((await params).group); if (!g) notFound();
  const all = await getPracticeAreas(); const areas = all.filter((a) => a.group_slug === g.slug);
  const [counts, { rows, count }, regions, groups, gc, logos] = await Promise.all([getAreaCounts(), listByAreas(areas.map((a) => a.slug), { size: 8, primaryOnly: true }), getRegions(), getGroups(), getGroupCounts(), getLogos(areas[0]?.slug, null, 24)]);
  return (<>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: `${lawyersTitle(g.name)} in Australia`, url: `${siteUrl()}/law/${g.slug}`, about: { "@type": "Thing", name: g.name }, description: g.intro }} />
    <Hero kicker={g.name} group={g.slug} title={lawyersTitle(g.name)} intro={g.intro} crumbs={[{ name: "Areas of law", href: "/law" }, { name: g.name }]} stats={[{ v: (gc[g.slug] ?? count).toLocaleString("en-AU"), l: "firms" }, { v: String(areas.length), l: "specialisations" }, { v: String(regions.length), l: "regions" }]} />
    <GuideNav />
    <div className="wrap pt-8">
      <ContextCards body={g.body} why={g.why} au={g.au_context} topic={g.short_name ?? g.name} group={g.slug} />
      <h2 className="h-md mt-20">Choose a specialisation</h2>
      <div className="mt-8"><AreaTiles compact tiles={[...areas].sort((a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0)).map((a) => ({ href: `/law/${g.slug}/${a.slug}`, name: a.name, sub: a.intro ?? undefined, count: counts[a.slug] ?? 0, group: g.slug }))} /></div>
    </div>
    <LogoCarousel logos={logos} title={`${g.name} firms in the directory`} />
    <div className="wrap">
      <h2 id="directory-results" className="h-md">Compare {g.name.toLowerCase()} firms</h2>
      <div className="mt-8"><ListingList rows={rows} areas={areaMap(all)} name={`${g.name} lawyers`} group={g.slug} /></div>
      <PracticeGuide group={g} />
      <FaqList faq={g.faq} />
      <LinkGrid title={`${lawyersTitle(g.name)} by location`} cols={4} links={regions.map((r) => ({ href: `/locations/${r.region_slug}/${g.slug}`, label: `${r.region_name}, ${r.state}` }))} />
      <LinkGrid title="Other areas of law" cols={4} links={groups.filter((x) => x.slug !== g.slug).map((x) => ({ href: `/law/${x.slug}`, label: x.name, count: gc[x.slug] }))} />
    </div></>);
}

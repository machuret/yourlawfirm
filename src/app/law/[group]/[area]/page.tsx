import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import { GuideNav, PracticeGuide } from "@/components/EditorialGuide";
import FaqList from "@/components/FaqList";
import Results from "@/components/Results";
import { parseFilters, qs } from "@/lib/filters";
import ContextCards from "@/components/ContextCards";
import LogoCarousel from "@/components/LogoCarousel";
import LinkGrid from "@/components/LinkGrid";
import SearchBox from "@/components/SearchBox";
import JsonLd from "@/components/JsonLd";
import { getGroup, getGroups, getPracticeArea, getPracticeAreas, getAreaCounts, listByAreas, getAreaTopRegions, getLogos } from "@/lib/queries";
import { areaMap, lawyersTitle } from "@/lib/format";
import { canonical } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
export const revalidate = 3600;
type P = { params: Promise<{ group: string; area: string }>; searchParams: Promise<Record<string, string | undefined>> };
export async function generateMetadata({ params }: P) {
  const { group, area } = await params; const a = await getPracticeArea(area); if (!a || a.group_slug !== group) return {};
  return { title: `${lawyersTitle(a.name)} in Australia`, description: a.meta_description ?? a.intro ?? undefined, ...canonical(`/law/${group}/${area}`) };
}
export default async function AreaPage({ params, searchParams }: P) {
  const [{ group, area }, sp] = await Promise.all([params, searchParams]);
  const [g, a] = await Promise.all([getGroup(group), getPracticeArea(area)]);
  if (!g || !a || a.group_slug !== g.slug) notFound();
  const page = Math.max(1, Number(sp.page ?? 1) || 1); const f = parseFilters(sp);
  const [all, counts, { rows, count }, top, logos, groups] = await Promise.all([getPracticeAreas(), getAreaCounts(), listByAreas([a.slug], { page, filters: f, size: f.view === "map" ? 300 : 24 }), getAreaTopRegions(a.slug, 16), getLogos(a.slug, null, 24), getGroups()]);
  const siblings = all.filter((x) => x.group_slug === g.slug && x.slug !== a.slug);
  const url = `${siteUrl()}/law/${g.slug}/${a.slug}`;
  return (<>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: `${lawyersTitle(a.name)} in Australia`, url, description: a.intro, about: { "@type": "Thing", name: a.name }, isPartOf: { "@type": "CollectionPage", name: g.name, url: `${siteUrl()}/law/${g.slug}` } }} />
    <Hero kicker={g.name} group={g.slug} title={lawyersTitle(a.name)} intro={a.intro}
      crumbs={[{ name: "Areas of law", href: "/law" }, ...(g.name !== a.name ? [{ name: g.name, href: `/law/${g.slug}` }] : []), { name: a.name }]} stats={[{ v: (counts[a.slug] ?? count).toLocaleString("en-AU"), l: "firms" }, { v: String(top.length), l: "regions" }]}>
      <div className="max-w-xl"><SearchBox placeholder={`Suburb or postcode for ${a.name.toLowerCase()}`} /></div>
    </Hero>
    <GuideNav />
    <div className="wrap pt-8">
      <ContextCards body={a.body} why={a.why} au={a.au_context} topic={a.name} group={g.slug} />
      <LinkGrid title={`${lawyersTitle(a.name)} near you`} cols={4} links={top.map((r) => ({ href: `/law/${g.slug}/${a.slug}/${r.region_slug}`, label: `${r.region_name}, ${r.state}`, count: Number(r.listings) }))} />
    </div>
    <LogoCarousel logos={logos} title={`${a.name} firms in the directory`} />
    <div className="wrap">
      <h2 id="directory-results" className="h-md">{(counts[a.slug] ?? count).toLocaleString("en-AU")} {a.name.toLowerCase()} firms</h2>
      <div className="mt-6"><Results rows={rows} count={count} areas={areaMap(all)} name={`${a.name} lawyers`} page={page} filters={f} group={g.slug} hrefFor={(p) => `/law/${g.slug}/${a.slug}${qs(sp, { page: p > 1 ? p : null })}`} /></div>
      <PracticeGuide group={g} area={a} />
      <FaqList faq={[...(a.faq ?? []), ...(g.faq ?? []).slice(0, 2)]} />
      <LinkGrid title={`More in ${g.name}`} links={siblings.map((s) => ({ href: `/law/${g.slug}/${s.slug}`, label: s.name, count: counts[s.slug] }))} />
      <LinkGrid title="Other areas of law" cols={4} links={groups.filter((x) => x.slug !== g.slug).map((x) => ({ href: `/law/${x.slug}`, label: x.name }))} />
    </div></>);
}

import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import FaqList from "@/components/FaqList";
import ListingList from "@/components/ListingList";
import Results from "@/components/Results";
import { parseFilters, qs } from "@/lib/filters";
import AreaTiles from "@/components/AreaTiles";
import LogoCarousel from "@/components/LogoCarousel";
import LinkGrid from "@/components/LinkGrid";
import JsonLd from "@/components/JsonLd";
import { getRegion, getRegions, listByRegion, getPracticeAreas, getGroups, getRegionGroupCounts, getState, getLogos } from "@/lib/queries";
import { areaMap, lawyersTitle } from "@/lib/format";
import { canonical } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
export const revalidate = 3600;
type P = { params: Promise<{ region: string }>; searchParams: Promise<Record<string, string | undefined>> };
export async function generateMetadata({ params }: P) {
  const r = await getRegion((await params).region); if (!r) return {};
  return { title: `Lawyers in ${r.region_name}, ${r.state}`, description: r.meta_description ?? r.intro ?? undefined, ...canonical(`/locations/${r.region_slug}`) };
}
export default async function RegionPage({ params, searchParams }: P) {
  const [{ region }, sp] = await Promise.all([params, searchParams]);
  const r = await getRegion(region); if (!r) notFound();
  const page = Math.max(1, Number(sp.page ?? 1) || 1); const f = parseFilters(sp);
  const [{ rows, count }, areas, groups, rgc, regions, st, logos] = await Promise.all([listByRegion(r.region_slug, page, f.view === "map" ? 300 : 24, f), getPracticeAreas(), getGroups(), getRegionGroupCounts(r.region_slug), getRegions(), getState(r.state), getLogos(null, r.region_slug, 24)]);
  const nearby = regions.filter((x) => x.state === r.state && x.region_slug !== r.region_slug);
  const localAreas = areas.filter((a) => (rgc.areas[a.slug] ?? 0) > 0 && a.slug !== "general-practice").sort((a, b) => (rgc.areas[b.slug] ?? 0) - (rgc.areas[a.slug] ?? 0));
  return (<>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: `Lawyers in ${r.region_name}, ${r.state}`, url: `${siteUrl()}/locations/${r.region_slug}`, about: { "@type": "Place", name: `${r.region_name}, ${st?.name ?? r.state}`, containedInPlace: { "@type": "State", name: st?.name ?? r.state } } }} />
    <Hero kicker={st?.name} title={`Lawyers in ${r.region_name}`} intro={r.intro} stats={[{ v: count.toLocaleString("en-AU"), l: "firms" }, { v: String(localAreas.length), l: "areas of law" }, { v: String(r.major_centres.length), l: "major centres" }]} crumbs={[{ name: "Locations", href: "/locations" }, { name: st?.name ?? r.state, href: `/locations#${r.state}` }, { name: r.region_name }]}>
      <div className="scroll-x">{localAreas.slice(0, 10).map((a) => <a key={a.slug} href={`/law/${a.group_slug}/${a.slug}/${r.region_slug}`} className="pill hover:bg-hair">{a.name} <span className="text-muted">{rgc.areas[a.slug]}</span></a>)}</div>
    </Hero>
    <div className="wrap">
      <AreaTiles cols={4} compact tiles={groups.filter((g) => (rgc.groups[g.slug] ?? 0) > 0 && g.slug !== "general").map((g) => ({ href: `/locations/${r.region_slug}/${g.slug}`, name: g.name, count: rgc.groups[g.slug], icon: g.slug, group: g.slug }))} />
    </div>
    <LogoCarousel logos={logos} title={`Firms in ${r.region_name}`} />
    <div className="wrap">
      <h2 className="h-md">{count.toLocaleString("en-AU")} firms in {r.region_name}</h2>
      <div className="mt-6"><Results rows={rows} count={count} areas={areaMap(areas)} name={`Lawyers in ${r.region_name}`} page={page} filters={f} hrefFor={(p) => `/locations/${r.region_slug}${qs(sp, { page: p > 1 ? p : null })}`} /></div>
      {st ? <section className="mt-20 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="surface p-7"><h2 className="text-[22px] font-semibold tracking-tight">The legal system in {st.name}</h2><p className="mt-3 text-[17px] leading-relaxed text-ink-2">{r.body}</p></div>
        <dl className="surface grid gap-3 p-7 text-[15px]">{[["First instance", st.lower_court], ["Intermediate", st.intermediate_court], ["Superior court", st.supreme_court], ["Tribunal", st.tribunal], ["Family law", st.family_court], ["Lawyer regulator", st.regulator]].filter(([, v]) => v).map(([k, v]) => <div key={k}><dt className="text-[13px] text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl>
      </section> : null}
      <FaqList faq={r.faq} />
      <LinkGrid title={`Areas of law in ${r.region_name}`} cols={3} links={localAreas.map((a) => ({ href: `/law/${a.group_slug}/${a.slug}/${r.region_slug}`, label: lawyersTitle(a.name), count: rgc.areas[a.slug] }))} />
      <LinkGrid title={`Nearby in ${st?.name ?? r.state}`} cols={4} links={nearby.map((x) => ({ href: `/locations/${x.region_slug}`, label: x.region_name }))} />
    </div></>);
}

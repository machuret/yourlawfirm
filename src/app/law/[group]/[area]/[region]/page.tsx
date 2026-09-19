import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import FaqList from "@/components/FaqList";
import ListingList from "@/components/ListingList";
import Results from "@/components/Results";
import { parseFilters, qs } from "@/lib/filters";
import ContextCards from "@/components/ContextCards";
import LogoCarousel from "@/components/LogoCarousel";
import LinkGrid from "@/components/LinkGrid";
import { getGroup, getPracticeArea, getPracticeAreas, listByAreas, getRegion, getRegions, getState, getRegionGroupCounts, getLogos } from "@/lib/queries";
import { areaMap, lawyersTitle } from "@/lib/format";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
type P = { params: Promise<{ group: string; area: string; region: string }>; searchParams: Promise<Record<string, string | undefined>> };
export async function generateMetadata({ params }: P) {
  const { group, area, region } = await params;
  const [a, r] = await Promise.all([getPracticeArea(area), getRegion(region)]); if (!a || !r) return {};
  const { count } = await listByAreas([a.slug], { region: r.region_slug, size: 1 });
  return { title: `${lawyersTitle(a.name)} in ${r.region_name}, ${r.state}`, description: `Compare ${count} ${a.name.toLowerCase()} lawyers in ${r.region_name}, ${r.state}. Ratings, reviews, fees and contact details.`, ...canonical(`/law/${group}/${area}/${region}`), robots: count === 0 ? { index: false, follow: true } : undefined };
}
export default async function AreaRegion({ params, searchParams }: P) {
  const [{ group, area, region }, sp] = await Promise.all([params, searchParams]);
  const [g, a, r] = await Promise.all([getGroup(group), getPracticeArea(area), getRegion(region)]);
  if (!g || !a || !r || a.group_slug !== g.slug) notFound();
  const page = Math.max(1, Number(sp.page ?? 1) || 1); const f = parseFilters(sp);
  const [all, { rows, count }, regions, st, rgc, logos] = await Promise.all([getPracticeAreas(), listByAreas([a.slug], { region: r.region_slug, page, filters: f, size: f.view === "map" ? 300 : 24 }), getRegions(), getState(r.state), getRegionGroupCounts(r.region_slug), getLogos(a.slug, r.region_slug, 20)]);
  const nearby = regions.filter((x) => x.state === r.state && x.region_slug !== r.region_slug);
  const otherAreas = all.filter((x) => (rgc.areas[x.slug] ?? 0) > 0 && x.slug !== a.slug).sort((x, y) => (rgc.areas[y.slug] ?? 0) - (rgc.areas[x.slug] ?? 0)).slice(0, 12);
  return (<>
    <Hero kicker={`${g.name} · ${r.region_name}`} title={`${lawyersTitle(a.name)} in ${r.region_name}`} intro={`${count ? count.toLocaleString("en-AU") : "No"} ${a.name.toLowerCase()} ${count === 1 ? "firm" : "firms"} in ${r.region_name}, ${st?.name ?? r.state}, including ${r.major_centres.slice(0, 4).join(", ")}.`}
      crumbs={[{ name: g.name, href: `/law/${g.slug}` }, ...(g.name !== a.name ? [{ name: a.name, href: `/law/${g.slug}/${a.slug}` }] : []), { name: r.region_name }]} />
    <div className="wrap">
      <Results rows={rows} count={count} areas={areaMap(all)} name={`${a.name} lawyers in ${r.region_name}`} page={page} filters={f} hrefFor={(p) => `/law/${g.slug}/${a.slug}/${r.region_slug}${qs(sp, { page: p > 1 ? p : null })}`} />
      <div className="mt-16"><ContextCards why={a.why} au={a.au_context} topic={a.name} /></div>
      {st ? <section className="surface mt-4 p-7"><h2 className="text-[22px] font-semibold tracking-tight">Courts and tribunals in {st.name}</h2><p className="mt-2 max-w-3xl text-[17px] leading-relaxed text-ink-2">{st.body}</p></section> : null}
    </div>
    <LogoCarousel logos={logos} title={`${a.name} firms in ${r.region_name}`} />
    <div className="wrap">
      <FaqList faq={[...(a.faq ?? []), ...(r.faq ?? []).slice(0, 2)]} />
      <LinkGrid title={`${lawyersTitle(a.name)} nearby`} links={nearby.map((x) => ({ href: `/law/${g.slug}/${a.slug}/${x.region_slug}`, label: `${a.name} in ${x.region_name}` }))} />
      <LinkGrid title={`Other lawyers in ${r.region_name}`} links={otherAreas.map((x) => ({ href: `/law/${x.group_slug}/${x.slug}/${r.region_slug}`, label: x.name, count: rgc.areas[x.slug] }))} />
      <LinkGrid title="Explore" cols={3} links={[{ href: `/locations/${r.region_slug}`, label: `All lawyers in ${r.region_name}` }, { href: `/law/${g.slug}/${a.slug}`, label: `${a.name} across Australia` }, { href: `/locations/${r.region_slug}/${g.slug}`, label: `${g.name} in ${r.region_name}` }]} />
    </div></>);
}

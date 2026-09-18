import Link from "next/link";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import FaqList from "@/components/FaqList";
import ListingList from "@/components/ListingList";
import AreaTiles from "@/components/AreaTiles";
import { getRegion, getRegions, listByRegion, getPracticeAreas, getGroups, getRegionGroupCounts, getState } from "@/lib/queries";
import { areaMap } from "@/lib/format";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
type P = { params: Promise<{ region: string }>; searchParams: Promise<{ page?: string }> };
export async function generateMetadata({ params }: P) {
  const r = await getRegion((await params).region); if (!r) return {};
  return { title: `Lawyers in ${r.region_name}, ${r.state}`, description: r.meta_description ?? r.intro ?? undefined, ...canonical(`/locations/${r.region_slug}`), openGraph: { images: r.hero_image_url ? [r.hero_image_url] : [] } };
}
export default async function RegionPage({ params, searchParams }: P) {
  const [{ region }, sp] = await Promise.all([params, searchParams]);
  const r = await getRegion(region); if (!r) notFound();
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const [{ rows, count }, areas, groups, rgc, regions, st] = await Promise.all([listByRegion(r.region_slug, page), getPracticeAreas(), getGroups(), getRegionGroupCounts(r.region_slug), getRegions(), getState(r.state)]);
  const nearby = regions.filter((x) => x.state === r.state && x.region_slug !== r.region_slug);
  const topAreas = areas.filter((a) => (rgc.areas[a.slug] ?? 0) > 0 && a.slug !== "general-practice").sort((a, b) => (rgc.areas[b.slug] ?? 0) - (rgc.areas[a.slug] ?? 0)).slice(0, 16);
  return (<>
    <Hero kicker={st?.name} title={`Lawyers in ${r.region_name}`} intro={r.intro} image={r.hero_image_url} credit={r.hero_credit} crumbs={[{ name: "Locations", href: "/locations" }, { name: st?.name ?? r.state, href: `/locations#${r.state}` }, { name: r.region_name }]} />
    <div className="wrap py-12">
      <h2 className="section-title">Areas of law in {r.region_name}</h2>
      <div className="mt-6"><AreaTiles cols={4} tiles={groups.filter((g) => (rgc.groups[g.slug] ?? 0) > 0 && g.slug !== "general").map((g) => ({ href: `/locations/${r.region_slug}/${g.slug}`, name: g.name, image: g.hero_image_url, count: rgc.groups[g.slug] }))} /></div>
      <ul className="mt-6 flex flex-wrap gap-2 text-sm">{topAreas.map((a) => <li key={a.slug}><Link href={`/law/${a.group_slug}/${a.slug}/${r.region_slug}`} className="chip hover:bg-stone">{a.name} <span className="text-muted">{rgc.areas[a.slug]}</span></Link></li>)}</ul>
      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <div>
          <h2 className="section-title">{count.toLocaleString("en-AU")} firms in {r.region_name}</h2>
          <div className="mt-6"><ListingList rows={rows} areas={areaMap(areas)} name={`Lawyers in ${r.region_name}`} page={page} count={count} hrefFor={(p) => `/locations/${r.region_slug}${p > 1 ? `?page=${p}` : ""}`} /></div>
          <h2 className="section-title mt-14">The legal system in {st?.name ?? r.state}</h2>
          <div className="prose-body"><p>{r.body}</p></div>
          <FaqList faq={r.faq} />
        </div>
        <aside className="self-start lg:sticky lg:top-24 grid gap-4">
          {st ? <div className="card p-5 text-sm"><h2 className="text-xl">Courts & regulator</h2><dl className="mt-3 grid gap-2">
            <div><dt className="text-muted">First instance</dt><dd>{st.lower_court}</dd></div>
            {st.intermediate_court ? <div><dt className="text-muted">Intermediate</dt><dd>{st.intermediate_court}</dd></div> : null}
            <div><dt className="text-muted">Superior</dt><dd>{st.supreme_court}</dd></div>
            <div><dt className="text-muted">Tribunal</dt><dd>{st.tribunal}</dd></div>
            <div><dt className="text-muted">Family law</dt><dd>{st.family_court}</dd></div>
            <div><dt className="text-muted">Lawyer regulator</dt><dd>{st.regulator}</dd></div></dl></div> : null}
          <div className="card p-5"><h2 className="text-xl">Nearby regions</h2><ul className="mt-3 grid gap-1 text-sm">{nearby.map((x) => <li key={x.region_slug}><Link href={`/locations/${x.region_slug}`} className="hover:underline">{x.region_name}</Link></li>)}</ul></div>
        </aside>
      </div>
    </div></>);
}

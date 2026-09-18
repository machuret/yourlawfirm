import Link from "next/link";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import AreaTiles from "@/components/AreaTiles";
import FaqList from "@/components/FaqList";
import ListingList from "@/components/ListingList";
import { getGroup, getPracticeAreas, getAreaCounts, listByAreas, getRegions, getRegionCounts } from "@/lib/queries";
import { areaMap } from "@/lib/format";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
type P = { params: Promise<{ group: string }> };
export async function generateMetadata({ params }: P) {
  const g = await getGroup((await params).group); if (!g) return {};
  return { title: `${g.name} lawyers in Australia`, description: g.meta_description ?? g.intro ?? undefined, ...canonical(`/law/${g.slug}`), openGraph: { images: g.hero_image_url ? [g.hero_image_url] : [] } };
}
export default async function GroupPage({ params }: P) {
  const g = await getGroup((await params).group); if (!g) notFound();
  const all = await getPracticeAreas(); const areas = all.filter((a) => a.group_slug === g.slug);
  const [counts, { rows }, regions, rc] = await Promise.all([getAreaCounts(), listByAreas(areas.map((a) => a.slug), { size: 8, primaryOnly: true }), getRegions(), getRegionCounts()]);
  return (<>
    <Hero title={`${g.name} lawyers`} intro={g.intro} image={g.hero_image_url} credit={g.hero_credit} crumbs={[{ name: "Areas of law", href: "/law" }, { name: g.name }]} />
    <div className="wrap py-14">
      <h2 className="section-title">Choose a specific area</h2>
      <div className="mt-6"><AreaTiles cols={3} tiles={areas.sort((a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0)).map((a) => ({ href: `/law/${g.slug}/${a.slug}`, name: a.name, sub: a.intro ?? undefined, image: a.hero_image_url, count: counts[a.slug] ?? 0 }))} /></div>
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <div>
          <h2 className="section-title">About {g.short_name?.toLowerCase() ?? g.name.toLowerCase()}</h2>
          <div className="prose-body"><p>{g.body}</p></div>
          <h2 className="section-title mt-14">{g.name} firms</h2>
          <div className="mt-6"><ListingList rows={rows} areas={areaMap(all)} name={`${g.name} lawyers`} /></div>
          <FaqList faq={g.faq} />
        </div>
        <aside className="self-start lg:sticky lg:top-24 card p-5">
          <h2 className="text-xl">{g.name} by location</h2>
          <ul className="mt-3 grid gap-1 text-sm max-h-[60vh] overflow-auto pr-2">{regions.filter((r) => (rc[r.region_slug] ?? 0) > 0).map((r) => <li key={r.region_slug}><Link href={`/locations/${r.region_slug}/${g.slug}`} className="hover:underline">{r.region_name}, {r.state}</Link></li>)}</ul>
        </aside>
      </div>
    </div></>);
}

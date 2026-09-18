import Link from "next/link";
import Hero from "@/components/Hero";
import SearchBox from "@/components/SearchBox";
import AreaTiles from "@/components/AreaTiles";
import ListingCard from "@/components/ListingCard";
import { getGroups, getPracticeAreas, getGroupCounts, getRegions, getRegionCounts, getFeatured, getAreaCounts } from "@/lib/queries";
import { areaMap } from "@/lib/format";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
export const metadata = canonical("/");
export default async function Home() {
  const [groups, areas, gCounts, regions, rCounts, featured, aCounts] = await Promise.all([getGroups(), getPracticeAreas(), getGroupCounts(), getRegions(), getRegionCounts(), getFeatured(6), getAreaCounts()]);
  const total = Object.values(rCounts).reduce((a, b) => a + b, 0);
  const topAreas = [...areas].sort((a, b) => (aCounts[b.slug] ?? 0) - (aCounts[a.slug] ?? 0)).filter((a) => a.slug !== "general-practice").slice(0, 12);
  const topRegions = [...regions].sort((a, b) => (rCounts[b.region_slug] ?? 0) - (rCounts[a.region_slug] ?? 0)).slice(0, 8);
  return (
    <>
      <Hero size="lg" title="Find the right lawyer, near you." intro={`${total.toLocaleString("en-AU")} Australian law firms, solicitors and conveyancers, checked against their own websites and Google. Compare ratings, people and fees, then contact them directly.`}>
        <div className="max-w-2xl"><SearchBox size="lg" placeholder="Try “divorce”, “Parramatta” or a firm name" /></div>
        <p className="mt-4 text-sm text-white/70">Popular: {topAreas.slice(0, 5).map((a, i) => <span key={a.slug}>{i ? " · " : ""}<Link href={`/law/${a.group_slug}/${a.slug}`} className="underline hover:text-white">{a.name}</Link></span>)}</p>
      </Hero>
      <section className="wrap py-16">
        <div className="flex items-end justify-between gap-4"><h2 className="section-title">Areas of law</h2><Link href="/law" className="text-sm underline">All areas</Link></div>
        <div className="mt-6"><AreaTiles tiles={groups.filter((g) => g.slug !== "general").map((g) => ({ href: `/law/${g.slug}`, name: g.name, sub: g.intro ?? undefined, image: g.hero_image_url, count: gCounts[g.slug] }))} /></div>
      </section>
      <section className="bg-stone">
        <div className="wrap py-16 grid gap-12 lg:grid-cols-2">
          <div><h2 className="section-title">Most searched</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2">{topAreas.map((a) => <li key={a.slug} className="flex justify-between gap-3 border-b border-line py-2"><Link href={`/law/${a.group_slug}/${a.slug}`} className="hover:underline">{a.name}</Link><span className="text-sm text-muted tabular-nums">{aCounts[a.slug] ?? 0}</span></li>)}</ul></div>
          <div><h2 className="section-title">Biggest locations</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2">{topRegions.map((r) => <li key={r.region_slug} className="flex justify-between gap-3 border-b border-line py-2"><Link href={`/locations/${r.region_slug}`} className="hover:underline">{r.region_name}, {r.state}</Link><span className="text-sm text-muted tabular-nums">{rCounts[r.region_slug] ?? 0}</span></li>)}</ul>
            <Link href="/locations" className="mt-4 inline-block text-sm underline">All 66 locations</Link></div>
        </div>
      </section>
      {featured.length ? (<section className="wrap py-16"><h2 className="section-title">Well-reviewed firms</h2><div className="mt-6 grid gap-4">{featured.map((l) => <ListingCard key={l.listing_id} l={l} areas={areaMap(areas)} />)}</div></section>) : null}
      <section className="wrap pb-4">
        <div className="card grid gap-6 p-8 md:grid-cols-3">
          <div><h3 className="text-xl">Checked, not scraped and forgotten</h3><p className="mt-2 text-sm text-ink/80">Every listing is matched to a live firm website, and most are confirmed against Google by phone number.</p></div>
          <div><h3 className="text-xl">Real reviews, clearly sourced</h3><p className="mt-2 text-sm text-ink/80">Google ratings and reviews show where they came from and when we retrieved them.</p></div>
          <div><h3 className="text-xl">Contact firms directly</h3><p className="mt-2 text-sm text-ink/80">No middleman fees. Call, visit the website or send an enquiry straight to the firm.</p></div>
        </div>
      </section>
    </>
  );
}

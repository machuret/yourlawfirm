import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import ListingCard from "@/components/ListingCard";
import { getSite } from "@/lib/site";
import { getPracticeAreas, getAreaCounts, getRegions, getRegionCounts, getFeatured } from "@/lib/queries";
import { areaMap } from "@/lib/format";

export const revalidate = 3600;

export default async function Home() {
  const [site, areas, counts, regions, regionCounts, featured] = await Promise.all([getSite(), getPracticeAreas(), getAreaCounts(), getRegions(), getRegionCounts(), getFeatured(6)]);
  const total = Object.values(regionCounts).reduce((a, b) => a + b, 0);
  const groups = Object.entries(areas.reduce<Record<string, typeof areas>>((acc, a) => ((acc[a.parent_group] ??= []).push(a), acc), {}));
  const states = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
  return (
    <>
      <section className="wrap pt-10 pb-12 md:pt-16">
        <h1 className="text-4xl md:text-6xl max-w-3xl leading-[1.05]">{site.tagline ?? "Find a lawyer near you."}</h1>
        <p className="mt-4 max-w-prose text-muted">{total.toLocaleString("en-AU")} listings across every state and territory, compiled from public directories and firm websites. Pick an area of law, tell us where you are, and compare.</p>
        <div className="mt-8"><SearchForm areas={areas} /></div>
      </section>

      <section className="bg-stone">
        <div className="wrap py-12">
          <h2 className="text-2xl">Browse by area of law</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {groups.map(([g, list]) => (
              <div key={g}>
                <h3 className="text-base font-semibold font-body">{g}</h3>
                <ul className="mt-2 grid gap-1 text-sm">
                  {list.map((a) => <li key={a.slug} className="flex justify-between gap-3"><Link href={`/practice-areas/${a.slug}`} className="hover:underline">{a.name}</Link><span className="text-muted tabular-nums">{counts[a.slug] ?? 0}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-12">
        <h2 className="text-2xl">Browse by location</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {states.map((st) => (
            <div key={st}>
              <h3 className="text-base font-semibold font-body">{st}</h3>
              <ul className="mt-2 grid gap-1 text-sm">
                {regions.filter((r) => r.state === st).map((r) => <li key={r.region_slug} className="flex justify-between gap-3"><Link href={`/locations/${r.region_slug}`} className="hover:underline">{r.region_name}</Link><span className="text-muted tabular-nums">{regionCounts[r.region_slug] ?? 0}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {featured.length ? (
        <section className="wrap py-6">
          <h2 className="text-2xl">Firms with complete profiles</h2>
          <div className="mt-2">{featured.map((l) => <ListingCard key={l.listing_id} l={l} areas={areaMap(areas)} />)}</div>
        </section>
      ) : null}
    </>
  );
}

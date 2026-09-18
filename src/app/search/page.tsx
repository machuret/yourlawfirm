import Link from "next/link";
import Hero from "@/components/Hero";
import SearchBox from "@/components/SearchBox";
import ListingList from "@/components/ListingList";
import { getPracticeAreas, searchText, searchNearby, suggest } from "@/lib/queries";
import { areaMap } from "@/lib/format";
export const metadata = { title: "Search lawyers", robots: { index: false, follow: true } };
export const dynamic = "force-dynamic";
export default async function Search({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams; const q = (sp.q ?? "").trim();
  const lat = sp.lat ? Number(sp.lat) : null, lng = sp.lng ? Number(sp.lng) : null;
  const [areas, rows, sugg] = await Promise.all([getPracticeAreas(), lat != null && lng != null ? searchNearby(lat, lng, sp.area || undefined) : q || sp.area ? searchText(q, sp.area || undefined) : Promise.resolve([]), q ? suggest(q) : Promise.resolve([])]);
  const quick = sugg.filter((s) => s.kind !== "firm").slice(0, 6);
  return (<>
    <Hero title={q ? `Results for “${q}”` : "Find a lawyer"} crumbs={[{ name: "Search" }]}><div className="max-w-2xl"><SearchBox size="lg" /></div></Hero>
    <div className="wrap py-10">
      {quick.length ? <div className="mb-8"><p className="text-sm text-muted">Jump to</p><ul className="mt-2 flex flex-wrap gap-2">{quick.map((s) => <li key={s.url}><Link href={s.url} className="chip hover:bg-stone">{s.label}</Link></li>)}</ul></div> : null}
      {q || sp.area || lat != null ? <p className="mb-4 text-sm text-muted">{rows.length} {rows.length === 1 ? "firm" : "firms"}{lat != null ? " near you" : ""}</p> : <p className="text-ink/80">Search by legal issue, suburb, postcode or firm name, or <Link href="/law" className="underline">browse areas of law</Link>.</p>}
      {(q || sp.area || lat != null) ? <ListingList rows={rows} areas={areaMap(areas)} name={`Search results for ${q}`} /> : null}
    </div></>);
}

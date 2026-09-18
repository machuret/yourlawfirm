import Link from "next/link";
import { notFound } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import { getRegion, listByRegion, getPracticeAreas } from "@/lib/queries";
import { areaMap } from "@/lib/format";
export const revalidate = 3600;
type P = { params: Promise<{ region: string }>; searchParams: Promise<{ page?: string }> };
export async function generateMetadata({ params }: P) {
  const r = await getRegion((await params).region);
  return r ? { title: `Lawyers in ${r.region_name}, ${r.state}`, description: `Law firms and solicitors in ${r.region_name} (${r.major_centres?.join(", ")}).` } : {};
}
export default async function RegionPage({ params, searchParams }: P) {
  const [{ region }, sp] = await Promise.all([params, searchParams]);
  const r = await getRegion(region);
  if (!r) notFound();
  const page = Math.max(1, Number(sp.page ?? 1));
  const [rows, areas] = await Promise.all([listByRegion(region, page), getPracticeAreas()]);
  return (
    <div className="wrap py-10">
      <p className="text-sm text-muted"><Link href="/locations" className="underline">Locations</Link> / {r.state}</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Lawyers in {r.region_name}</h1>
      <p className="mt-2 text-sm text-muted">{r.major_centres?.join(" · ")}</p>
      <div className="mt-6">{rows.map((l) => <ListingCard key={l.listing_id} l={l} areas={areaMap(areas)} />)}</div>
      {rows.length === 24 ? <p className="mt-6"><Link href={`/locations/${region}?page=${page + 1}`} className="underline">Next page</Link></p> : null}
    </div>);
}

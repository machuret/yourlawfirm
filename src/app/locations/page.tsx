import Link from "next/link";
import { getRegions, getRegionCounts } from "@/lib/queries";
export const revalidate = 3600;
export const metadata = { title: "Locations" };
export default async function Locations() {
  const [regions, counts] = await Promise.all([getRegions(), getRegionCounts()]);
  const states = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
  return (
    <div className="wrap py-10">
      <h1 className="text-3xl">Lawyers by location</h1>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {states.map((st) => (<div key={st}><h2 className="text-lg">{st}</h2>
          <ul className="mt-2 grid gap-1 text-sm">{regions.filter((r) => r.state === st).map((r) => <li key={r.region_slug} className="flex justify-between"><Link href={`/locations/${r.region_slug}`} className="hover:underline">{r.region_name}</Link><span className="text-muted">{counts[r.region_slug] ?? 0}</span></li>)}</ul></div>))}
      </div>
    </div>);
}

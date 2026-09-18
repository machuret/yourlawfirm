import Link from "next/link";
import Hero from "@/components/Hero";
import { getRegions, getRegionCounts, getStates } from "@/lib/queries";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
export const metadata = { title: "Lawyers by location", description: "Find lawyers in every region of Australia, from capital cities to regional and remote areas.", ...canonical("/locations") };
const ORDER = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
export default async function Locations() {
  const [regions, counts, states] = await Promise.all([getRegions(), getRegionCounts(), getStates()]);
  return (<>
    <Hero title="Lawyers by location" intro="66 regions across every state and territory. Choose where you are, then narrow down by area of law." crumbs={[{ name: "Locations" }]} />
    <div className="wrap py-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
      {ORDER.map((st) => (<section key={st} id={st} className="scroll-mt-24">
        <h2 className="text-[22px] font-semibold tracking-tight">{states.find((s) => s.state === st)?.name ?? st}</h2>
        <ul className="mt-3 grid gap-1.5">{regions.filter((r) => r.state === st).map((r) => <li key={r.region_slug} className="flex justify-between gap-3 text-[15px] border-b border-hair py-2"><Link href={`/locations/${r.region_slug}`} className="hover:text-accent">{r.region_name}</Link><span className="text-muted tabular-nums">{counts[r.region_slug] ?? 0}</span></li>)}</ul>
      </section>))}
    </div></>);
}

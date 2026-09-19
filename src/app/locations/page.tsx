import Link from "next/link";
import Hero from "@/components/Hero";
import { locationImage } from "@/lib/imagery";
import { getRegions, getRegionCounts, getStates } from "@/lib/queries";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
export const metadata = { title: "Lawyers by location", description: "Find lawyers in every region of Australia, from capital cities to regional and remote areas.", ...canonical("/locations") };
const ORDER = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
export default async function Locations() {
  const [regions, counts, states] = await Promise.all([getRegions(), getRegionCounts(), getStates()]);
  return (<>
    <Hero image={locationImage('vic-bendigo')} credit="AI-generated regional illustration" kicker="Local knowledge. Relevant expertise." title="Lawyers by location" intro={`${regions.length} regions across every state and territory. Explore local guides, compare firms and prepare for your first conversation.`} crumbs={[{ name: "Locations" }]} />
    <section className="wrap location-summary"><p className="section-eyebrow">Make location work for you</p><h2 className="h-md">Start close to home. Choose by experience.</h2><p>A nearby office can make meetings easier, but the right experience matters too. Select a region, then narrow your search by the legal issue. Each local guide explains what to prepare, how to discuss costs and where to find other sources of help. Ask firms about remote appointments and any travel or attendance requirements before engaging them.</p></section>
    <div className="wrap py-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
      {ORDER.map((st) => (<section key={st} id={st} className="scroll-mt-24">
        <h2 className="text-[22px] font-semibold tracking-tight">{states.find((s) => s.state === st)?.name ?? st}</h2>
        <ul className="mt-3 grid gap-1.5">{regions.filter((r) => r.state === st).map((r) => <li key={r.region_slug} className="flex justify-between gap-3 text-[15px] border-b border-hair py-2"><Link href={`/locations/${r.region_slug}`} className="hover:text-accent">{r.region_name}</Link><span className="text-muted tabular-nums">{counts[r.region_slug] ?? 0}</span></li>)}</ul>
      </section>))}
    </div></>);
}

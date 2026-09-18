import Link from "next/link";
import { notFound } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import { getPracticeArea, getPracticeAreas, listByArea, getRegions, getRegion } from "@/lib/queries";
import { areaMap } from "@/lib/format";
export const revalidate = 3600;

type P = { params: Promise<{ slug: string }>; searchParams: Promise<{ region?: string; page?: string }> };
export async function generateMetadata({ params, searchParams }: P) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const [a, r] = await Promise.all([getPracticeArea(slug), sp.region ? getRegion(sp.region) : null]);
  if (!a) return {};
  return { title: `${a.name} lawyers${r ? ` in ${r.region_name}, ${r.state}` : " in Australia"}`, description: `Compare ${a.name.toLowerCase()} lawyers${r ? ` in ${r.region_name}` : " across Australia"}: contact details, fees, languages and services.` };
}
export default async function Area({ params, searchParams }: P) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const area = await getPracticeArea(slug);
  if (!area) notFound();
  const page = Math.max(1, Number(sp.page ?? 1));
  const [{ rows, count }, areas, regions, region] = await Promise.all([listByArea(slug, sp.region, page), getPracticeAreas(), getRegions(), sp.region ? getRegion(sp.region) : null]);
  return (
    <div className="wrap py-10">
      <p className="text-sm text-muted"><Link href="/practice-areas" className="underline">Areas of law</Link> / {area.parent_group}</p>
      <h1 className="mt-2 text-3xl md:text-4xl">{area.name} lawyers{region ? ` in ${region.region_name}` : ""}</h1>
      <p className="mt-2 text-muted text-sm">{count ? `${count.toLocaleString("en-AU")} listings` : ""}</p>
      <details className="mt-4 text-sm"><summary className="cursor-pointer underline">Narrow by region</summary>
        <ul className="mt-3 flex flex-wrap gap-2">{regions.map((r) => <li key={r.region_slug}><Link href={`/practice-areas/${slug}?region=${r.region_slug}`} className={`inline-block border border-line px-2 py-0.5 rounded-sm ${sp.region === r.region_slug ? "bg-green text-paper" : ""}`}>{r.region_name}, {r.state}</Link></li>)}</ul>
      </details>
      <div className="mt-6">{rows.map((l) => <ListingCard key={l.listing_id} l={l} areas={areaMap(areas)} />)}</div>
      {rows.length === 24 ? <p className="mt-6"><Link href={`/practice-areas/${slug}?${new URLSearchParams({ ...(sp.region ? { region: sp.region } : {}), page: String(page + 1) })}`} className="underline">Next page</Link></p> : null}
    </div>);
}

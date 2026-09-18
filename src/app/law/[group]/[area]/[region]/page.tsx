import Link from "next/link";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import FaqList from "@/components/FaqList";
import ListingList from "@/components/ListingList";
import { getGroup, getPracticeArea, getPracticeAreas, listByAreas, getRegion, getRegions, getState } from "@/lib/queries";
import { areaMap } from "@/lib/format";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
type P = { params: Promise<{ group: string; area: string; region: string }>; searchParams: Promise<{ page?: string }> };
export async function generateMetadata({ params }: P) {
  const { group, area, region } = await params;
  const [a, r] = await Promise.all([getPracticeArea(area), getRegion(region)]); if (!a || !r) return {};
  const { count } = await listByAreas([a.slug], { region: r.region_slug, size: 1 });
  return { title: `${a.name} lawyers in ${r.region_name}, ${r.state}`, description: `Compare ${count} ${a.name.toLowerCase()} lawyers in ${r.region_name}, ${r.state}. Ratings, reviews, fees and contact details.`, ...canonical(`/law/${group}/${area}/${region}`),
    robots: count === 0 ? { index: false, follow: true } : undefined };
}
export default async function AreaRegion({ params, searchParams }: P) {
  const [{ group, area, region }, sp] = await Promise.all([params, searchParams]);
  const [g, a, r] = await Promise.all([getGroup(group), getPracticeArea(area), getRegion(region)]);
  if (!g || !a || !r || a.group_slug !== g.slug) notFound();
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const [all, { rows, count }, regions, st] = await Promise.all([getPracticeAreas(), listByAreas([a.slug], { region: r.region_slug, page }), getRegions(), getState(r.state)]);
  const nearby = regions.filter((x) => x.state === r.state && x.region_slug !== r.region_slug);
  const faq = [...(a.faq ?? []), ...(r.faq ?? []).slice(0, 2)];
  return (<>
    <Hero kicker={`${g.name} · ${r.state}`} title={`${a.name} lawyers in ${r.region_name}`} intro={`${count ? count.toLocaleString("en-AU") : "No"} ${a.name.toLowerCase()} ${count === 1 ? "listing" : "listings"} in ${r.region_name}, including ${r.major_centres.slice(0, 4).join(", ")}.`}
      image={a.hero_image_url ?? r.hero_image_url} credit={a.hero_image_url ? a.hero_credit : r.hero_credit}
      crumbs={[{ name: g.name, href: `/law/${g.slug}` }, { name: a.name, href: `/law/${g.slug}/${a.slug}` }, { name: r.region_name }]} />
    <div className="wrap py-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
      <div>
        <div className="prose-body"><p className="!mt-0">{a.body}</p>{st ? <p>{st.body}</p> : null}</div>
        <div className="mt-10"><ListingList rows={rows} areas={areaMap(all)} name={`${a.name} lawyers in ${r.region_name}`} page={page} count={count} hrefFor={(p) => `/law/${g.slug}/${a.slug}/${r.region_slug}${p > 1 ? `?page=${p}` : ""}`} /></div>
        {count === 0 ? <p className="mt-4 text-sm"><Link href={`/law/${g.slug}/${a.slug}`} className="underline">See {a.name.toLowerCase()} lawyers across Australia</Link>. Many firms act for clients remotely.</p> : null}
        <FaqList faq={faq} />
      </div>
      <aside className="self-start lg:sticky lg:top-24 grid gap-4">
        <div className="card p-5"><h2 className="text-xl">Nearby in {r.state}</h2>
          <ul className="mt-3 grid gap-1 text-sm">{nearby.map((x) => <li key={x.region_slug}><Link href={`/law/${g.slug}/${a.slug}/${x.region_slug}`} className="hover:underline">{a.name} in {x.region_name}</Link></li>)}</ul></div>
        <div className="card p-5"><h2 className="text-xl">All lawyers in {r.region_name}</h2><Link href={`/locations/${r.region_slug}`} className="mt-2 inline-block text-sm underline">Every area of law</Link></div>
      </aside>
    </div></>);
}

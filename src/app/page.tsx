import Link from "next/link";
import { ShieldCheck, Star, PhoneCall } from "lucide-react";
import Hero from "@/components/Hero";
import SearchBox from "@/components/SearchBox";
import AreaTiles from "@/components/AreaTiles";
import ListingCard from "@/components/ListingCard";
import LogoCarousel from "@/components/LogoCarousel";
import LinkGrid from "@/components/LinkGrid";
import { getGroups, getPracticeAreas, getGroupCounts, getRegions, getRegionCounts, getFeatured, getAreaCounts, getLogos } from "@/lib/queries";
import { areaMap } from "@/lib/format";
import { canonical } from "@/lib/seo";
export const revalidate = 3600;
export const metadata = canonical("/");
export default async function Home() {
  const [groups, areas, gCounts, regions, rCounts, featured, aCounts, logos] = await Promise.all([getGroups(), getPracticeAreas(), getGroupCounts(), getRegions(), getRegionCounts(), getFeatured(6), getAreaCounts(), getLogos(null, null, 30)]);
  const total = Object.values(rCounts).reduce((a, b) => a + b, 0);
  const topAreas = [...areas].filter((a) => a.slug !== "general-practice").sort((a, b) => (aCounts[b.slug] ?? 0) - (aCounts[a.slug] ?? 0)).slice(0, 15);
  const topRegions = [...regions].sort((a, b) => (rCounts[b.region_slug] ?? 0) - (rCounts[a.region_slug] ?? 0)).slice(0, 15);
  return (
    <>
      <Hero size="lg" center title="Find the right lawyer." intro={`${total.toLocaleString("en-AU")} Australian law firms, checked against their own websites and Google. Compare ratings, people and fees, then contact them directly.`}>
        <SearchBox size="lg" placeholder="Try “divorce”, “Parramatta” or a firm name" />
        <div className="mt-5 flex flex-wrap justify-center gap-2">{topAreas.slice(0, 6).map((a) => <Link key={a.slug} href={`/law/${a.group_slug}/${a.slug}`} className="pill hover:bg-hair">{a.name}</Link>)}</div>
      </Hero>
      <LogoCarousel logos={logos} title="Firms you’ll find here" />
      <section className="wrap py-14">
        <div className="flex items-end justify-between gap-4"><h2 className="h-md">Browse by area of law</h2><Link href="/law" className="link text-[15px]">All areas ›</Link></div>
        <div className="mt-8"><AreaTiles tiles={groups.filter((g) => g.slug !== "general").map((g) => ({ href: `/law/${g.slug}`, name: g.name, sub: g.intro ?? undefined, count: gCounts[g.slug], icon: g.slug }))} /></div>
      </section>
      <section className="band"><div className="wrap grid gap-6 py-16 md:grid-cols-3">
        {[[ShieldCheck, "Checked listings", "Every firm is matched to a live website, and most are confirmed against Google by phone number."], [Star, "Clearly sourced reviews", "Google ratings show where they came from and the date we retrieved them."], [PhoneCall, "Contact firms directly", "No middleman or fees. Call, visit the website or send an enquiry to the firm."]].map(([I, t, d]) => { const Icon = I as typeof ShieldCheck; return (
          <div key={t as string} className="surface p-7"><Icon className="h-6 w-6 text-accent" /><h3 className="mt-4 text-[21px] font-semibold tracking-tight">{t as string}</h3><p className="mt-2 text-[15px] text-muted">{d as string}</p></div>); })}
      </div></section>
      {featured.length ? <section className="wrap py-16"><h2 className="h-md">Well-reviewed firms</h2><div className="mt-8 grid gap-4 md:grid-cols-2">{featured.map((l) => <ListingCard key={l.listing_id} l={l} areas={areaMap(areas)} />)}</div></section> : null}
      <div className="wrap">
        <LinkGrid title="Most searched areas of law" links={topAreas.map((a) => ({ href: `/law/${a.group_slug}/${a.slug}`, label: a.name, count: aCounts[a.slug] }))} />
        <LinkGrid title="Largest locations" links={topRegions.map((r) => ({ href: `/locations/${r.region_slug}`, label: `${r.region_name}, ${r.state}`, count: rCounts[r.region_slug] }))} />
      </div>
    </>
  );
}

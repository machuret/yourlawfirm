import Link from "next/link";
import { ShieldCheck, Star, PhoneCall, HeartCrack, Siren, Flower2, Bandage, KeyRound, BriefcaseBusiness, Plane, FileWarning, Search, ListChecks, MessageSquare } from "lucide-react";
import Hero from "@/components/Hero";
import SearchBox from "@/components/SearchBox";
import AreaTiles from "@/components/AreaTiles";
import ListingCard from "@/components/ListingCard";
import LogoCarousel from "@/components/LogoCarousel";
import LinkGrid from "@/components/LinkGrid";
import SectionHead from "@/components/SectionHead";
import { getGroups, getPracticeAreas, getGroupCounts, getRegions, getRegionCounts, getFeatured, getAreaCounts, getLogos } from "@/lib/queries";
import { areaMap } from "@/lib/format";
import { canonical } from "@/lib/seo";
import { gStyle } from "@/lib/theme";
export const revalidate = 3600;
export const metadata = canonical("/");
const SIT = [[HeartCrack, "I’m separating", "family", "/law/family/divorce-separation"], [Siren, "I’ve been charged", "criminal", "/law/criminal/criminal-law"], [Flower2, "Someone has died", "wills", "/law/wills/probate-estate-administration"], [Bandage, "I was injured", "injury", "/law/injury/personal-injury"],
  [KeyRound, "I’m buying or selling", "property", "/law/property/property-conveyancing"], [BriefcaseBusiness, "I lost my job", "employment", "/law/employment/unfair-dismissal"], [Plane, "I need a visa", "immigration", "/law/immigration/immigration"], [FileWarning, "I’m owed money", "business", "/law/business/debt-recovery"]] as const;
export default async function Home() {
  const [groups, areas, gCounts, regions, rCounts, featured, aCounts, logos] = await Promise.all([getGroups(), getPracticeAreas(), getGroupCounts(), getRegions(), getRegionCounts(), getFeatured(4), getAreaCounts(), getLogos(null, null, 30)]);
  const total = Object.values(rCounts).reduce((a, b) => a + b, 0);
  const topAreas = [...areas].filter((a) => a.slug !== "general-practice").sort((a, b) => (aCounts[b.slug] ?? 0) - (aCounts[a.slug] ?? 0)).slice(0, 15);
  const topRegions = [...regions].sort((a, b) => (rCounts[b.region_slug] ?? 0) - (rCounts[a.region_slug] ?? 0)).slice(0, 15);
  return (
    <>
      <Hero size="lg" title="The right lawyer, without the guesswork." intro="Find legal expertise for life’s important moments. Explore Australian law firms, compare their experience and reviews, and take your next step with confidence."
        stats={[{ v: total.toLocaleString("en-AU"), l: "law firms" }, { v: String(regions.length), l: "regions" }, { v: String(areas.length), l: "areas of law" }]}>
        <div className="surface-glass p-2"><SearchBox size="lg" placeholder="Legal issue, location or firm" /></div>
      </Hero>
      <section className="wrap situation-section"><p className="section-eyebrow">Not sure where to start? Find help for your situation</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SIT.map(([I, t, g, h]) => (<li key={h}><Link href={h} style={gStyle(g)} className="situation-link surface card-hover flex h-full items-center gap-3"><span className="tile-icon g-tint !h-10 !w-10 shrink-0"><I className="h-5 w-5" /></span><span className="text-[13px] font-medium leading-snug">{t}</span></Link></li>))}
        </ul>
      </section>
      <LogoCarousel logos={logos} title="Some of the firms listed" />
      <section className="wrap py-16">
        <SectionHead title="Browse by area of law" sub="Each area explains what the lawyers do, why it matters and how it works in Australia." href="/law" linkText="All areas" />
        <div className="mt-8"><AreaTiles tiles={groups.filter((g) => g.slug !== "general").map((g) => ({ href: `/law/${g.slug}`, name: g.name, sub: g.intro ?? undefined, count: gCounts[g.slug], icon: g.slug, group: g.slug }))} /></div>
      </section>
      <section className="band mt-10"><div className="wrap py-16">
        <SectionHead title="How it works" sub="Three steps, no sign-up, no fees." />
        <ol className="steps mt-8 grid gap-4 md:grid-cols-3">
          {[[Search, "Find your area and place", "Start with what’s happening or where you are. Filter by open now, verified, rating, fees and language."], [ListChecks, "Compare firms", "See Google ratings, the people behind each firm, fees and languages. Save up to four and compare side by side."], [MessageSquare, "Contact them directly", "Call, visit the website or send an enquiry straight to the firm. We never sit in the middle."]].map(([I, t, d]) => { const Icon = I as typeof Search; return (
            <li key={t as string} className="step surface flex flex-col gap-4 p-7"><div className="flex items-center justify-between"><span /><Icon className="h-6 w-6 text-accent" /></div><div><h3 className="text-[21px] font-semibold tracking-tight">{t as string}</h3><p className="mt-2 text-[15px] leading-relaxed text-muted">{d as string}</p></div></li>); })}
        </ol>
      </div></section>
      {featured.length ? <section className="wrap py-16"><SectionHead title="Well-reviewed firms" sub="Verified firms with strong Google ratings from many reviews." /><div className="mt-8 grid gap-4 md:grid-cols-2">{featured.map((l) => <ListingCard key={l.listing_id} l={l} areas={areaMap(areas)} group={areas.find((a) => a.slug === l.primary_practice_area)?.group_slug} />)}</div></section> : null}
      <section className="band"><div className="wrap grid gap-6 py-16 md:grid-cols-3">
        {[[ShieldCheck, "Checked listings", "Look for the verification badge to see where a firm’s phone number has been matched to its website and Google."], [Star, "Clearly sourced reviews", "Google ratings show where they came from and the date we retrieved them. Firms with too few reviews aren’t rated."], [PhoneCall, "Contact firms directly", "No middleman or fees. Call, visit the website or send an enquiry to the firm."]].map(([I, t, d]) => { const Icon = I as typeof ShieldCheck; return (
          <div key={t as string} className="surface p-7"><span className="tile-icon bg-accent-soft text-accent"><Icon className="h-5 w-5" /></span><h3 className="mt-4 text-[21px] font-semibold tracking-tight">{t as string}</h3><p className="mt-2 text-[15px] leading-relaxed text-muted">{d as string}</p></div>); })}
      </div></section>
      <div className="wrap">
        <LinkGrid title="Most searched areas of law" links={topAreas.map((a) => ({ href: `/law/${a.group_slug}/${a.slug}`, label: a.name, count: aCounts[a.slug] }))} />
        <LinkGrid title="Largest locations" links={topRegions.map((r) => ({ href: `/locations/${r.region_slug}`, label: `${r.region_name}, ${r.state}`, count: rCounts[r.region_slug] }))} />
      </div>
    </>
  );
}

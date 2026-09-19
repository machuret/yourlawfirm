import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Phone, Globe, Mail, MapPin, Send } from "lucide-react";
import { Linkedin } from "@/components/Icons";
import { getListing, getPractitioners, getPracticeAreas, getReviews, getRelated, getGroups, getRegionGroupCounts } from "@/lib/queries";
import { fmtPhone, areaMap, areaName, DAYS, DAY_LABEL, lawyersTitle } from "@/lib/format";
import { canonical } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import LeadForm from "@/components/LeadForm";
import Stars from "@/components/Stars";
import Tip from "@/components/Tip";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ListingCard, { Initials } from "@/components/ListingCard";
import OpenStatus from "@/components/OpenStatus";
import LinkGrid from "@/components/LinkGrid";
import { SaveButton } from "@/components/Shortlist";
import { gStyle } from "@/lib/theme";
export const revalidate = 3600;
type P = { params: Promise<{ slug: string }> };
const ROLE: Record<string, string> = { founder: "Founder", co_founder: "Co-founder", founding_partner: "Founding partner", managing_partner: "Managing partner", senior_partner: "Senior partner", partner: "Partner", managing_director: "Managing director", principal: "Principal", director: "Director", ceo: "CEO", president: "President", chair: "Chair", special_counsel: "Special counsel", of_counsel: "Of counsel" };
export async function generateMetadata({ params }: P) {
  const l = await getListing((await params).slug); if (!l) return {};
  const pa = areaName(l.primary_practice_area, areaMap(await getPracticeAreas()));
  return { title: `${l.business_name}${l.suburb ? `, ${l.suburb}` : ""} · ${pa} lawyer`, description: l.short_description ?? `${l.business_name} is a ${pa.toLowerCase()} firm in ${l.suburb}, ${l.state}. Contact details, ratings, people and opening hours.`, ...canonical(`/lawyers/${l.slug}`), openGraph: { images: l.logo_url ? [l.logo_url] : [] } };
}
export default async function ListingPage({ params }: P) {
  const l = await getListing((await params).slug); if (!l) notFound();
  const [people, areas, reviews, related, groups, rgc] = await Promise.all([getPractitioners(l.firm_id ?? ""), getPracticeAreas(), getReviews(l.listing_id), getRelated(l.listing_id, 4), getGroups(), l.region_slug ? getRegionGroupCounts(l.region_slug) : Promise.resolve({ groups: {}, areas: {} } as { groups: Record<string, number>; areas: Record<string, number> })]);
  const names = areaMap(areas); const pa = areas.find((a) => a.slug === l.primary_practice_area); const g = groups.find((x) => x.slug === pa?.group_slug);
  const leaders = people.filter((p) => p.leadership_role || p.is_principal), team = people.filter((p) => !(p.leadership_role || p.is_principal));
  const google = reviews.filter((r) => r.source === "google"), own = reviews.filter((r) => r.source === "firm_website");
  const url = `${siteUrl()}/lawyers/${l.slug}`;
  const ld = { "@context": "https://schema.org", "@type": l.is_law_practice ? "LegalService" : "LocalBusiness", "@id": url, url, name: l.business_name, telephone: l.phone_e164 ?? undefined, email: l.email_general ?? undefined, image: l.logo_url ?? undefined, logo: l.logo_url ?? undefined, description: l.short_description ?? undefined,
    address: { "@type": "PostalAddress", streetAddress: l.address_line_1 ?? undefined, addressLocality: l.suburb ?? undefined, addressRegion: l.state ?? undefined, postalCode: l.postcode ?? undefined, addressCountry: "AU" },
    geo: l.latitude ? { "@type": "GeoCoordinates", latitude: l.latitude, longitude: l.longitude } : undefined, areaServed: l.region_name ? { "@type": "Place", name: l.region_name } : undefined, hasMap: l.latitude ? `https://www.google.com/maps?q=${l.latitude},${l.longitude}` : undefined,
    knowsAbout: (l.practice_areas ?? []).map((a) => areaName(a, names)), foundingDate: l.year_established ? String(l.year_established) : undefined,
    openingHoursSpecification: l.opening_hours ? DAYS.flatMap((d) => (l.opening_hours?.[d] ?? []).map(([o, c]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: ({ mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" } as Record<string, string>)[d], opens: o, closes: c }))) : undefined,
    aggregateRating: l.google_rating && (l.google_review_count ?? 0) >= 3 ? { "@type": "AggregateRating", ratingValue: l.google_rating, reviewCount: l.google_review_count, bestRating: 5 } : undefined,
    employee: leaders.slice(0, 10).map((p) => ({ "@type": "Person", name: p.full_name_display, jobTitle: ROLE[p.leadership_role ?? ""] ?? p.role_title ?? undefined, sameAs: p.linkedin_url ?? undefined })),
    sameAs: [l.website_url, l.firm_linkedin_url, ...Object.values(l.social_links ?? {})].filter(Boolean) };
  const crumbs = [...(g ? [{ name: g.name, href: `/law/${g.slug}` }] : []), ...(pa && g && pa.name !== g.name ? [{ name: pa.name, href: `/law/${g.slug}/${pa.slug}` }] : []), ...(pa && g && l.region_slug ? [{ name: l.region_name ?? "", href: `/law/${g.slug}/${pa.slug}/${l.region_slug}` }] : []), { name: l.business_name }];
  const facts = [["Free first consultation", l.free_first_consultation === "yes" ? "Yes" : null], ["Fees", l.fee_structures?.length ? l.fee_structures.map((f) => ({ fixed: "Fixed fees", conditional: "No win, no fee", legal_aid: "Legal Aid" } as Record<string, string>)[f] ?? f).join(", ") : null],
    ["Languages", (l.languages_spoken?.length ?? 0) > 1 ? l.languages_spoken!.map((x) => x[0].toUpperCase() + x.slice(1)).join(", ") : null], ["Established", l.year_established ? String(l.year_established) : null], ["Lawyers", l.number_of_lawyers ? String(l.number_of_lawyers) : null], ["Type", l.is_law_practice ? "Law firm" : "Licensed conveyancer"]].filter(([, v]) => v) as [string, string][];
  return (
    <>
      <JsonLd data={ld} />
      <section className="relative overflow-hidden" style={gStyle(g?.slug)}>
        <div aria-hidden="true" className="g-glow pointer-events-none absolute inset-x-0 top-0 h-[30rem]" />
        <div className="wrap relative pt-8 pb-10">
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-16 w-16 md:h-24 md:w-24 shrink-0 items-center justify-center overflow-hidden rounded-[20px] md:rounded-[26px] bg-paper logo-tile shadow-[var(--shadow-2)]">{l.logo_url ? <img src={l.logo_url} alt={`${l.business_name} logo`} className="max-h-12 max-w-12 md:max-h-16 md:max-w-16 object-contain" /> : <Initials name={l.business_name} className="text-2xl md:text-3xl" />}</div>
            <div className="min-w-0">
              {pa ? <p className="inline-flex rounded-full g-tint px-3 py-1 text-[13px] font-semibold">{pa.name}</p> : null}
              <div className="flex items-center gap-2"><h1 className="h-lg">{l.business_name}</h1>{l.data_confidence === "high" ? <Tip label="Verified: phone number confirmed on the firm’s website and Google"><BadgeCheck aria-hidden="true" className="h-7 w-7 text-accent" /></Tip> : null}</div>
              {l.office_name && l.office_name !== l.business_name ? <p className="mt-1 text-[15px] text-muted">{l.office_name}</p> : null}
              <p className="mt-2 flex items-center gap-1.5 text-[17px] text-muted"><MapPin className="h-4 w-4" />{[l.address_line_1, l.suburb, l.state, l.postcode].filter(Boolean).join(", ")}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1"><Stars rating={l.google_rating} count={l.google_review_count} fetchedAt={l.google_fetched_at} size="lg" /><OpenStatus hours={l.opening_hours} tz={l.timezone} /></div>
            </div>
          </div>
          <div className="mt-7 hidden flex-wrap gap-2 md:flex">
            {l.phone_e164 ? <a href={`tel:${l.phone_e164}`} className="btn btn-primary"><Phone className="h-4 w-4" />Call {fmtPhone(l.phone_primary)}</a> : null}
            {l.website_url ? <a href={l.website_url} target="_blank" rel="noopener nofollow" className="btn btn-soft"><Globe className="h-4 w-4" />Website</a> : null}
            <a href="#enquire" className="btn btn-soft"><Send className="h-4 w-4" />Send enquiry</a>
            <SaveButton slug={l.slug} name={l.business_name} />
          </div>
        </div>
      </section>
      <nav aria-label="On this page" className="sticky top-14 z-30 border-y border-hair bg-glass backdrop-blur-xl">
        <ul className="wrap scroll-x !gap-1 py-2 text-[14px]">{[["overview", "Overview"], ...(people.length ? [["people", "People"]] : []), ...(google.length || own.length ? [["reviews", "Reviews"]] : []), ...(l.opening_hours ? [["hours", "Hours"]] : []), ...(l.latitude ? [["location", "Location"]] : []), ["enquire", "Enquire"]].map(([id, t]) => <li key={id}><a href={`#${id}`} className="navbtn block text-muted hover:text-ink">{t}</a></li>)}</ul>
      </nav>
      <div className="wrap grid gap-12 pb-10 pt-10 lg:grid-cols-[1fr_22rem]">
        <div id="overview" className="min-w-0 scroll-mt-28">
          {l.short_description ? <p className="text-[21px] leading-[1.45] tracking-tight text-ink-3">{l.short_description}</p> : null}
          <section className="mt-12"><h2 className="text-[24px] font-semibold tracking-tight">Areas of practice</h2>
            {(() => { const all = [l.primary_practice_area, ...(l.practice_areas ?? []).filter((a) => a !== l.primary_practice_area)];
              const pill = (a: string) => { const x = areas.find((z) => z.slug === a); return <li key={a}><Link href={x ? `/law/${x.group_slug}/${x.slug}${l.region_slug ? `/${l.region_slug}` : ""}` : "#"} className={`pill hover:bg-hair ${a === l.primary_practice_area ? "g-tint font-medium" : ""}`}>{areaName(a, names)}</Link></li>; };
              return <><ul className="mt-4 flex flex-wrap gap-2">{all.slice(0, 5).map(pill)}</ul>{all.length > 5 ? <details className="mt-2"><summary className="link cursor-pointer text-[14px]">Show {all.length - 5} more</summary><ul className="mt-2 flex flex-wrap gap-2">{all.slice(5).map(pill)}</ul></details> : null}</>; })()}</section>
          {facts.length ? <section className="mt-12"><h2 className="text-[24px] font-semibold tracking-tight">At a glance</h2>
            <dl className="surface mt-4 grid gap-px overflow-hidden sm:grid-cols-2">{facts.map(([k, v]) => <div key={k} className="bg-paper p-5"><dt className="text-[13px] text-muted">{k}</dt><dd className="mt-0.5 text-[17px] font-medium">{v}</dd></div>)}</dl></section> : null}
          {leaders.length ? <section id="people" className="mt-12 scroll-mt-28"><h2 className="text-[24px] font-semibold tracking-tight">Leadership</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">{leaders.map((p) => <li key={p.practitioner_id} className="surface flex items-center gap-4 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft"><Initials name={p.full_name_display} className="text-sm" /></span>
              <div className="min-w-0 flex-1"><p className="truncate font-semibold">{p.full_name_display}</p><p className="text-[14px] text-muted">{p.is_founder ? "Founder · " : ""}{ROLE[p.leadership_role ?? ""] ?? p.role_title}</p></div>
              {p.linkedin_url ? <a href={p.linkedin_url} target="_blank" rel="noopener nofollow" aria-label={`${p.full_name_display} on LinkedIn`} className="text-link"><Linkedin className="h-5 w-5" /></a> : null}</li>)}</ul></section> : null}
          {team.length ? <section className="mt-8"><h3 className="text-[19px] font-semibold tracking-tight">Team</h3>
            <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">{team.map((p) => <li key={p.practitioner_id} className="flex items-center justify-between gap-3 border-b border-hair py-2.5 text-[15px]"><span>{p.full_name_display}<span className="text-muted">{p.role_title ? ` · ${p.role_title}` : ""}</span></span>{p.linkedin_url ? <a href={p.linkedin_url} target="_blank" rel="noopener nofollow" aria-label="LinkedIn" className="text-link"><Linkedin className="h-4 w-4" /></a> : null}</li>)}</ul></section> : null}
          {google.length || own.length ? <div id="reviews" className="scroll-mt-28" /> : null}
          {l.google_rating != null && (l.google_review_count ?? 0) >= 3 ? <section className="surface mt-14 flex items-center gap-6 p-6"><p className="display text-[48px] leading-none">{l.google_rating.toFixed(1)}</p><div><Stars rating={l.google_rating} size="lg" /><p className="mt-1 text-[15px] text-muted">Average from {l.google_review_count?.toLocaleString("en-AU")} Google reviews</p></div></section> : null}
          {google.length ? <section className="mt-8"><div className="flex items-baseline justify-between gap-4"><h2 className="text-[24px] font-semibold tracking-tight">Google reviews</h2><span className="text-[13px] text-muted">Retrieved {new Date(google[0].fetched_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</span></div>
            <ul className="scroll-x mt-4 snap-x pb-2">{google.map((r) => <li key={r.review_id} className="surface w-[85%] shrink-0 snap-start p-6 sm:w-[23rem]">
              <div className="flex items-center justify-between gap-2"><span className="truncate font-semibold">{r.author_name}</span><Stars rating={r.rating} /></div>
              {r.published_at ? <p className="text-[13px] text-muted">{new Date(r.published_at).toLocaleDateString("en-AU", { month: "long", year: "numeric" })}</p> : null}
              <p className="mt-3 line-clamp-6 text-[15px] leading-relaxed text-ink-2">{r.text}</p>
              {r.source_url ? <a href={r.source_url} target="_blank" rel="noopener nofollow" className="link mt-3 inline-block text-[13px]">View on Google</a> : null}</li>)}</ul></section> : null}
          {own.length ? <section className="mt-12"><h2 className="text-[24px] font-semibold tracking-tight">Client testimonials</h2><p className="text-[13px] text-muted">Published by the firm on its own website.</p>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">{own.map((r) => <li key={r.review_id} className="surface p-6 text-[15px]"><p className="leading-relaxed text-ink-2">“{r.text}”</p>{r.author_name ? <p className="mt-2 text-muted">{r.author_name}</p> : null}</li>)}</ul></section> : null}
          {l.latitude ? <section id="location" className="mt-12 scroll-mt-28"><h2 className="text-[24px] font-semibold tracking-tight">Location</h2>
            <div className="surface mt-4 overflow-hidden"><iframe title={`Map of ${l.business_name}`} src={`https://www.google.com/maps?q=${l.latitude},${l.longitude}&z=15&output=embed`} className="h-72 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></section> : null}
        </div>
        <aside className="grid gap-4 self-start lg:sticky lg:top-32">
          <div className="surface grid gap-3 p-6 text-[15px]">
            <h2 className="text-[21px] font-semibold tracking-tight">Contact</h2>
            {l.phone_e164 ? <a href={`tel:${l.phone_e164}`} className="btn btn-primary"><Phone className="h-4 w-4" />{fmtPhone(l.phone_primary)}</a> : null}
            {l.website_url ? <a href={l.website_url} target="_blank" rel="noopener nofollow" className="btn btn-soft"><Globe className="h-4 w-4" />Visit website</a> : null}
            {l.email_general ? <a href={`mailto:${l.email_general}`} className="link flex items-center gap-2 break-all"><Mail className="h-4 w-4 shrink-0" />{l.email_general}</a> : null}
            {l.firm_linkedin_url ? <a href={l.firm_linkedin_url} target="_blank" rel="noopener nofollow" className="link flex items-center gap-2"><Linkedin className="h-4 w-4" />LinkedIn</a> : null}
          </div>
          {l.opening_hours ? <div id="hours" className="surface scroll-mt-28 p-6 text-[15px]"><h2 className="text-[21px] font-semibold tracking-tight">Opening hours</h2><table className="mt-3 w-full"><tbody>{DAYS.map((d) => <tr key={d} className="border-b border-hair last:border-0"><td className="py-1.5 text-muted">{DAY_LABEL[d]}</td><td className="py-1.5 text-right tabular-nums">{l.opening_hours?.[d]?.length ? l.opening_hours[d].map((r) => r.join("–")).join(", ") : "Closed"}</td></tr>)}</tbody></table></div> : null}
          <div id="enquire" className="scroll-mt-24"><LeadForm listingId={l.listing_id} firm={l.business_name} area={l.primary_practice_area} region={l.region_slug} /></div>
        </aside>
      </div>
      <div className="wrap">
        {related.length ? <section className="mt-6"><h2 className="h-md">Similar firms nearby</h2><div className="mt-8 grid gap-4 md:grid-cols-2">{related.map((x) => <ListingCard key={x.listing_id} l={x} areas={names} group={g?.slug} />)}</div></section> : null}
        {l.region_slug ? <LinkGrid title={`Lawyers in ${l.region_name}`} links={areas.filter((a) => (rgc.areas[a.slug] ?? 0) > 1 && a.slug !== "general-practice").sort((a, b) => (rgc.areas[b.slug] ?? 0) - (rgc.areas[a.slug] ?? 0)).slice(0, 12).map((a) => ({ href: `/law/${a.group_slug}/${a.slug}/${l.region_slug}`, label: lawyersTitle(a.name), count: rgc.areas[a.slug] }))} /> : null}
        <p className="mt-14 text-[13px] text-muted">Compiled from the firm’s website, public directories and Google{l.date_last_verified ? `, last checked ${new Date(l.date_last_verified).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}` : ""}. Run this firm? <Link href={`/claim/${l.slug}`} className="link">Claim or correct this listing</Link>.</p>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hair bg-glass p-3 backdrop-blur-xl md:hidden" style={{ paddingBottom: "max(.75rem, env(safe-area-inset-bottom))" }}>
        <div className="flex gap-2">{l.phone_e164 ? <a href={`tel:${l.phone_e164}`} className="btn btn-primary flex-1"><Phone className="h-4 w-4" />Call</a> : null}<a href="#enquire" className="btn btn-soft flex-1"><Send className="h-4 w-4" />Enquire</a>{l.website_url ? <a href={l.website_url} target="_blank" rel="noopener nofollow" className="btn btn-soft" aria-label="Website"><Globe className="h-4 w-4" /></a> : null}</div>
      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}

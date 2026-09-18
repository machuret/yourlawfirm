import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing, getPractitioners, getPracticeAreas, getReviews, getRelated, getGroups } from "@/lib/queries";
import { fmtPhone, areaMap, areaName, DAYS, DAY_LABEL } from "@/lib/format";
import { canonical } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import LeadForm from "@/components/LeadForm";
import Stars from "@/components/Stars";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ListingCard from "@/components/ListingCard";
export const revalidate = 3600;
type P = { params: Promise<{ slug: string }> };
const ROLE: Record<string, string> = { founder: "Founder", co_founder: "Co-founder", founding_partner: "Founding partner", managing_partner: "Managing partner", senior_partner: "Senior partner", partner: "Partner", managing_director: "Managing director", principal: "Principal", director: "Director", ceo: "CEO", president: "President", chair: "Chair", special_counsel: "Special counsel", of_counsel: "Of counsel" };
export async function generateMetadata({ params }: P) {
  const l = await getListing((await params).slug); if (!l) return {};
  const areas = await getPracticeAreas(); const pa = areaName(l.primary_practice_area, areaMap(areas));
  return { title: `${l.business_name}${l.suburb ? `, ${l.suburb}` : ""} — ${pa} lawyer`, description: l.short_description ?? `${l.business_name} is a ${pa.toLowerCase()} firm in ${l.suburb}, ${l.state}. Contact details, ratings, people and opening hours.`, ...canonical(`/lawyers/${l.slug}`), openGraph: { images: l.logo_url ? [l.logo_url] : [] } };
}
export default async function ListingPage({ params }: P) {
  const l = await getListing((await params).slug); if (!l) notFound();
  const [people, areas, reviews, related, groups] = await Promise.all([getPractitioners(l.firm_id ?? ""), getPracticeAreas(), getReviews(l.listing_id), getRelated(l.listing_id, 6), getGroups()]);
  const names = areaMap(areas); const pa = areas.find((a) => a.slug === l.primary_practice_area); const g = groups.find((x) => x.slug === pa?.group_slug);
  const leaders = people.filter((p) => p.leadership_role || p.is_principal), team = people.filter((p) => !(p.leadership_role || p.is_principal));
  const google = reviews.filter((r) => r.source === "google"), own = reviews.filter((r) => r.source === "firm_website");
  const url = `${siteUrl()}/lawyers/${l.slug}`;
  const ld = { "@context": "https://schema.org", "@type": l.is_law_practice ? "LegalService" : "LocalBusiness", "@id": url, url, name: l.business_name, telephone: l.phone_e164 ?? undefined, email: l.email_general ?? undefined, image: l.logo_url ?? undefined, description: l.short_description ?? undefined,
    address: { "@type": "PostalAddress", streetAddress: l.address_line_1 ?? undefined, addressLocality: l.suburb ?? undefined, addressRegion: l.state ?? undefined, postalCode: l.postcode ?? undefined, addressCountry: "AU" },
    geo: l.latitude ? { "@type": "GeoCoordinates", latitude: l.latitude, longitude: l.longitude } : undefined, areaServed: l.region_name ?? undefined,
    knowsAbout: (l.practice_areas ?? []).map((a) => areaName(a, names)), foundingDate: l.year_established ? String(l.year_established) : undefined,
    aggregateRating: l.google_rating && l.google_review_count ? { "@type": "AggregateRating", ratingValue: l.google_rating, reviewCount: l.google_review_count, bestRating: 5 } : undefined,
    employee: leaders.slice(0, 10).map((p) => ({ "@type": "Person", name: p.full_name_display, jobTitle: ROLE[p.leadership_role ?? ""] ?? p.role_title ?? undefined, sameAs: p.linkedin_url ?? undefined })),
    sameAs: [l.website_url, l.firm_linkedin_url, ...Object.values(l.social_links ?? {})].filter(Boolean) };
  const crumbs = [...(g ? [{ name: g.name, href: `/law/${g.slug}` }] : []), ...(pa && g && pa.name !== g.name ? [{ name: pa.name, href: `/law/${g.slug}/${pa.slug}` }] : []), ...(pa && g && l.region_slug ? [{ name: l.region_name ?? "", href: `/law/${g.slug}/${pa.slug}/${l.region_slug}` }] : []), { name: l.business_name }];
  const initials = l.business_name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <>
      <JsonLd data={ld} />
      <section className="bg-green-deep text-white hero-pattern">
        <div className="wrap py-10">
          <Breadcrumbs items={crumbs} light />
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-paper">{l.logo_url ? <img src={l.logo_url} alt={`${l.business_name} logo`} className="max-h-16 max-w-16 object-contain" /> : <span className="font-display text-2xl text-green">{initials}</span>}</div>
              <div>
                {pa ? <p className="text-sm text-brass-light">{pa.name}{l.is_verified ? " · Verified" : ""}</p> : null}
                <h1 className="text-4xl md:text-5xl leading-tight">{l.business_name}</h1>
                <p className="mt-1 text-white/80">{[l.address_line_1, l.suburb, l.state, l.postcode].filter(Boolean).join(", ")}</p>
                <div className="mt-2"><Stars rating={l.google_rating} count={l.google_review_count} fetchedAt={l.google_fetched_at} size="lg" light /></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {l.phone_e164 ? <a href={`tel:${l.phone_e164}`} className="btn btn-brass">Call {fmtPhone(l.phone_primary)}</a> : null}
              {l.website_url ? <a href={l.website_url} target="_blank" rel="noopener nofollow" className="btn border border-white/40 text-white hover:bg-white/10">Website</a> : null}
              <a href="#enquire" className="btn border border-white/40 text-white hover:bg-white/10">Send enquiry</a>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap py-12 grid gap-12 lg:grid-cols-[1fr_22rem]">
        <div>
          {l.short_description ? <p className="text-xl leading-relaxed max-w-3xl">{l.short_description}</p> : null}
          <section className="mt-10"><h2 className="section-title">Areas of practice</h2>
            <ul className="mt-4 flex flex-wrap gap-2">{(l.practice_areas ?? []).map((a) => { const x = areas.find((z) => z.slug === a); return <li key={a}><Link href={x ? `/law/${x.group_slug}/${x.slug}${l.region_slug ? `/${l.region_slug}` : ""}` : "#"} className={`chip hover:bg-stone ${a === l.primary_practice_area ? "chip-on hover:!bg-green-deep" : ""}`}>{areaName(a, names)}</Link></li>; })}</ul></section>
          <section className="mt-10"><h2 className="section-title">At a glance</h2>
            <dl className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2 max-w-3xl">
              {[["Free first consultation", l.free_first_consultation === "yes" ? "Yes" : "Ask the firm"], ["Fees", l.fee_structures?.length ? l.fee_structures.map((f) => ({ fixed: "Fixed fees", conditional: "No win, no fee", legal_aid: "Legal Aid" } as Record<string, string>)[f] ?? f).join(", ") : null],
                ["Languages", (l.languages_spoken?.length ?? 0) > 1 ? l.languages_spoken!.map((x) => x[0].toUpperCase() + x.slice(1)).join(", ") : null], ["Established", l.year_established ? String(l.year_established) : null],
                ["Lawyers", l.number_of_lawyers ? String(l.number_of_lawyers) : null], ["Type", l.is_law_practice ? "Law firm" : "Licensed conveyancer (not a law practice)"]].filter(([, v]) => v).map(([k, v]) => <div key={k} className="border-b border-line pb-2"><dt className="text-sm text-muted">{k}</dt><dd>{v}</dd></div>)}
            </dl></section>
          {leaders.length ? (<section className="mt-10"><h2 className="section-title">Leadership</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">{leaders.map((p) => <li key={p.practitioner_id} className="card p-4 flex items-start justify-between gap-3"><div><p className="font-semibold">{p.full_name_display}</p><p className="text-sm text-muted">{p.is_founder ? "Founder · " : ""}{ROLE[p.leadership_role ?? ""] ?? p.role_title}</p></div>{p.linkedin_url ? <a href={p.linkedin_url} target="_blank" rel="noopener nofollow" className="text-sm underline shrink-0">LinkedIn</a> : null}</li>)}</ul></section>) : null}
          {team.length ? (<section className="mt-8"><h2 className="text-2xl">Team</h2>
            <ul className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2 text-sm">{team.map((p) => <li key={p.practitioner_id} className="flex justify-between gap-3 border-b border-line py-1.5"><span>{p.full_name_display}<span className="text-muted">{p.role_title ? ` — ${p.role_title}` : ""}</span></span>{p.linkedin_url ? <a href={p.linkedin_url} target="_blank" rel="noopener nofollow" className="underline">LinkedIn</a> : null}</li>)}</ul></section>) : null}
          {google.length ? (<section className="mt-12"><h2 className="section-title">Google reviews</h2>
            <p className="mt-1 text-xs text-muted">From Google Maps, retrieved {new Date(google[0].fetched_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}. Reviews are the reviewers’ own words.</p>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">{google.map((r) => <li key={r.review_id} className="card p-5 text-sm">
              <div className="flex items-center justify-between gap-2"><span className="font-semibold">{r.author_name}</span><Stars rating={r.rating} /></div>
              {r.published_at ? <p className="text-xs text-muted">{new Date(r.published_at).toLocaleDateString("en-AU", { month: "long", year: "numeric" })}</p> : null}
              <p className="mt-2 line-clamp-6 leading-relaxed">{r.text}</p>
              {r.source_url ? <a href={r.source_url} target="_blank" rel="noopener nofollow" className="mt-2 inline-block text-xs underline text-muted">View on Google</a> : null}</li>)}</ul></section>) : null}
          {own.length ? (<section className="mt-12"><h2 className="section-title">Client testimonials</h2><p className="mt-1 text-xs text-muted">Published by the firm on its own website.</p>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">{own.map((r) => <li key={r.review_id} className="border-l-4 border-brass pl-4 text-sm"><p className="italic leading-relaxed">“{r.text}”</p>{r.author_name ? <p className="mt-1 text-muted">{r.author_name}</p> : null}</li>)}</ul></section>) : null}
          {l.latitude ? (<section className="mt-12"><h2 className="section-title">Location</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-line"><iframe title={`Map of ${l.business_name}`} src={`https://www.google.com/maps?q=${l.latitude},${l.longitude}&z=15&output=embed`} className="h-72 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></section>) : null}
          {related.length ? (<section className="mt-14"><h2 className="section-title">Other {pa?.name.toLowerCase() ?? ""} lawyers nearby</h2>
            <div className="mt-5 grid gap-4">{related.map((x) => <ListingCard key={x.listing_id} l={x} areas={names} />)}</div>
            {pa && g && l.region_slug ? <Link href={`/law/${g.slug}/${pa.slug}/${l.region_slug}`} className="mt-4 inline-block text-sm underline">All {pa.name.toLowerCase()} lawyers in {l.region_name}</Link> : null}</section>) : null}
          <p className="mt-14 max-w-3xl text-xs text-muted">Compiled from the firm’s website, public directories and Google{l.date_last_verified ? `, last checked ${new Date(l.date_last_verified).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}` : ""}. Run this firm? <Link href={`/claim/${l.slug}`} className="underline">Claim or correct this listing</Link>.</p>
        </div>
        <aside className="self-start lg:sticky lg:top-24 grid gap-4">
          <div className="card p-5 grid gap-3 text-sm">
            <h2 className="text-xl">Contact</h2>
            {l.address_line_1 || l.suburb ? <p>{[l.level_floor, l.address_line_1].filter(Boolean).join(", ")}<br />{[l.suburb, l.state, l.postcode].filter(Boolean).join(" ")}</p> : null}
            {l.phone_e164 ? <a href={`tel:${l.phone_e164}`} className="btn btn-solid">Call {fmtPhone(l.phone_primary)}</a> : null}
            {l.website_url ? <a href={l.website_url} target="_blank" rel="noopener nofollow" className="btn btn-line">Visit website</a> : null}
            {l.email_general ? <a href={`mailto:${l.email_general}`} className="underline break-all">{l.email_general}</a> : null}
            {l.firm_linkedin_url ? <a href={l.firm_linkedin_url} target="_blank" rel="noopener nofollow" className="underline">LinkedIn</a> : null}
          </div>
          {l.opening_hours ? <div className="card p-5 text-sm"><h2 className="text-xl">Opening hours</h2><table className="mt-3 w-full"><tbody>{DAYS.map((d) => <tr key={d} className="border-b border-line last:border-0"><td className="py-1 text-muted">{DAY_LABEL[d]}</td><td className="py-1 text-right">{l.opening_hours?.[d]?.length ? l.opening_hours[d].map((r) => r.join("–")).join(", ") : "Closed"}</td></tr>)}</tbody></table></div> : null}
          <div id="enquire" className="scroll-mt-24"><LeadForm listingId={l.listing_id} firm={l.business_name} area={l.primary_practice_area} region={l.region_slug} /></div>
        </aside>
      </div>
    </>
  );
}

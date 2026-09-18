import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing, getPractitioners, getPracticeAreas } from "@/lib/queries";
import { fmtPhone, areaMap, areaName, DAYS, DAY_LABEL } from "@/lib/format";
import LeadForm from "@/components/LeadForm";
export const revalidate = 3600;
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P) {
  const l = await getListing((await params).slug);
  if (!l) return {};
  return { title: `${l.business_name}${l.suburb ? ` — ${l.suburb}` : ""}`, description: l.short_description ?? `${l.business_name} in ${l.suburb}, ${l.state}. Contact details, practice areas and opening hours.` };
}
export default async function ListingPage({ params }: P) {
  const l = await getListing((await params).slug);
  if (!l) notFound();
  const [people, areas] = await Promise.all([getPractitioners(l.listing_id), getPracticeAreas()]);
  const names = areaMap(areas);
  const ld = { "@context": "https://schema.org", "@type": l.is_law_practice ? "LegalService" : "LocalBusiness", name: l.business_name, telephone: l.phone_e164 ?? undefined, url: l.website_url ?? undefined, image: l.logo_url ?? undefined,
    address: { "@type": "PostalAddress", streetAddress: l.address_line_1 ?? undefined, addressLocality: l.suburb ?? undefined, addressRegion: l.state ?? undefined, postalCode: l.postcode ?? undefined, addressCountry: "AU" },
    geo: l.latitude ? { "@type": "GeoCoordinates", latitude: l.latitude, longitude: l.longitude } : undefined };
  return (
    <div className="wrap py-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div>
        <p className="text-sm text-muted">{l.region_slug ? <Link href={`/locations/${l.region_slug}`} className="underline">{l.region_name}</Link> : null}{l.suburb ? ` / ${l.suburb}` : ""}</p>
        <div className="mt-2 flex items-start justify-between gap-6">
          <h1 className="text-3xl md:text-4xl leading-tight">{l.business_name}{l.office_name ? <span className="block text-xl text-muted">{l.office_name}</span> : null}</h1>
          {l.logo_url ? <img src={l.logo_url} alt={`${l.business_name} logo`} className="max-h-14 w-auto object-contain" /> : null}
        </div>
        {l.tagline ? <p className="mt-2 text-lg">{l.tagline}</p> : null}
        <ul className="mt-4 flex flex-wrap gap-1.5 text-xs">
          {(l.practice_areas ?? []).map((a) => <li key={a}><Link href={`/practice-areas/${a}`} className={`inline-block border border-line px-2 py-0.5 rounded-sm ${a === l.primary_practice_area ? "bg-green text-paper border-green" : ""}`}>{areaName(a, names)}</Link></li>)}
          {l.is_verified ? <li className="bg-brass text-paper px-2 py-0.5 rounded-sm">Verified</li> : null}
        </ul>
        {l.short_description ? <p className="mt-6 max-w-prose">{l.short_description}</p> : null}

        <h2 className="mt-10 text-2xl">At a glance</h2>
        <dl className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm max-w-prose">
          {l.fee_structures?.length ? <><dt className="text-muted">Fees</dt><dd>{l.fee_structures.map((f) => f.replace("_", " ")).join(", ")}</dd></> : null}
          <dt className="text-muted">Free first consultation</dt><dd>{l.free_first_consultation === "yes" ? "Yes" : l.free_first_consultation === "no" ? "No" : "Ask the firm"}</dd>
          {l.no_win_no_fee ? <><dt className="text-muted">No win, no fee</dt><dd>Yes</dd></> : null}
          {l.legal_aid_accepted ? <><dt className="text-muted">Legal Aid</dt><dd>Accepted</dd></> : null}
          {l.languages_spoken?.length ? <><dt className="text-muted">Languages</dt><dd>{l.languages_spoken.join(", ")}</dd></> : null}
          {l.year_established ? <><dt className="text-muted">Established</dt><dd>{l.year_established}</dd></> : null}
          {l.number_of_lawyers ? <><dt className="text-muted">Lawyers</dt><dd>{l.number_of_lawyers}</dd></> : null}
          {!l.is_law_practice ? <><dt className="text-muted">Type</dt><dd>{l.listing_type.replace(/_/g, " ")} (not a law practice)</dd></> : null}
        </dl>

        {people.length ? (<><h2 className="mt-10 text-2xl">People</h2>
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm max-w-prose">{people.map((p) => <li key={p.practitioner_id} className="rule pt-2"><span className="font-semibold">{p.full_name_display}</span>{p.role_title ? <span className="text-muted"> — {p.role_title}</span> : null}</li>)}</ul></>) : null}

        {l.opening_hours ? (<><h2 className="mt-10 text-2xl">Opening hours</h2>
          <table className="mt-3 text-sm"><tbody>{DAYS.map((d) => <tr key={d}><td className="pr-6 text-muted">{DAY_LABEL[d]}</td><td>{l.opening_hours?.[d]?.length ? l.opening_hours[d].map((r) => r.join("–")).join(", ") : "Closed"}</td></tr>)}</tbody></table></>) : null}

        <p className="mt-12 text-xs text-muted max-w-prose">Details are compiled from public directories and the firm’s website and were last checked on the date shown in our records. If you run this firm, <Link href={`/claim/${l.slug}`} className="underline">claim the listing</Link> to correct or expand it.</p>
      </div>

      <aside className="lg:sticky lg:top-6 self-start grid gap-4">
        <div className="border border-line rounded-sm p-5 grid gap-3 text-sm">
          <h2 className="text-xl">Contact</h2>
          {l.address_line_1 || l.suburb ? <p>{[l.level_floor, l.address_line_1].filter(Boolean).join(", ")}<br />{[l.suburb, l.state, l.postcode].filter(Boolean).join(" ")}</p> : null}
          {l.phone_e164 ? <a href={`tel:${l.phone_e164}`} className="bg-green text-paper text-center py-2.5 rounded-sm hover:bg-green-deep">Call {fmtPhone(l.phone_primary)}</a> : null}
          {l.website_url ? <a href={l.website_url} target="_blank" rel="noopener nofollow" className="border border-green text-green text-center py-2.5 rounded-sm hover:bg-stone">Visit website</a> : null}
          {l.booking_url ? <a href={l.booking_url} target="_blank" rel="noopener nofollow" className="underline">Book online</a> : null}
          {l.latitude ? <a href={`https://www.google.com/maps?q=${l.latitude},${l.longitude}`} target="_blank" rel="noopener" className="underline">Open in maps</a> : null}
        </div>
        <LeadForm listingId={l.listing_id} firm={l.business_name} area={l.primary_practice_area} region={l.region_slug} />
      </aside>
    </div>);
}

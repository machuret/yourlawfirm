import Link from "next/link";
import type { Listing } from "@/lib/types";
import { fmtPhone, areaName } from "@/lib/format";

export default function ListingCard({ l, areas, distanceKm }: { l: Listing; areas: Record<string, string>; distanceKm?: number }) {
  const featured = l.is_featured && (!l.featured_until || l.featured_until >= new Date().toISOString().slice(0, 10));
  return (
    <article className={`grid gap-2 py-5 rule ${featured ? "bg-stone -mx-4 px-4 rounded-sm border-l-4 border-l-brass" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl leading-snug">
            <Link href={`/lawyers/${l.slug}`} className="hover:underline">{l.business_name}</Link>
            {l.office_name ? <span className="text-muted text-base"> — {l.office_name}</span> : null}
          </h3>
          <p className="text-sm text-muted">
            {[l.address_line_1, l.suburb, l.state, l.postcode].filter(Boolean).join(", ")}
            {distanceKm != null ? ` · ${distanceKm.toFixed(1)} km` : ""}
          </p>
        </div>
        {l.logo_url ? <img src={l.logo_url} alt="" width={96} height={40} className="shrink-0 max-h-10 w-auto object-contain" /> : null}
      </div>
      {l.short_description ? <p className="text-sm max-w-prose">{l.short_description}</p> : null}
      <ul className="flex flex-wrap gap-1.5 text-xs">
        {(l.practice_areas ?? []).slice(0, 5).map((a) => (
          <li key={a}><Link href={`/practice-areas/${a}`} className={`inline-block border border-line px-2 py-0.5 rounded-sm ${a === l.primary_practice_area ? "bg-green text-paper border-green" : ""}`}>{areaName(a, areas)}</Link></li>
        ))}
        {l.is_verified ? <li className="inline-block bg-brass text-paper px-2 py-0.5 rounded-sm">Verified</li> : null}
        {l.no_win_no_fee ? <li className="inline-block border border-line px-2 py-0.5 rounded-sm">No win, no fee</li> : null}
        {l.free_first_consultation === "yes" ? <li className="inline-block border border-line px-2 py-0.5 rounded-sm">Free first consultation</li> : null}
        {!l.is_law_practice ? <li className="inline-block border border-line px-2 py-0.5 rounded-sm text-muted">Not a law practice</li> : null}
      </ul>
      <div className="flex flex-wrap gap-4 text-sm">
        {l.phone_e164 ? <a href={`tel:${l.phone_e164}`} className="underline">{fmtPhone(l.phone_primary)}</a> : null}
        {l.website_url ? <a href={l.website_url} target="_blank" rel="noopener nofollow" className="underline">Website</a> : null}
        <Link href={`/lawyers/${l.slug}`} className="underline">Full profile</Link>
      </div>
    </article>
  );
}

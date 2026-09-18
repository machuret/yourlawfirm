import Link from "next/link";
import type { Listing } from "@/lib/types";
import { fmtPhone, areaName } from "@/lib/format";
import Stars from "./Stars";
export default function ListingCard({ l, areas }: { l: Listing; areas: Record<string, string> }) {
  const featured = l.is_featured && (!l.featured_until || l.featured_until >= new Date().toISOString().slice(0, 10));
  const initials = l.business_name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <article className={`card grid gap-4 p-5 md:grid-cols-[4.5rem_1fr_auto] ${featured ? "ring-2 ring-brass" : ""}`}>
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-line bg-paper">
        {l.logo_url ? <img src={l.logo_url} alt="" className="max-h-14 max-w-14 object-contain" loading="lazy" /> : <span className="font-display text-xl text-green">{initials}</span>}
      </div>
      <div className="min-w-0">
        {featured ? <p className="text-xs font-semibold text-brass">Featured</p> : null}
        <h3 className="text-xl leading-snug"><Link href={`/lawyers/${l.slug}`} className="hover:underline">{l.business_name}</Link></h3>
        <p className="mt-0.5 text-sm text-muted">{[l.suburb, l.state].filter(Boolean).join(", ")}{l.region_name ? ` · ${l.region_name}` : ""}</p>
        <div className="mt-1"><Stars rating={l.google_rating} count={l.google_review_count} fetchedAt={l.google_fetched_at} /></div>
        {l.short_description ? <p className="mt-2 line-clamp-2 text-sm text-ink/80">{l.short_description}</p> : null}
        <ul className="mt-3 flex flex-wrap gap-1.5 text-xs">
          {(l.practice_areas ?? []).slice(0, 4).map((a) => <li key={a} className={`chip ${a === l.primary_practice_area ? "chip-on" : ""}`}>{areaName(a, areas)}</li>)}
          {l.no_win_no_fee ? <li className="chip">No win, no fee</li> : null}
          {l.free_first_consultation === "yes" ? <li className="chip">Free first consult</li> : null}
          {!l.is_law_practice ? <li className="chip text-muted">Licensed conveyancer</li> : null}
        </ul>
      </div>
      <div className="flex flex-row gap-2 md:flex-col md:items-stretch md:justify-center">
        <Link href={`/lawyers/${l.slug}`} className="btn btn-solid">View profile</Link>
        {l.phone_e164 ? <a href={`tel:${l.phone_e164}`} className="btn btn-line">{fmtPhone(l.phone_primary)}</a> : null}
      </div>
    </article>
  );
}

import Link from "next/link";
import { BadgeCheck, Phone, Globe, Languages, Sparkles, HandCoins, Clock } from "lucide-react";
import type { Listing } from "@/lib/types";
import { fmtPhone, areaName } from "@/lib/format";
import Stars from "./Stars";
import Tip from "./Tip";
import OpenStatus from "./OpenStatus";
import { SaveButton } from "./Shortlist";
import { gStyle } from "@/lib/theme";
import { Award } from "lucide-react";
export function Initials({ name, className = "" }: { name: string; className?: string }) {
  const i = name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return <span className={`display text-accent ${className}`}>{i}</span>;
}
export default function ListingCard({ l, areas, group }: { l: Listing; areas: Record<string, string>; group?: string | null }) {
  const featured = l.is_featured && (!l.featured_until || l.featured_until >= new Date().toISOString().slice(0, 10));
  const langs = (l.languages_spoken ?? []).filter((x) => x !== "english");
  const topRated = (l.google_rating ?? 0) >= 4.8 && (l.google_review_count ?? 0) >= 50;
  return (
    <article style={gStyle(group)} className={`surface card-hover relative flex flex-col overflow-hidden p-4 sm:p-5 ${featured ? "ring-2 ring-star/70" : ""}`}>
      <span aria-hidden="true" className="g-bar absolute inset-x-0 top-0 h-[3px] opacity-70" />
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-soft logo-tile">
          {l.logo_url ? <img src={l.logo_url} alt="" className="max-h-11 max-w-11 object-contain" loading="lazy" /> : <Initials name={l.business_name} className="text-lg" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[19px] leading-tight"><Link href={`/lawyers/${l.slug}`} className="after:absolute after:inset-0 hover:underline">{l.business_name}</Link></h3>
            {l.data_confidence === "high" ? <Tip label="Verified: phone number confirmed on the firm’s website and Google"><BadgeCheck aria-hidden="true" className="relative z-10 h-4 w-4 shrink-0 text-accent" /></Tip> : null}
          </div>
          <p className="mt-0.5 truncate text-[14px] text-muted">{[l.suburb, l.state].filter(Boolean).join(", ")}{l.region_name ? ` · ${l.region_name}` : ""}</p>
          <div className="relative z-10 mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1"><Stars rating={l.google_rating} count={l.google_review_count} fetchedAt={l.google_fetched_at} /><OpenStatus hours={l.opening_hours} tz={l.timezone} /></div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">{featured ? <span className="pill pill-accent !text-[12px]"><Sparkles className="h-3 w-3" />Featured</span> : topRated ? <Tip label="4.8★ or higher from at least 50 Google reviews"><span className="pill !text-[12px] bg-[color-mix(in_srgb,var(--star)_14%,var(--paper))] text-[color-mix(in_srgb,var(--star)_70%,var(--ink))]"><Award className="h-3 w-3" />Top rated</span></Tip> : null}<SaveButton slug={l.slug} name={l.business_name} /></div>
      </div>
      {l.short_description ? <p className="mt-3 line-clamp-2 text-[14px] leading-snug text-ink-2">{l.short_description}</p> : null}
      <div className="relative z-10 mt-3 flex flex-wrap gap-1.5 [&>*:nth-child(n+5)]:hidden">
        <span className="pill g-tint !text-[13px] font-medium">{areaName(l.primary_practice_area, areas)}</span>
        {(l.practice_areas?.length ?? 0) > 1 ? <Tip label={(l.practice_areas ?? []).filter((a) => a !== l.primary_practice_area).map((a) => areaName(a, areas)).join(" · ")}><span className="pill !text-[13px]">+{(l.practice_areas?.length ?? 1) - 1} more</span></Tip> : null}
        {l.no_win_no_fee ? <Tip label="The firm mentions no win, no fee arrangements. Confirm terms in writing."><span className="pill !text-[13px]"><HandCoins className="h-3.5 w-3.5" />No win, no fee</span></Tip> : null}
        {l.free_first_consultation === "yes" ? <Tip label="The firm advertises a free first consultation."><span className="pill !text-[13px]"><Clock className="h-3.5 w-3.5" />Free first consult</span></Tip> : null}
        {langs.length ? <Tip label={`Languages mentioned on the firm’s website: ${langs.join(", ")}`}><span className="pill !text-[13px]"><Languages className="h-3.5 w-3.5" />{langs.length + 1} languages</span></Tip> : null}
      </div>
      <div className="relative z-10 mt-auto flex items-center gap-2 pt-4">
        {l.phone_e164 ? <a href={`tel:${l.phone_e164}`} className="btn btn-soft !px-3.5 !py-2 text-[14px]"><Phone className="h-4 w-4" />{fmtPhone(l.phone_primary)}</a> : null}
        {l.website_url ? <a href={l.website_url} target="_blank" rel="noopener nofollow" className="btn btn-ghost text-[14px]" aria-label={`${l.business_name} website`}><Globe className="h-4 w-4" />Website</a> : null}
        {l.year_established ? <span className="ml-auto text-[12px] text-muted">Est. {l.year_established}</span> : null}
        <Link href={`/lawyers/${l.slug}`} className={`btn btn-ghost text-[14px] ${l.year_established ? "" : "ml-auto"}`}>Profile ›</Link>
      </div>
    </article>
  );
}

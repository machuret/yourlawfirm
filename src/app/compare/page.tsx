import Link from "next/link";
import { BadgeCheck, Check, Minus } from "lucide-react";
import Hero from "@/components/Hero";
import Stars from "@/components/Stars";
import OpenStatus from "@/components/OpenStatus";
import { Initials } from "@/components/ListingCard";
import { getListingsBySlugs, getPracticeAreas } from "@/lib/queries";
import { areaMap, areaName, fmtPhone } from "@/lib/format";
export const metadata = { title: "Compare firms", robots: { index: false, follow: true } };
export const dynamic = "force-dynamic";
const Y = ({ v }: { v: boolean | null | undefined }) => v ? <Check className="h-5 w-5 text-accent" aria-label="Yes" /> : <Minus className="h-5 w-5 text-line" aria-label="Not stated" />;
export default async function Compare({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const slugs = ((await searchParams).f ?? "").split(",").filter(Boolean).slice(0, 4);
  const [rows, areas] = await Promise.all([getListingsBySlugs(slugs), getPracticeAreas()]); const names = areaMap(areas);
  const lines: [string, (l: (typeof rows)[number]) => React.ReactNode][] = [
    ["Rating", (l) => <Stars rating={l.google_rating} count={l.google_review_count} fetchedAt={l.google_fetched_at} />],
    ["Verified", (l) => <Y v={l.data_confidence === "high"} />], ["Open now", (l) => <OpenStatus hours={l.opening_hours} tz={l.timezone} />],
    ["Main area", (l) => areaName(l.primary_practice_area, names)], ["Also handles", (l) => (l.practice_areas ?? []).filter((a) => a !== l.primary_practice_area).slice(0, 4).map((a) => areaName(a, names)).join(", ") || "—"],
    ["Free first consult", (l) => <Y v={l.free_first_consultation === "yes"} />], ["No win, no fee", (l) => <Y v={l.no_win_no_fee} />], ["Legal Aid", (l) => <Y v={l.legal_aid_accepted} />],
    ["Languages", (l) => (l.languages_spoken ?? []).map((x) => x[0].toUpperCase() + x.slice(1)).join(", ") || "English"], ["Established", (l) => l.year_established ?? "—"],
    ["Location", (l) => [l.suburb, l.state].filter(Boolean).join(", ")], ["Phone", (l) => l.phone_e164 ? <a className="link" href={`tel:${l.phone_e164}`}>{fmtPhone(l.phone_primary)}</a> : "—"]];
  return (<>
    <Hero title="Compare firms" intro={rows.length ? "Side by side, from each firm’s website and Google. Always confirm fees and availability directly." : "Tap the heart on up to four firms, then compare them here."} crumbs={[{ name: "Compare" }]} />
    {rows.length ? <div className="wrap overflow-x-auto"><table className="surface w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden text-[15px]">
      <thead><tr><th className="w-40 bg-paper p-4" />{rows.map((l) => <th key={l.slug} className="bg-paper p-4 text-left align-top">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-soft">{l.logo_url ? <img src={l.logo_url} alt="" className="max-h-9 max-w-9 object-contain" /> : <Initials name={l.business_name} />}</div>
        <Link href={`/lawyers/${l.slug}`} className="mt-3 flex items-center gap-1 text-[17px] font-semibold tracking-tight hover:underline">{l.business_name}{l.data_confidence === "high" ? <BadgeCheck className="h-4 w-4 text-accent" /> : null}</Link></th>)}</tr></thead>
      <tbody>{lines.map(([k, f]) => <tr key={k}><th scope="row" className="border-t border-hair p-4 text-left text-[13px] font-medium text-muted">{k}</th>{rows.map((l) => <td key={l.slug} className="border-t border-hair p-4 align-top">{f(l)}</td>)}</tr>)}</tbody>
    </table></div> : <div className="wrap"><Link href="/law" className="btn btn-primary">Browse areas of law</Link></div>}
  </>);
}

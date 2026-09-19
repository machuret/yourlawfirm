import ListingList from "./ListingList";
import Toolbar from "./Toolbar";
import MapView from "./MapView";
import type { Listing } from "@/lib/types";
import type { Filters } from "@/lib/filters";
export default function Results({ rows, count, areas, name, page, hrefFor, filters, group }: { rows: Listing[]; count: number; areas: Record<string, string>; name: string; page: number; hrefFor: (p: number) => string; filters: Filters; group?: string | null }) {
  const pins = rows.filter((l) => l.latitude != null && l.longitude != null).map((l) => ({ slug: l.slug, name: l.business_name, lat: l.latitude as number, lng: l.longitude as number, rating: l.google_rating, count: l.google_review_count, suburb: l.suburb }));
  return (
    <div>
      <Toolbar count={count} />
      <div className="mt-6">{filters.view === "map" ? <><MapView pins={pins} /><p className="mt-3 text-[13px] text-muted">Showing {pins.length.toLocaleString("en-AU")} firms with a mapped address. Select a pin for details.</p></> : <ListingList rows={rows} areas={areas} name={name} page={page} count={count} hrefFor={hrefFor} group={group} />}</div>
    </div>
  );
}

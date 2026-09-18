import type { Metadata } from "next";
import SearchForm from "@/components/SearchForm";
import ListingCard from "@/components/ListingCard";
import { getPracticeAreas, searchText, searchNearby } from "@/lib/queries";
import { areaMap } from "@/lib/format";

export const metadata: Metadata = { title: "Search lawyers" };
export const dynamic = "force-dynamic";

export default async function Search({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const areas = await getPracticeAreas();
  const lat = sp.lat ? Number(sp.lat) : null, lng = sp.lng ? Number(sp.lng) : null;
  const rows = lat != null && lng != null ? await searchNearby(lat, lng, sp.area || undefined) : (sp.q || sp.area ? await searchText(sp.q ?? "", sp.area || undefined) : []);
  const label = lat != null ? "near you" : sp.q ? `matching “${sp.q}”` : sp.area ? areaMap(areas)[sp.area] : "";
  return (
    <div className="wrap py-10">
      <h1 className="text-3xl">Search</h1>
      <div className="mt-6"><SearchForm areas={areas} defaultArea={sp.area ?? ""} defaultQ={sp.q ?? ""} compact /></div>
      <div className="mt-10">
        {rows.length ? <p className="text-sm text-muted">{rows.length} result{rows.length === 1 ? "" : "s"} {label}</p> : (sp.q || sp.area || lat != null) ? <p>No listings found {label}. Try a nearby suburb, a postcode, or a broader practice area.</p> : <p className="text-muted">Choose a practice area, type a suburb or postcode, or use “Near me”.</p>}
        {rows.map((l) => <ListingCard key={l.listing_id} l={l} areas={areaMap(areas)} />)}
      </div>
    </div>
  );
}

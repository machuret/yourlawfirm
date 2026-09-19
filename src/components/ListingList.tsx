import Link from "next/link";
import ListingCard from "./ListingCard";
import JsonLd from "./JsonLd";
import { itemListLd } from "@/lib/seo";
import type { Listing } from "@/lib/types";
export default function ListingList({ rows, areas, name, page, count, hrefFor, size = 24, group }: { rows: Listing[]; areas: Record<string, string>; name: string; page?: number; count?: number; hrefFor?: (p: number) => string; size?: number; group?: string | null }) {
  if (!rows.length) return <p className="surface-flat p-6 text-muted">No firms listed here yet. Try a nearby location or a broader area of law.</p>;
  const pages = count ? Math.ceil(count / size) : 0;
  return (
    <div>
      <JsonLd data={itemListLd(name, rows)} />
      <div className="grid gap-4 md:grid-cols-2">{rows.map((l) => <ListingCard key={l.listing_id} l={l} areas={areas} group={group} />)}</div>
      {hrefFor && page && pages > 1 ? (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2 text-[15px]">
          {page > 1 ? <Link href={hrefFor(page - 1)} className="btn btn-soft">‹ Previous</Link> : null}
          <span className="px-3 text-muted">Page {page} of {pages}</span>
          {page < pages ? <Link href={hrefFor(page + 1)} className="btn btn-soft">Next ›</Link> : null}
        </nav>) : null}
    </div>
  );
}

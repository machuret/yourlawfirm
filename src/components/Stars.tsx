export default function Stars({ rating, count, fetchedAt, size = "sm" }: { rating: number | null; count?: number | null; fetchedAt?: string | null; size?: "sm" | "lg" }) {
  if (rating == null) return null;
  const full = Math.round(rating);
  return (
    <span className={`inline-flex items-center gap-1.5 ${size === "lg" ? "text-base" : "text-xs"}`} title={fetchedAt ? `Google rating, retrieved ${new Date(fetchedAt).toLocaleDateString("en-AU")}` : "Google rating"}>
      <span aria-hidden="true" className="text-brass tracking-tight">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>
      <span className="tabular-nums">{rating.toFixed(1)}</span>
      {count != null ? <span className="text-muted">({count} Google review{count === 1 ? "" : "s"})</span> : null}
    </span>
  );
}

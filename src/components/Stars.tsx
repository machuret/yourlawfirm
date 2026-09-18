export default function Stars({ rating, count, fetchedAt, size = "sm", light = false }: { rating: number | null; count?: number | null; fetchedAt?: string | null; size?: "sm" | "lg"; light?: boolean }) {
  if (rating == null) return null;
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className={`inline-flex items-center gap-1.5 ${size === "lg" ? "text-base" : "text-xs"}`} title={fetchedAt ? `Google rating, retrieved ${new Date(fetchedAt).toLocaleDateString("en-AU")}` : "Google rating"}>
      <span aria-hidden="true" className="relative inline-block leading-none tracking-tight">
        <span className={light ? "text-white/30" : "text-line"}>★★★★★</span>
        <span className="absolute inset-0 overflow-hidden text-brass" style={{ width: `${pct}%` }}>★★★★★</span>
      </span>
      <span className="tabular-nums font-semibold">{rating.toFixed(1)}</span>
      {count != null ? <span className={light ? "text-white/70" : "text-muted"}>({count.toLocaleString("en-AU")} on Google)</span> : null}
    </span>
  );
}

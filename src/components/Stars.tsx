import Tip from "./Tip";
export default function Stars({ rating, count, fetchedAt, size = "sm", light = false }: { rating: number | null; count?: number | null; fetchedAt?: string | null; size?: "sm" | "lg"; light?: boolean }) {
  if (rating == null) return null;
  if (count != null && count < 3) return <Tip label={`Only ${count} Google review${count === 1 ? "" : "s"} so far, not enough for a reliable rating`}><span className={`text-[13px] ${light ? "text-white/70" : "text-muted"}`}>New on Google</span></Tip>;
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const when = fetchedAt ? new Date(fetchedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) : null;
  return (
    <Tip label={`Google rating${count != null ? ` from ${count.toLocaleString("en-AU")} reviews` : ""}${when ? `, retrieved ${when}` : ""}`}>
      <span className={`inline-flex items-center gap-1.5 ${size === "lg" ? "text-[17px]" : "text-[14px]"}`}>
        <span aria-hidden="true" className="relative inline-block leading-none">
          <span className={light ? "text-white/25" : "text-hair"}>★★★★★</span>
          <span className="absolute inset-0 overflow-hidden text-star" style={{ width: `${pct}%` }}>★★★★★</span>
        </span>
        <span className="font-semibold tabular-nums">{rating.toFixed(1)}</span>
        {count != null ? <span className={light ? "text-white/70" : "text-muted"}>({count.toLocaleString("en-AU")})</span> : null}
      </span>
    </Tip>
  );
}

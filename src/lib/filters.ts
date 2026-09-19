export type Filters = { open?: boolean; verified?: boolean; top?: boolean; free?: boolean; nwnf?: boolean; lang?: string; sort?: "best" | "rating" | "reviews" | "name"; view?: "list" | "map" };
type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
export function parseFilters(sp: SP): Filters {
  const s = one(sp.sort);
  return { open: one(sp.open) === "1", verified: one(sp.verified) === "1", top: one(sp.top) === "1", free: one(sp.free) === "1", nwnf: one(sp.nwnf) === "1",
    lang: one(sp.lang) || undefined, sort: (["rating", "reviews", "name"].includes(s ?? "") ? s : "best") as Filters["sort"], view: one(sp.view) === "map" ? "map" : "list" };
}
/** Build a query string from current params with overrides (null removes a key). */
export function qs(sp: SP, over: Record<string, string | number | null> = {}) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) { const x = one(v); if (x != null && x !== "") u.set(k, x); }
  for (const [k, v] of Object.entries(over)) { if (v == null) u.delete(k); else u.set(k, String(v)); }
  const s = u.toString(); return s ? `?${s}` : "";
}
export const hasFilters = (f: Filters) => !!(f.open || f.verified || f.top || f.free || f.nwnf || f.lang);

export function fmtPhone(p: string | null) {
  if (!p) return "";
  if (/^1[38]00\d{6}$/.test(p)) return `${p.slice(0, 4)} ${p.slice(4, 7)} ${p.slice(7)}`;
  if (/^13\d{4}$/.test(p)) return `${p.slice(0, 2)} ${p.slice(2)}`;
  if (/^04\d{8}$/.test(p)) return `${p.slice(0, 4)} ${p.slice(4, 7)} ${p.slice(7)}`;
  if (/^0\d{9}$/.test(p)) return `(${p.slice(0, 2)}) ${p.slice(2, 6)} ${p.slice(6)}`;
  return p;
}
export function areaName(slug: string, map: Record<string, string>) { return map[slug] ?? slug.replace(/-/g, " "); }
export function areaMap(areas: { slug: string; name: string }[]) { return Object.fromEntries(areas.map((a) => [a.slug, a.name])); }
export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export const DAY_LABEL: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };

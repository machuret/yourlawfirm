import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { getGroups, getPracticeAreas, getRegions, getGroupCounts } from "@/lib/queries";
import { getSite, siteUrl } from "@/lib/site";
export const revalidate = 86400;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite(); const base = siteUrl();
  const [groups, areas, regions, gc] = await Promise.all([getGroups(), getPracticeAreas(), getRegions(), getGroupCounts()]);
  const listings: { slug: string; date_last_verified: string | null }[] = [];
  for (let from = 0; ; from += 1000) {
    let q = supabase.from("public_listings").select("slug,date_last_verified").range(from, from + 999);
    if (site.practice_area_filter?.length) q = q.overlaps("practice_areas", site.practice_area_filter);
    const { data } = await q; listings.push(...(data ?? [])); if (!data || data.length < 1000) break;
  }
  const { data: combos } = await supabase.rpc("area_region_pairs");
  const u = (p: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" = "weekly") => ({ url: base + p, priority, changeFrequency });
  return [u("/", 1, "daily"), u("/law", 0.9), u("/locations", 0.9),
    ...groups.filter((g) => (gc[g.slug] ?? 0) > 0).map((g) => u(`/law/${g.slug}`, 0.9)),
    ...areas.map((a) => u(`/law/${a.group_slug}/${a.slug}`, 0.8)),
    ...regions.map((r) => u(`/locations/${r.region_slug}`, 0.8)),
    ...((combos ?? []) as { group_slug: string; area_slug: string; region_slug: string }[]).map((c) => u(`/law/${c.group_slug}/${c.area_slug}/${c.region_slug}`, 0.6)),
    ...listings.map((l) => ({ url: `${base}/lawyers/${l.slug}`, lastModified: l.date_last_verified ?? undefined, priority: 0.5 })),
    u("/about", 0.3, "monthly"), u("/privacy", 0.2, "monthly"), u("/terms", 0.2, "monthly")];
}

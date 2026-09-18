import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { getPracticeAreas, getRegions } from "@/lib/queries";
import { getSite } from "@/lib/site";
export const revalidate = 86400;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();
  const base = `https://${site.domain ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000"}`;
  const [areas, regions] = await Promise.all([getPracticeAreas(), getRegions()]);
  let q = supabase.from("public_listings").select("slug,date_last_verified,practice_areas").range(0, 49999);
  if (site.practice_area_filter?.length) q = q.overlaps("practice_areas", site.practice_area_filter);
  const { data } = await q;
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...areas.map((a) => ({ url: `${base}/practice-areas/${a.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...regions.map((r) => ({ url: `${base}/locations/${r.region_slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...(data ?? []).map((l) => ({ url: `${base}/lawyers/${l.slug}`, lastModified: l.date_last_verified ?? undefined, priority: 0.5 })),
  ];
}

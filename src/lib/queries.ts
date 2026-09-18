import { cache } from "react";
import { supabase } from "./supabase";
import { siteAreaFilter, SITE_KEY } from "./site";
import type { Listing, PracticeArea, Region, Practitioner, Review, Group, StateInfo, Suggestion } from "./types";

const LISTING_COLS = "listing_id,firm_id,slug,business_name,office_name,listing_type,is_law_practice,suburb,state,postcode,region_slug,region_name,address_line_1,level_floor,latitude,longitude,phone_e164,phone_primary,website_url,booking_url,email_general,primary_practice_area,practice_areas,languages_spoken,fee_structures,free_first_consultation,no_win_no_fee,legal_aid_accepted,after_hours,opening_hours,timezone,tagline,short_description,badges,claim_status,is_verified,plan_tier,is_featured,featured_until,logo_url,hero_image_url,google_rating,google_review_count,year_established,number_of_lawyers,social_links,firm_linkedin_url,google_fetched_at,reviews_available,founders,leadership,data_confidence,date_last_verified";
const AREA_COLS = "slug,name,parent_group,group_slug,candidate_site,is_lawyer_area,intro,body,faq,hero_image_url,hero_credit,seo_title,meta_description,sort";
const REGION_COLS = "region_slug,region_name,state,region_type,major_centres,intro,body,faq,hero_image_url,hero_credit,seo_title,meta_description";

function base() { return supabase.from("public_listings").select(LISTING_COLS, { count: "exact" }); }
function scopedWith(filter: string[]) { const q = base(); return filter.length ? q.overlaps("practice_areas", filter) : q; }
const ORDER = (q: ReturnType<typeof base>) => q.order("is_featured", { ascending: false }).order("sort_priority", { ascending: false }).order("data_confidence", { ascending: true }).order("google_review_count", { ascending: false, nullsFirst: false }).order("business_name");

export const getGroups = cache(async (): Promise<Group[]> => {
  const filter = await siteAreaFilter();
  const { data } = await supabase.from("practice_groups").select("*").order("sort");
  let groups = (data ?? []) as Group[];
  if (filter.length) { const areas = await getPracticeAreas(); const keep = new Set(areas.map((a) => a.group_slug)); groups = groups.filter((g) => keep.has(g.slug)); }
  return groups;
});
export async function getGroup(slug: string) { return (await getGroups()).find((g) => g.slug === slug) ?? null; }
export const getPracticeAreas = cache(async (): Promise<PracticeArea[]> => {
  const filter = await siteAreaFilter();
  let q = supabase.from("practice_areas").select(AREA_COLS).order("sort");
  if (filter.length) q = q.in("slug", filter);
  return ((await q).data ?? []) as PracticeArea[];
});
export async function getPracticeArea(slug: string) { return (await getPracticeAreas()).find((a) => a.slug === slug) ?? null; }
export const getRegions = cache(async (): Promise<Region[]> => ((await supabase.from("regions").select(REGION_COLS).order("state").order("region_name")).data ?? []) as Region[]);
export async function getRegion(slug: string) { return (await getRegions()).find((r) => r.region_slug === slug) ?? null; }
export const getStates = cache(async (): Promise<StateInfo[]> => ((await supabase.from("states").select("*")).data ?? []) as StateInfo[]);
export async function getState(code: string) { return (await getStates()).find((s) => s.state === code) ?? null; }

export const getAreaCounts = cache(async (): Promise<Record<string, number>> => {
  const { data } = await supabase.rpc("site_area_counts", { site: SITE_KEY });
  return Object.fromEntries((data ?? []).map((r: { practice_area_slug: string; listings: number }) => [r.practice_area_slug, Number(r.listings)]));
});
export const getRegionCounts = cache(async (): Promise<Record<string, number>> => {
  const { data } = await supabase.rpc("site_region_counts", { site: SITE_KEY });
  return Object.fromEntries((data ?? []).map((r: { region_slug: string; listings: number }) => [r.region_slug, Number(r.listings)]));
});
export const getGroupCounts = cache(async (): Promise<Record<string, number>> => {
  const { data } = await supabase.rpc("group_counts", { site: SITE_KEY });
  return Object.fromEntries((data ?? []).map((r: { group_slug: string; listings: number }) => [r.group_slug, Number(r.listings)]));
});
export async function getRegionGroupCounts(region: string) {
  const { data } = await supabase.rpc("region_group_counts", { region, site: SITE_KEY });
  const groups: Record<string, number> = {}, areas: Record<string, number> = {};
  for (const r of (data ?? []) as { group_slug: string; area_slug: string; listings: number }[]) { areas[r.area_slug] = Number(r.listings); groups[r.group_slug] = Math.max(groups[r.group_slug] ?? 0, Number(r.listings)); }
  return { groups, areas };
}

export async function listByAreas(areaSlugs: string[], opts: { region?: string; page?: number; size?: number; primaryOnly?: boolean } = {}) {
  const size = opts.size ?? 24, from = ((opts.page ?? 1) - 1) * size;
  let q = scopedWith(await siteAreaFilter());
  q = areaSlugs.length === 1 && !opts.primaryOnly ? q.contains("practice_areas", areaSlugs) : opts.primaryOnly ? q.in("primary_practice_area", areaSlugs) : q.overlaps("practice_areas", areaSlugs);
  if (opts.region) q = q.eq("region_slug", opts.region);
  const { data, count } = await ORDER(q).range(from, from + size - 1);
  return { rows: (data ?? []) as Listing[], count: count ?? 0 };
}
export async function listByRegion(region: string, page = 1, size = 24) {
  const from = (page - 1) * size;
  const { data, count } = await ORDER(scopedWith(await siteAreaFilter()).eq("region_slug", region)).range(from, from + size - 1);
  return { rows: (data ?? []) as Listing[], count: count ?? 0 };
}
export async function getFeatured(limit = 6): Promise<Listing[]> {
  const filter = await siteAreaFilter();
  const { data } = await ORDER(scopedWith(filter).eq("is_featured", true).limit(limit));
  if (data?.length) return data as Listing[];
  const fb = await ORDER(scopedWith(filter).eq("data_confidence", "high").not("logo_url", "is", null).gte("google_review_count", 20).limit(limit));
  return (fb.data ?? []) as Listing[];
}
export const getListing = cache(async (slug: string) => ((await base().eq("slug", slug).maybeSingle()).data ?? null) as Listing | null);
export async function getPractitioners(firmId: string): Promise<Practitioner[]> {
  const { data } = await supabase.from("public_practitioners").select("practitioner_id,slug,full_name_display,role_title,practitioner_type,is_principal,practice_areas,admission_year,linkedin_url,leadership_role,is_founder").eq("firm_id", firmId).order("is_principal", { ascending: false }).order("full_name_display").limit(40);
  return data ?? [];
}
export async function getReviews(listingId: string): Promise<Review[]> {
  const { data } = await supabase.from("public_reviews").select("review_id,source,author_name,author_photo_url,rating,text,published_at,source_url,fetched_at").eq("listing_id", listingId).not("text", "is", null).order("published_at", { ascending: false, nullsFirst: false }).limit(8);
  return (data ?? []) as Review[];
}
export async function getRelated(listingId: string, lim = 6): Promise<Listing[]> {
  const { data } = await supabase.rpc("related_listings", { lid: listingId, lim });
  return (data ?? []) as Listing[];
}
export async function searchText(q: string, area?: string) {
  const text = q.trim().replace(/[,%()]/g, " ");
  let query = scopedWith(await siteAreaFilter());
  if (/^\d{4}$/.test(text)) query = query.eq("postcode", text);
  else if (text) query = query.or(`suburb.ilike.%${text}%,business_name.ilike.%${text}%,region_name.ilike.%${text}%`);
  if (area) query = query.contains("practice_areas", [area]);
  const { data } = await ORDER(query).limit(48);
  return (data ?? []) as Listing[];
}
export async function searchNearby(lat: number, lng: number, area?: string, radiusKm = 25) {
  const filter = await siteAreaFilter();
  const { data } = await supabase.rpc("nearby_listings", { lat, lng, radius_km: radiusKm, area: area ?? null, site: filter.length ? SITE_KEY : null, lim: 48 });
  return (data ?? []) as Listing[];
}
export async function suggest(q: string): Promise<Suggestion[]> {
  if (q.trim().length < 2) return [];
  const { data } = await supabase.rpc("suggest", { q, site: SITE_KEY, lim: 10 });
  return (data ?? []) as Suggestion[];
}

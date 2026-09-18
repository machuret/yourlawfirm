import { supabase } from "./supabase";
import { siteAreaFilter } from "./site";
import type { Listing, PracticeArea, Region, Practitioner } from "./types";

const LISTING_COLS = "listing_id,slug,business_name,office_name,listing_type,is_law_practice,suburb,state,postcode,region_slug,region_name,address_line_1,level_floor,latitude,longitude,phone_e164,phone_primary,website_url,booking_url,email_general,primary_practice_area,practice_areas,languages_spoken,fee_structures,free_first_consultation,no_win_no_fee,legal_aid_accepted,after_hours,opening_hours,timezone,tagline,short_description,badges,claim_status,is_verified,plan_tier,is_featured,featured_until,logo_url,hero_image_url,google_rating,google_review_count,year_established,number_of_lawyers,social_links";

function base() { return supabase.from("public_listings").select(LISTING_COLS, { count: "exact" }); }
function scopedWith(filter: string[]) { const q = base(); return filter.length ? q.overlaps("practice_areas", filter) : q; }
const ORDER = (q: ReturnType<typeof base>) => q.order("is_featured", { ascending: false }).order("sort_priority", { ascending: false }).order("is_verified", { ascending: false }).order("business_name");

export async function getPracticeAreas(): Promise<PracticeArea[]> {
  const filter = await siteAreaFilter();
  let q = supabase.from("practice_areas").select("slug,name,parent_group,candidate_site,is_lawyer_area").order("parent_group").order("name");
  if (filter.length) q = q.in("slug", filter);
  return (await q).data ?? [];
}
export async function getPracticeArea(slug: string) {
  return (await supabase.from("practice_areas").select("slug,name,parent_group,candidate_site,is_lawyer_area").eq("slug", slug).maybeSingle()).data as PracticeArea | null;
}
export async function getRegions(): Promise<Region[]> {
  return (await supabase.from("regions").select("region_slug,region_name,state,region_type,major_centres").order("state").order("region_name")).data ?? [];
}
export async function getRegion(slug: string) {
  return (await supabase.from("regions").select("region_slug,region_name,state,region_type,major_centres").eq("region_slug", slug).maybeSingle()).data as Region | null;
}
export async function getAreaCounts(): Promise<Record<string, number>> {
  const { data } = await supabase.rpc("site_area_counts", { site: process.env.NEXT_PUBLIC_SITE_KEY ?? "hub" });
  return Object.fromEntries((data ?? []).map((r: { practice_area_slug: string; listings: number }) => [r.practice_area_slug, Number(r.listings)]));
}
export async function getRegionCounts(): Promise<Record<string, number>> {
  const { data } = await supabase.rpc("site_region_counts", { site: process.env.NEXT_PUBLIC_SITE_KEY ?? "hub" });
  return Object.fromEntries((data ?? []).map((r: { region_slug: string; listings: number }) => [r.region_slug, Number(r.listings)]));
}
export async function getFeatured(limit = 6): Promise<Listing[]> {
  const filter = await siteAreaFilter();
  const { data } = await ORDER(scopedWith(filter).eq("is_featured", true).limit(limit));
  if (data?.length) return data as Listing[];
  // no paid featured yet: show verified / richest listings so the page isn't empty
  const fb = await ORDER(scopedWith(filter).not("logo_url", "is", null).not("short_description", "is", null).limit(limit));
  return (fb.data ?? []) as Listing[];
}
export async function listByArea(slug: string, region?: string, page = 1, size = 24) {
  let q = scopedWith(await siteAreaFilter()).contains("practice_areas", [slug]);
  if (region) q = q.eq("region_slug", region);
  const from = (page - 1) * size;
  const { data, count } = await ORDER(q).range(from, from + size - 1);
  return { rows: (data ?? []) as Listing[], count: count ?? 0 };
}
export async function listByRegion(region: string, page = 1, size = 24) {
  const from = (page - 1) * size;
  const { data } = await ORDER(scopedWith(await siteAreaFilter()).eq("region_slug", region)).range(from, from + size - 1);
  return (data ?? []) as Listing[];
}
export async function getListing(slug: string) {
  const { data } = await base().eq("slug", slug).maybeSingle();
  return data as Listing | null;
}
export async function getPractitioners(listingId: string): Promise<Practitioner[]> {
  const { data } = await supabase.from("public_practitioners").select("practitioner_id,slug,full_name_display,role_title,practitioner_type,is_principal,practice_areas,admission_year").eq("listing_id", listingId).order("is_principal", { ascending: false }).order("full_name_display");
  return data ?? [];
}
export async function searchText(q: string, area?: string) {
  const text = q.trim();
  let query = scopedWith(await siteAreaFilter());
  if (/^\d{4}$/.test(text)) query = query.eq("postcode", text);
  else if (text) query = query.or(`suburb.ilike.%${text}%,business_name.ilike.%${text}%`);
  if (area) query = query.contains("practice_areas", [area]);
  const { data } = await ORDER(query).limit(40);
  return (data ?? []) as Listing[];
}
export async function searchNearby(lat: number, lng: number, area?: string, radiusKm = 25) {
  const filter = await siteAreaFilter();
  const { data } = await supabase.rpc("nearby_listings", { lat, lng, radius_km: radiusKm, area: area ?? null, site: filter.length ? process.env.NEXT_PUBLIC_SITE_KEY : null, lim: 40 });
  return (data ?? []) as Listing[];
}

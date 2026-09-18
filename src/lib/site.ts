import { supabase } from "./supabase";
import type { Site } from "./types";

export const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY ?? "hub";

const fallback: Site = { site_key: "hub", domain: null, brand_name: "Your Law Firm", site_type: "hub", practice_area_filter: [], tagline: "Find a lawyer anywhere in Australia", primary_colour: null };

export async function getSite(): Promise<Site> {
  const { data } = await supabase.from("sites").select("site_key,domain,brand_name,site_type,practice_area_filter,tagline,primary_colour").eq("site_key", SITE_KEY).maybeSingle();
  return { ...fallback, ...(data ?? {}), brand_name: data?.brand_name || fallback.brand_name };
}

/** Practice-area slugs this site is allowed to show. Empty = everything (hub). */
export async function siteAreaFilter(): Promise<string[]> {
  const s = await getSite();
  return s.practice_area_filter ?? [];
}

import { cache } from "react";
import { supabase } from "./supabase";
import type { Site } from "./types";

export const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY ?? "hub";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@yourlawfirm.com.au";
export const LEGAL_ENTITY = process.env.NEXT_PUBLIC_LEGAL_ENTITY ?? "the operator of this website";

const fallback: Site = { site_key: "hub", domain: null, brand_name: "Your Law Firm", site_type: "hub", practice_area_filter: [], tagline: "Find a lawyer anywhere in Australia", primary_colour: null };

export const getSite = cache(async (): Promise<Site> => {
  const { data } = await supabase.from("sites").select("site_key,domain,brand_name,site_type,practice_area_filter,tagline,primary_colour").eq("site_key", SITE_KEY).maybeSingle();
  return { ...fallback, ...(data ?? {}), brand_name: data?.brand_name || fallback.brand_name };
});
export async function siteAreaFilter(): Promise<string[]> { return (await getSite()).practice_area_filter ?? []; }
export function siteUrl(): string {
  const d = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "yourlawfirm.vercel.app";
  return `https://${d.replace(/^https?:\/\//, "")}`;
}

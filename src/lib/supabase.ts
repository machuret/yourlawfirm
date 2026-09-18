import { createClient } from "@supabase/supabase-js";

// Public (anon) credentials only — safe to ship to the browser. Override via env per deployment.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://pcwkvdrlsrkfitekxxec.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_53rFj9GS7ETVU1X0-ukYIw_rz_BacNp";

// Anon client: only sees public_* views, reference tables and the RPCs granted to anon.
export const supabase = createClient(url, key, { auth: { persistSession: false } });

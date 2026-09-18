import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || b.website) return NextResponse.json({ ok: false }, { status: 400 }); // honeypot
  if (!b.listing_id || !b.name || !b.email || !b.message) return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  const { error } = await supabase.from("leads").insert({ listing_id: b.listing_id, site_key: process.env.NEXT_PUBLIC_SITE_KEY ?? "hub", channel: "form", practice_area_slug: b.practice_area_slug ?? null, region_slug: b.region_slug ?? null, name: String(b.name).slice(0, 120), email: String(b.email).slice(0, 200), phone: b.phone ? String(b.phone).slice(0, 30) : null, message: String(b.message).slice(0, 4000), consent_marketing: !!b.consent_marketing });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  // TODO: email/SMS the firm via lead_routing (service role, Resend/Twilio) — do this in an edge function, not here.
  return NextResponse.json({ ok: true });
}

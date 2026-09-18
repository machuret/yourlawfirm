import { NextResponse } from "next/server";
import { suggest } from "@/lib/queries";
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const data = await suggest(q.slice(0, 60));
  return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}

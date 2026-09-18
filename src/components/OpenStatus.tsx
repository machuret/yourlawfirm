"use client";
import { useEffect, useState } from "react";
const KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export default function OpenStatus({ hours, tz }: { hours: Record<string, string[][]> | null; tz: string }) {
  const [s, setS] = useState<null | { open: boolean; text: string }>(null);
  useEffect(() => {
    if (!hours) return;
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: tz || "Australia/Sydney" }));
    const day = KEYS[now.getDay()]; const mins = now.getHours() * 60 + now.getMinutes();
    const toM = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + (m || 0); };
    const today = hours[day] ?? [];
    const cur = today.find(([a, b]) => mins >= toM(a) && mins < toM(b));
    if (cur) setS({ open: true, text: `Open · closes ${cur[1]}` });
    else { const next = today.find(([a]) => toM(a) > mins); setS({ open: false, text: next ? `Closed · opens ${next[0]}` : "Closed now" }); }
  }, [hours, tz]);
  if (!s) return null;
  return <span className={`inline-flex items-center gap-1.5 text-[13px] ${s.open ? "text-accent" : "text-muted"}`}><span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${s.open ? "bg-accent" : "bg-line"}`} />{s.text}</span>;
}

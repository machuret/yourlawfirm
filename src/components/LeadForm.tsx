"use client";
import { useState } from "react";
export default function LeadForm({ listingId, firm, area, region }: { listingId: string; firm: string; area: string; region: string | null }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("sending");
    const f = new FormData(e.currentTarget);
    const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listing_id: listingId, practice_area_slug: area, region_slug: region, name: f.get("name"), email: f.get("email"), phone: f.get("phone"), message: f.get("message"), consent_marketing: f.get("consent") === "on", website: f.get("website") }) });
    setState(r.ok ? "sent" : "error");
  }
  if (state === "sent") return <div className="surface p-6 text-[15px]">Sent. {firm} will be in touch using the details you gave.</div>;
  return (
    <form onSubmit={submit} className="surface grid gap-3 p-6 text-[15px]">
      <h2 className="text-[21px] font-semibold tracking-tight">Send an enquiry</h2>
      <input name="name" required placeholder="Your name" className="rounded-xl border border-hair bg-soft px-3.5 py-2.5 outline-none focus:border-accent focus:bg-paper" />
      <input name="email" type="email" required placeholder="Email" className="rounded-xl border border-hair bg-soft px-3.5 py-2.5 outline-none focus:border-accent focus:bg-paper" />
      <input name="phone" placeholder="Phone (optional)" className="rounded-xl border border-hair bg-soft px-3.5 py-2.5 outline-none focus:border-accent focus:bg-paper" />
      <textarea name="message" required rows={4} placeholder="Briefly, what do you need help with?" className="rounded-xl border border-hair bg-soft px-3.5 py-2.5 outline-none focus:border-accent focus:bg-paper" />
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex gap-2 items-start text-xs text-muted"><input type="checkbox" name="consent" className="mt-0.5" />Also send me occasional legal tips from this site.</label>
      <button disabled={state === "sending"} className="btn btn-primary disabled:opacity-60">{state === "sending" ? "Sending…" : "Send enquiry"}</button>
      {state === "error" ? <p className="text-red-700">Couldn’t send. Check your details and try again, or call the firm directly.</p> : null}
      <p className="text-xs text-muted">Your message goes to the firm. We don’t give legal advice.</p>
    </form>);
}

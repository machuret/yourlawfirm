import { Lightbulb, MapPin } from "lucide-react";
import { gStyle } from "@/lib/theme";
export default function ContextCards({ why, au, body, topic, group }: { why?: string | null; au?: string | null; body?: string | null; topic: string; group?: string | null }) {
  if (!why && !au && !body) return null;
  return (
    <section className="mt-4" style={gStyle(group)}>
      {body ? <p className="max-w-3xl text-[21px] leading-[1.45] tracking-tight text-ink-3">{body}</p> : null}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {why ? <div className="surface relative overflow-hidden p-7"><span aria-hidden="true" className="g-bar absolute inset-x-0 top-0 h-1" /><span className="tile-icon g-tint"><Lightbulb className="h-5 w-5" /></span>
          <h2 className="mt-4 text-[22px] font-semibold tracking-tight">Why {topic.toLowerCase()} matters</h2><p className="mt-2 text-[17px] leading-relaxed text-ink-2">{why}</p></div> : null}
        {au ? <div className="surface relative overflow-hidden p-7"><span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-accent" /><span className="tile-icon bg-accent-soft text-accent"><MapPin className="h-5 w-5" /></span>
          <h2 className="mt-4 text-[22px] font-semibold tracking-tight">The Australian context</h2><p className="mt-2 text-[17px] leading-relaxed text-ink-2">{au}</p></div> : null}
      </div>
    </section>
  );
}

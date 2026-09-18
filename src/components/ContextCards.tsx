import { Lightbulb, MapPin } from "lucide-react";
export default function ContextCards({ why, au, body, topic }: { why?: string | null; au?: string | null; body?: string | null; topic: string }) {
  if (!why && !au && !body) return null;
  return (
    <section className="mt-4">
      {body ? <p className="max-w-3xl text-[21px] leading-[1.45] tracking-tight text-[#333336]">{body}</p> : null}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {why ? <div className="surface p-7"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent"><Lightbulb className="h-5 w-5" /></span>
          <h2 className="mt-4 text-[22px] font-semibold tracking-tight">Why {topic.toLowerCase()} matters</h2><p className="mt-2 text-[17px] leading-relaxed text-[#424245]">{why}</p></div> : null}
        {au ? <div className="surface p-7"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent"><MapPin className="h-5 w-5" /></span>
          <h2 className="mt-4 text-[22px] font-semibold tracking-tight">The Australian context</h2><p className="mt-2 text-[17px] leading-relaxed text-[#424245]">{au}</p></div> : null}
      </div>
    </section>
  );
}

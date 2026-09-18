import { Plus } from "lucide-react";
import type { Faq } from "@/lib/types";
import JsonLd from "./JsonLd";
import { faqLd } from "@/lib/seo";
export default function FaqList({ faq, title = "Frequently asked questions" }: { faq: Faq[] | null | undefined; title?: string }) {
  if (!faq?.length) return null;
  return (
    <section className="mt-20">
      <JsonLd data={faqLd(faq)} />
      <h2 className="h-md">{title}</h2>
      <div className="surface-flat mt-6 divide-y divide-hair">
        {faq.map((f, i) => (
          <details key={i} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[19px] font-semibold tracking-tight">
              <span>{f.q}</span><Plus aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <p className="mt-3 text-[17px] leading-relaxed text-[#424245]">{f.a}</p>
          </details>))}
      </div>
    </section>
  );
}

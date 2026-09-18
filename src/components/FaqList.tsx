import type { Faq } from "@/lib/types";
import JsonLd from "./JsonLd";
import { faqLd } from "@/lib/seo";
export default function FaqList({ faq, title = "Common questions" }: { faq: Faq[] | null | undefined; title?: string }) {
  if (!faq?.length) return null;
  return (
    <section className="mt-14">
      <JsonLd data={faqLd(faq)} />
      <h2 className="text-3xl">{title}</h2>
      <div className="mt-5 max-w-3xl divide-y divide-line border-y border-line">
        {faq.map((f, i) => (
          <details key={i} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium">
              <span>{f.q}</span><span aria-hidden="true" className="mt-1 text-brass transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-ink/80 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

import { siteUrl } from "./site";
import type { Faq, Listing } from "./types";
export type Crumb = { name: string; href?: string };
export function breadcrumbLd(crumbs: Crumb[]) {
  const base = siteUrl();
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, ...(c.href ? { item: base + c.href } : {}) })) };
}
export function faqLd(faq: Faq[] | null | undefined) {
  if (!faq?.length) return null;
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
}
export function itemListLd(name: string, rows: Listing[]) {
  const base = siteUrl();
  return { "@context": "https://schema.org", "@type": "ItemList", name, numberOfItems: rows.length, itemListElement: rows.map((l, i) => ({ "@type": "ListItem", position: i + 1, url: `${base}/lawyers/${l.slug}`, name: l.business_name })) };
}
export function canonical(path: string) { return { alternates: { canonical: siteUrl() + path } }; }

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "./JsonLd";
import { breadcrumbLd, type Crumb } from "@/lib/seo";
export default function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  const all: Crumb[] = [{ name: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={`text-[13px] ${light ? "text-white/75" : "text-muted"}`}>
      <JsonLd data={breadcrumbLd(all)} />
      <ol className="scroll-x items-center !gap-1">
        {all.map((c, i) => (
          <li key={i} className="flex shrink-0 items-center gap-1">
            {i > 0 ? <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 opacity-50" /> : null}
            {c.href && i < all.length - 1 ? <Link href={c.href} className="hover:underline">{c.name}</Link> : <span aria-current="page" className={light ? "text-white" : "text-ink"}>{c.name}</span>}
          </li>))}
      </ol>
    </nav>
  );
}

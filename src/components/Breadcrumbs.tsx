import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbLd, type Crumb } from "@/lib/seo";
export default function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  const all: Crumb[] = [{ name: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${light ? "text-white/80" : "text-muted"}`}>
      <JsonLd data={breadcrumbLd(all)} />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true" className={light ? "text-white/40" : "text-line"}>/</span> : null}
            {c.href && i < all.length - 1 ? <Link href={c.href} className={`hover:underline ${light ? "hover:text-white" : "hover:text-ink"}`}>{c.name}</Link> : <span aria-current={i === all.length - 1 ? "page" : undefined} className={light ? "text-white" : "text-ink"}>{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

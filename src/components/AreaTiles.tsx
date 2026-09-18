import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GROUP_ICON } from "./Icons";
export type Tile = { href: string; name: string; sub?: string; image?: string | null; count?: number; icon?: string };
export default function AreaTiles({ tiles, cols = 3 }: { tiles: Tile[]; cols?: 2 | 3 | 4 }) {
  const c = cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-4 ${c}`}>
      {tiles.map((t) => { const I = t.icon ? GROUP_ICON[t.icon] : null; return (
        <Link key={t.href} href={t.href} className="surface card-hover group flex flex-col p-6">
          <div className="flex items-start justify-between">
            {I ? <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent"><I className="h-5 w-5" /></span> : <span />}
            <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-line transition group-hover:text-accent" />
          </div>
          <p className="mt-5 text-[21px] font-semibold tracking-tight leading-snug">{t.name}</p>
          {t.sub ? <p className="mt-1.5 line-clamp-2 text-[15px] text-muted">{t.sub}</p> : null}
          {t.count != null ? <p className="mt-auto pt-4 text-[13px] text-accent">{t.count.toLocaleString("en-AU")} firms</p> : null}
        </Link>); })}
    </div>
  );
}

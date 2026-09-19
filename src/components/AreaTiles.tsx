import Link from "next/link";
import Image from "next/image";
import { groupImage } from "@/lib/imagery";
import { ArrowRight } from "lucide-react";
import { GROUP_ICON } from "./Icons";
import { gStyle } from "@/lib/theme";
export type Tile = { href: string; name: string; sub?: string; count?: number; icon?: string; group?: string };
export default function AreaTiles({ tiles, cols = 3, compact = false }: { tiles: Tile[]; cols?: 2 | 3 | 4; compact?: boolean }) {
  const c = cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-4 ${c}`}>
      {tiles.map((t) => { const I = t.icon ? GROUP_ICON[t.icon] : null; return (
        <Link key={t.href} href={t.href} style={gStyle(t.group ?? t.icon)} className={`surface card-hover group relative flex flex-col overflow-hidden ${compact ? "p-5" : "area-card"}`}>
          {!compact ? <div className="area-card-photo"><Image src={groupImage(t.group ?? t.icon)} alt="" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" /></div> : null}
          <div className={compact ? "flex flex-1 flex-col" : "area-card-body"}>
          <span aria-hidden="true" className="g-bar absolute inset-x-0 top-0 h-1 opacity-80" />
          <div className="flex items-start justify-between">
            {I ? <span className="tile-icon g-tint"><I className="h-5 w-5" /></span> : <span className="tile-icon g-tint text-[15px] font-bold">{t.name.slice(0, 1)}</span>}
            <ArrowRight aria-hidden="true" className="h-5 w-5 -translate-x-1 text-line opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-accent" />
          </div>
          <p className={`mt-5 font-semibold tracking-tight leading-snug ${compact ? "text-[18px]" : "area-card-title"}`}>{t.name}</p>
          {t.sub ? <p className="mt-1.5 line-clamp-2 text-[15px] text-muted">{t.sub}</p> : null}
          {t.count != null ? <p className="mt-auto pt-4 text-[13px] font-medium text-muted"><span className="stat text-ink">{t.count.toLocaleString("en-AU")}</span> firms</p> : null}
        </div></Link>); })}
    </div>
  );
}

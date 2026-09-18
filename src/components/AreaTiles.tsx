import Link from "next/link";
import Image from "next/image";
export type Tile = { href: string; name: string; sub?: string; image?: string | null; count?: number };
export default function AreaTiles({ tiles, cols = 3 }: { tiles: Tile[]; cols?: 2 | 3 | 4 }) {
  const c = cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-4 ${c}`}>
      {tiles.map((t) => (
        <Link key={t.href} href={t.href} className="tile group">
          {t.image ? <Image src={t.image} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" /> : <div aria-hidden="true" className="absolute inset-0 hero-pattern" />}
          <div aria-hidden="true" className="absolute inset-0 tile-scrim" />
          <div className="relative flex h-full min-h-[11rem] flex-col justify-end p-5">
            <p className="font-display text-2xl leading-tight group-hover:underline">{t.name}</p>
            {t.sub ? <p className="mt-1 text-sm text-white/80 line-clamp-2">{t.sub}</p> : null}
            {t.count != null ? <p className="mt-2 text-xs text-brass-light">{t.count.toLocaleString("en-AU")} listings</p> : null}
          </div>
        </Link>))}
    </div>
  );
}

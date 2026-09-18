import Link from "next/link";
export default function LogoCarousel({ logos, title }: { logos: { slug: string; business_name: string; logo_url: string }[]; title?: string }) {
  if (logos.length < 6) return null;
  const row = [...logos, ...logos];
  return (
    <section aria-label={title ?? "Firms listed"} className="py-10">
      {title ? <p className="wrap text-center text-[15px] text-muted">{title}</p> : null}
      <div className="marquee mt-6">
        <ul className="marquee-track items-center">
          {row.map((l, i) => (
            <li key={i} aria-hidden={i >= logos.length ? "true" : undefined}>
              <Link href={`/lawyers/${l.slug}`} tabIndex={i >= logos.length ? -1 : undefined} title={l.business_name} className="flex h-14 w-36 items-center justify-center rounded-2xl bg-paper px-4 opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0">
                <img src={l.logo_url} alt={l.business_name} className="max-h-10 max-w-full object-contain" loading="lazy" />
              </Link>
            </li>))}
        </ul>
      </div>
    </section>
  );
}

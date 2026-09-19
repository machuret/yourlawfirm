import Image from "next/image";
import type { Crumb } from "@/lib/seo";
import Breadcrumbs from "./Breadcrumbs";
import { groupImage } from "@/lib/imagery";
import type { Credit } from "@/lib/types";

type HeroProps = {
  title: string; kicker?: string; intro?: string | null; image?: string | null;
  credit?: Credit | string; crumbs?: Crumb[]; children?: React.ReactNode;
  size?: "md" | "lg"; center?: boolean; group?: string | null;
  stats?: { v: string; l: string }[];
};
export default function Hero({ title, kicker, intro, image, credit, crumbs, children, size = "md", center = false, group, stats }: HeroProps) {
  const illustrated = size === "lg" || Boolean(group || image);
  const source = image || groupImage(group);
  return (
    <section className={`directory-hero ${illustrated ? "hero-illustrated" : "hero-simple"} ${size === "lg" ? "hero-home" : ""}`}>
      <div className="wrap relative">
        {crumbs ? <div className="hero-breadcrumbs"><Breadcrumbs items={crumbs} light={illustrated} /></div> : null}
        <div className={`hero-layout ${!illustrated && center ? "text-center" : ""}`}>
          <div className="hero-copy">
            <p className="hero-kicker"><span aria-hidden="true" />{kicker || (size === "lg" ? "Australia’s independent legal directory" : "Your next step starts here")}</p>
            <h1 className={size === "lg" ? "h-xl" : "h-lg"}>{title}</h1>
            {intro ? <p className="lede mt-6">{intro}</p> : null}
            {children ? <div className="hero-search mt-8">{children}</div> : null}
            {size === "lg" ? <p className="hero-assurance">Free to browse <span>·</span> No sign-up <span>·</span> Contact firms directly</p> : null}
            {stats?.length ? <dl className="hero-stats">{stats.map((s) => <div key={s.l}><dt>{s.l}</dt><dd className="stat">{s.v}</dd></div>)}</dl> : null}
          </div>
          {illustrated ? <figure className="hero-figure">
            {source.startsWith("/") ? <Image src={source} alt="" fill preload sizes="(max-width: 767px) 100vw, (max-width: 1280px) 45vw, 600px" className="object-cover" /> :
              // eslint-disable-next-line @next/next/no-img-element
              <img src={source} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />}
            <figcaption>{!image ? "AI-generated editorial image" : typeof credit === "string" ? credit : credit ? <>
              {credit.source_url && /^https?:\/\//.test(credit.source_url) ? <a href={credit.source_url} target="_blank" rel="noopener noreferrer" className="underline">{credit.title || "Image"}</a> : credit.title || "Image"}
              {credit.creator ? ` · ${credit.creator}` : ""}
              {credit.license_url && /^https?:\/\//.test(credit.license_url) ? <> · <a href={credit.license_url} target="_blank" rel="noopener noreferrer" className="underline">{credit.license || "Licence"}</a></> : credit.license ? ` · ${credit.license}` : ""}
            </> : "Legal directory"}</figcaption>
            {size === "lg" ? <div className="hero-image-note"><span>Clarity. Confidence. A way forward.</span><p>Find the right expertise<br />for what matters to you.</p></div> : null}
          </figure> : null}
        </div>
      </div>
    </section>
  );
}

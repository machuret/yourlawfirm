import Image from "next/image";
import type { Credit } from "@/lib/types";
import type { Crumb } from "@/lib/seo";
import Breadcrumbs from "./Breadcrumbs";
export default function Hero({ title, kicker, intro, image, credit, crumbs, children, size = "md" }: { title: string; kicker?: string; intro?: string | null; image?: string | null; credit?: Credit; crumbs?: Crumb[]; children?: React.ReactNode; size?: "md" | "lg" }) {
  return (
    <section className={`relative overflow-hidden bg-green-deep text-white ${size === "lg" ? "min-h-[34rem]" : "min-h-[22rem]"} flex`}>
      {image ? <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" /> : <div aria-hidden="true" className="absolute inset-0 hero-pattern" />}
      <div aria-hidden="true" className="absolute inset-0 hero-scrim" />
      <div className="wrap relative z-10 flex flex-col justify-end py-10 md:py-14 w-full">
        {crumbs ? <div className="mb-6"><Breadcrumbs items={crumbs} light /></div> : null}
        {kicker ? <p className="text-brass-light text-sm tracking-wide">{kicker}</p> : null}
        <h1 className={`mt-1 max-w-3xl leading-[1.05] ${size === "lg" ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"}`}>{title}</h1>
        {intro ? <p className="mt-4 max-w-2xl text-lg text-white/85">{intro}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
      {image && credit?.title ? (
        <p className="absolute bottom-2 right-3 z-10 text-[10px] text-white/60 max-w-[60%] truncate">
          Photo: {credit.source_url ? <a href={credit.source_url} target="_blank" rel="noopener nofollow" className="underline">{credit.creator || credit.title}</a> : credit.creator || credit.title}{credit.license ? `, ${credit.license}${credit.license_version ? " " + credit.license_version : ""}` : ""}
        </p>) : null}
    </section>
  );
}

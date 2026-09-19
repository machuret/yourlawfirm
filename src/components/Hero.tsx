import Image from "next/image";
import type { Credit } from "@/lib/types";
import type { Crumb } from "@/lib/seo";
import Breadcrumbs from "./Breadcrumbs";
export default function Hero({ title, kicker, intro, image, credit, crumbs, children, size = "md", center = false }: { title: string; kicker?: string; intro?: string | null; image?: string | null; credit?: Credit; crumbs?: Crumb[]; children?: React.ReactNode; size?: "md" | "lg"; center?: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 h-[34rem] bg-[radial-gradient(60%_60%_at_50%_0%,var(--glow)_0%,transparent_70%)]" />
      <div className={`wrap relative ${size === "lg" ? "pt-16 pb-12 md:pt-28 md:pb-16" : "pt-8 pb-10 md:pt-12 md:pb-14"} ${center ? "text-center" : ""}`}>
        {crumbs ? <div className={`mb-8 ${center ? "flex justify-center" : ""}`}><Breadcrumbs items={crumbs} /></div> : null}
        {kicker ? <p className="eyebrow">{kicker}</p> : null}
        <h1 className={`${size === "lg" ? "h-xl" : "h-lg"} mt-2 ${center ? "mx-auto" : ""} max-w-4xl`}>{title}</h1>
        {intro ? <p className={`lede mt-5 max-w-3xl ${center ? "mx-auto" : ""}`}>{intro}</p> : null}
        {children ? <div className={`mt-8 ${center ? "mx-auto max-w-2xl" : ""}`}>{children}</div> : null}
        {image ? (
          <figure className="relative mt-10 aspect-[12/5] overflow-hidden rounded-[28px] bg-soft">
            <Image src={image} alt="" fill priority sizes="(min-width:1120px) 1076px, 100vw" className="object-cover" />
            {credit?.title ? <figcaption className="absolute bottom-2 right-3 text-[11px] text-white/80">Photo: {credit.creator || credit.title}{credit.license ? `, ${credit.license}` : ""}</figcaption> : null}
          </figure>) : null}
      </div>
    </section>
  );
}

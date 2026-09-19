import type { Crumb } from "@/lib/seo";
import Breadcrumbs from "./Breadcrumbs";
import { gStyle } from "@/lib/theme";
export default function Hero({ title, kicker, intro, crumbs, children, size = "md", center = false, group, stats }: { title: string; kicker?: string; intro?: string | null; image?: string | null; credit?: unknown; crumbs?: Crumb[]; children?: React.ReactNode; size?: "md" | "lg"; center?: boolean; group?: string | null; stats?: { v: string; l: string }[] }) {
  return (
    <section className="relative overflow-hidden" style={gStyle(group)}>
      <div aria-hidden="true" className="g-glow pointer-events-none absolute inset-x-0 top-0 h-[36rem]" />
      <div className={`wrap relative ${size === "lg" ? "pt-14 pb-10 md:pt-24 md:pb-14" : "pt-7 pb-10 md:pt-10 md:pb-12"} ${center ? "text-center" : ""}`}>
        {crumbs ? <div className={`mb-7 ${center ? "flex justify-center" : ""}`}><Breadcrumbs items={crumbs} /></div> : null}
        {kicker ? <p className="inline-flex items-center gap-2 rounded-full g-tint px-3 py-1 text-[13px] font-semibold">{kicker}</p> : null}
        <h1 className={`${size === "lg" ? "h-xl" : "h-lg"} mt-3 ${center ? "mx-auto" : ""} max-w-4xl`}>{title}</h1>
        {intro ? <p className={`lede mt-5 max-w-3xl ${center ? "mx-auto" : ""}`}>{intro}</p> : null}
        {children ? <div className={`mt-8 ${center ? "mx-auto max-w-2xl" : ""}`}>{children}</div> : null}
        {stats?.length ? <dl className={`mt-9 flex flex-wrap gap-x-10 gap-y-4 ${center ? "justify-center" : ""}`}>{stats.map((s) => <div key={s.l}><dt className="sr-only">{s.l}</dt><dd><span className="stat block text-[28px] leading-none">{s.v}</span><span className="mt-1 block text-[13px] text-muted">{s.l}</span></dd></div>)}</dl> : null}
      </div>
    </section>
  );
}

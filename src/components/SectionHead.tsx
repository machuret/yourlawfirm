import Link from "next/link";
export default function SectionHead({ title, sub, href, linkText = "See all" }: { title: string; sub?: string; href?: string; linkText?: string }) {
  return (
    <div className="section-heading flex items-end justify-between gap-6">
      <div><h2 className="h-md">{title}</h2>{sub ? <p className="mt-2 max-w-2xl text-[17px] text-muted">{sub}</p> : null}</div>
      {href ? <Link href={href} className="link shrink-0 text-[15px] font-medium">{linkText} ›</Link> : null}
    </div>
  );
}

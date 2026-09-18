import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { getSite, siteUrl } from "@/lib/site";
import { getGroups, getPracticeAreas, getRegions, getStates } from "@/lib/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return { metadataBase: new URL(siteUrl()), title: { default: `${site.brand_name} — find a lawyer in Australia`, template: `%s | ${site.brand_name}` },
    description: "Compare Australian law firms, solicitors and conveyancers by area of law and location. Ratings, reviews, people and contact details.",
    openGraph: { siteName: site.brand_name ?? undefined, type: "website", locale: "en_AU" }, twitter: { card: "summary_large_image" } };
}
const ORDER = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, groups, areas, regions, states] = await Promise.all([getSite(), getGroups(), getPracticeAreas(), getRegions(), getStates()]);
  const g = groups.filter((x) => x.slug !== "general").map((x) => ({ slug: x.slug, name: x.name, areas: areas.filter((a) => a.group_slug === x.slug).map((a) => ({ slug: a.slug, name: a.name })) }));
  const s = ORDER.map((code) => ({ state: code, name: states.find((x) => x.state === code)?.name ?? code, regions: regions.filter((r) => r.state === code).map((r) => ({ slug: r.region_slug, name: r.region_name })) })).filter((x) => x.regions.length);
  const pop = [["family", "family-law", "Family lawyers"], ["wills", "wills-estates", "Wills & estates lawyers"], ["criminal", "criminal-law", "Criminal lawyers"], ["property", "property-conveyancing", "Conveyancing"], ["injury", "personal-injury", "Personal injury lawyers"], ["employment", "unfair-dismissal", "Unfair dismissal"], ["immigration", "immigration", "Immigration lawyers"]]
    .filter(([, a]) => areas.some((x) => x.slug === a)).map(([gg, a, n]) => ({ href: `/law/${gg}/${a}`, name: n }));
  const base = siteUrl();
  return (
    <html lang="en-AU" className={`${inter.variable} ${interTight.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg">
        <JsonLd data={[{ "@context": "https://schema.org", "@type": "Organization", name: site.brand_name, url: base },
          { "@context": "https://schema.org", "@type": "WebSite", name: site.brand_name, url: base, potentialAction: { "@type": "SearchAction", target: `${base}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } }]} />
        <Header brand={site.brand_name ?? "Your Law Firm"} groups={g} states={s} />
        <main className="flex-1">{children}</main>
        <Footer brand={site.brand_name ?? "Your Law Firm"} groups={g} states={s} popular={pop} />
      </body>
    </html>
  );
}

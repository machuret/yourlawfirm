import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import Link from "next/link";
import { getSite } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["opsz"] });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return { title: { default: `${site.brand_name} — ${site.tagline ?? "Australian lawyer directory"}`, template: `%s | ${site.brand_name}` }, description: site.tagline ?? "Find and compare Australian lawyers by practice area and location." };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <html lang="en-AU" className={`${fraunces.variable} ${publicSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        <header className="wrap flex items-center justify-between py-5">
          <Link href="/" className="font-display text-2xl text-green-deep no-underline">{site.brand_name}</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/practice-areas" className="hover:underline">Practice areas</Link>
            <Link href="/locations" className="hover:underline">Locations</Link>
            <Link href="/search" className="hover:underline">Search</Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="rule mt-16">
          <div className="wrap py-8 text-sm text-muted flex flex-wrap gap-x-8 gap-y-2 justify-between">
            <span>© {new Date().getFullYear()} {site.brand_name}. Listings are compiled from public sources; details may change — confirm with the firm.</span>
            <span className="flex gap-6"><Link href="/search">Find a lawyer</Link><Link href="/claim">Claim your listing</Link></span>
          </div>
        </footer>
      </body>
    </html>
  );
}

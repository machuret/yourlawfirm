import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/search"] }, sitemap: `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000"}/sitemap.xml` };
}

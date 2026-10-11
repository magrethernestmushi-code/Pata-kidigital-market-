import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticPages = [
    "",
    "/shop",
    "/how-it-works",
    "/about",
    "/contact",
    "/delivery-policy",
    "/returns-refunds",
    "/privacy-policy",
    "/terms",
    "/track-order",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  let productPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const [prods, cats] = await Promise.all([
      db
        .select({ slug: products.slug, updatedAt: products.updatedAt })
        .from(products)
        .where(eq(products.isHidden, false)),
      db.select({ slug: categories.slug }).from(categories),
    ]);
    productPages = prods.map((p) => ({
      url: `${siteUrl}/product/${p.slug}`,
      lastModified: p.updatedAt,
    }));
    categoryPages = cats.map((c) => ({
      url: `${siteUrl}/category/${c.slug}`,
      lastModified: new Date(),
    }));
  } catch {
    // DB unavailable at build time - static pages are still useful.
  }

  return [...staticPages, ...categoryPages, ...productPages];
}

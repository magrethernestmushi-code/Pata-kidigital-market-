import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { and, eq, ilike, or, asc, desc, SQL } from "drizzle-orm";

export type ProductSort = "newest" | "price_asc" | "price_desc";

export async function getProducts(opts: {
  categorySlug?: string;
  q?: string;
  sort?: ProductSort;
  limit?: number;
}) {
  const conditions: SQL[] = [eq(products.isHidden, false)];

  if (opts.categorySlug) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, opts.categorySlug),
    });
    if (!cat) return { items: [], category: null };
    conditions.push(eq(products.categoryId, cat.id));
    const items = await queryWithConditions(conditions, opts);
    return { items, category: cat };
  }

  if (opts.q) {
    const term = `%${opts.q}%`;
    conditions.push(
      or(ilike(products.name, term), ilike(products.description, term))!
    );
  }

  const items = await queryWithConditions(conditions, opts);
  return { items, category: null };
}

async function queryWithConditions(
  conditions: SQL[],
  opts: { sort?: ProductSort; limit?: number }
) {
  let orderBy = desc(products.createdAt);
  if (opts.sort === "price_asc") orderBy = asc(products.priceTzs);
  if (opts.sort === "price_desc") orderBy = desc(products.priceTzs);

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      sku: products.sku,
      name: products.name,
      priceTzs: products.priceTzs,
      images: products.images,
      stockStatus: products.stockStatus,
      isDemo: products.isDemo,
      isFeatured: products.isFeatured,
      isNewArrival: products.isNewArrival,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(opts.limit ?? 60);

  return rows;
}

export async function getAllCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

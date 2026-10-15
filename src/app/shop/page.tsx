import type { Metadata } from "next";
import { getProducts, getAllCategories, type ProductSort } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse all products available on Pata Online.",
};

export default async function ShopPage({
  searchParams,
}: PageProps<"/shop">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const sort = (typeof sp.sort === "string" ? sp.sort : "newest") as ProductSort;

  const [{ items }, categories] = await Promise.all([
    getProducts({ categorySlug: category, q, sort }),
    getAllCategories(),
  ]);

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark mb-1">
        {q ? `Search results for "${q}"` : "Shop All Products"}
      </h1>
      <p className="text-sm text-charcoal/60 mb-6">{items.length} products found</p>

      <ProductFilters categories={categories} />

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center text-charcoal/60 border border-dashed border-forest/20">
          No products match your search yet. Try a different term or browse all categories.
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, type ProductSort } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getProducts({ categorySlug: slug });
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? `Shop ${category.name} on Pata KiDigital Marketplace.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;
  const sort = (typeof sp.sort === "string" ? sp.sort : "newest") as ProductSort;

  const { items, category } = await getProducts({ categorySlug: slug, sort });
  if (!category) notFound();

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark mb-1">
        {category.name}
      </h1>
      {category.description && (
        <p className="text-sm text-charcoal/60 mb-1 max-w-xl">{category.description}</p>
      )}
      <p className="text-sm text-charcoal/60 mb-6">{items.length} products</p>

      <ProductFilters categories={[]} hideCategoryFilter />

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center text-charcoal/60 border border-dashed border-forest/20">
          No products in this category yet — check back soon.
        </div>
      )}
    </div>
  );
}

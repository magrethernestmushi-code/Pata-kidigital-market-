import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import ProductGallery from "@/components/ProductGallery";
import ProductDetailActions from "@/components/ProductDetailActions";
import ProductCard from "@/components/ProductCard";
import StockBadge from "@/components/StockBadge";
import { getSetting } from "@/lib/settings";

async function getProduct(slug: string) {
  const row = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: { category: true, supplier: true },
  });
  return row;
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || product.isHidden) notFound();

  const [related, whatsappNumber] = await Promise.all([
    db
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
      })
      .from(products)
      .where(
        and(
          eq(products.categoryId, product.categoryId),
          ne(products.id, product.id),
          eq(products.isHidden, false)
        )
      )
      .limit(4),
    getSetting("whatsapp_number"),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div className="container-page py-10">
      <nav className="text-xs text-charcoal/50 mb-6 flex flex-wrap gap-1">
        <a href="/shop" className="hover:text-forest">Shop</a>
        <span>/</span>
        {product.category && (
          <>
            <a href={`/category/${product.category.slug}`} className="hover:text-forest">
              {product.category.name}
            </a>
            <span>/</span>
          </>
        )}
        <span className="text-charcoal/80">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <ProductGallery images={product.images ?? []} name={product.name} />

        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.isDemo && <span className="demo-tag">Demo — not yet confirmed stock</span>}
            {product.isNewArrival && <span className="amber-tag">New Arrival</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark mb-1">
            {product.name}
          </h1>
          <p className="text-xs text-charcoal/50 mb-3">SKU: {product.sku}</p>
          <div className="mb-4">
            <StockBadge status={product.stockStatus} />
          </div>

          <ProductDetailActions
            productId={product.id}
            slug={product.slug}
            sku={product.sku}
            name={product.name}
            priceTzs={parseFloat(product.priceTzs)}
            image={product.images?.[0] ?? "https://picsum.photos/seed/pk-placeholder/800/800"}
            variations={product.variations ?? []}
            stockStatus={product.stockStatus}
            whatsappNumber={whatsappNumber}
            siteUrl={siteUrl}
          />

          <div className="mt-8 flex flex-col gap-5 text-sm">
            <section>
              <h2 className="font-bold text-forest-dark mb-1.5">Description</h2>
              <p className="text-charcoal/80 whitespace-pre-line">{product.description}</p>
            </section>

            {product.supplier && (
              <section>
                <h2 className="font-bold text-forest-dark mb-1.5">Sold by</h2>
                <p className="text-charcoal/80">
                  {product.supplier.name}
                  {product.supplier.location ? ` — ${product.supplier.location}` : ""}
                </p>
              </section>
            )}

            {product.deliveryEstimate && (
              <section>
                <h2 className="font-bold text-forest-dark mb-1.5">Delivery Information</h2>
                <p className="text-charcoal/80">{product.deliveryEstimate}</p>
              </section>
            )}

            {(product.returnPolicy || product.warrantyInfo) && (
              <section>
                <h2 className="font-bold text-forest-dark mb-1.5">Returns & Warranty</h2>
                {product.returnPolicy && <p className="text-charcoal/80">{product.returnPolicy}</p>}
                {product.warrantyInfo && <p className="text-charcoal/80 mt-1">{product.warrantyInfo}</p>}
              </section>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-extrabold text-forest-dark mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

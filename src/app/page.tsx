import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { asc, desc, eq, and } from "drizzle-orm";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getSetting } from "@/lib/settings";
import type { ProductCardData } from "@/lib/types";

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [cats, featured, newArrivals, whatsappNumber] = await Promise.all([
    safeQuery(
      () =>
        db
          .select()
          .from(categories)
          .orderBy(asc(categories.sortOrder))
          .limit(6),
      []
    ),
    safeQuery(
      () =>
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
          .where(and(eq(products.isFeatured, true), eq(products.isHidden, false)))
          .orderBy(desc(products.createdAt))
          .limit(8),
      [] as ProductCardData[]
    ),
    safeQuery(
      () =>
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
          .where(and(eq(products.isNewArrival, true), eq(products.isHidden, false)))
          .orderBy(desc(products.createdAt))
          .limit(8),
      [] as ProductCardData[]
    ),
    getSetting("whatsapp_number"),
  ]);

  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Hello Pata Online. I'd like help finding a product."
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=70"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative container-page py-16 sm:py-24 flex flex-col items-start gap-5">
          <span className="amber-tag">Student life. Sorted.</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white max-w-xl leading-tight">
            Your campus. Your style.
          </h1>
          <p className="text-cream/90 max-w-lg text-sm sm:text-base">
            Shop everyday essentials, fashion, beauty and electronics from
            trusted campus suppliers — ordered online or via WhatsApp,
            delivered to your hostel by boda boda.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link href="/shop" className="btn-primary bg-amber text-forest-dark hover:bg-amber-dark !bg-amber">
              Shop Products
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary !bg-white/0 !text-white !border-white/60 hover:!bg-white/10">
              Order via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-12 sm:py-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-forest-dark">Shop by Category</h2>
          <Link href="/shop" className="text-sm font-semibold text-forest hover:underline">
            View all
          </Link>
        </div>
        {cats.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {cats.map((c) => (
              <CategoryCard key={c.id} slug={c.slug} name={c.name} imageUrl={c.imageUrl} />
            ))}
          </div>
        ) : (
          <EmptyState text="Categories will appear here once added in the admin dashboard." />
        )}
      </section>

      {/* Featured */}
      <section className="container-page py-6 sm:py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-forest-dark">Featured Products</h2>
          <Link href="/shop" className="text-sm font-semibold text-forest hover:underline">
            View all
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState text="Featured products will appear here once confirmed suppliers and stock are added." />
        )}
      </section>

      {/* New arrivals */}
      <section className="container-page py-6 sm:py-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-forest-dark">New Arrivals</h2>
          <Link href="/shop" className="text-sm font-semibold text-forest hover:underline">
            View all
          </Link>
        </div>
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState text="New arrivals will appear here as suppliers add fresh stock." />
        )}
      </section>

      {/* How delivery works */}
      <section className="bg-white py-12 sm:py-16 mt-6">
        <div className="container-page">
          <h2 className="text-xl sm:text-2xl font-extrabold text-forest-dark mb-8">
            How Campus Delivery Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Order online or on WhatsApp",
                body: "Browse products, add to cart, or message us directly to place your order.",
              },
              {
                step: "2",
                title: "We confirm availability",
                body: "Our team confirms stock, price and delivery cost with you before anything is dispatched.",
              },
              {
                step: "3",
                title: "Boda boda delivers to you",
                body: "Your order is picked up from the supplier and delivered straight to your hostel.",
              },
            ].map((s) => (
              <div key={s.step} className="flex flex-col gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-white font-bold">
                  {s.step}
                </span>
                <h3 className="font-bold text-forest-dark">{s.title}</h3>
                <p className="text-sm text-charcoal/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="container-page py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-extrabold text-forest-dark mb-8">
          Why Students Trust Us
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              title: "Verified product information",
              body: "We label demo or unconfirmed listings clearly so you always know what's really in stock.",
            },
            {
              title: "Clear, honest prices",
              body: "Prices are shown upfront in TZS — no hidden fees sprung on you at checkout.",
            },
            {
              title: "Real customer support",
              body: "Reach a real person on WhatsApp for help with orders, delivery, or returns.",
            },
          ].map((f) => (
            <div key={f.title} className="card p-5">
              <h3 className="font-bold text-forest-dark mb-1.5">{f.title}</h3>
              <p className="text-sm text-charcoal/70">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="container-page pb-16">
        <div className="card bg-forest text-cream flex flex-col sm:flex-row items-center justify-between gap-4 p-7 sm:p-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Prefer to order on WhatsApp?
            </h2>
            <p className="text-cream/80 text-sm mt-1">
              Chat with us directly and we&apos;ll help you find what you need.
            </p>
          </div>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp shrink-0">
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="card p-8 text-center text-sm text-charcoal/60 border border-dashed border-forest/20">
      {text}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { formatTzs } from "@/lib/format";
import StockBadge from "./StockBadge";
import type { ProductCardData } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images?.[0] ?? "https://picsum.photos/seed/pk-placeholder/600/600";
  return (
    <div className="card card-hover flex flex-col overflow-hidden">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square bg-cream">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {product.isDemo && <span className="demo-tag">Demo</span>}
          {product.isNewArrival && <span className="amber-tag">New</span>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        {product.categoryName && (
          <span className="text-[11px] uppercase tracking-wide text-charcoal/50 font-medium">
            {product.categoryName}
          </span>
        )}
        <Link href={`/product/${product.slug}`} className="font-semibold text-sm leading-snug line-clamp-2 hover:text-forest transition-colors">
          {product.name}
        </Link>
        <div className="flex items-center justify-between mt-0.5">
          <span className="font-bold text-forest">{formatTzs(product.priceTzs)}</span>
          <StockBadge status={product.stockStatus} />
        </div>
        <div className="mt-2 flex gap-2">
          <AddToCartButton
            product={{
              productId: product.id,
              slug: product.slug,
              sku: product.sku,
              name: product.name,
              priceTzs: parseFloat(String(product.priceTzs)),
              image,
            }}
            disabled={product.stockStatus === "out_of_stock"}
            compact
          />
          <Link
            href={`/product/${product.slug}`}
            className="btn-secondary !py-1.5 !px-3 text-xs flex-1 justify-center"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

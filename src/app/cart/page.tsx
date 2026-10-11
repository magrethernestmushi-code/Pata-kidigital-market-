"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatTzs } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-extrabold text-forest-dark mb-2">Your Cart</h1>
        <p className="text-charcoal/60 mb-6">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark mb-6">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variation ?? ""}`}
              className="card flex gap-3 p-3"
            >
              <Link
                href={`/product/${item.slug}`}
                className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-cream"
              >
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-semibold text-sm line-clamp-2 hover:text-forest"
                >
                  {item.name}
                </Link>
                {item.variation && (
                  <p className="text-xs text-charcoal/50 mt-0.5">{item.variation}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="inline-flex items-center rounded-full border border-forest/30 overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.variation, item.quantity - 1)
                      }
                      className="w-7 h-7 flex items-center justify-center hover:bg-forest/5"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.variation, item.quantity + 1)
                      }
                      className="w-7 h-7 flex items-center justify-center hover:bg-forest/5"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-forest text-sm">
                    {formatTzs(item.priceTzs * item.quantity)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.productId, item.variation)}
                aria-label="Remove item"
                className="self-start text-charcoal/40 hover:text-red-600 transition-colors p-1"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="card p-5 h-fit sticky top-24">
          <h2 className="font-bold text-forest-dark mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-charcoal/70">Subtotal</span>
            <span className="font-semibold">{formatTzs(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-charcoal/70">Delivery Fee</span>
            <span className="font-semibold">To be confirmed</span>
          </div>
          <p className="text-xs text-charcoal/50 mb-4">
            Confirmed with your rider based on your location
          </p>
          <div className="border-t border-forest/10 pt-3 flex justify-between font-bold text-forest mb-5">
            <span>Total (excl. delivery)</span>
            <span>{formatTzs(subtotal)}</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full">
            Proceed to Checkout
          </Link>
          <Link
            href="/shop"
            className="block text-center text-sm font-medium text-forest mt-3 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

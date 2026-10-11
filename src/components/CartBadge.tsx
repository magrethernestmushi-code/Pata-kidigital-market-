"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartBadge() {
  const { itemCount } = useCart();
  return (
    <Link
      href="/cart"
      aria-label="View cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-forest/5 transition-colors"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-forest">
        <circle cx="9" cy="21" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="18" cy="21" r="1.4" fill="currentColor" stroke="none" />
        <path d="M2.5 3h2l2.2 11.1a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20 7H5.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1 text-[11px] font-bold text-forest-dark">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

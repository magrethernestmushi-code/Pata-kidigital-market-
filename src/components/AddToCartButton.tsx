"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCartButton({
  product,
  variation,
  quantity = 1,
  disabled,
  compact,
}: {
  product: { productId: number; slug: string; sku: string; name: string; priceTzs: number; image: string };
  variation?: string | null;
  quantity?: number;
  disabled?: boolean;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    if (disabled) return;
    addItem({ ...product, variation: variation ?? null }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`btn-primary ${compact ? "!py-1.5 !px-3 text-xs flex-1" : "w-full"}`}
    >
      {disabled ? "Unavailable" : added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { buildWhatsAppUrl, buildProductOrderMessage } from "@/lib/whatsapp";
import { formatTzs } from "@/lib/format";

type Variation = { type: string; options: string[] };

export default function ProductDetailActions({
  productId,
  slug,
  sku,
  name,
  priceTzs,
  image,
  variations,
  stockStatus,
  whatsappNumber,
  siteUrl,
}: {
  productId: number;
  slug: string;
  sku: string;
  name: string;
  priceTzs: number;
  image: string;
  variations: Variation[];
  stockStatus: string;
  whatsappNumber: string;
  siteUrl: string;
}) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const v of variations) initial[v.type] = v.options[0];
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variationLabel = useMemo(() => {
    const parts = variations.map((v) => `${v.type}: ${selected[v.type]}`);
    return parts.length ? parts.join(", ") : null;
  }, [variations, selected]);

  const disabled = stockStatus === "out_of_stock";
  const productUrl = `${siteUrl}/product/${slug}`;

  function handleAddToCart() {
    if (disabled) return;
    addItem(
      { productId, slug, sku, name, priceTzs, image, variation: variationLabel },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    buildProductOrderMessage({
      productName: name,
      sku,
      priceTzs,
      variation: variationLabel,
      quantity,
      productUrl,
    })
  );

  return (
    <div className="flex flex-col gap-4">
      {variations.map((v) => (
        <div key={v.type}>
          <span className="text-sm font-semibold text-forest-dark block mb-1.5">{v.type}</span>
          <div className="flex flex-wrap gap-2">
            {v.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelected((s) => ({ ...s, [v.type]: opt }))}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  selected[v.type] === opt
                    ? "bg-forest text-white border-forest"
                    : "border-forest/30 text-charcoal hover:border-forest"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <span className="text-sm font-semibold text-forest-dark block mb-1.5">Quantity</span>
        <div className="inline-flex items-center rounded-full border border-forest/30 overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-forest/5 text-lg"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 flex items-center justify-center hover:bg-forest/5 text-lg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-lg font-bold text-forest">
        {formatTzs(priceTzs * quantity)}
        {quantity > 1 && (
          <span className="text-sm font-normal text-charcoal/50"> ({formatTzs(priceTzs)} each)</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={disabled}
          className="btn-primary flex-1"
        >
          {disabled ? "Unavailable" : added ? "Added to Cart ✓" : "Add to Cart"}
        </button>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp flex-1"
        >
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}

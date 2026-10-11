import { formatTzs } from "./format";

/**
 * Builds a wa.me click-to-chat URL with a URL-encoded prefilled message.
 * `number` must already be in international format without spaces or '+'.
 */
export function buildWhatsAppUrl(number: string, message: string): string {
  const cleanNumber = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildProductOrderMessage(params: {
  productName: string;
  sku: string;
  priceTzs: number | string;
  variation?: string | null;
  quantity: number;
  productUrl: string;
}): string {
  const { productName, sku, priceTzs, variation, quantity, productUrl } = params;
  const lines = [
    `Hello Pata KiDigital Marketplace. I would like to order ${productName}, quantity ${quantity}.`,
    `Product code: ${sku}`,
    variation ? `Option: ${variation}` : null,
    `The listed price is ${formatTzs(priceTzs)}.`,
    `Product link: ${productUrl}`,
    `Please confirm availability, total cost and delivery details.`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function buildCartOrderMessage(params: {
  items: { name: string; quantity: number; lineTotal: number; variation?: string | null }[];
  subtotal: number;
  deliveryLocation?: string;
}): string {
  const { items, subtotal, deliveryLocation } = params;
  const itemLines = items.map(
    (it) =>
      `- ${it.name}${it.variation ? ` (${it.variation})` : ""} x${it.quantity} — ${formatTzs(
        it.lineTotal
      )}`
  );
  const lines = [
    `Hello Pata KiDigital Marketplace. I would like to order the following items:`,
    ...itemLines,
    `Subtotal: ${formatTzs(subtotal)}`,
    deliveryLocation ? `My delivery location is ${deliveryLocation}.` : null,
    `Please confirm availability, total cost and delivery details.`,
  ].filter(Boolean);
  return lines.join("\n");
}

/** Generates a human-friendly order reference, e.g. PK-20261010-7F3K */
export function generateOrderReference(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PK-${y}${m}${d}-${rand}`;
}

export const ORDER_STATUSES = [
  "awaiting_confirmation",
  "awaiting_payment",
  "payment_confirmed",
  "preparing_order",
  "out_for_delivery",
  "completed",
  "cancelled",
  "refunded",
] as const;

export const PAYMENT_METHODS = [
  "Mobile Money (M-Pesa / Tigo Pesa / Airtel Money)",
  "Bank Transfer",
  "Cash on Delivery",
] as const;

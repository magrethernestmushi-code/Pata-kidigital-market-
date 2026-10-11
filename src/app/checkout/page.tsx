"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatTzs } from "@/lib/format";
import { PAYMENT_METHODS } from "@/lib/orders";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{
    customerName: string;
    phone: string;
    university: string;
    deliveryLocation: string;
    deliveryInstructions: string;
    preferredPayment: string;
  }>({
    customerName: "",
    phone: "",
    university: "",
    deliveryLocation: "",
    deliveryInstructions: "",
    preferredPayment: PAYMENT_METHODS[0],
  });

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-extrabold text-forest-dark mb-2">Checkout</h1>
        <p className="text-charcoal/60 mb-6">Your cart is empty — add a product first.</p>
        <Link href="/shop" className="btn-primary">
          Shop Products
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            variation: i.variation ?? null,
            quantity: i.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong placing your order.");
      }
      const data = await res.json();
      clearCart();
      router.push(`/order-confirmation/${data.reference}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark mb-1">Checkout</h1>
      <p className="text-sm text-charcoal/60 mb-6">
        No account needed — just the details below.
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 card p-5 flex flex-col gap-4">
          <Field label="Full Name">
            <input
              required
              value={form.customerName}
              onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
              placeholder="e.g. Amina Juma"
            />
          </Field>
          <Field label="Phone Number">
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. 0712 345 678"
            />
          </Field>
          <Field label="University / Campus">
            <input
              required
              value={form.university}
              onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
              placeholder="e.g. University of Dar es Salaam"
            />
          </Field>
          <Field label="Hostel / Delivery Location">
            <input
              required
              value={form.deliveryLocation}
              onChange={(e) => setForm((f) => ({ ...f, deliveryLocation: e.target.value }))}
              placeholder="e.g. Hall 7, Room 204"
            />
          </Field>
          <Field label="Delivery Instructions (optional)">
            <textarea
              rows={3}
              value={form.deliveryInstructions}
              onChange={(e) => setForm((f) => ({ ...f, deliveryInstructions: e.target.value }))}
              placeholder="Landmarks, best time to deliver, etc."
            />
          </Field>
          <Field label="Preferred Payment Method">
            <select
              value={form.preferredPayment}
              onChange={(e) => setForm((f) => ({ ...f, preferredPayment: e.target.value }))}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary mt-2">
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
          <p className="text-xs text-charcoal/50 text-center">
            Placing an order does not charge you automatically. Our team will confirm
            availability, total cost and delivery details with you directly.
          </p>
        </form>

        <div className="card p-5 h-fit">
          <h2 className="font-bold text-forest-dark mb-4">Order Summary</h2>
          <ul className="flex flex-col gap-2 mb-4 text-sm">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.variation ?? ""}`}
                className="flex justify-between gap-2"
              >
                <span className="text-charcoal/80">
                  {item.name}
                  {item.variation ? ` (${item.variation})` : ""} × {item.quantity}
                </span>
                <span className="font-semibold shrink-0">
                  {formatTzs(item.priceTzs * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-forest/10 pt-3 flex justify-between font-bold text-forest">
            <span>Subtotal</span>
            <span>{formatTzs(subtotal)}</span>
          </div>
          <p className="text-xs text-charcoal/50 mt-1">
            Delivery fee is confirmed separately based on your location.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-forest-dark block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

"use client";

import { useState } from "react";
import { formatTzs } from "@/lib/format";
import OrderStatusTimeline from "./OrderStatusTimeline";

type OrderResult = {
  reference: string;
  status: string;
  paymentStatus: string;
  subtotalTzs: string;
  deliveryFeeTzs: string;
  totalTzs: string;
  createdAt: string;
  deliveryLocation: string;
  items: { productName: string; variation: string | null; quantity: number; lineTotalTzs: string }[];
};

export default function TrackOrderForm({
  initialReference,
  initialPhone,
}: {
  initialReference: string;
  initialPhone: string;
}) {
  const [reference, setReference] = useState(initialReference);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, phone }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Order not found.");
      }
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-forest-dark block mb-1.5">
            Order Reference
          </span>
          <input
            required
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. PK-20261010-7F3K"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-forest-dark block mb-1.5">
            Phone Number
          </span>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="The phone number used at checkout"
          />
        </label>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>

      {result && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-charcoal/60">Order Reference</span>
            <span className="font-mono font-bold text-forest">{result.reference}</span>
          </div>
          <OrderStatusTimeline status={result.status} />
          <div className="border-t border-forest/10 pt-4 mt-2">
            <h3 className="font-bold text-forest-dark mb-2 text-sm">Items</h3>
            <ul className="flex flex-col gap-1.5 text-sm mb-3">
              {result.items.map((it, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {it.productName}
                    {it.variation ? ` (${it.variation})` : ""} × {it.quantity}
                  </span>
                  <span className="font-semibold">{formatTzs(it.lineTotalTzs)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-forest">
              <span>Total</span>
              <span>{formatTzs(result.totalTzs)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

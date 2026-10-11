import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatTzs } from "@/lib/format";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";

export default async function OrderConfirmationPage({
  params,
}: PageProps<"/order-confirmation/[reference]">) {
  const { reference } = await params;
  const order = await db.query.orders.findFirst({ where: eq(orders.reference, reference) });
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  return (
    <div className="container-page py-14 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white text-2xl mb-3">
          ✓
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark mb-2">
          Order Received!
        </h1>
        <p className="text-charcoal/60 text-sm max-w-md mx-auto">
          Our team will confirm availability and delivery cost shortly. Save your order
          reference below to track status.
        </p>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-charcoal/60">Order Reference</span>
          <span className="font-mono font-bold text-forest text-lg">{order.reference}</span>
        </div>
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-bold text-forest-dark mb-3">Items</h2>
        <ul className="flex flex-col gap-2 text-sm mb-4">
          {items.map((it) => (
            <li key={it.id} className="flex justify-between">
              <span>
                {it.productName}
                {it.variation ? ` (${it.variation})` : ""} × {it.quantity}
              </span>
              <span className="font-semibold">{formatTzs(it.lineTotalTzs)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-forest/10 pt-3 flex justify-between font-bold text-forest">
          <span>Subtotal</span>
          <span>{formatTzs(order.subtotalTzs)}</span>
        </div>
      </div>

      <div className="card p-6 bg-amber/10 border border-amber/40 text-sm text-charcoal/80 mb-6">
        This order is not yet marked as paid. Payment is confirmed only through our
        verified payment process.
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={`/track-order?reference=${order.reference}&phone=${order.phone}`} className="btn-secondary flex-1 text-center">
          Track This Order
        </Link>
        <Link href="/shop" className="btn-primary flex-1 text-center">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatTzs } from "@/lib/format";
import { updateOrderStatusAction } from "@/lib/admin-actions";
import { ORDER_STATUSES } from "@/lib/orders";

export const metadata = { title: "Admin · Order Detail" };

const PAYMENT_STATUSES = ["pending", "verified", "failed", "refunded"] as const;

export default async function AdminOrderDetailPage({
  params,
}: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const orderId = Number(id);
  if (Number.isNaN(orderId)) notFound();

  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold text-forest-dark mb-1">Order {order.reference}</h1>
      <p className="text-sm text-charcoal/60 mb-6">
        Placed {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h2 className="font-bold text-forest-dark mb-3">Customer</h2>
          <dl className="text-sm flex flex-col gap-1.5">
            <Row label="Name" value={order.customerName} />
            <Row label="Phone" value={order.phone} />
            <Row label="University" value={order.university} />
            <Row label="Delivery Location" value={order.deliveryLocation} />
            {order.deliveryInstructions && (
              <Row label="Instructions" value={order.deliveryInstructions} />
            )}
            {order.deliveryLat && order.deliveryLng && (
              <div className="flex justify-between gap-3 items-center">
                <dt className="text-charcoal/50">Shared Pin</dt>
                <dd>
                  <a
                    href={`https://maps.google.com/?q=${order.deliveryLat},${order.deliveryLng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-forest font-semibold underline"
                  >
                    📍 Open in Google Maps
                  </a>
                </dd>
              </div>
            )}
            <Row label="Payment Method" value={order.preferredPayment} />
          </dl>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-forest-dark mb-3">Items</h2>
          <ul className="flex flex-col gap-2 text-sm mb-3">
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
          <div className="border-t border-forest/10 pt-2 flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">{formatTzs(order.subtotalTzs)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span className="font-semibold">{formatTzs(order.deliveryFeeTzs)}</span>
          </div>
          <div className="flex justify-between font-bold text-forest mt-1">
            <span>Total</span>
            <span>{formatTzs(order.totalTzs)}</span>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-bold text-forest-dark mb-4">Update Order</h2>
        <form action={updateOrderStatusAction} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={order.id} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Order Status">
              <select name="status" defaultValue={order.status}>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Payment Status">
              <select name="paymentStatus" defaultValue={order.paymentStatus}>
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Delivery Fee (TZS)">
            <input name="deliveryFeeTzs" type="number" step="0.01" defaultValue={order.deliveryFeeTzs} />
          </Field>
          <Field label="Admin Notes (internal only)">
            <textarea name="adminNotes" defaultValue={order.adminNotes ?? ""} rows={3} />
          </Field>
          <p className="text-xs text-charcoal/50">
            Marking payment as &quot;verified&quot; should only be done after confirming payment
            through your payment provider or an authorised process — never based solely on a
            customer message or screenshot.
          </p>
          <button type="submit" className="btn-primary w-fit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-charcoal/50">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
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

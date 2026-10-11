import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatTzs } from "@/lib/format";

export const metadata = { title: "Admin · Orders" };

export default async function AdminOrdersPage() {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-6">Orders</h1>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-charcoal/50 border-b border-forest/10">
              <th className="p-3 font-medium">Reference</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Payment</th>
              <th className="p-3 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-forest/5 last:border-0">
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono text-forest hover:underline">
                    {o.reference}
                  </Link>
                </td>
                <td className="p-3">
                  <p>{o.customerName}</p>
                  <p className="text-xs text-charcoal/40">{o.phone}</p>
                </td>
                <td className="p-3 font-semibold">{formatTzs(o.totalTzs)}</td>
                <td className="p-3">
                  <span className="rounded-full bg-forest/10 text-forest-dark px-2.5 py-0.5 text-xs font-semibold">
                    {o.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      o.paymentStatus === "verified"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="p-3 text-xs text-charcoal/50">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-charcoal/50">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

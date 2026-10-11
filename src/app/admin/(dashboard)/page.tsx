import Link from "next/link";
import { db } from "@/db";
import { orders, products, enquiries } from "@/db/schema";
import { desc, eq, sql, ne, and } from "drizzle-orm";
import { formatTzs } from "@/lib/format";

export const metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const [pendingOrders, totalOrders, hiddenCount, totalCount, unresolvedEnquiries, recentOrders, revenueRow] =
    await Promise.all([
      db.select({ c: sql<number>`count(*)` }).from(orders).where(eq(orders.status, "awaiting_confirmation")),
      db.select({ c: sql<number>`count(*)` }).from(orders),
      db.select({ c: sql<number>`count(*)` }).from(products).where(eq(products.isHidden, true)),
      db.select({ c: sql<number>`count(*)` }).from(products),
      db.select({ c: sql<number>`count(*)` }).from(enquiries).where(eq(enquiries.resolved, false)),
      db.select().from(orders).orderBy(desc(orders.createdAt)).limit(6),
      db
        .select({ sum: sql<string>`COALESCE(SUM(${orders.totalTzs}), 0)` })
        .from(orders)
        .where(and(ne(orders.status, "cancelled"), ne(orders.status, "refunded"))),
    ]);

  const stats = [
    { label: "Orders Awaiting Confirmation", value: pendingOrders[0]?.c ?? 0, href: "/admin/orders" },
    { label: "Total Orders", value: totalOrders[0]?.c ?? 0, href: "/admin/orders" },
    { label: "Active Products", value: (totalCount[0]?.c ?? 0) - (hiddenCount[0]?.c ?? 0), href: "/admin/products" },
    { label: "Unresolved Enquiries", value: unresolvedEnquiries[0]?.c ?? 0, href: "/admin/enquiries" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-1">Overview</h1>
      <p className="text-sm text-charcoal/60 mb-6">
        Total recorded sales value: <strong>{formatTzs(revenueRow[0]?.sum ?? 0)}</strong>
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card card-hover p-5">
            <p className="text-3xl font-extrabold text-forest">{s.value}</p>
            <p className="text-sm text-charcoal/60 mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-bold text-forest-dark mb-3">Recent Orders</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-charcoal/50 border-b border-forest/10">
              <th className="p-3 font-medium">Reference</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-forest/5 last:border-0">
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono text-forest hover:underline">
                    {o.reference}
                  </Link>
                </td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3 font-semibold">{formatTzs(o.totalTzs)}</td>
                <td className="p-3">
                  <span className="rounded-full bg-forest/10 text-forest-dark px-2.5 py-0.5 text-xs font-semibold">
                    {o.status.replace(/_/g, " ")}
                  </span>
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-charcoal/50">
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

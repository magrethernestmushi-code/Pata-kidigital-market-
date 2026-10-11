import Link from "next/link";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatTzs } from "@/lib/format";
import { toggleProductHiddenAction, deleteProductAction } from "@/lib/admin-actions";
import StockBadge from "@/components/StockBadge";

export const metadata = { title: "Admin · Products" };

export default async function AdminProductsPage() {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      priceTzs: products.priceTzs,
      stockStatus: products.stockStatus,
      stockQty: products.stockQty,
      isDemo: products.isDemo,
      isHidden: products.isHidden,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-forest-dark">Products</h1>
        <Link href="/admin/products/new" className="btn-primary !py-2 !px-4 text-sm">
          + Add Product
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-charcoal/50 border-b border-forest/10">
              <th className="p-3 font-medium">Product</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-forest/5 last:border-0 align-top">
                <td className="p-3">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-charcoal/40">
                    {p.sku} {p.isDemo && <span className="demo-tag ml-1">Demo</span>}
                  </p>
                </td>
                <td className="p-3">{p.categoryName ?? "—"}</td>
                <td className="p-3 font-semibold">{formatTzs(p.priceTzs)}</td>
                <td className="p-3">
                  <StockBadge status={p.stockStatus} />
                  <p className="text-xs text-charcoal/40 mt-1">Qty: {p.stockQty}</p>
                </td>
                <td className="p-3">
                  {p.isHidden ? (
                    <span className="text-xs font-semibold text-red-500">Hidden</span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600">Visible</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    <Link href={`/admin/products/${p.id}`} className="text-xs font-semibold text-forest hover:underline">
                      Edit
                    </Link>
                    <form action={toggleProductHiddenAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="hidden" value={(!p.isHidden).toString()} />
                      <button className="text-xs font-semibold text-charcoal/60 hover:underline">
                        {p.isHidden ? "Unhide" : "Hide"}
                      </button>
                    </form>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="text-xs font-semibold text-red-500 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-charcoal/50">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

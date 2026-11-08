import { db } from "@/db";
import { updateAdRequestAction } from "@/lib/admin-actions";
import { formatTzs } from "@/lib/format";

export const metadata = { title: "Admin · Ad Requests" };

export default async function AdminAdRequestsPage() {
  const list = await db.query.adRequests.findMany({
    with: { business: true },
    orderBy: (fields, { desc }) => desc(fields.createdAt),
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-6">Ad Requests</h1>

      <div className="flex flex-col gap-3">
        {list.map((r) => (
          <details key={r.id} className="card p-4" open={r.status !== "delivered" && r.status !== "cancelled"}>
            <summary className="cursor-pointer font-semibold text-forest-dark flex items-center justify-between flex-wrap gap-2">
              <span>
                {r.business?.businessName ?? "Unknown business"} — {formatTzs(r.priceTzs)}
              </span>
              <span className="amber-tag">{r.status.replace("_", " ")}</span>
            </summary>
            <p className="mt-3 text-sm text-charcoal/80">{r.details}</p>
            <p className="text-xs text-charcoal/50 mt-1">
              Contact via WhatsApp: {r.business?.whatsappNumber}
            </p>

            <form action={updateAdRequestAction} className="mt-4 pt-4 border-t border-forest/10 flex flex-col gap-3">
              <input type="hidden" name="id" value={r.id} />
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-forest-dark block mb-1">Status</span>
                  <select name="status" defaultValue={r.status}>
                    <option value="requested">Requested</option>
                    <option value="in_progress">In progress</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-forest-dark block mb-1">Delivered Ad Link</span>
                  <input name="deliverableUrl" defaultValue={r.deliverableUrl ?? ""} placeholder="https://..." />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-semibold text-forest-dark block mb-1">Notes to business</span>
                <textarea name="adminNotes" defaultValue={r.adminNotes ?? ""} rows={2} />
              </label>
              <button type="submit" className="btn-primary !py-1.5 !px-4 text-sm w-fit">
                Save
              </button>
            </form>
          </details>
        ))}
        {list.length === 0 && <p className="text-sm text-charcoal/50">No ad requests yet.</p>}
      </div>
    </div>
  );
}

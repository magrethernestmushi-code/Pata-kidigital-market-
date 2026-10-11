import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { desc } from "drizzle-orm";
import { resolveEnquiryAction } from "@/lib/admin-actions";

export const metadata = { title: "Admin · Enquiries" };

export default async function AdminEnquiriesPage() {
  const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-6">Customer Enquiries</h1>
      <div className="flex flex-col gap-3">
        {rows.map((e) => (
          <div key={e.id} className="card p-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">{e.name}</p>
              <p className="text-xs text-charcoal/40 mb-2">
                {e.phone} {e.email ? `· ${e.email}` : ""} ·{" "}
                {new Date(e.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-charcoal/80 whitespace-pre-line">{e.message}</p>
            </div>
            <form action={resolveEnquiryAction} className="shrink-0">
              <input type="hidden" name="id" value={e.id} />
              <input type="hidden" name="resolved" value={(!e.resolved).toString()} />
              <button
                className={`text-xs font-semibold rounded-full px-3 py-1.5 ${
                  e.resolved
                    ? "bg-stone-100 text-stone-600"
                    : "bg-forest text-white"
                }`}
              >
                {e.resolved ? "Resolved ✓" : "Mark Resolved"}
              </button>
            </form>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-charcoal/50 card p-6 text-center">No enquiries yet.</p>
        )}
      </div>
    </div>
  );
}

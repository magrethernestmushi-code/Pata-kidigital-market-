import { db } from "@/db";
import { businesses } from "@/db/schema";
import { desc } from "drizzle-orm";
import { confirmBusinessPaymentAction, toggleBusinessSuspendedAction } from "@/lib/admin-actions";
import { getBusinessStatus } from "@/lib/business-status";
import { formatTzs } from "@/lib/format";

export const metadata = { title: "Admin · Businesses" };

export default async function AdminBusinessesPage() {
  const list = await db.select().from(businesses).orderBy(desc(businesses.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-2">Businesses</h1>
      <p className="text-sm text-charcoal/60 mb-6">
        Self-service listings. First month free, then {formatTzs(30000)}/month. Confirm payment
        manually once you&apos;ve received mobile money or bank transfer.
      </p>

      <div className="flex flex-col gap-3">
        {list.map((b) => {
          const status = getBusinessStatus(b);
          return (
            <details key={b.id} className="card p-4">
              <summary className="cursor-pointer font-semibold text-forest-dark flex items-center justify-between flex-wrap gap-2">
                <span>{b.businessName}</span>
                <StatusPill status={status} />
              </summary>
              <div className="mt-4 flex flex-col gap-2 text-sm">
                <Row label="Owner" value={b.ownerName ?? "—"} />
                <Row label="Email" value={b.email} />
                <Row label="WhatsApp" value={b.whatsappNumber} />
                <Row label="Instagram" value={b.instagramHandle ?? "—"} />
                <Row label="TikTok" value={b.tiktokHandle ?? "—"} />
                <Row label="Trial ends" value={new Date(b.trialEndsAt).toLocaleDateString()} />
                <Row
                  label="Subscription paid until"
                  value={b.subscriptionExpiresAt ? new Date(b.subscriptionExpiresAt).toLocaleDateString() : "Not yet paid"}
                />
              </div>

              <div className="mt-4 pt-4 border-t border-forest/10 flex flex-wrap gap-3">
                <form action={confirmBusinessPaymentAction}>
                  <input type="hidden" name="id" value={b.id} />
                  <button className="btn-primary !py-1.5 !px-4 text-sm">
                    Confirm {formatTzs(30000)} Payment (+30 days)
                  </button>
                </form>
                <form action={toggleBusinessSuspendedAction}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="suspended" value={(!b.suspended).toString()} />
                  <button className="btn-secondary !py-1.5 !px-4 text-sm">
                    {b.suspended ? "Unsuspend" : "Suspend"}
                  </button>
                </form>
              </div>
            </details>
          );
        })}
        {list.length === 0 && <p className="text-sm text-charcoal/50">No businesses have signed up yet.</p>}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-forest-dark w-36 shrink-0">{label}</span>
      <span className="text-charcoal/70">{value}</span>
    </div>
  );
}

function StatusPill({ status }: { status: ReturnType<typeof getBusinessStatus> }) {
  const color = status.active
    ? status.label === "Free trial"
      ? "bg-amber/20 text-amber-dark"
      : "bg-forest/10 text-forest"
    : "bg-red-100 text-red-700";
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>{status.label}</span>;
}

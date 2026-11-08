import { redirect } from "next/navigation";
import { db } from "@/db";
import { adRequests } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getBusinessSession } from "@/lib/business-auth";
import { createAdRequestAction } from "@/lib/business-actions";
import { formatTzs } from "@/lib/format";

export const metadata = { title: "Request an Ad · Pata Online Business" };

const STATUS_LABEL: Record<string, string> = {
  requested: "Requested",
  in_progress: "In progress",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default async function BusinessAdsPage() {
  const session = await getBusinessSession();
  if (!session) redirect("/business/login");

  const requests = await db
    .select()
    .from(adRequests)
    .where(eq(adRequests.businessId, session.businessId))
    .orderBy(desc(adRequests.createdAt));

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-dark mb-1">Digital Marketing Ads</h1>
        <p className="text-charcoal/70 text-sm">
          Pata Kidigital&apos;s team can create a paid ad to promote your business —{" "}
          <strong>{formatTzs(100000)} per ad</strong>. Tell us what you&apos;d like, and we&apos;ll
          follow up with you on WhatsApp.
        </p>
      </div>

      <form action={createAdRequestAction} className="card p-5 flex flex-col gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-forest-dark block mb-1.5">
            What should the ad promote?
          </span>
          <textarea
            name="details"
            rows={4}
            required
            placeholder="e.g. A promo video for our new product line, to post on Instagram and TikTok."
          />
        </label>
        <button type="submit" className="btn-primary w-fit">
          Request Ad — {formatTzs(100000)}
        </button>
      </form>

      {requests.length > 0 && (
        <div>
          <h2 className="font-bold text-forest-dark mb-3">Your Requests</h2>
          <div className="flex flex-col gap-3">
            {requests.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="amber-tag">{STATUS_LABEL[r.status]}</span>
                  <span className="text-sm font-semibold text-forest-dark">{formatTzs(r.priceTzs)}</span>
                </div>
                <p className="text-sm text-charcoal/80">{r.details}</p>
                {r.deliverableUrl && (
                  <a
                    href={r.deliverableUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-forest hover:underline mt-2 inline-block"
                  >
                    View delivered ad →
                  </a>
                )}
                {r.adminNotes && (
                  <p className="text-xs text-charcoal/50 mt-2">Note from Pata Kidigital: {r.adminNotes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

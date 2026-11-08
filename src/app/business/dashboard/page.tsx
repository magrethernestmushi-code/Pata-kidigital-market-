import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { businesses, businessProducts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getBusinessSession } from "@/lib/business-auth";
import { getBusinessStatus } from "@/lib/business-status";
import { formatTzs } from "@/lib/format";
import { toggleBusinessProductHiddenAction } from "@/lib/business-actions";
import DeleteProductButton from "@/components/business/DeleteProductButton";

export const metadata = { title: "Dashboard · Pata Online Business" };

export default async function BusinessDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const session = await getBusinessSession();
  if (!session) return null;
  const { welcome } = await searchParams;

  const business = await db.query.businesses.findFirst({ where: eq(businesses.id, session.businessId) });
  if (!business) return null;

  const products = await db
    .select()
    .from(businessProducts)
    .where(eq(businessProducts.businessId, session.businessId))
    .orderBy(desc(businessProducts.createdAt));

  const status = getBusinessStatus(business);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {welcome && (
        <div className="card p-4 bg-forest text-white">
          <p className="font-bold">Welcome to Pata Online! 🎉</p>
          <p className="text-sm text-cream/90 mt-1">
            Your first month is free. Add your products below so students can find you.
          </p>
        </div>
      )}

      <StatusBanner status={status} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-forest-dark">Your Products</h1>
        <Link href="/business/dashboard/products/new" className="btn-primary">
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card p-8 text-center text-charcoal/60">
          <p>You haven&apos;t added any products yet.</p>
          <Link href="/business/dashboard/products/new" className="btn-primary mt-4 inline-flex">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="card p-4 flex flex-col gap-2">
              <div className="aspect-square rounded-xl bg-forest/5 overflow-hidden relative">
                {p.imageIds[0] ? (
                  <Image
                    src={`/api/business-images/${p.imageIds[0]}`}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-charcoal/30 text-xs">
                    No photo
                  </div>
                )}
                {p.isHidden && (
                  <span className="absolute top-2 left-2 demo-tag">Hidden</span>
                )}
              </div>
              <p className="font-bold text-forest-dark truncate">{p.name}</p>
              <p className="text-sm text-charcoal/70">{p.priceTzs ? formatTzs(p.priceTzs) : "Price on request"}</p>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <Link href={`/business/dashboard/products/${p.id}`} className="font-semibold text-forest hover:underline">
                  Edit
                </Link>
                <form action={toggleBusinessProductHiddenAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="hidden" value={(!p.isHidden).toString()} />
                  <button className="font-semibold text-charcoal/60 hover:underline">
                    {p.isHidden ? "Unhide" : "Hide"}
                  </button>
                </form>
                <DeleteProductButton id={p.id} name={p.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBanner({ status }: { status: ReturnType<typeof getBusinessStatus> }) {
  if (!status.active) {
    return (
      <div className="card p-4 border-2 border-red-300 bg-red-50">
        <p className="font-bold text-red-700">
          {status.label === "Suspended" ? "Your listing is suspended." : "Your listing has expired."}
        </p>
        <p className="text-sm text-red-700/80 mt-1">
          {status.label === "Suspended"
            ? "Contact Pata Online support for details."
            : "Your products are hidden from the public directory. Pay TZS 30,000 for another month to go back live — contact us on WhatsApp to confirm payment and we'll reactivate your listing."}
        </p>
      </div>
    );
  }

  const isTrial = status.label === "Free trial";
  return (
    <div className={`card p-4 ${isTrial ? "bg-amber/15 border border-amber/40" : "bg-forest/5 border border-forest/20"}`}>
      <p className="font-bold text-forest-dark">
        {isTrial ? "Free trial active" : "Subscription active"} — {status.daysLeft} day
        {status.daysLeft === 1 ? "" : "s"} left
      </p>
      <p className="text-sm text-charcoal/70 mt-1">
        {isTrial
          ? "Your listing is free until your trial ends. After that it's TZS 30,000/month to stay visible."
          : "Your listing is live on the public directory."}
      </p>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { getBusinessStatus } from "@/lib/business-status";
import { formatTzs } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import PageHeading from "@/components/PageHeading";

export const metadata = { title: "Business Directory · Pata Online" };

export default async function BusinessesPage() {
  const allBusinesses = await db.query.businesses.findMany({
    with: { products: true },
  });

  // Only show businesses whose trial or paid subscription hasn't lapsed.
  const live = allBusinesses.filter((b) => getBusinessStatus(b).active);

  return (
    <div className="container-page py-10">
      <PageHeading
        title="Business Directory"
        subtitle="Local businesses selling directly to students — message them on WhatsApp, Instagram or TikTok."
      />

      <div className="card bg-forest text-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <div>
          <p className="font-bold">Own a business?</p>
          <p className="text-sm text-cream/80">List your products here free for your first month.</p>
        </div>
        <Link href="/business/signup" className="btn-primary bg-amber text-forest-dark hover:bg-amber-dark !bg-amber shrink-0">
          List Your Business
        </Link>
      </div>

      {live.length === 0 ? (
        <div className="card p-8 text-center text-charcoal/60 border border-dashed border-forest/20">
          No businesses listed yet. Be the first!
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {live.map((b) => {
            const visibleProducts = b.products.filter((p) => !p.isHidden);
            const waUrl = buildWhatsAppUrl(b.whatsappNumber, `Hello ${b.businessName}, I saw your listing on Pata Online.`);
            return (
              <div key={b.id} className="card p-5 sm:p-6">
                <div className="flex items-start gap-4 mb-4">
                  {b.logoImageId ? (
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-forest/15">
                      <Image src={`/api/business-images/${b.logoImageId}`} alt="" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-xl bg-forest/10 shrink-0 flex items-center justify-center font-extrabold text-forest">
                      {b.businessName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-extrabold text-forest-dark text-lg truncate">{b.businessName}</h2>
                    {b.location && <p className="text-sm text-charcoal/60">{b.location}</p>}
                    {b.description && <p className="text-sm text-charcoal/70 mt-1">{b.description}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp !px-4 !py-2 text-sm">
                    WhatsApp
                  </a>
                  {b.instagramHandle && (
                    <a
                      href={`https://instagram.com/${b.instagramHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary !px-4 !py-2 text-sm"
                    >
                      Instagram
                    </a>
                  )}
                  {b.tiktokHandle && (
                    <a
                      href={`https://tiktok.com/@${b.tiktokHandle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary !px-4 !py-2 text-sm"
                    >
                      TikTok
                    </a>
                  )}
                </div>

                {visibleProducts.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {visibleProducts.map((p) => (
                      <div key={p.id} className="rounded-xl overflow-hidden border border-forest/10">
                        <div className="aspect-square bg-forest/5 relative">
                          {p.imageIds[0] ? (
                            <Image src={`/api/business-images/${p.imageIds[0]}`} alt={p.name} fill className="object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-charcoal/30 text-xs">
                              No photo
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-sm font-semibold text-forest-dark truncate">{p.name}</p>
                          <p className="text-xs text-charcoal/60">{p.priceTzs ? formatTzs(p.priceTzs) : "Price on request"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

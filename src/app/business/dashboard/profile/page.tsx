import Image from "next/image";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getBusinessSession } from "@/lib/business-auth";
import { updateBusinessProfileAction } from "@/lib/business-actions";

export const metadata = { title: "Profile & Social Links · Pata Online Business" };

export default async function BusinessProfilePage() {
  const session = await getBusinessSession();
  if (!session) redirect("/business/login");

  const business = await db.query.businesses.findFirst({ where: eq(businesses.id, session.businessId) });
  if (!business) redirect("/business/login");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-6">Profile & Social Links</h1>
      <form action={updateBusinessProfileAction} className="flex flex-col gap-6 max-w-2xl" encType="multipart/form-data">
        <div className="card p-5 flex flex-col gap-4">
          <h2 className="font-bold text-forest-dark text-sm uppercase tracking-wide">Business</h2>
          <Field label="Business Name">
            <input name="businessName" defaultValue={business.businessName} required />
          </Field>
          <Field label="Your Name" optional>
            <input name="ownerName" defaultValue={business.ownerName ?? ""} />
          </Field>
          <Field label="Location" optional>
            <input name="location" defaultValue={business.location ?? ""} />
          </Field>
          <Field label="About your business" optional>
            <textarea name="description" rows={3} defaultValue={business.description ?? ""} />
          </Field>
          <Field label="Logo / Photo" optional>
            {business.logoImageId && (
              <div className="relative h-20 w-20 rounded-xl overflow-hidden mb-2 border border-forest/15">
                <Image src={`/api/business-images/${business.logoImageId}`} alt="" fill className="object-cover" />
              </div>
            )}
            <input type="file" name="logo" accept="image/*" />
          </Field>
        </div>

        <div className="card p-5 flex flex-col gap-4">
          <h2 className="font-bold text-forest-dark text-sm uppercase tracking-wide">
            Where customers reach you
          </h2>
          <Field label="WhatsApp Number" hint="International format, e.g. 255712345678">
            <input name="whatsappNumber" defaultValue={business.whatsappNumber} required inputMode="numeric" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Instagram" optional>
              <input name="instagramHandle" defaultValue={business.instagramHandle ?? ""} placeholder="@yourbusiness" />
            </Field>
            <Field label="TikTok" optional>
              <input name="tiktokHandle" defaultValue={business.tiktokHandle ?? ""} placeholder="@yourbusiness" />
            </Field>
          </div>
        </div>

        <button type="submit" className="btn-primary w-fit">
          Save Changes
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  optional,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-forest-dark block mb-1.5">
        {label}
        {optional && <span className="font-normal text-charcoal/40"> (optional)</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-charcoal/50 mt-1 block">{hint}</span>}
    </label>
  );
}

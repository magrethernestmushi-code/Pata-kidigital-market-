import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { businessProducts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getBusinessSession } from "@/lib/business-auth";
import BusinessProductForm from "@/components/business/BusinessProductForm";

export const metadata = { title: "Edit Product · Pata Online Business" };

export default async function EditBusinessProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getBusinessSession();
  if (!session) redirect("/business/login");

  const { id } = await params;
  const product = await db.query.businessProducts.findFirst({ where: eq(businessProducts.id, Number(id)) });
  if (!product || product.businessId !== session.businessId) notFound();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-6">Edit Product</h1>
      <BusinessProductForm product={product} />
    </div>
  );
}

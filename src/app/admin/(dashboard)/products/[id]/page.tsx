import { notFound } from "next/navigation";
import { db } from "@/db";
import { categories, suppliers, products } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Admin · Edit Product" };

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const productId = Number(id);
  if (Number.isNaN(productId)) notFound();

  const [product, cats, sups] = await Promise.all([
    db.query.products.findFirst({ where: eq(products.id, productId) }),
    db.select().from(categories).orderBy(asc(categories.sortOrder)),
    db.select().from(suppliers).orderBy(asc(suppliers.name)),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-6">Edit Product</h1>
      <ProductForm product={product} categories={cats} suppliers={sups} />
    </div>
  );
}

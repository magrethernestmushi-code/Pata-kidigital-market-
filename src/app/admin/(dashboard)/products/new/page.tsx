import { db } from "@/db";
import { categories, suppliers } from "@/db/schema";
import { asc } from "drizzle-orm";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Admin · Add Product" };

export default async function NewProductPage() {
  const [cats, sups] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder)),
    db.select().from(suppliers).orderBy(asc(suppliers.name)),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-6">Add Product</h1>
      <ProductForm categories={cats} suppliers={sups} />
    </div>
  );
}

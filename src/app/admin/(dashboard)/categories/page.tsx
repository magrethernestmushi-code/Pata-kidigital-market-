import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import { upsertCategoryAction, deleteCategoryAction } from "@/lib/admin-actions";

export const metadata = { title: "Admin · Categories" };

export default async function AdminCategoriesPage() {
  const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-6">Categories</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-3">
          {cats.map((c) => (
            <details key={c.id} className="card p-4">
              <summary className="cursor-pointer font-semibold text-forest-dark flex items-center justify-between">
                {c.name}
                <span className="text-xs text-charcoal/40 font-normal">/{c.slug}</span>
              </summary>
              <form action={upsertCategoryAction} className="mt-4 flex flex-col gap-3">
                <input type="hidden" name="id" value={c.id} />
                <Field label="Name (English)">
                  <input name="name" defaultValue={c.name} required />
                </Field>
                <Field label="Name (Swahili)">
                  <input name="nameSw" defaultValue={c.nameSw ?? ""} />
                </Field>
                <Field label="Description">
                  <textarea name="description" defaultValue={c.description ?? ""} rows={2} />
                </Field>
                <Field label="Image URL">
                  <input name="imageUrl" defaultValue={c.imageUrl ?? ""} />
                </Field>
                <Field label="Sort Order">
                  <input name="sortOrder" type="number" defaultValue={c.sortOrder} />
                </Field>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary !py-1.5 !px-4 text-sm">
                    Save
                  </button>
                  <button
                    type="submit"
                    formAction={deleteCategoryAction}
                    className="btn-secondary !py-1.5 !px-4 text-sm !border-red-300 !text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </details>
          ))}
          {cats.length === 0 && (
            <p className="text-sm text-charcoal/50">No categories yet — add one.</p>
          )}
        </div>

        <div className="card p-5 h-fit">
          <h2 className="font-bold text-forest-dark mb-4">Add Category</h2>
          <form action={upsertCategoryAction} className="flex flex-col gap-3">
            <Field label="Name (English)">
              <input name="name" required />
            </Field>
            <Field label="Name (Swahili)">
              <input name="nameSw" />
            </Field>
            <Field label="Description">
              <textarea name="description" rows={2} />
            </Field>
            <Field label="Image URL">
              <input name="imageUrl" placeholder="https://..." />
            </Field>
            <Field label="Sort Order">
              <input name="sortOrder" type="number" defaultValue={cats.length} />
            </Field>
            <button type="submit" className="btn-primary mt-1">
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-forest-dark block mb-1">{label}</span>
      {children}
    </label>
  );
}

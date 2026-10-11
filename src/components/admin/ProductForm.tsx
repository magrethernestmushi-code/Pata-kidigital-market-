import { upsertProductAction } from "@/lib/admin-actions";
import type { Product, Category, Supplier } from "@/lib/types";

export default function ProductForm({
  product,
  categories,
  suppliers,
}: {
  product?: Product;
  categories: Category[];
  suppliers: Supplier[];
}) {
  const variationsText = product?.variations?.length
    ? JSON.stringify(product.variations, null, 2)
    : "";

  return (
    <form action={upsertProductAction} className="flex flex-col gap-4 max-w-2xl">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Field label="Product Name">
        <input name="name" defaultValue={product?.name} required />
      </Field>

      <Field label="Description">
        <textarea name="description" defaultValue={product?.description} rows={4} required />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Category">
          <select name="categoryId" defaultValue={product?.categoryId} required>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Supplier">
          <select name="supplierId" defaultValue={product?.supplierId ?? ""}>
            <option value="">No supplier assigned</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Price (TZS)">
          <input name="priceTzs" type="number" step="0.01" defaultValue={product?.priceTzs} required />
        </Field>
        <Field label="Supplier Cost (TZS, private)">
          <input name="costTzs" type="number" step="0.01" defaultValue={product?.costTzs ?? ""} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Stock Status">
          <select name="stockStatus" defaultValue={product?.stockStatus ?? "unconfirmed"}>
            <option value="in_stock">In Stock</option>
            <option value="limited">Limited Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="unconfirmed">Unconfirmed / Demo</option>
          </select>
        </Field>
        <Field label="Stock Quantity">
          <input name="stockQty" type="number" defaultValue={product?.stockQty ?? 0} />
        </Field>
      </div>

      <Field label="Image URLs (one per line)">
        <textarea
          name="images"
          rows={3}
          defaultValue={product?.images?.join("\n")}
          placeholder="https://example.com/image1.jpg"
        />
      </Field>

      <Field label="Variations (optional)">
        <textarea
          name="variations"
          rows={3}
          defaultValue={variationsText}
          placeholder={`Simple format, one per line:\nSize: S,M,L,XL\nColor: Black,Red`}
        />
        <span className="text-xs text-charcoal/50 mt-1 block">
          Use &quot;Type: option1,option2&quot; per line, or paste JSON like{" "}
          {`[{"type":"Size","options":["S","M"]}]`}
        </span>
      </Field>

      <Field label="Delivery Estimate">
        <input name="deliveryEstimate" defaultValue={product?.deliveryEstimate ?? ""} placeholder="e.g. Same day within Dar es Salaam" />
      </Field>

      <Field label="Return Policy">
        <textarea name="returnPolicy" defaultValue={product?.returnPolicy ?? ""} rows={2} />
      </Field>

      <Field label="Warranty Information">
        <textarea name="warrantyInfo" defaultValue={product?.warrantyInfo ?? ""} rows={2} />
      </Field>

      <div className="flex flex-wrap gap-4">
        <Checkbox name="isDemo" label="Demo / not yet confirmed stock" defaultChecked={product?.isDemo ?? true} />
        <Checkbox name="isFeatured" label="Featured on homepage" defaultChecked={product?.isFeatured} />
        <Checkbox name="isNewArrival" label="New arrival" defaultChecked={product?.isNewArrival} />
        <Checkbox name="isHidden" label="Hidden from storefront" defaultChecked={product?.isHidden} />
      </div>

      <button type="submit" className="btn-primary w-fit mt-2">
        {product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-forest-dark block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="!w-auto" />
      {label}
    </label>
  );
}

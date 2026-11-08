import Image from "next/image";
import { upsertBusinessProductAction } from "@/lib/business-actions";
import type { BusinessProduct } from "@/lib/types";

export default function BusinessProductForm({ product }: { product?: BusinessProduct }) {
  return (
    <form action={upsertBusinessProductAction} className="flex flex-col gap-6 max-w-2xl" encType="multipart/form-data">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Section title="Basic Information">
        <Field label="Product Name">
          <input name="name" defaultValue={product?.name} required />
        </Field>
        <Field label="Description" optional>
          <textarea name="description" defaultValue={product?.description ?? ""} rows={4} />
        </Field>
        <Field label="Price (TZS)" optional hint="Leave blank for 'Price on request'">
          <input name="priceTzs" type="number" step="0.01" defaultValue={product?.priceTzs ?? ""} />
        </Field>
      </Section>

      <Section title="Photos">
        {product && product.imageIds.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-2">
            {product.imageIds.map((imgId) => (
              <label key={imgId} className="relative block aspect-square rounded-lg overflow-hidden border border-forest/15">
                <Image src={`/api/business-images/${imgId}`} alt="" fill className="object-cover" />
                <span className="absolute bottom-1 right-1 bg-white/90 rounded-md px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                  <input type="checkbox" name="keepImageIds" value={imgId} defaultChecked className="!w-auto h-3 w-3" />
                  Keep
                </span>
              </label>
            ))}
          </div>
        )}
        <Field label="Add Photos" optional hint="Up to 6 photos total, 5MB each. Saved permanently — they won't disappear.">
          <input type="file" name="images" accept="image/*" multiple />
        </Field>
      </Section>

      <Checkbox name="isHidden" label="Hide this product from the public page" defaultChecked={product?.isHidden} />

      <button type="submit" className="btn-primary w-fit">
        {product ? "Save Changes" : "Add Product"}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <h2 className="font-bold text-forest-dark text-sm uppercase tracking-wide">{title}</h2>
      {children}
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

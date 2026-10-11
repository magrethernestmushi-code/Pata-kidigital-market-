import { db } from "@/db";
import { suppliers } from "@/db/schema";
import { asc } from "drizzle-orm";
import { upsertSupplierAction, recordSupplierSettlementAction } from "@/lib/admin-actions";
import { formatTzs } from "@/lib/format";

export const metadata = { title: "Admin · Suppliers" };

export default async function AdminSuppliersPage() {
  const sups = await db.select().from(suppliers).orderBy(asc(suppliers.name));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-6">Suppliers</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-3">
          {sups.map((s) => (
            <details key={s.id} className="card p-4">
              <summary className="cursor-pointer font-semibold text-forest-dark flex items-center justify-between flex-wrap gap-2">
                <span>
                  {s.name} {!s.active && <span className="text-xs text-red-500">(inactive)</span>}
                </span>
                <span className="text-sm font-bold text-amber-dark">
                  Owed: {formatTzs(s.amountOwed)}
                </span>
              </summary>
              <form action={upsertSupplierAction} className="mt-4 flex flex-col gap-3">
                <input type="hidden" name="id" value={s.id} />
                <Field label="Name">
                  <input name="name" defaultValue={s.name} required />
                </Field>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Phone">
                    <input name="contactPhone" defaultValue={s.contactPhone ?? ""} />
                  </Field>
                  <Field label="Email">
                    <input name="contactEmail" defaultValue={s.contactEmail ?? ""} />
                  </Field>
                </div>
                <Field label="Location">
                  <input name="location" defaultValue={s.location ?? ""} />
                </Field>
                <Field label="Commission Rate (%)">
                  <input name="commissionRate" type="number" step="0.01" defaultValue={s.commissionRate} />
                </Field>
                <Field label="Notes">
                  <textarea name="notes" defaultValue={s.notes ?? ""} rows={2} />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="active" defaultChecked={s.active} className="!w-auto" />
                  Active
                </label>
                <button type="submit" className="btn-primary !py-1.5 !px-4 text-sm w-fit">
                  Save
                </button>
              </form>

              <form action={recordSupplierSettlementAction} className="mt-4 pt-4 border-t border-forest/10 flex items-end gap-2">
                <input type="hidden" name="id" value={s.id} />
                <Field label="Record Settlement Paid (TZS)">
                  <input name="amount" type="number" step="0.01" placeholder="0" />
                </Field>
                <button type="submit" className="btn-secondary !py-1.5 !px-4 text-sm">
                  Record Payment
                </button>
              </form>
            </details>
          ))}
          {sups.length === 0 && (
            <p className="text-sm text-charcoal/50">No suppliers yet — add one.</p>
          )}
        </div>

        <div className="card p-5 h-fit">
          <h2 className="font-bold text-forest-dark mb-4">Add Supplier</h2>
          <form action={upsertSupplierAction} className="flex flex-col gap-3">
            <Field label="Name">
              <input name="name" required />
            </Field>
            <Field label="Phone">
              <input name="contactPhone" />
            </Field>
            <Field label="Email">
              <input name="contactEmail" />
            </Field>
            <Field label="Location">
              <input name="location" />
            </Field>
            <Field label="Commission Rate (%)">
              <input name="commissionRate" type="number" step="0.01" defaultValue={15} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked className="!w-auto" />
              Active
            </label>
            <button type="submit" className="btn-primary mt-1">
              Add Supplier
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block flex-1">
      <span className="text-xs font-semibold text-forest-dark block mb-1">{label}</span>
      {children}
    </label>
  );
}

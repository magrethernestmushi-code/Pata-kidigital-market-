import { getAllSettings } from "@/lib/settings";
import { updateSettingsAction } from "@/lib/admin-actions";

export const metadata = { title: "Admin · Settings" };

export default async function AdminSettingsPage() {
  const settings = await getAllSettings();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-extrabold text-forest-dark mb-6">Settings</h1>
      <form action={updateSettingsAction} className="card p-5 flex flex-col gap-4">
        <Field label="Business WhatsApp Number" hint="International format, no spaces or plus sign, e.g. 255712345678">
          <input name="whatsapp_number" defaultValue={settings.whatsapp_number} required />
        </Field>
        <Field label="Business Name">
          <input name="business_name" defaultValue={settings.business_name} />
        </Field>
        <Field label="Business Email">
          <input name="business_email" type="email" defaultValue={settings.business_email} />
        </Field>
        <Field label="Default Delivery Fee (TZS)" hint="Used as a starting reference only — confirm actual delivery cost per order.">
          <input name="default_delivery_fee" type="number" step="0.01" defaultValue={settings.default_delivery_fee} />
        </Field>
        <button type="submit" className="btn-primary w-fit mt-2">
          Save Settings
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-forest-dark block mb-1.5">{label}</span>
      {children}
      {hint && <span className="text-xs text-charcoal/50 block mt-1">{hint}</span>}
    </label>
  );
}

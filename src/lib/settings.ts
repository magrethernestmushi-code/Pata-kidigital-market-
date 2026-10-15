import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEFAULTS: Record<string, string> = {
  whatsapp_number: process.env.WHATSAPP_NUMBER ?? "255700000000",
  business_name: "Pata Online",
  business_email: "hello@pataonline.co.tz",
  default_delivery_fee: "0",
};

export async function getSetting(key: string): Promise<string> {
  try {
    const row = await db.query.settings.findFirst({
      where: eq(settings.key, key),
    });
    return row?.value ?? DEFAULTS[key] ?? "";
  } catch {
    return DEFAULTS[key] ?? "";
  }
}

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(settings);
    const map: Record<string, string> = { ...DEFAULTS };
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch {
    return { ...DEFAULTS };
  }
}

export async function setSetting(key: string, value: string) {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
}

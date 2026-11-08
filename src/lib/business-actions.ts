"use server";

import { db } from "@/db";
import { businesses, businessProducts, businessImages, adRequests } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { getBusinessSession } from "@/lib/business-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB per photo
const MAX_IMAGES_PER_PRODUCT = 6;

async function requireBusiness() {
  const session = await getBusinessSession();
  if (!session) throw new Error("Not authorized.");
  return session;
}

/** Reads File entries from a FormData field, stores each as a businessImages
 * row, and returns the new row ids. Skips anything that isn't an image or is
 * too large (fails loudly so the merchant knows why an upload didn't stick). */
async function storeUploadedImages(
  formData: FormData,
  fieldName: string,
  businessId: number
): Promise<number[]> {
  const files = formData.getAll(fieldName).filter((f): f is File => f instanceof File && f.size > 0);
  const ids: number[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error(`"${file.name}" is larger than 5MB. Please use a smaller photo.`);
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const [row] = await db
      .insert(businessImages)
      .values({ businessId, contentType: file.type, data: buffer })
      .returning({ id: businessImages.id });
    ids.push(row.id);
  }
  return ids;
}

// ---------- Profile ----------
export async function updateBusinessProfileAction(formData: FormData) {
  const session = await requireBusiness();

  const businessName = String(formData.get("businessName") ?? "").trim();
  const ownerName = String(formData.get("ownerName") ?? "").trim() || null;
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").replace(/[^0-9]/g, "");
  const instagramHandle = String(formData.get("instagramHandle") ?? "").trim() || null;
  const tiktokHandle = String(formData.get("tiktokHandle") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!businessName || !whatsappNumber) {
    throw new Error("Business name and WhatsApp number are required.");
  }

  const updates: Partial<typeof businesses.$inferInsert> = {
    businessName,
    ownerName,
    whatsappNumber,
    instagramHandle,
    tiktokHandle,
    location,
    description,
  };

  const logoIds = await storeUploadedImages(formData, "logo", session.businessId);
  if (logoIds.length > 0) {
    updates.logoImageId = logoIds[0];
  }

  await db.update(businesses).set(updates).where(eq(businesses.id, session.businessId));

  revalidatePath("/business/dashboard");
  revalidatePath("/businesses");
}

// ---------- Products ----------
export async function upsertBusinessProductAction(formData: FormData) {
  const session = await requireBusiness();

  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const priceRaw = String(formData.get("priceTzs") ?? "").trim();
  const priceTzs = priceRaw ? priceRaw : null;
  const isHidden = formData.get("isHidden") === "on";

  if (!name) throw new Error("Product name is required.");

  // Ownership check on edit.
  let existingImageIds: number[] = [];
  if (id) {
    const existing = await db.query.businessProducts.findFirst({ where: eq(businessProducts.id, id) });
    if (!existing || existing.businessId !== session.businessId) {
      throw new Error("Product not found.");
    }
    existingImageIds = existing.imageIds;
  }

  // Images the merchant chose to keep (hidden inputs), minus any they removed.
  const keepIds = formData
    .getAll("keepImageIds")
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n));
  const kept = id ? existingImageIds.filter((imgId) => keepIds.includes(imgId)) : [];

  const room = MAX_IMAGES_PER_PRODUCT - kept.length;
  const newIds = room > 0 ? await storeUploadedImages(formData, "images", session.businessId) : [];
  const imageIds = [...kept, ...newIds].slice(0, MAX_IMAGES_PER_PRODUCT);

  // Clean up any images the merchant removed from this edit so they don't
  // linger in storage forever.
  const removedIds = existingImageIds.filter((imgId) => !imageIds.includes(imgId));
  if (removedIds.length > 0) {
    await db.delete(businessImages).where(inArray(businessImages.id, removedIds));
  }

  const values = {
    businessId: session.businessId,
    name,
    description,
    priceTzs,
    imageIds,
    isHidden,
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(businessProducts).set(values).where(eq(businessProducts.id, id));
  } else {
    await db.insert(businessProducts).values(values);
  }

  revalidatePath("/business/dashboard");
  revalidatePath("/businesses");
  redirect("/business/dashboard");
}

export async function deleteBusinessProductAction(formData: FormData) {
  const session = await requireBusiness();
  const id = Number(formData.get("id"));

  const existing = await db.query.businessProducts.findFirst({ where: eq(businessProducts.id, id) });
  if (!existing || existing.businessId !== session.businessId) {
    throw new Error("Product not found.");
  }

  if (existing.imageIds.length > 0) {
    await db.delete(businessImages).where(inArray(businessImages.id, existing.imageIds));
  }
  await db.delete(businessProducts).where(eq(businessProducts.id, id));

  revalidatePath("/business/dashboard");
  revalidatePath("/businesses");
}

export async function toggleBusinessProductHiddenAction(formData: FormData) {
  const session = await requireBusiness();
  const id = Number(formData.get("id"));
  const hidden = formData.get("hidden") === "true";

  const existing = await db.query.businessProducts.findFirst({ where: eq(businessProducts.id, id) });
  if (!existing || existing.businessId !== session.businessId) {
    throw new Error("Product not found.");
  }

  await db.update(businessProducts).set({ isHidden: hidden, updatedAt: new Date() }).where(eq(businessProducts.id, id));
  revalidatePath("/business/dashboard");
  revalidatePath("/businesses");
}

// ---------- Ad requests ----------
export async function createAdRequestAction(formData: FormData) {
  const session = await requireBusiness();
  const details = String(formData.get("details") ?? "").trim();
  if (!details) throw new Error("Tell us what you'd like the ad to promote.");

  await db.insert(adRequests).values({
    businessId: session.businessId,
    details,
  });

  revalidatePath("/business/dashboard");
}

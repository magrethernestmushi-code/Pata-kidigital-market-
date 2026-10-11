"use server";

import { db } from "@/db";
import {
  products,
  categories,
  suppliers,
  orders,
  orderItems,
  enquiries,
  settings,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authorized.");
  return session;
}

// ---------- Categories ----------
export async function upsertCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const name = String(formData.get("name") ?? "").trim();
  const nameSw = String(formData.get("nameSw") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!name) throw new Error("Category name is required.");
  const slug = slugify(name);

  if (id) {
    await db
      .update(categories)
      .set({ name, nameSw, description, imageUrl, sortOrder, slug })
      .where(eq(categories.id, id));
  } else {
    await db.insert(categories).values({ name, nameSw, description, imageUrl, sortOrder, slug });
  }
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
}

// ---------- Suppliers ----------
export async function upsertSupplierAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const name = String(formData.get("name") ?? "").trim();
  const contactPhone = String(formData.get("contactPhone") ?? "").trim() || null;
  const contactEmail = String(formData.get("contactEmail") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const commissionRate = String(formData.get("commissionRate") ?? "15");
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const active = formData.get("active") === "on";

  if (!name) throw new Error("Supplier name is required.");

  if (id) {
    await db
      .update(suppliers)
      .set({ name, contactPhone, contactEmail, location, commissionRate, notes, active })
      .where(eq(suppliers.id, id));
  } else {
    await db.insert(suppliers).values({ name, contactPhone, contactEmail, location, commissionRate, notes, active });
  }
  revalidatePath("/admin/suppliers");
}

export async function recordSupplierSettlementAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const amount = parseFloat(String(formData.get("amount") ?? "0"));
  if (!amount || amount <= 0) throw new Error("Enter a valid settlement amount.");

  await db
    .update(suppliers)
    .set({ amountOwed: sql`GREATEST(${suppliers.amountOwed} - ${amount}, 0)` })
    .where(eq(suppliers.id, id));
  revalidatePath("/admin/suppliers");
}

// ---------- Products ----------
export async function upsertProductAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = Number(formData.get("categoryId"));
  const supplierId = formData.get("supplierId") ? Number(formData.get("supplierId")) : null;
  const priceTzs = String(formData.get("priceTzs") ?? "0");
  const costTzs = formData.get("costTzs") ? String(formData.get("costTzs")) : null;
  const stockStatus = String(formData.get("stockStatus") ?? "unconfirmed") as
    | "in_stock"
    | "limited"
    | "out_of_stock"
    | "unconfirmed";
  const stockQty = Number(formData.get("stockQty") ?? 0);
  const isDemo = formData.get("isDemo") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const isNewArrival = formData.get("isNewArrival") === "on";
  const isHidden = formData.get("isHidden") === "on";
  const imagesRaw = String(formData.get("images") ?? "");
  const images = imagesRaw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const variationsRaw = String(formData.get("variations") ?? "").trim();
  let variations: { type: string; options: string[] }[] = [];
  if (variationsRaw) {
    try {
      variations = JSON.parse(variationsRaw);
    } catch {
      // Fallback simple format: "Size: S,M,L\nColor: Red,Blue"
      variations = variationsRaw
        .split(/\r?\n/)
        .map((line) => {
          const [type, opts] = line.split(":");
          return {
            type: (type ?? "").trim(),
            options: (opts ?? "").split(",").map((o) => o.trim()).filter(Boolean),
          };
        })
        .filter((v) => v.type && v.options.length > 0);
    }
  }
  const returnPolicy = String(formData.get("returnPolicy") ?? "").trim() || null;
  const warrantyInfo = String(formData.get("warrantyInfo") ?? "").trim() || null;
  const deliveryEstimate = String(formData.get("deliveryEstimate") ?? "").trim() || null;

  if (!name || !description || !categoryId || !priceTzs) {
    throw new Error("Name, description, category and price are required.");
  }

  const values = {
    name,
    description,
    categoryId,
    supplierId,
    priceTzs,
    costTzs,
    stockStatus,
    stockQty,
    isDemo,
    isFeatured,
    isNewArrival,
    isHidden,
    images,
    variations,
    returnPolicy,
    warrantyInfo,
    deliveryEstimate,
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(products).set(values).where(eq(products.id, id));
  } else {
    const slug = slugify(name);
    const sku = `PKD-${Date.now().toString(36).toUpperCase()}`;
    await db.insert(products).values({ ...values, slug, sku });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function toggleProductHiddenAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const hidden = formData.get("hidden") === "true";
  await db.update(products).set({ isHidden: hidden, updatedAt: new Date() }).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
}

// ---------- Orders ----------
const COMMISSION_STATUSES_THAT_OWE_SUPPLIER = ["payment_confirmed", "preparing_order", "out_for_delivery", "completed"];

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  const paymentStatus = String(formData.get("paymentStatus"));
  const deliveryFeeTzs = String(formData.get("deliveryFeeTzs") ?? "0");
  const adminNotes = String(formData.get("adminNotes") ?? "").trim() || null;

  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  if (!order) throw new Error("Order not found.");

  const subtotal = parseFloat(order.subtotalTzs);
  const fee = parseFloat(deliveryFeeTzs) || 0;
  const total = subtotal + fee;

  const wasSettlable = COMMISSION_STATUSES_THAT_OWE_SUPPLIER.includes(order.status);
  const nowSettlable = COMMISSION_STATUSES_THAT_OWE_SUPPLIER.includes(status);

  await db
    .update(orders)
    .set({
      status: status as typeof orders.$inferSelect.status,
      paymentStatus: paymentStatus as typeof orders.$inferSelect.paymentStatus,
      deliveryFeeTzs: String(fee),
      totalTzs: String(total),
      adminNotes,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id));

  // When an order newly becomes settlable, credit suppliers their share (line total minus commission).
  if (nowSettlable && !wasSettlable) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    for (const item of items) {
      if (!item.supplierId) continue;
      const lineTotal = parseFloat(item.lineTotalTzs);
      const commission = item.commissionTzs ? parseFloat(item.commissionTzs) : 0;
      const supplierShare = lineTotal - commission;
      await db
        .update(suppliers)
        .set({ amountOwed: sql`${suppliers.amountOwed} + ${supplierShare}` })
        .where(eq(suppliers.id, item.supplierId));
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/suppliers");
}

// ---------- Enquiries ----------
export async function resolveEnquiryAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const resolved = formData.get("resolved") === "true";
  await db.update(enquiries).set({ resolved }).where(eq(enquiries.id, id));
  revalidatePath("/admin/enquiries");
}

// ---------- Settings ----------
export async function updateSettingsAction(formData: FormData) {
  await requireAdmin();
  const whatsappNumber = String(formData.get("whatsapp_number") ?? "").replace(/[^0-9]/g, "");
  const businessName = String(formData.get("business_name") ?? "").trim();
  const businessEmail = String(formData.get("business_email") ?? "").trim();
  const defaultDeliveryFee = String(formData.get("default_delivery_fee") ?? "0");

  if (!whatsappNumber) throw new Error("WhatsApp number is required.");

  const entries: [string, string][] = [
    ["whatsapp_number", whatsappNumber],
    ["business_name", businessName],
    ["business_email", businessEmail],
    ["default_delivery_fee", defaultDeliveryFee],
  ];

  for (const [key, value] of entries) {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

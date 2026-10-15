import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems, products, suppliers } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { generateOrderReference } from "@/lib/orders";

const itemSchema = z.object({
  productId: z.number().int().positive(),
  variation: z.string().nullable().optional(),
  quantity: z.number().int().positive().max(50),
});

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(7).max(40),
  university: z.string().trim().min(2).max(160),
  deliveryLocation: z.string().trim().min(2).max(220),
  deliveryInstructions: z.string().trim().max(500).optional().nullable(),
  preferredPayment: z.string().trim().min(2).max(60),
  deliveryLat: z.number().min(-90).max(90).optional().nullable(),
  deliveryLng: z.number().min(-180).max(180).optional().nullable(),
  items: z.array(itemSchema).min(1).max(40),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Fetch authoritative, current product data server-side (never trust client prices).
  const productIds = [...new Set(data.items.map((i) => i.productId))];
  const dbProducts = await db.select().from(products).where(inArray(products.id, productIds));
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  const supplierIds = [...new Set(dbProducts.map((p) => p.supplierId).filter((id): id is number => id !== null))];
  const dbSuppliers = supplierIds.length
    ? await db.select().from(suppliers).where(inArray(suppliers.id, supplierIds))
    : [];
  const supplierMap = new Map(dbSuppliers.map((s) => [s.id, s]));

  let subtotal = 0;
  const itemsToInsert: {
    productId: number;
    supplierId: number | null;
    productName: string;
    variation: string | null;
    unitPriceTzs: string;
    quantity: number;
    lineTotalTzs: string;
    commissionRate: string | null;
    commissionTzs: string | null;
  }[] = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product || product.isHidden) {
      return NextResponse.json(
        { error: `One of the items in your cart is no longer available. Please refresh your cart.` },
        { status: 409 }
      );
    }
    const unitPrice = parseFloat(product.priceTzs);
    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;

    const supplier = product.supplierId ? supplierMap.get(product.supplierId) : undefined;
    const commissionRate = supplier ? parseFloat(supplier.commissionRate) : null;
    const commissionTzs = commissionRate !== null ? (lineTotal * commissionRate) / 100 : null;

    itemsToInsert.push({
      productId: product.id,
      supplierId: product.supplierId,
      productName: product.name,
      variation: item.variation ?? null,
      unitPriceTzs: String(unitPrice),
      quantity: item.quantity,
      lineTotalTzs: String(lineTotal),
      commissionRate: commissionRate !== null ? String(commissionRate) : null,
      commissionTzs: commissionTzs !== null ? String(commissionTzs) : null,
    });
  }

  const reference = generateOrderReference();

  const [order] = await db
    .insert(orders)
    .values({
      reference,
      customerName: data.customerName,
      phone: data.phone,
      university: data.university,
      deliveryLocation: data.deliveryLocation,
      deliveryInstructions: data.deliveryInstructions || null,
      deliveryLat: data.deliveryLat != null ? String(data.deliveryLat) : null,
      deliveryLng: data.deliveryLng != null ? String(data.deliveryLng) : null,
      preferredPayment: data.preferredPayment,
      subtotalTzs: String(subtotal),
      deliveryFeeTzs: "0",
      totalTzs: String(subtotal),
      status: "awaiting_confirmation",
      paymentStatus: "pending",
      source: "cart",
    })
    .returning();

  await db.insert(orderItems).values(
    itemsToInsert.map((i) => ({ ...i, orderId: order.id }))
  );

  return NextResponse.json({ reference: order.reference }, { status: 201 });
}

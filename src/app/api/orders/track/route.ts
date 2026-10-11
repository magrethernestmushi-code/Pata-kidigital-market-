import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";

const schema = z.object({
  reference: z.string().trim().min(3).max(30),
  phone: z.string().trim().min(4).max(40),
});

function normalizePhone(p: string) {
  return p.replace(/[^0-9]/g, "").slice(-9); // compare last 9 digits to tolerate +255/0 prefixes
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide your order reference and phone number." }, { status: 400 });
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.reference, parsed.data.reference.trim().toUpperCase()),
  });

  if (!order || normalizePhone(order.phone) !== normalizePhone(parsed.data.phone)) {
    return NextResponse.json(
      { error: "We couldn't find an order matching that reference and phone number." },
      { status: 404 }
    );
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  return NextResponse.json({
    reference: order.reference,
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotalTzs: order.subtotalTzs,
    deliveryFeeTzs: order.deliveryFeeTzs,
    totalTzs: order.totalTzs,
    createdAt: order.createdAt,
    deliveryLocation: order.deliveryLocation,
    items: items.map((i) => ({
      productName: i.productName,
      variation: i.variation,
      quantity: i.quantity,
      lineTotalTzs: i.lineTotalTzs,
    })),
  });
}

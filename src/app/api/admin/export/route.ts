import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  settings,
  adminUsers,
  suppliers,
  categories,
  products,
  orders,
  orderItems,
  enquiries,
} from "@/db/schema";

// Read-only backup endpoint: dumps every table as JSON so the business owner
// always has an independent copy of their data, regardless of which hosting
// provider or database is in use. Protected by the same secret as the
// bootstrap endpoint (BOOTSTRAP_SECRET env var on the web service).
export async function GET(req: NextRequest) {
  const secret = process.env.BOOTSTRAP_SECRET;
  const provided = req.headers.get("x-bootstrap-secret") ?? req.nextUrl.searchParams.get("secret");

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "BOOTSTRAP_SECRET is not configured on the server." },
      { status: 500 }
    );
  }
  if (!provided || provided !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      settingsRows,
      adminUsersRows,
      suppliersRows,
      categoriesRows,
      productsRows,
      ordersRows,
      orderItemsRows,
      enquiriesRows,
    ] = await Promise.all([
      db.select().from(settings),
      db.select().from(adminUsers),
      db.select().from(suppliers),
      db.select().from(categories),
      db.select().from(products),
      db.select().from(orders),
      db.select().from(orderItems),
      db.select().from(enquiries),
    ]);

    return NextResponse.json({
      ok: true,
      exportedAt: new Date().toISOString(),
      tables: {
        settings: settingsRows,
        adminUsers: adminUsersRows,
        suppliers: suppliersRows,
        categories: categoriesRows,
        products: productsRows,
        orders: ordersRows,
        orderItems: orderItemsRows,
        enquiries: enquiriesRows,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Enums ----------
export const orderStatusEnum = pgEnum("order_status", [
  "awaiting_confirmation",
  "awaiting_payment",
  "payment_confirmed",
  "preparing_order",
  "out_for_delivery",
  "completed",
  "cancelled",
  "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "verified",
  "failed",
  "refunded",
]);

export const stockStatusEnum = pgEnum("stock_status", [
  "in_stock",
  "limited",
  "out_of_stock",
  "unconfirmed", // demo / not yet confirmed by supplier
]);

// ---------- Settings (key/value config, e.g. WhatsApp number) ----------
export const settings = pgTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- Admin users ----------
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 40 }).default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Suppliers ----------
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 40 }),
  contactEmail: varchar("contact_email", { length: 160 }),
  location: varchar("location", { length: 200 }),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 2 })
    .default("15.00")
    .notNull(), // percent marketplace takes
  notes: text("notes"),
  amountOwed: numeric("amount_owed", { precision: 12, scale: 2 })
    .default("0")
    .notNull(), // running balance owed to supplier
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Categories ----------
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  nameSw: varchar("name_sw", { length: 160 }), // Swahili name
  description: text("description"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ---------- Products ----------
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 60 }).notNull().unique(), // product code
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  name: varchar("name", { length: 220 }).notNull(),
  nameSw: varchar("name_sw", { length: 220 }),
  description: text("description").notNull(),
  descriptionSw: text("description_sw"),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  priceTzs: numeric("price_tzs", { precision: 12, scale: 2 }).notNull(),
  costTzs: numeric("cost_tzs", { precision: 12, scale: 2 }), // supplier cost (private)
  images: jsonb("images").$type<string[]>().default([]).notNull(),
  variations: jsonb("variations")
    .$type<{ type: string; options: string[] }[]>()
    .default([])
    .notNull(), // e.g. [{type:"Size", options:["S","M","L"]}]
  stockStatus: stockStatusEnum("stock_status").default("unconfirmed").notNull(),
  stockQty: integer("stock_qty").default(0).notNull(),
  isDemo: boolean("is_demo").default(true).notNull(), // demo content flag
  isFeatured: boolean("is_featured").default(false).notNull(),
  isNewArrival: boolean("is_new_arrival").default(false).notNull(),
  isHidden: boolean("is_hidden").default(false).notNull(),
  returnPolicy: text("return_policy"),
  warrantyInfo: text("warranty_info"),
  deliveryEstimate: varchar("delivery_estimate", { length: 160 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- Orders ----------
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 30 }).notNull().unique(), // e.g. PK-20261010-0001
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  university: varchar("university", { length: 160 }).notNull(),
  deliveryLocation: varchar("delivery_location", { length: 220 }).notNull(),
  deliveryInstructions: text("delivery_instructions"),
  preferredPayment: varchar("preferred_payment", { length: 60 }).notNull(),
  subtotalTzs: numeric("subtotal_tzs", { precision: 12, scale: 2 }).notNull(),
  deliveryFeeTzs: numeric("delivery_fee_tzs", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  totalTzs: numeric("total_tzs", { precision: 12, scale: 2 }).notNull(),
  status: orderStatusEnum("status").default("awaiting_confirmation").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  paymentReference: varchar("payment_reference", { length: 120 }),
  source: varchar("source", { length: 20 }).default("cart").notNull(), // "cart" | "whatsapp"
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- Order items ----------
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id").references(() => products.id),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  productName: varchar("product_name", { length: 220 }).notNull(), // snapshot
  variation: varchar("variation", { length: 120 }),
  unitPriceTzs: numeric("unit_price_tzs", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  lineTotalTzs: numeric("line_total_tzs", { precision: 12, scale: 2 }).notNull(),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }), // snapshot at sale time
  commissionTzs: numeric("commission_tzs", { precision: 12, scale: 2 }), // marketplace earning
  supplierSettledAt: timestamp("supplier_settled_at"),
});

// ---------- Customer enquiries (Contact form) ----------
export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  email: varchar("email", { length: 160 }),
  message: text("message").notNull(),
  resolved: boolean("resolved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Relations ----------
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  supplier: one(suppliers, {
    fields: [orderItems.supplierId],
    references: [suppliers.id],
  }),
}));

import type {
  products,
  categories,
  suppliers,
  orders,
  orderItems,
  businesses,
  businessProducts,
  businessImages,
  adRequests,
} from "@/db/schema";

export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export type Business = typeof businesses.$inferSelect;
export type BusinessProduct = typeof businessProducts.$inferSelect;
export type BusinessImage = typeof businessImages.$inferSelect;
export type AdRequest = typeof adRequests.$inferSelect;

export type ProductWithCategory = Product & { category: Category | null };
export type ProductCardData = Pick<
  Product,
  | "id"
  | "slug"
  | "sku"
  | "name"
  | "priceTzs"
  | "images"
  | "stockStatus"
  | "isDemo"
  | "isFeatured"
  | "isNewArrival"
> & { categoryName?: string | null };

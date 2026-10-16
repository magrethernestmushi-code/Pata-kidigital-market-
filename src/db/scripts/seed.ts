import "dotenv/config";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { categories, products, suppliers, adminUsers, settings } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { slugify } from "@/lib/format";

/**
 * Always-run, idempotent content fixes. Each one matches on the OLD value
 * and is a no-op once applied, so it's safe to run on every deploy even
 * though the one-time demo seed below only ever runs once. This is how a
 * copy/wording change (a rename, a rebrand) reaches a database that was
 * already seeded in the past, without touching anything an admin has since
 * edited themselves through the dashboard.
 */
async function runContentMigrations() {
  // Settings written by the very first seed, before the "Pata Online" rename.
  await db
    .update(settings)
    .set({ value: "Pata Online", updatedAt: new Date() })
    .where(and(eq(settings.key, "business_name"), eq(settings.value, "Pata KiDigital Marketplace")));
  await db
    .update(settings)
    .set({ value: "hello@pataonline.co.tz", updatedAt: new Date() })
    .where(and(eq(settings.key, "business_email"), eq(settings.value, "hello@patakidigital.co.tz")));

  // Category renames away from student-specific wording to general retail
  // categories. Matched by the OLD slug and updated in place (same id), so
  // products already assigned to these categories stay correctly linked.
  await db
    .update(categories)
    .set({ name: "Home & Living Essentials", nameSw: "Mahitaji ya Nyumbani", slug: "home-living-essentials" })
    .where(eq(categories.slug, "room-hostel-essentials"));
  await db
    .update(categories)
    .set({ name: "Stationery & Office Supplies", nameSw: "Vifaa vya Ofisi na Uandishi", slug: "stationery-office-supplies" })
    .where(eq(categories.slug, "student-supplies"));

  // Supplier renames (demo suppliers only).
  await db.update(suppliers).set({ name: "Beauty Hub TZ" }).where(eq(suppliers.name, "Campus Beauty Hub"));
  await db.update(suppliers).set({ name: "Home Essentials Co." }).where(eq(suppliers.name, "Hostel Essentials Co."));

  // Demo product copy: remove campus/hostel/semester wording, matched by
  // the OLD slug since changing the name changes the slug.
  const productCopyMigrations: {
    oldSlug: string;
    name: string;
    slug: string;
    description: string;
  }[] = [
    {
      oldSlug: "matte-liquid-lipstick-set-3-pack",
      name: "Matte Liquid Lipstick Set (3-pack)",
      slug: "matte-liquid-lipstick-set-3-pack",
      description:
        "Long-lasting matte liquid lipstick trio in versatile everyday shades. Lightweight formula that doesn't dry out your lips.",
    },
    {
      oldSlug: "campus-tote-backpack",
      name: "Canvas Tote Backpack",
      slug: "canvas-tote-backpack",
      description: "Durable canvas backpack with laptop sleeve, built for daily commuting and everyday use.",
    },
    {
      oldSlug: "classic-denim-jacket",
      name: "Classic Denim Jacket",
      slug: "classic-denim-jacket",
      description: "Unisex denim jacket, a wardrobe staple that pairs with anything.",
    },
    {
      oldSlug: "everyday-canvas-sneakers",
      name: "Everyday Canvas Sneakers",
      slug: "everyday-canvas-sneakers",
      description: "Lightweight canvas sneakers for all-day comfort, wherever you're headed.",
    },
    {
      oldSlug: "wireless-earbuds-bluetooth-5-3",
      name: "Wireless Earbuds (Bluetooth 5.3)",
      slug: "wireless-earbuds-bluetooth-5-3",
      description: "Compact true-wireless earbuds with charging case — great for calls, music and daily use.",
    },
    {
      oldSlug: "hostel-starter-bedding-set",
      name: "Starter Bedding Set",
      slug: "starter-bedding-set",
      description: "Complete bedding set with sheet, pillowcase and light duvet — sized for standard single beds.",
    },
    {
      oldSlug: "a4-notebook-stationery-bundle",
      name: "A4 Notebook & Stationery Bundle",
      slug: "a4-notebook-stationery-bundle",
      description:
        "Five A4 ruled notebooks plus pens, highlighters and sticky notes — everything for school, work or home office.",
    },
  ];
  for (const m of productCopyMigrations) {
    await db
      .update(products)
      .set({ name: m.name, slug: m.slug, description: m.description, updatedAt: new Date() })
      .where(eq(products.slug, m.oldSlug));
  }
  await db
    .update(products)
    .set({ deliveryEstimate: "Same day to next day within Dar es Salaam." })
    .where(eq(products.deliveryEstimate, "Same day to next day within Dar es Salaam campuses."));
}

async function main() {
  await runContentMigrations();

  // Safe to run on every deploy: if the demo admin already exists, the
  // database has already been seeded once, so skip re-inserting suppliers
  // (which have no unique constraint and would otherwise duplicate).
  const [existingAdmin] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, "admin@pataonline.co.tz"))
    .limit(1);

  if (existingAdmin) {
    console.log("Demo data already seeded — content migrations re-checked, nothing else to do.");
    process.exit(0);
  }

  // Migration path from the brand's previous name: if the admin account
  // was created before the rename (its email still ends in
  // @patakidigital.co.tz), rename it in place instead of creating a
  // second admin — the password and user id are kept unchanged.
  const [legacyAdmin] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, "admin@patakidigital.co.tz"))
    .limit(1);

  if (legacyAdmin) {
    await db
      .update(adminUsers)
      .set({ email: "admin@pataonline.co.tz", name: "Pata Online Admin" })
      .where(eq(adminUsers.id, legacyAdmin.id));
    console.log(
      "Renamed existing admin login from admin@patakidigital.co.tz to admin@pataonline.co.tz (same password)."
    );
    process.exit(0);
  }

  console.log("Seeding Pata Online demo data...");

  // --- Settings ---
  await db
    .insert(settings)
    .values([
      { key: "whatsapp_number", value: process.env.WHATSAPP_NUMBER ?? "255700000000" },
      { key: "business_name", value: "Pata Online" },
      { key: "business_email", value: "hello@pataonline.co.tz" },
      { key: "default_delivery_fee", value: "3000" },
    ])
    .onConflictDoNothing();

  // --- Admin user ---
  const adminEmail = "admin@pataonline.co.tz";
  const adminPasswordHash = await hashPassword("ChangeMe123!");
  await db
    .insert(adminUsers)
    .values({
      name: "Pata Online Admin",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: "admin",
    })
    .onConflictDoNothing();
  console.log(`Admin login -> email: ${adminEmail}  password: ChangeMe123!  (change this immediately)`);

  // --- Categories ---
  const catData = [
    { name: "Beauty & Personal Care", nameSw: "Urembo na Utunzaji wa Mwili", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=70" },
    { name: "Fashion & Accessories", nameSw: "Mitindo na Vifaa", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=70" },
    { name: "Clothing & Footwear", nameSw: "Mavazi na Viatu", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=70" },
    { name: "Electronics & Gadgets", nameSw: "Elektroniki na Vifaa", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=70" },
    { name: "Home & Living Essentials", nameSw: "Mahitaji ya Nyumbani", img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=70" },
    { name: "Stationery & Office Supplies", nameSw: "Vifaa vya Ofisi na Uandishi", img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=70" },
  ];

  const insertedCats = [];
  for (let i = 0; i < catData.length; i++) {
    const c = catData[i];
    const [row] = await db
      .insert(categories)
      .values({
        slug: slugify(c.name),
        name: c.name,
        nameSw: c.nameSw,
        imageUrl: c.img,
        sortOrder: i,
      })
      .onConflictDoUpdate({
        target: categories.slug,
        set: { name: c.name, nameSw: c.nameSw, imageUrl: c.img, sortOrder: i },
      })
      .returning();
    insertedCats.push(row);
  }

  // --- Suppliers ---
  const supplierData = [
    { name: "Beauty Hub TZ", phone: "255712000001", location: "Mlimani City, Dar es Salaam", rate: "15.00" },
    { name: "UrbanWear TZ", phone: "255712000002", location: "Kariakoo, Dar es Salaam", rate: "18.00" },
    { name: "TechSpot Dar", phone: "255712000003", location: "Kinondoni, Dar es Salaam", rate: "12.00" },
    { name: "Home Essentials Co.", phone: "255712000004", location: "Ubungo, Dar es Salaam", rate: "15.00" },
  ];
  const insertedSuppliers = [];
  for (const s of supplierData) {
    const [row] = await db
      .insert(suppliers)
      .values({
        name: s.name,
        contactPhone: s.phone,
        location: s.location,
        commissionRate: s.rate,
      })
      .returning();
    insertedSuppliers.push(row);
  }

  // --- Products (clearly marked as demo until real suppliers are confirmed) ---
  type Seed = {
    name: string;
    cat: number;
    sup: number;
    price: number;
    cost: number;
    desc: string;
    images: string[];
    variations?: { type: string; options: string[] }[];
    featured?: boolean;
    newArrival?: boolean;
    stock: "in_stock" | "limited" | "out_of_stock" | "unconfirmed";
    qty: number;
  };

  const productSeeds: Seed[] = [
    {
      name: "Matte Liquid Lipstick Set (3-pack)",
      cat: 0,
      sup: 0,
      price: 15000,
      cost: 9000,
      desc: "Long-lasting matte liquid lipstick trio in versatile everyday shades. Lightweight formula that doesn't dry out your lips.",
      images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=70"],
      variations: [{ type: "Shade Set", options: ["Everyday Nudes", "Bold Reds", "Berry Tones"] }],
      featured: true,
      stock: "in_stock",
      qty: 24,
    },
    {
      name: "Shea Butter Body Lotion 400ml",
      cat: 0,
      sup: 0,
      price: 9500,
      cost: 6000,
      desc: "Deeply moisturising shea butter lotion for everyday hydration, suited to Dar es Salaam's climate.",
      images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=70"],
      stock: "in_stock",
      qty: 40,
      newArrival: true,
    },
    {
      name: "Canvas Tote Backpack",
      cat: 1,
      sup: 1,
      price: 32000,
      cost: 20000,
      desc: "Durable canvas backpack with laptop sleeve, built for daily commuting and everyday use.",
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=70"],
      variations: [{ type: "Color", options: ["Black", "Olive", "Tan"] }],
      featured: true,
      stock: "in_stock",
      qty: 15,
    },
    {
      name: "Unisex Analog Wrist Watch",
      cat: 1,
      sup: 1,
      price: 21000,
      cost: 13000,
      desc: "Minimalist analog watch with adjustable strap — a simple everyday accessory.",
      images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=70"],
      stock: "limited",
      qty: 6,
    },
    {
      name: "Classic Denim Jacket",
      cat: 2,
      sup: 1,
      price: 45000,
      cost: 28000,
      desc: "Unisex denim jacket, a wardrobe staple that pairs with anything.",
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=70"],
      variations: [{ type: "Size", options: ["S", "M", "L", "XL"] }],
      featured: true,
      newArrival: true,
      stock: "in_stock",
      qty: 18,
    },
    {
      name: "Everyday Canvas Sneakers",
      cat: 2,
      sup: 1,
      price: 38000,
      cost: 24000,
      desc: "Lightweight canvas sneakers for all-day comfort, wherever you're headed.",
      images: ["https://images.unsplash.com/photo-1600185365483-26d7f4e8e8f4?w=800&q=70"],
      variations: [{ type: "Size", options: ["38", "39", "40", "41", "42", "43"] }],
      stock: "in_stock",
      qty: 22,
    },
    {
      name: "Wireless Earbuds (Bluetooth 5.3)",
      cat: 3,
      sup: 2,
      price: 42000,
      cost: 27000,
      desc: "Compact true-wireless earbuds with charging case — great for calls, music and daily use.",
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=70"],
      featured: true,
      stock: "in_stock",
      qty: 30,
    },
    {
      name: "20,000mAh Power Bank",
      cat: 3,
      sup: 2,
      price: 36000,
      cost: 23000,
      desc: "High-capacity power bank with dual USB output, keeps your phone and laptop charged through long days.",
      images: ["https://images.unsplash.com/photo-1609692814859-9931fd51f71a?w=800&q=70"],
      newArrival: true,
      stock: "in_stock",
      qty: 25,
    },
    {
      name: "Phone Ring Light with Tripod",
      cat: 3,
      sup: 2,
      price: 25000,
      cost: 15000,
      desc: "Adjustable ring light and tripod for content creation, presentations and video calls.",
      images: ["https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=70"],
      stock: "unconfirmed",
      qty: 0,
    },
    {
      name: "Starter Bedding Set",
      cat: 4,
      sup: 3,
      price: 48000,
      cost: 30000,
      desc: "Complete bedding set with sheet, pillowcase and light duvet — sized for standard single beds.",
      images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=70"],
      variations: [{ type: "Color", options: ["Grey", "Navy", "Cream"] }],
      featured: true,
      stock: "in_stock",
      qty: 12,
    },
    {
      name: "Compact Study Desk Lamp",
      cat: 4,
      sup: 3,
      price: 18000,
      cost: 11000,
      desc: "USB-rechargeable LED desk lamp with adjustable brightness — ideal for late-night reading.",
      images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=70"],
      newArrival: true,
      stock: "in_stock",
      qty: 20,
    },
    {
      name: "A4 Notebook & Stationery Bundle",
      cat: 5,
      sup: 3,
      price: 12000,
      cost: 7000,
      desc: "Five A4 ruled notebooks plus pens, highlighters and sticky notes — everything for school, work or home office.",
      images: ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=70"],
      stock: "in_stock",
      qty: 50,
    },
  ];

  for (let i = 0; i < productSeeds.length; i++) {
    const p = productSeeds[i];
    const sku = `PKD-${String(i + 1).padStart(4, "0")}`;
    await db
      .insert(products)
      .values({
        sku,
        slug: slugify(p.name),
        name: p.name,
        description: p.desc,
        categoryId: insertedCats[p.cat].id,
        supplierId: insertedSuppliers[p.sup].id,
        priceTzs: String(p.price),
        costTzs: String(p.cost),
        images: p.images,
        variations: p.variations ?? [],
        stockStatus: p.stock,
        stockQty: p.qty,
        isDemo: true,
        isFeatured: !!p.featured,
        isNewArrival: !!p.newArrival,
        returnPolicy: "Items may be returned within 48 hours of delivery if unused and in original packaging.",
        warrantyInfo: p.cat === 3 ? "30-day supplier warranty against manufacturing defects." : null,
        deliveryEstimate: "Same day to next day within Dar es Salaam.",
      })
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: p.name,
          description: p.desc,
          priceTzs: String(p.price),
          images: p.images,
          stockStatus: p.stock,
          stockQty: p.qty,
          updatedAt: new Date(),
        },
      });
  }

  console.log(`Seeded ${insertedCats.length} categories, ${insertedSuppliers.length} suppliers, ${productSeeds.length} products.`);
  console.log("All seeded products are marked isDemo=true and labeled 'Demo' on the storefront until real suppliers confirm stock.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

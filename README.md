# Pata KiDigital Marketplace

**Student life. Sorted.** A mobile-first online marketplace connecting Tanzanian
university students with trusted campus shops and suppliers. Students browse
products, order through the website or WhatsApp, pay through approved payment
methods, and receive orders by boda boda delivery.

## Technical architecture

- **Framework:** Next.js 16 (App Router, TypeScript), deployed as a single
  Node.js web service.
- **Database:** PostgreSQL, accessed via [Drizzle ORM](https://orm.drizzle.team/)
  (chosen over Prisma because Prisma's binary query engine couldn't be fetched
  in this build environment; Drizzle is pure TypeScript/SQL with no native
  binary dependency, and works identically on Render).
- **Styling:** Tailwind CSS v4 with a custom brand theme (deep forest green,
  warm cream, soft amber, charcoal) defined in `src/app/globals.css`.
- **Auth:** Admin dashboard protected by a JWT stored in an httpOnly cookie
  (`src/lib/auth.ts`), with bcrypt-hashed passwords.
- **Cart:** Client-side cart (`src/components/CartProvider.tsx`) persisted to
  `localStorage`, checked out through a server-validated order API route that
  always re-prices items from the database (never trusts client-sent prices).
- **WhatsApp:** `wa.me` click-to-chat links with URL-encoded, pre-filled order
  messages (`src/lib/whatsapp.ts`). The business WhatsApp number is stored as a
  runtime setting (`src/lib/settings.ts`), editable from the admin dashboard,
  not hard-coded.
- **i18n:** All user-facing strings are centralized in `src/i18n/strings.ts`
  with English and Swahili values, ready for a language switcher later.

### Project structure

```
src/
  app/                   Routes (App Router)
    (storefront pages)   /, /shop, /category/[slug], /product/[slug],
                         /cart, /checkout, /order-confirmation/[reference],
                         /track-order, /how-it-works, /about, /contact,
                         /delivery-policy, /returns-refunds,
                         /privacy-policy, /terms
    admin/               /admin/login (public) + /admin/(dashboard)/...
                         (protected: overview, products, categories,
                         suppliers, orders, enquiries, settings)
    api/                 /api/orders, /api/orders/track, /api/enquiries
  components/            Shared UI (ProductCard, CartProvider, admin forms, …)
  db/                    Drizzle schema (schema.ts), client (index.ts),
                         seed script (scripts/seed.ts)
  lib/                   Business logic: auth, orders, products, settings,
                         WhatsApp message building, formatting
  i18n/                  Centralized EN/SW strings
```

### Data model (see `src/db/schema.ts`)

Categories, Suppliers (with commission rate + running amount owed), Products
(price, stock status/qty, variations, demo flag, images), Orders + Order Items
(with order reference, status workflow, payment status, delivery fee tracked
separately from product price, commission snapshot per line item), Admin
Users, Enquiries, and a generic Settings key/value table (business WhatsApp
number, business name/email, default delivery fee).

## Build stages (as delivered)

1. **Stage 1:** Brand design, responsive homepage, categories, search, product
   cards and product detail pages.
2. **Stage 2:** Functional cart, WhatsApp product/cart ordering, contact page,
   delivery information pages.
3. **Stage 3:** Secure admin dashboard — supplier management, stock control,
   order status workflow, order tracking by reference + phone.
4. **Stage 4 (partial, by design):** Payment-provider integration is
   intentionally left as a clearly labelled gap — the schema and order
   workflow already support `payment_status` (pending/verified/failed/
   refunded), transaction references, and supplier settlement records, but no
   real payment gateway is wired up yet. This matches the brief: "Use a
   clearly labelled test mode until live credentials and provider approval
   are configured." Payments are currently recorded as **Cash on Delivery /
   Mobile Money / Bank Transfer preference only**, verified manually by an
   admin in the order detail page — never auto-marked paid from a customer
   message.

## Local development

### Prerequisites

- Node.js 20.9+
- A PostgreSQL database

### Setup

```bash
npm install
cp .env.example .env
# edit .env: set DATABASE_URL, AUTH_SECRET, WHATSAPP_NUMBER

npm run db:push   # create tables from the Drizzle schema
npm run db:seed   # seed demo categories/suppliers/products + an admin user
npm run dev       # http://localhost:3000
```

The seed script prints a demo admin login
(`admin@patakidigital.co.tz` / `ChangeMe123!`) — **change this password
immediately** by creating a new admin user and removing/disabling the seeded
one before going live.

All seeded products are marked `isDemo: true` and show a "Demo" badge on the
storefront until a real admin confirms supplier stock and unmarks them.

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push the Drizzle schema to the database |
| `npm run db:seed` | Seed demo data |

## Deploying to Render

1. Create a Render PostgreSQL instance and a Render Web Service pointing at
   this repository (build command `npm install && npm run build`, start
   command `npm run start`).
2. Set environment variables on the web service:
   - `DATABASE_URL` — the Postgres instance's **internal** connection string
   - `AUTH_SECRET` — a long random string (used to sign admin session cookies)
   - `WHATSAPP_NUMBER` — business WhatsApp number, international format, no
     spaces or `+`
   - `NEXT_PUBLIC_SITE_URL` — the public URL Render assigns to the service
3. After the first deploy, run `npm run db:push` and `npm run db:seed` once
   (via a Render shell or a one-off job) against the production database to
   create tables and seed demo data — or skip seeding and add your own
   categories/products/suppliers directly from `/admin`.
4. Log into `/admin`, change the admin password (create a new admin user via
   direct DB access or extend the admin UI, then remove the seeded one), and
   update the WhatsApp number and business details under **Settings**.

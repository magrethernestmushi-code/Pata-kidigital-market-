import Link from "next/link";
import Logo from "./Logo";
import CartBadge from "./CartBadge";
import SearchForm from "./SearchForm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getSetting } from "@/lib/settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default async function SiteHeader() {
  let cats: { slug: string; name: string }[] = [];
  try {
    cats = await db
      .select({ slug: categories.slug, name: categories.name })
      .from(categories)
      .orderBy(asc(categories.sortOrder))
      .limit(6);
  } catch {
    cats = [];
  }
  const whatsappNumber = await getSetting("whatsapp_number");
  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Hello Pata KiDigital Marketplace, I have a question."
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-forest/10">
      <div className="container-page flex items-center gap-3 py-3">
        <Logo />
        <SearchForm className="hidden sm:block flex-1 max-w-md" />
        <nav className="ml-auto hidden lg:flex items-center gap-5 text-sm font-medium text-charcoal/80">
          <Link href="/shop" className="hover:text-forest transition-colors">
            Shop All
          </Link>
          {cats.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="hover:text-forest transition-colors"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/how-it-works" className="hover:text-forest transition-colors">
            How It Works
          </Link>
        </nav>
        <div className="ml-auto lg:ml-0 flex items-center gap-1">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-full border border-[#25d366]/40 px-3 text-sm font-semibold text-[#128C4A] hover:bg-[#25d366]/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 0 1 7 12.4l-.2.4.7 2.6-2.7-.7-.4.2A8.2 8.2 0 1 1 12 3.8Zm-3.2 4a.8.8 0 0 0-.6.3c-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.5 2 .9 2 .6 2.4.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1l-.4-.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1-.2-.1-1-.3-1.8-1.1-.7-.6-1.1-1.4-1.2-1.6-.1-.2 0-.4.1-.5l.4-.4.2-.4c0-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.3-.4-.5-.4h-.4Z"/>
            </svg>
            WhatsApp
          </a>
          <CartBadge />
        </div>
      </div>
      <div className="sm:hidden border-t border-forest/10 px-4 py-2">
        <SearchForm />
      </div>
    </header>
  );
}

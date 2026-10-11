"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

function NavIcon({ name }: { name: "home" | "explore" | "cart" | "whatsapp" }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", strokeWidth: 1.8 };
  switch (name) {
    case "home":
      return (
        <svg {...common} fill="none" stroke="currentColor">
          <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.5 10v9a1 1 0 0 0 1 1H9.5v-5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V20h3a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "explore":
      return (
        <svg {...common} fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="9" />
          <path d="m15 9-2 6-6 2 2-6 6-2Z" strokeLinejoin="round" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common} fill="none" stroke="currentColor">
          <circle cx="9" cy="21" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="18" cy="21" r="1.2" fill="currentColor" stroke="none" />
          <path d="M2.5 3h2l2.2 11.1a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20 7H5.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 0 1 7 12.4l-.2.4.7 2.6-2.7-.7-.4.2A8.2 8.2 0 1 1 12 3.8Zm-3.2 4a.8.8 0 0 0-.6.3c-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.5 2 .9 2 .6 2.4.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1l-.4-.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1-.2-.1-1-.3-1.8-1.1-.7-.6-1.1-1.4-1.2-1.6-.1-.2 0-.4.1-.5l.4-.4.2-.4c0-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.3-.4-.5-.4h-.4Z"/>
        </svg>
      );
  }
}

export default function BottomNav({ whatsappNumber }: { whatsappNumber: string }) {
  const pathname = usePathname();
  const { itemCount } = useCart();

  if (pathname?.startsWith("/admin")) return null;

  const items = [
    { href: "/", label: "Home", icon: "home" as const },
    { href: "/shop", label: "Explore", icon: "explore" as const },
    { href: "/cart", label: "Cart", icon: "cart" as const, badge: itemCount },
    {
      href: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`,
      label: "WhatsApp",
      icon: "whatsapp" as const,
      external: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white border-t border-forest/10 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const active = !item.external && pathname === item.href;
          const Content = (
            <div
              className={`relative flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium ${
                active ? "text-forest" : "text-charcoal/60"
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
              {"badge" in item && item.badge ? (
                <span className="absolute top-1 right-[28%] flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 text-[10px] font-bold text-forest-dark">
                  {item.badge}
                </span>
              ) : null}
            </div>
          );
          return item.external ? (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
              {Content}
            </a>
          ) : (
            <Link key={item.label} href={item.href}>
              {Content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

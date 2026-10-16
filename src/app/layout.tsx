import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import BottomNav from "@/components/BottomNav";
import { getSetting } from "@/lib/settings";

// Every page reads live data (products, stock, prices, business settings)
// from the database on each request. Without this, Next.js would prerender
// pages once at build time and freeze that snapshot — including the
// WhatsApp number and anything an admin later changes in the dashboard.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Pata Online — Everything you need, delivered.",
    template: "%s | Pata Online",
  },
  description:
    "Pata Online connects customers across Tanzania with trusted local shops. Shop beauty, fashion, electronics and home essentials — order online or via WhatsApp, delivered by boda boda.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Pata Online — Everything you need, delivered.",
    description: "Everything you need, in one place.",
    type: "website",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const whatsappNumber = await getSetting("whatsapp_number");

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <SiteFooter />
          <WhatsAppFloatingButton whatsappNumber={whatsappNumber} />
          <BottomNav whatsappNumber={whatsappNumber} />
        </CartProvider>
      </body>
    </html>
  );
}

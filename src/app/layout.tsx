import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import BottomNav from "@/components/BottomNav";
import { getSetting } from "@/lib/settings";

export const metadata: Metadata = {
  title: {
    default: "Pata KiDigital Marketplace — Student life. Sorted.",
    template: "%s | Pata KiDigital Marketplace",
  },
  description:
    "Pata KiDigital Marketplace connects Tanzanian university students with trusted campus shops. Shop beauty, fashion, electronics and hostel essentials — order online or via WhatsApp, delivered by boda boda.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Pata KiDigital Marketplace — Student life. Sorted.",
    description: "Everything students need, in one place.",
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

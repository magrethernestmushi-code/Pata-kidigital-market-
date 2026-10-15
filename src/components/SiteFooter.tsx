import Link from "next/link";
import Logo from "./Logo";

const policyLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Pata KiDigital" },
  { href: "/contact", label: "Contact & WhatsApp Support" },
  { href: "/delivery-policy", label: "Delivery Policy" },
  { href: "/returns-refunds", label: "Returns & Refunds" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/track-order", label: "Track Order" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-forest text-cream/90 mt-16">
      <div className="container-page py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="[&_span.text-forest]:text-white [&_span]:text-white" />
          <p className="mt-3 text-sm text-cream/70 max-w-xs">
            Student life. Sorted. Everything students need, in one place —
            browse, order and get it delivered to your hostel.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            Policies
          </h3>
          <ul className="space-y-2 text-sm text-cream/70">
            {policyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-amber transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>Dar es Salaam, Tanzania</li>
            <li>hello@patakidigital.co.tz</li>
            <li>
              <Link href="/contact" className="hover:text-amber transition-colors">
                Send us a message
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
            Follow Us
          </h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>Instagram @patakidigital</li>
            <li>TikTok @patakidigital</li>
            <li>Facebook /patakidigital</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-4 text-xs text-cream/60 flex flex-col sm:flex-row gap-2 sm:justify-between">
          <span>© {new Date().getFullYear()} Pata KiDigital Marketplace. All rights reserved.</span>
          <span>Dar es Salaam, Tanzania.</span>
        </div>
      </div>
    </footer>
  );
}

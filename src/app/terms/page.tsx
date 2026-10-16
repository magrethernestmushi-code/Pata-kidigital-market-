import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = { title: "Terms and Conditions" };

export default function TermsPage() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <PageHeading title="Terms and Conditions" />
      <div className="flex flex-col gap-5 text-sm sm:text-base text-charcoal/80">
        <p>
          By using Pata Online, you agree to the following terms.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">About the Marketplace</h2>
        <p>
          Pata Online is a platform connecting customers with
          independent partner shops and suppliers. Products are supplied, priced, and
          fulfilled by these partners, with Pata Online earning a commission on
          completed sales. We do our best to ensure listed information is accurate, but
          availability and pricing are always subject to final confirmation from the
          supplier.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Orders</h2>
        <p>
          Placing an order through the website or WhatsApp is a request to purchase, not an
          automatic confirmation. An order is only confirmed once our team verifies
          availability, final price, and delivery details with you. No order is treated as
          paid based solely on a message or screenshot — payment is verified through our
          official payment process.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Pricing</h2>
        <p>
          All prices are listed in Tanzanian Shillings (TZS) and exclude delivery fees
          unless stated. We do not use fake discounts, fabricated stock numbers, or
          misleading trust badges.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">User Conduct</h2>
        <p>
          You agree to provide accurate information when placing an order and to use the
          marketplace only for lawful purposes.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Limitation of Liability</h2>
        <p>
          Pata Online facilitates transactions between customers and partner
          suppliers. While we vet our partners, we are not the manufacturer of most listed
          products and our liability is limited to the value of the relevant order.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Changes to These Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the marketplace
          after changes constitutes acceptance of the revised terms.
        </p>
      </div>
    </div>
  );
}

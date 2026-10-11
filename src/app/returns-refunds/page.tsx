import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = { title: "Returns & Refunds Policy" };

export default function ReturnsRefundsPage() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <PageHeading title="Returns & Refunds Policy" />
      <div className="flex flex-col gap-5 text-sm sm:text-base text-charcoal/80">
        <p>
          Return and warranty conditions may vary by product and supplier. Specific terms
          for each item are shown on its product page where applicable. The general policy
          below applies unless a product page states otherwise.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Eligibility for Returns</h2>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Items may be returned within 48 hours of delivery.</li>
          <li>Items must be unused, undamaged, and in their original packaging.</li>
          <li>A valid order reference is required for any return or exchange request.</li>
        </ul>
        <h2 className="font-bold text-forest-dark text-lg mt-2">How to Request a Return</h2>
        <p>
          Contact us on WhatsApp with your order reference and reason for the return. Our
          team will confirm eligibility with the supplying partner and advise on next
          steps, including any pickup arrangement.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Refunds</h2>
        <p>
          Approved refunds are processed back through the original payment method once the
          returned item is received and inspected. Refund tracking is recorded against your
          order reference. Processing times may vary depending on the payment provider.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Damaged or Incorrect Items</h2>
        <p>
          If you receive a damaged or incorrect item, contact us within 24 hours of
          delivery with photos where possible. We will coordinate a replacement or refund
          with the supplier.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Non-Returnable Items</h2>
        <p>
          For hygiene reasons, certain beauty and personal care items may not be eligible
          for return once opened. This will be noted on the relevant product page.
        </p>
      </div>
    </div>
  );
}

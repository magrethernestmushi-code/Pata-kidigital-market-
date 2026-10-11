import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = { title: "Delivery Policy" };

export default function DeliveryPolicyPage() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <PageHeading title="Delivery Policy" />
      <div className="flex flex-col gap-5 text-sm sm:text-base text-charcoal/80">
        <p>
          Orders placed on Pata KiDigital Marketplace are delivered within Dar es Salaam
          campuses by boda boda, coordinated between our team and the supplying partner
          shop.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Delivery Cost</h2>
        <p>
          The delivery fee is separate from the product price and is confirmed with you
          directly based on your hostel or delivery location before your order is
          dispatched. It is never automatically added without your confirmation.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Delivery Timing</h2>
        <p>
          Most orders are delivered the same day or within one business day of
          confirmation, depending on supplier stock and rider availability. Estimated
          delivery times shown on product pages are indicative and only given once
          confirmed with the supplier.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Receiving Your Order</h2>
        <p>
          Please ensure your delivery location and phone number are accurate at checkout.
          Our rider or team member will contact you before arrival. If you are unavailable
          at the agreed time, additional delivery charges may apply for a second attempt.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Order Confirmation Required</h2>
        <p>
          No order is dispatched until our team has confirmed product availability, final
          cost, and delivery details with you — whether the order was placed through the
          website or WhatsApp.
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how ordering and delivery works on Pata Online.",
};

const steps = [
  {
    title: "1. Browse or message us",
    body: "Explore products by category, search for something specific, or message us directly on WhatsApp if you'd rather chat with a real person.",
  },
  {
    title: "2. Add to cart or request an order",
    body: "Add items to your cart and checkout with your name, phone, university and delivery location — no account needed. Or send your order details straight on WhatsApp.",
  },
  {
    title: "3. We confirm availability and cost",
    body: "Our team checks stock with the supplier and confirms the final price and delivery fee with you before anything is dispatched. Nothing is charged automatically.",
  },
  {
    title: "4. Pay through an approved method",
    body: "Once confirmed, pay via mobile money, bank transfer, or cash on delivery — whichever is agreed with our team. Payment is only ever verified through our official process.",
  },
  {
    title: "5. Boda boda delivers to your hostel",
    body: "Your order is picked up from the supplier and delivered to your campus or hostel, with delivery cost handled separately from the product price.",
  },
  {
    title: "6. Track your order anytime",
    body: "Use your order reference and phone number to check your order status at any time on our Track Order page.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <PageHeading
        title="How It Works"
        subtitle="From browsing to delivery — here's exactly what happens when you order from Pata Online."
      />
      <div className="flex flex-col gap-6">
        {steps.map((s) => (
          <div key={s.title} className="card p-5">
            <h2 className="font-bold text-forest-dark mb-1.5">{s.title}</h2>
            <p className="text-sm text-charcoal/70">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

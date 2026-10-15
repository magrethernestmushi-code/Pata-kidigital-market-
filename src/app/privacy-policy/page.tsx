import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <PageHeading title="Privacy Policy" />
      <div className="flex flex-col gap-5 text-sm sm:text-base text-charcoal/80">
        <p>
          Pata Online respects your privacy. This policy explains what
          information we collect and how we use it.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Information We Collect</h2>
        <p>
          When you place an order, we collect your name, phone number, university or
          campus, and delivery location. We do not require you to create an account or
          provide unnecessary personal information.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">How We Use Your Information</h2>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>To confirm, process, and deliver your order.</li>
          <li>To contact you about order status, availability, or delivery arrangements.</li>
          <li>To coordinate fulfilment with the relevant supplying partner.</li>
          <li>To respond to enquiries you send through our contact form or WhatsApp.</li>
        </ul>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Sharing of Information</h2>
        <p>
          We share only the information necessary for a supplier to fulfil your order (such
          as product, quantity, and delivery location). We do not sell your personal
          information to third parties.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Payment Information</h2>
        <p>
          Payments are processed through approved payment providers. We do not store full
          payment credentials on our systems.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Data Retention</h2>
        <p>
          Order and enquiry records are retained as needed to resolve disputes, process
          returns, and meet our legal obligations.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Contact Us</h2>
        <p>
          For any privacy-related questions, reach us through our Contact page or
          WhatsApp.
        </p>
      </div>
    </div>
  );
}

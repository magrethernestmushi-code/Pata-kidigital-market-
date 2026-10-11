import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import ContactForm from "@/components/ContactForm";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getSetting } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact & WhatsApp Support",
  description: "Get in touch with Pata KiDigital Marketplace via WhatsApp or our contact form.",
};

export default async function ContactPage() {
  const whatsappNumber = await getSetting("whatsapp_number");
  const businessEmail = await getSetting("business_email");
  const waUrl = buildWhatsAppUrl(whatsappNumber, "Hello Pata KiDigital Marketplace, I have a question.");

  return (
    <div className="container-page py-12 max-w-2xl">
      <PageHeading
        title="Contact & WhatsApp Support"
        subtitle="The fastest way to reach us is WhatsApp. You can also send a message below."
      />

      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full sm:w-fit mb-8">
        Chat with us on WhatsApp
      </a>

      <div className="grid sm:grid-cols-2 gap-4 mb-10 text-sm">
        <div className="card p-4">
          <p className="font-semibold text-forest-dark mb-1">Email</p>
          <p className="text-charcoal/70">{businessEmail}</p>
        </div>
        <div className="card p-4">
          <p className="font-semibold text-forest-dark mb-1">Location</p>
          <p className="text-charcoal/70">Dar es Salaam, Tanzania</p>
        </div>
      </div>

      <h2 className="font-bold text-forest-dark mb-3">Send us a message</h2>
      <ContactForm />
    </div>
  );
}

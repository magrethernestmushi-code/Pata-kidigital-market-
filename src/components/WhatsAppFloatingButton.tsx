"use client";

import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppFloatingButton({ whatsappNumber }: { whatsappNumber: string }) {
  const url = buildWhatsAppUrl(
    whatsappNumber,
    "Hello Pata KiDigital Marketplace, I have a question."
  );
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed z-30 right-4 bottom-20 md:bottom-6 flex h-13 w-13 h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25d366] shadow-lg hover:brightness-95 transition"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 0 1 7 12.4l-.2.4.7 2.6-2.7-.7-.4.2A8.2 8.2 0 1 1 12 3.8Zm-3.2 4a.8.8 0 0 0-.6.3c-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.5 2 .9 2 .6 2.4.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1l-.4-.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1-.2-.1-1-.3-1.8-1.1-.7-.6-1.1-1.4-1.2-1.6-.1-.2 0-.4.1-.5l.4-.4.2-.4c0-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.3-.4-.5-.4h-.4Z"/>
      </svg>
    </a>
  );
}

import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = {
  title: "About Pata Online",
  description: "Learn about Pata Online and our mission to make everyday shopping easy for everyone in Tanzania.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <PageHeading title="About Pata Online" />
      <div className="prose-sm flex flex-col gap-5 text-sm sm:text-base text-charcoal/80">
        <p>
          Pata Online connects customers across Tanzania with
          trusted local shops and suppliers. Our promise is simple:{" "}
          <strong className="text-forest-dark">Everything you need, delivered.</strong>
        </p>
        <p>
          We know everyday life means limited time and limited budgets. That&apos;s why we
          built a marketplace where anyone can browse beauty, fashion, electronics, and
          home essentials in one place — order online or on WhatsApp — and have it
          delivered straight to their door by boda boda.
        </p>
        <p>
          We don&apos;t manufacture or stock every product ourselves. Instead, we partner
          with vetted shops and suppliers who fulfil orders, and we earn a commission on
          completed sales. This means we can offer a wide variety of products while keeping
          prices fair and transparent.
        </p>
        <h2 className="font-bold text-forest-dark text-lg mt-2">Our Commitments</h2>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>We never present demo or unconfirmed listings as guaranteed stock.</li>
          <li>We show clear prices in Tanzanian shillings — no hidden fees.</li>
          <li>We verify payment through official channels, never based on a screenshot alone.</li>
          <li>We protect your personal information and never share it beyond what&apos;s needed to fulfil your order.</li>
        </ul>
        <p>
          Pata Online is based in Dar es Salaam, Tanzania.
        </p>
      </div>
    </div>
  );
}

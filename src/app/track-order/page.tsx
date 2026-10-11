import TrackOrderForm from "@/components/TrackOrderForm";

export const metadata = { title: "Track Your Order" };

export default async function TrackOrderPage({
  searchParams,
}: PageProps<"/track-order">) {
  const sp = await searchParams;
  const reference = typeof sp.reference === "string" ? sp.reference : "";
  const phone = typeof sp.phone === "string" ? sp.phone : "";

  return (
    <div className="container-page py-14 max-w-xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark mb-2 text-center">
        Track Your Order
      </h1>
      <p className="text-sm text-charcoal/60 text-center mb-8">
        Enter your order reference and the phone number you used at checkout.
      </p>
      <TrackOrderForm initialReference={reference} initialPhone={phone} />
    </div>
  );
}

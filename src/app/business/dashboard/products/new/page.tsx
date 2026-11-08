import BusinessProductForm from "@/components/business/BusinessProductForm";

export const metadata = { title: "Add Product · Pata Online Business" };

export default function NewBusinessProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-dark mb-6">Add Product</h1>
      <BusinessProductForm />
    </div>
  );
}

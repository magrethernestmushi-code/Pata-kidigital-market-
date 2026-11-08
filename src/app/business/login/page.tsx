import { redirect } from "next/navigation";
import Link from "next/link";
import { getBusinessSession } from "@/lib/business-auth";
import Logo from "@/components/Logo";
import LoginForm from "./LoginForm";

export const metadata = { title: "Business Login · Pata Online" };

export default async function BusinessLoginPage() {
  const session = await getBusinessSession();
  if (session) redirect("/business/dashboard");

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4">
      <div className="card p-8 w-full max-w-sm">
        <div className="flex justify-center mb-5">
          <Logo />
        </div>
        <h1 className="text-xl font-extrabold text-forest-dark text-center mb-1">
          Business Login
        </h1>
        <p className="text-sm text-charcoal/60 text-center mb-6">
          Manage your listing, products and WhatsApp/Instagram/TikTok details.
        </p>
        <LoginForm />
        <p className="text-sm text-charcoal/60 text-center mt-5">
          New business?{" "}
          <Link href="/business/signup" className="font-semibold text-forest hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}

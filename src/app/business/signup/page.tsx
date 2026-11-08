import { redirect } from "next/navigation";
import Link from "next/link";
import { getBusinessSession } from "@/lib/business-auth";
import Logo from "@/components/Logo";
import SignupForm from "./SignupForm";

export const metadata = { title: "List Your Business · Pata Online" };

export default async function BusinessSignupPage() {
  const session = await getBusinessSession();
  if (session) redirect("/business/dashboard");

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4 py-10">
      <div className="card p-8 w-full max-w-lg">
        <div className="flex justify-center mb-5">
          <Logo />
        </div>
        <h1 className="text-xl font-extrabold text-forest-dark text-center mb-1">
          List Your Business
        </h1>
        <p className="text-sm text-charcoal/60 text-center mb-6">
          Reach students across campus. Free for your first month.
        </p>
        <SignupForm />
        <p className="text-sm text-charcoal/60 text-center mt-5">
          Already have an account?{" "}
          <Link href="/business/login" className="font-semibold text-forest hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

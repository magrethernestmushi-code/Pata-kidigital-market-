import { redirect } from "next/navigation";
import Image from "next/image";
import { getAdminSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4">
      <div className="card p-8 w-full max-w-sm">
        <div className="flex justify-center mb-5">
          <Image
            src="/brand/pata-online-icon.png"
            alt="Pata Online"
            width={56}
            height={46}
            className="h-12 w-auto"
            priority
          />
        </div>
        <h1 className="text-xl font-extrabold text-forest-dark text-center mb-1">
          Admin Dashboard
        </h1>
        <p className="text-sm text-charcoal/60 text-center mb-6">
          Pata Online
        </p>
        <LoginForm />
      </div>
    </div>
  );
}

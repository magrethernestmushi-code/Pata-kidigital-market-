import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { logoutAction } from "../login/actions";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/suppliers", label: "Suppliers" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-forest text-cream p-5 gap-1">
        <div className="flex items-center gap-2 mb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-forest font-extrabold text-sm">
            PK
          </span>
          <span className="font-bold text-white text-sm">Admin</span>
        </div>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-cream/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        ))}
        <div className="mt-auto pt-4 border-t border-white/10">
          <p className="text-xs text-cream/60 mb-2 truncate">{session.email}</p>
          <form action={logoutAction}>
            <button className="text-sm font-semibold text-amber hover:underline">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-20 bg-forest text-white px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-sm">Pata KiDigital Admin</span>
          <form action={logoutAction}>
            <button className="text-xs font-semibold text-amber">Sign Out</button>
          </form>
        </header>
        <nav className="md:hidden flex overflow-x-auto gap-1 bg-white border-b border-forest/10 px-3 py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-forest-dark bg-forest/5 hover:bg-forest/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function ProductFilters({
  categories,
  hideCategoryFilter,
}: {
  categories: { slug: string; name: string }[];
  hideCategoryFilter?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const base = hideCategoryFilter ? pathname : "/shop";
    router.push(`${base}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3 items-center mb-6">
      {!hideCategoryFilter && (
        <select
          value={searchParams.get("category") ?? ""}
          onChange={(e) => setParam("category", e.target.value)}
          className="!w-auto text-sm"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      )}
      <select
        value={searchParams.get("sort") ?? "newest"}
        onChange={(e) => setParam("sort", e.target.value)}
        className="!w-auto text-sm"
        aria-label="Sort products"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}

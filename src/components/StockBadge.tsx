import { strings, t } from "@/i18n/strings";

const COLORS: Record<string, string> = {
  in_stock: "bg-emerald-50 text-emerald-700 border-emerald-200",
  limited: "bg-amber-50 text-amber-800 border-amber-300",
  out_of_stock: "bg-red-50 text-red-700 border-red-200",
  unconfirmed: "bg-stone-100 text-stone-600 border-stone-300",
};

export default function StockBadge({ status }: { status: keyof typeof strings.stock }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${COLORS[status]}`}
    >
      {t(strings.stock[status])}
    </span>
  );
}

import { strings, t } from "@/i18n/strings";

const ACTIVE_FLOW = [
  "awaiting_confirmation",
  "awaiting_payment",
  "payment_confirmed",
  "preparing_order",
  "out_for_delivery",
  "completed",
] as const;

export default function OrderStatusTimeline({ status }: { status: string }) {
  if (status === "cancelled" || status === "refunded") {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
        {t(strings.order.status[status as keyof typeof strings.order.status])}
      </div>
    );
  }

  const currentIndex = ACTIVE_FLOW.indexOf(status as (typeof ACTIVE_FLOW)[number]);

  return (
    <div className="flex flex-col gap-0">
      {ACTIVE_FLOW.map((s, i) => {
        const done = i <= currentIndex;
        const isLast = i === ACTIVE_FLOW.length - 1;
        return (
          <div key={s} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  done ? "bg-forest text-white" : "bg-stone-200 text-stone-500"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              {!isLast && (
                <span className={`w-0.5 flex-1 min-h-5 ${done ? "bg-forest" : "bg-stone-200"}`} />
              )}
            </div>
            <span
              className={`pb-5 text-sm ${
                done ? "font-semibold text-forest-dark" : "text-charcoal/50"
              }`}
            >
              {t(strings.order.status[s])}
            </span>
          </div>
        );
      })}
    </div>
  );
}

import type { Business } from "./types";

export type BusinessStatus = {
  active: boolean;
  label: "Free trial" | "Active subscription" | "Expired" | "Suspended";
  expiresAt: Date | null;
  daysLeft: number | null;
};

/**
 * A business's listing is visible on the public directory while it's within
 * its free trial month, or while a manually-confirmed 30,000 TZS/month
 * subscription hasn't lapsed yet — whichever gives a later expiry.
 */
export function getBusinessStatus(business: Pick<Business, "trialEndsAt" | "subscriptionExpiresAt" | "suspended">): BusinessStatus {
  const now = new Date();

  if (business.suspended) {
    return { active: false, label: "Suspended", expiresAt: null, daysLeft: null };
  }

  const subEnd = business.subscriptionExpiresAt ? new Date(business.subscriptionExpiresAt) : null;
  const trialEnd = new Date(business.trialEndsAt);

  const latestExpiry = subEnd && subEnd > trialEnd ? subEnd : trialEnd;
  const active = now < latestExpiry;
  const daysLeft = active ? Math.ceil((latestExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

  if (!active) {
    return { active: false, label: "Expired", expiresAt: latestExpiry, daysLeft: null };
  }

  const label = subEnd && subEnd > trialEnd ? "Active subscription" : "Free trial";
  return { active: true, label, expiresAt: latestExpiry, daysLeft };
}

"use server";

import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, signBusinessToken, BUSINESS_COOKIE } from "@/lib/business-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const TRIAL_DAYS = 30;

export async function businessSignupAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const businessName = String(formData.get("businessName") ?? "").trim();
  const ownerName = String(formData.get("ownerName") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").replace(/[^0-9]/g, "");
  const instagramHandle = String(formData.get("instagramHandle") ?? "").trim() || null;
  const tiktokHandle = String(formData.get("tiktokHandle") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!businessName || !email || !password || !whatsappNumber) {
    return { error: "Business name, email, password and WhatsApp number are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await db.query.businesses.findFirst({ where: eq(businesses.email, email) });
  if (existing) {
    return { error: "An account with this email already exists. Try logging in instead." };
  }

  const passwordHash = await hashPassword(password);
  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  const [business] = await db
    .insert(businesses)
    .values({
      businessName,
      ownerName,
      email,
      passwordHash,
      whatsappNumber,
      instagramHandle,
      tiktokHandle,
      location,
      description,
      trialEndsAt,
    })
    .returning();

  const token = signBusinessToken({
    businessId: business.id,
    email: business.email,
    businessName: business.businessName,
  });

  const cookieStore = await cookies();
  cookieStore.set(BUSINESS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/business/dashboard?welcome=1");
}

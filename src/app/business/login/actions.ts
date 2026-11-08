"use server";

import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, signBusinessToken, BUSINESS_COOKIE } from "@/lib/business-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function businessLoginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const business = await db.query.businesses.findFirst({ where: eq(businesses.email, email) });
  if (!business) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, business.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

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

  redirect("/business/dashboard");
}

export async function businessLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(BUSINESS_COOKIE);
  redirect("/business/login");
}

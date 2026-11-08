import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SECRET = process.env.AUTH_SECRET ?? "dev-only-insecure-secret-change-me";
export const BUSINESS_COOKIE = "pk_business_session";

export type BusinessSession = {
  businessId: number;
  email: string;
  businessName: string;
};

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signBusinessToken(payload: BusinessSession): string {
  return jwt.sign(payload, SECRET, { expiresIn: "30d" });
}

export function verifyBusinessToken(token: string): BusinessSession | null {
  try {
    return jwt.verify(token, SECRET) as BusinessSession;
  } catch {
    return null;
  }
}

export async function getBusinessSession(): Promise<BusinessSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(BUSINESS_COOKIE)?.value;
  if (!token) return null;
  return verifyBusinessToken(token);
}

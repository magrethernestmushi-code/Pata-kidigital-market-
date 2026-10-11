import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { enquiries } from "@/db/schema";

const schema = z.object({
  name: z.string().trim().min(2).max(160),
  phone: z.string().trim().max(40).optional().nullable(),
  email: z.string().trim().email().max(160).optional().or(z.literal("")).nullable(),
  message: z.string().trim().min(5).max(2000),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
  }
  const { name, phone, email, message } = parsed.data;
  await db.insert(enquiries).values({
    name,
    phone: phone || null,
    email: email || null,
    message,
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

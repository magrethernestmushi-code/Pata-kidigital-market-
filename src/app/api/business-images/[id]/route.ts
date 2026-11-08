import { db } from "@/db";
import { businessImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Serves an uploaded photo straight out of Postgres. Images are stored as
// binary data in the database (not on the web service's local disk, which
// Render wipes on every deploy/restart), so they persist until explicitly
// deleted by the business or an admin.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const imageId = Number(id);
  if (!Number.isInteger(imageId)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const image = await db.query.businessImages.findFirst({
    where: eq(businessImages.id, imageId),
  });
  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

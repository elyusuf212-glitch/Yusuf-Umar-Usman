import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnershipInquirySchema } from "@/lib/validation";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const { ok } = rateLimit(`partnership:${clientKeyFromRequest(request)}`, 5, 15 * 60 * 1000);
  if (!ok) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = partnershipInquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const inquiry = await db.partnershipInquiry.create({ data: parsed.data });
  return NextResponse.json({ inquiry }, { status: 201 });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const { ok } = rateLimit(`contact:${clientKeyFromRequest(request)}`, 5, 15 * 60 * 1000);
  if (!ok) {
    return NextResponse.json({ error: "Too many messages sent. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const message = await db.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ message }, { status: 201 });
}

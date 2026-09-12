import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  authorName: z.string().min(2),
  authorRole: z.string().optional(),
  quote: z.string().min(10),
  storyBody: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const testimonial = await db.testimonial.create({ data: parsed.data });
  return NextResponse.json({ testimonial }, { status: 201 });
}

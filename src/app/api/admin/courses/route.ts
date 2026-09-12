import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(2),
  isPublished: z.boolean().default(false),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const course = await db.course.create({
    data: { ...parsed.data, slug: `${slugify(parsed.data.title)}-${Date.now().toString(36)}`, createdById: session.sub },
  });

  return NextResponse.json({ course }, { status: 201 });
}

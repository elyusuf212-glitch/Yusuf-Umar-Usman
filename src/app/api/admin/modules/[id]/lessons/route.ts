import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(2),
  contentType: z.enum(["VIDEO", "PDF", "ARTICLE", "QUIZ", "ASSIGNMENT"]).default("ARTICLE"),
  contentUrl: z.string().optional(),
  durationMinutes: z.coerce.number().min(0).optional(),
});

export async function POST(request: Request, { params }: RouteContext<"/api/admin/modules/[id]/lessons">) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const order = await db.lesson.count({ where: { moduleId: id } });
  const lesson = await db.lesson.create({ data: { ...parsed.data, moduleId: id, order } });

  return NextResponse.json({ lesson }, { status: 201 });
}

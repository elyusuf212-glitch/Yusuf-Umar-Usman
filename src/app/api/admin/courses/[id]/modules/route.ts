import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({ title: z.string().min(2), description: z.string().optional() });

export async function POST(request: Request, { params }: RouteContext<"/api/admin/courses/[id]/modules">) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const order = await db.courseModule.count({ where: { courseId: id } });
  const courseModule = await db.courseModule.create({ data: { ...parsed.data, courseId: id, order } });

  return NextResponse.json({ module: courseModule }, { status: 201 });
}

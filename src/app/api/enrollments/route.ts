import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({ courseId: z.string() });

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in to enroll in this course." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const course = await db.course.findUnique({ where: { id: parsed.data.courseId } });
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const enrollment = await db.enrollment.upsert({
    where: { userId_courseId: { userId: session.sub, courseId: course.id } },
    create: { userId: session.sub, courseId: course.id, status: "IN_PROGRESS", startedAt: new Date() },
    update: {},
  });

  return NextResponse.json({ enrollment }, { status: 201 });
}

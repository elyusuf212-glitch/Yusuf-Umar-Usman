import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(2),
  body: z.string().min(5),
  audience: z.enum(["ALL", "FELLOWS", "MENTORS", "PROGRAMME", "COHORT"]).default("ALL"),
  cohortId: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requestBody = await request.json().catch(() => null);
  const parsed = schema.safeParse(requestBody);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const announcement = await db.announcement.create({ data: { ...parsed.data, createdById: session.sub } });

  const audienceFilter =
    parsed.data.audience === "FELLOWS"
      ? { fellow: { isNot: null } }
      : parsed.data.audience === "MENTORS"
        ? { mentor: { isNot: null } }
        : {};

  const recipients = await db.user.findMany({ where: audienceFilter, select: { id: true } });
  if (recipients.length) {
    await db.notification.createMany({
      data: recipients.map((r) => ({
        userId: r.id,
        type: "ANNOUNCEMENT" as const,
        title: announcement.title,
        body: announcement.body,
      })),
    });
  }

  return NextResponse.json({ announcement }, { status: 201 });
}

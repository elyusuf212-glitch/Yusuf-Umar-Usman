import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  eventType: z.enum(["TRAINING", "WEBINAR", "LEADERSHIP_CONVERSATION", "NETWORKING", "TOWN_HALL", "COMMUNITY_PROJECT", "MENTORSHIP_SESSION", "CONFERENCE"]),
  mode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
  startAt: z.string().min(1),
  endAt: z.string().optional(),
  location: z.string().optional(),
  onlineLink: z.string().optional(),
  speaker: z.string().optional(),
  capacity: z.coerce.number().min(0).optional(),
  isPublished: z.boolean(),
});

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/events/[id]">) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const { startAt, endAt, ...rest } = parsed.data;
  const event = await db.event.update({
    where: { id },
    data: { ...rest, startAt: new Date(startAt), endAt: endAt ? new Date(endAt) : null },
  });

  return NextResponse.json({ event });
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/admin/events/[id]">) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

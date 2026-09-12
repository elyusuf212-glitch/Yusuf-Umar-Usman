import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

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
  isPublished: z.boolean().default(true),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const { startAt, endAt, ...rest } = parsed.data;
  const event = await db.event.create({
    data: {
      ...rest,
      slug: `${slugify(parsed.data.title)}-${Date.now().toString(36)}`,
      startAt: new Date(startAt),
      endAt: endAt ? new Date(endAt) : undefined,
      createdById: session.sub,
    },
  });

  return NextResponse.json({ event }, { status: 201 });
}

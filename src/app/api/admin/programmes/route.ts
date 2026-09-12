import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  theme: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  applicationDeadline: z.string().optional(),
  location: z.string().optional(),
  deliveryFormat: z.enum(["IN_PERSON", "VIRTUAL", "HYBRID"]).default("HYBRID"),
  eligibility: z.string().optional(),
  slots: z.coerce.number().min(0).default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "OPEN_FOR_APPLICATIONS", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).default("DRAFT"),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const { startDate, endDate, applicationDeadline, ...rest } = parsed.data;
  const slug = slugify(parsed.data.name);

  const programme = await db.programme.create({
    data: {
      ...rest,
      slug,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      createdById: session.sub,
    },
  });

  await db.auditLog.create({
    data: { userId: session.sub, action: "PROGRAMME_CREATED", entityType: "Programme", entityId: programme.id },
  });

  return NextResponse.json({ programme }, { status: 201 });
}

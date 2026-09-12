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
  deliveryFormat: z.enum(["IN_PERSON", "VIRTUAL", "HYBRID"]),
  eligibility: z.string().optional(),
  slots: z.coerce.number().min(0),
  status: z.enum(["DRAFT", "PUBLISHED", "OPEN_FOR_APPLICATIONS", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]),
});

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/programmes/[id]">) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const { startDate, endDate, applicationDeadline, ...rest } = parsed.data;

  const programme = await db.programme.update({
    where: { id },
    data: {
      ...rest,
      slug: slugify(parsed.data.name),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
    },
  });

  await db.auditLog.create({
    data: { userId: session.sub, action: "PROGRAMME_UPDATED", entityType: "Programme", entityId: id },
  });

  return NextResponse.json({ programme });
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/admin/programmes/[id]">) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.programme.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

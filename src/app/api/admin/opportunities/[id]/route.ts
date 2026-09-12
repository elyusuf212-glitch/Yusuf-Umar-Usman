import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(2),
  organisation: z.string().min(2),
  description: z.string().min(10),
  eligibility: z.string().optional(),
  location: z.string().optional(),
  deadline: z.string().optional(),
  applicationUrl: z.string().url(),
  category: z.enum(["JOB", "INTERNSHIP", "SCHOLARSHIP", "FELLOWSHIP", "GRANT", "COMPETITION", "CONFERENCE", "TRAINING", "VOLUNTEERING", "YOUTH_PROGRAMME"]),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
});

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/opportunities/[id]">) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const { deadline, ...rest } = parsed.data;
  const opportunity = await db.opportunity.update({
    where: { id },
    data: { ...rest, deadline: deadline ? new Date(deadline) : null },
  });

  return NextResponse.json({ opportunity });
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/admin/opportunities/[id]">) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.opportunity.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2),
  year: z.coerce.number().min(2000).max(2100),
  status: z.enum(["UPCOMING", "APPLICATIONS_OPEN", "SELECTION", "ACTIVE", "COMPLETED"]).default("UPCOMING"),
  selectionProcess: z.string().optional(),
});

export async function POST(request: Request, { params }: RouteContext<"/api/admin/programmes/[id]/cohorts">) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const cohort = await db.cohort.create({ data: { ...parsed.data, programmeId: id } });
  return NextResponse.json({ cohort }, { status: 201 });
}

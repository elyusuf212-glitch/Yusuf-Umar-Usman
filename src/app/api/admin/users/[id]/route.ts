import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  role: z.enum(["ADMIN", "PROGRAMME_MANAGER", "MENTOR", "FELLOW", "PARTNER", "MEMBER"]).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/users/[id]">) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const user = await db.user.update({ where: { id }, data: parsed.data });

  if (parsed.data.role === "MENTOR") {
    await db.mentor.upsert({ where: { userId: id }, create: { userId: id }, update: {} });
  }
  if (parsed.data.role === "PARTNER") {
    await db.partner.upsert({
      where: { userId: id },
      create: { userId: id, organisationName: user.name, type: "PRIVATE_SECTOR" },
      update: {},
    });
  }

  await db.auditLog.create({
    data: { userId: session.sub, action: "USER_UPDATED", entityType: "User", entityId: id, metadata: parsed.data },
  });

  return NextResponse.json({ user });
}

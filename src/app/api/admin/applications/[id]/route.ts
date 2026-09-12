import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  status: z.enum(["DRAFT", "SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "ACCEPTED", "WAITLISTED", "REJECTED"]).optional(),
  score: z.coerce.number().min(0).max(100).optional(),
  reviewerNotes: z.string().max(4000).optional(),
});

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/applications/[id]">) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const application = await db.application.findUnique({ where: { id }, include: { programme: true } });
  if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });

  const updated = await db.application.update({
    where: { id },
    data: { ...parsed.data, reviewedById: session.sub, reviewedAt: new Date() },
  });

  if (parsed.data.status === "ACCEPTED" && application.cohortId) {
    const existingFellow = await db.fellow.findUnique({ where: { userId: application.userId } });
    if (!existingFellow) {
      const fellowCount = await db.fellow.count();
      const fellowNumber = `CN-${new Date().getFullYear()}-${String(fellowCount + 1).padStart(4, "0")}`;
      await db.$transaction([
        db.fellow.create({
          data: {
            userId: application.userId,
            cohortId: application.cohortId,
            applicationId: application.id,
            fellowNumber,
          },
        }),
        db.user.update({ where: { id: application.userId }, data: { role: "FELLOW" } }),
        db.notification.create({
          data: {
            userId: application.userId,
            type: "APPLICATION_UPDATE",
            title: "Congratulations — you're a CitizensNexus Fellow!",
            body: `Your application to ${application.programme.name} has been accepted. Welcome to the fellowship.`,
          },
        }),
      ]);
    }
  } else if (parsed.data.status && parsed.data.status !== "ACCEPTED") {
    await db.notification.create({
      data: {
        userId: application.userId,
        type: "APPLICATION_UPDATE",
        title: "Application status updated",
        body: `Your application to ${application.programme.name} is now: ${parsed.data.status.replaceAll("_", " ")}.`,
      },
    });
  }

  await db.auditLog.create({
    data: { userId: session.sub, action: "APPLICATION_REVIEWED", entityType: "Application", entityId: id, metadata: parsed.data },
  });

  return NextResponse.json({ application: updated });
}

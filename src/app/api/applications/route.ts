import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { draftApplicationSchema, applicationSchema } from "@/lib/validation";

const bodySchema = z.object({
  programmeId: z.string(),
  action: z.enum(["draft", "submit"]),
  data: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "You must be logged in to apply." }, { status: 401 });
  }

  const raw = await request.json().catch(() => null);
  const parsedBody = bodySchema.safeParse(raw);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { programmeId, action, data } = parsedBody.data;
  const schema = action === "submit" ? applicationSchema : draftApplicationSchema;
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please complete the required fields.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { cohortId, ...rest } = parsed.data;

  const programme = await db.programme.findUnique({ where: { id: programmeId } });
  if (!programme) {
    return NextResponse.json({ error: "Programme not found." }, { status: 404 });
  }

  const application = await db.application.upsert({
    where: { userId_programmeId_cohortId: { userId: session.sub, programmeId, cohortId } },
    create: {
      userId: session.sub,
      programmeId,
      cohortId,
      status: action === "submit" ? "SUBMITTED" : "DRAFT",
      submittedAt: action === "submit" ? new Date() : null,
      ...rest,
    },
    update: {
      ...rest,
      cohortId,
      ...(action === "submit" ? { status: "SUBMITTED", submittedAt: new Date() } : {}),
    },
  });

  if (action === "submit") {
    await db.notification.create({
      data: {
        userId: session.sub,
        type: "APPLICATION_UPDATE",
        title: "Application submitted",
        body: `Your application to ${programme.name} has been submitted and is now under review.`,
      },
    });
    await db.auditLog.create({
      data: { userId: session.sub, action: "APPLICATION_SUBMITTED", entityType: "Application", entityId: application.id },
    });
  }

  return NextResponse.json({ application });
}

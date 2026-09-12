import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  fellowId: z.string(),
  signatoryName: z.string().optional(),
  signatoryTitle: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const fellow = await db.fellow.findUnique({ where: { id: parsed.data.fellowId }, include: { cohort: { include: { programme: true } } } });
  if (!fellow) return NextResponse.json({ error: "Fellow not found." }, { status: 404 });

  const certificateCode = `CN-${fellow.cohort.year}-${nanoid(8).toUpperCase()}`;

  const [certificate] = await db.$transaction([
    db.certificate.create({
      data: {
        certificateCode,
        userId: fellow.userId,
        fellowId: fellow.id,
        programmeId: fellow.cohort.programmeId,
        cohortId: fellow.cohortId,
        programmeName: fellow.cohort.programme.name,
        signatoryName: parsed.data.signatoryName || "Programme Director",
        signatoryTitle: parsed.data.signatoryTitle || "CitizensNexus",
      },
    }),
    db.fellow.update({ where: { id: fellow.id }, data: { status: "GRADUATED", completedAt: new Date(), progressPercent: 100 } }),
    db.notification.create({
      data: {
        userId: fellow.userId,
        type: "CERTIFICATE",
        title: "Your certificate is ready!",
        body: `Congratulations on completing ${fellow.cohort.programme.name}. Your certificate (${certificateCode}) is now available.`,
      },
    }),
  ]);

  return NextResponse.json({ certificate }, { status: 201 });
}

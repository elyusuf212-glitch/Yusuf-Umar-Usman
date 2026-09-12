import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  mentorAssignmentId: z.string(),
  scheduledAt: z.string().min(1),
  durationMinutes: z.coerce.number().min(10).max(240).default(45),
  mentorNotes: z.string().max(4000).optional(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).default("SCHEDULED"),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "MENTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const mentor = await db.mentor.findUnique({ where: { userId: session.sub } });
  const assignment = await db.mentorAssignment.findUnique({ where: { id: parsed.data.mentorAssignmentId } });

  if (!mentor || !assignment || assignment.mentorId !== mentor.id) {
    return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
  }

  const mentorSession = await db.mentorSession.create({
    data: {
      mentorAssignmentId: assignment.id,
      scheduledAt: new Date(parsed.data.scheduledAt),
      durationMinutes: parsed.data.durationMinutes,
      mentorNotes: parsed.data.mentorNotes,
      status: parsed.data.status,
    },
  });

  return NextResponse.json({ session: mentorSession }, { status: 201 });
}

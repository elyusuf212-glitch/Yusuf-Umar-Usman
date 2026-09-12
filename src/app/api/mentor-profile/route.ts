import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  title: z.string().max(200).optional(),
  organisation: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  yearsExperience: z.coerce.number().min(0).max(80).optional(),
  linkedin: z.string().max(300).optional(),
  expertiseAreas: z.array(z.string()).optional(),
  mentorshipAreas: z.array(z.string()).optional(),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "MENTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  await db.mentor.update({ where: { userId: session.sub }, data: parsed.data });
  return NextResponse.json({ ok: true });
}

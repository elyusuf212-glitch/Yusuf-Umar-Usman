import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  phone: z.string().max(30).optional(),
  bio: z.string().max(2000).optional(),
  headline: z.string().max(200).optional(),
  location: z.string().max(120).optional(),
  state: z.string().max(120).optional(),
  education: z.string().max(200).optional(),
  institution: z.string().max(200).optional(),
  linkedin: z.string().max(300).optional(),
  twitter: z.string().max(300).optional(),
  website: z.string().max(300).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { name, phone, ...profileFields } = parsed.data;

  await db.$transaction([
    db.user.update({
      where: { id: session.sub },
      data: { ...(name ? { name } : {}), ...(phone ? { phone } : {}) },
    }),
    db.profile.upsert({
      where: { userId: session.sub },
      create: { userId: session.sub, ...profileFields },
      update: profileFields,
    }),
  ]);

  return NextResponse.json({ ok: true });
}

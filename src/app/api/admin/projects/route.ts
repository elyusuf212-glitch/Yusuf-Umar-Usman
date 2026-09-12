import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  problem: z.string().optional(),
  solution: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["PROPOSED", "ONGOING", "COMPLETED"]).default("ONGOING"),
  year: z.coerce.number().min(2000).max(2100),
  impactSummary: z.string().optional(),
  sdgNumbers: z.array(z.coerce.number()).default([]),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const { sdgNumbers, ...rest } = parsed.data;
  const sdgs = sdgNumbers.length ? await db.sdg.findMany({ where: { number: { in: sdgNumbers } } }) : [];

  const project = await db.project.create({
    data: {
      ...rest,
      slug: `${slugify(parsed.data.title)}-${Date.now().toString(36)}`,
      createdById: session.sub,
      sdgs: { create: sdgs.map((s) => ({ sdgId: s.id })) },
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}

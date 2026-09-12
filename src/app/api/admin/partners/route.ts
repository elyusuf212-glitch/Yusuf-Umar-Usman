import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  organisationName: z.string().min(2),
  type: z.enum(["NGO", "GOVERNMENT", "PRIVATE_SECTOR", "UNIVERSITY", "DEVELOPMENT_ORG", "MULTILATERAL"]),
  website: z.string().optional(),
  description: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const partner = await db.partner.create({ data: { ...parsed.data, isApproved: true } });
  return NextResponse.json({ partner }, { status: 201 });
}

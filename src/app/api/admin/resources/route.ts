import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.string().optional(),
  resourceType: z.enum(["PDF", "LINK", "TEMPLATE", "GUIDE", "VIDEO"]).default("LINK"),
  fileUrl: z.string().url(),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const resource = await db.resource.create({ data: { ...parsed.data, uploadedById: session.sub } });
  return NextResponse.json({ resource }, { status: 201 });
}

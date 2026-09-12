import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  stats: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).length(4),
});

export async function PATCH(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const setting = await db.siteSetting.upsert({
    where: { key: "impact_stats" },
    create: { key: "impact_stats", value: parsed.data.stats },
    update: { value: parsed.data.stats },
  });

  return NextResponse.json({ setting });
}

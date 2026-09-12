import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(2),
  organisation: z.string().min(2),
  description: z.string().min(10),
  eligibility: z.string().optional(),
  location: z.string().optional(),
  deadline: z.string().optional(),
  applicationUrl: z.string().url(),
  category: z.enum(["JOB", "INTERNSHIP", "SCHOLARSHIP", "FELLOWSHIP", "GRANT", "COMPETITION", "CONFERENCE", "TRAINING", "VOLUNTEERING", "YOUTH_PROGRAMME"]),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const { deadline, ...rest } = parsed.data;
  const opportunity = await db.opportunity.create({
    data: {
      ...rest,
      slug: `${slugify(parsed.data.title)}-${Date.now().toString(36)}`,
      deadline: deadline ? new Date(deadline) : undefined,
      postedById: session.sub,
    },
  });

  return NextResponse.json({ opportunity }, { status: 201 });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const applications = await db.application.findMany({
    include: { user: true, programme: true, cohort: true },
    orderBy: { createdAt: "desc" },
  });

  const header = ["Applicant Name", "Email", "Programme", "Cohort", "Status", "Score", "Submitted At", "Created At"];
  const rows = applications.map((a) => [
    a.user.name,
    a.user.email,
    a.programme.name,
    a.cohort?.name ?? "",
    a.status,
    a.score ?? "",
    a.submittedAt?.toISOString() ?? "",
    a.createdAt.toISOString(),
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="citizensnexus-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

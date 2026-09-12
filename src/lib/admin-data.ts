import { db } from "@/lib/db";

export async function getAdminOverviewStats() {
  const [
    totalUsers,
    activeFellows,
    mentors,
    applications,
    programmes,
    events,
    courses,
    projects,
    opportunities,
    partners,
  ] = await Promise.all([
    db.user.count(),
    db.fellow.count({ where: { status: "ACTIVE" } }),
    db.mentor.count({ where: { isActive: true } }),
    db.application.count(),
    db.programme.count(),
    db.event.count(),
    db.course.count(),
    db.project.count(),
    db.opportunity.count(),
    db.partner.count(),
  ]);

  return { totalUsers, activeFellows, mentors, applications, programmes, events, courses, projects, opportunities, partners };
}

export async function getApplicationsByStatus() {
  const grouped = await db.application.groupBy({ by: ["status"], _count: { _all: true } });
  return grouped.map((g) => ({ status: g.status, count: g._count._all }));
}

export async function getApplicationsByProgramme() {
  const programmes = await db.programme.findMany({
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  return programmes.map((p) => ({ name: p.name, applications: p._count.applications }));
}

export async function getUserGrowthByMonth(months = 6) {
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const users = await db.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } });

  const buckets = new Map<string, number>();
  for (let i = 0; i < months; i++) {
    const d = new Date(since);
    d.setMonth(d.getMonth() + i);
    const key = d.toLocaleDateString("en-NG", { month: "short", year: "2-digit" });
    buckets.set(key, 0);
  }
  for (const u of users) {
    const key = u.createdAt.toLocaleDateString("en-NG", { month: "short", year: "2-digit" });
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([month, count]) => ({ month, count }));
}

export async function getCourseCompletionStats() {
  const enrollments = await db.enrollment.groupBy({ by: ["status"], _count: { _all: true } });
  return enrollments.map((e) => ({ status: e.status, count: e._count._all }));
}

export async function getSdgProjectCounts() {
  const sdgs = await db.sdg.findMany({ include: { _count: { select: { projects: true } } }, orderBy: { number: "asc" } });
  return sdgs.map((s) => ({ number: s.number, name: s.name, count: s._count.projects, color: s.colorHex }));
}

export async function getRecentAuditLogs(take = 15) {
  return db.auditLog.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take });
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader, DashboardCard, ProgressBar } from "@/components/dashboard/widgets";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

export default async function FellowLearningPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [enrollments, availableCourses] = await Promise.all([
    db.enrollment.findMany({
      where: { userId: session.sub },
      include: { course: { include: { modules: { include: { lessons: true } } } } },
    }),
    db.course.findMany({ where: { isPublished: true } }),
  ]);

  const enrolledIds = new Set(enrollments.map((e) => e.courseId));
  const notEnrolled = availableCourses.filter((c) => !enrolledIds.has(c.id));

  return (
    <div>
      <PageHeader title="Learning Hub" description="Track your progress across CitizensNexus courses." />

      <DashboardCard title="My Courses" className="mb-6">
        {enrollments.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {enrollments.map((e) => {
              const lessonCount = e.course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
              return (
                <div key={e.id} className="rounded-xl border border-navy-100 p-4">
                  <div className="flex items-center justify-between">
                    <Badge tone="navy">{e.course.category}</Badge>
                    <Badge tone={e.status === "COMPLETED" ? "green" : "gold"}>{e.status.replaceAll("_", " ")}</Badge>
                  </div>
                  <p className="mt-3 font-bold text-navy-950">{e.course.title}</p>
                  <p className="mt-1 text-xs text-navy-500">{e.course.modules.length} modules · {lessonCount} lessons</p>
                  <div className="mt-3">
                    <ProgressBar percent={e.progressPercent} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon="📚" title="No enrollments yet" description="Enroll in a course below to get started." />
        )}
      </DashboardCard>

      <DashboardCard title="Available Courses">
        {notEnrolled.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {notEnrolled.map((course) => (
              <div key={course.id} className="flex items-center justify-between rounded-xl border border-navy-100 p-4">
                <div>
                  <Badge tone="navy">{course.category}</Badge>
                  <p className="mt-2 font-bold text-navy-950">{course.title}</p>
                </div>
                <LinkButton href={`/learning/${course.slug}`} size="sm" variant="outline">
                  View
                </LinkButton>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-navy-500">You&apos;re enrolled in every available course. 🎉</p>
        )}
      </DashboardCard>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getFellowByUserId, getAnnouncementsForAudience, getNotificationsForUser } from "@/lib/data";
import { PageHeader, StatCard, ProgressBar, DashboardCard } from "@/components/dashboard/widgets";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function FellowOverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const fellow = await getFellowByUserId(session.sub);

  if (!fellow) {
    return (
      <EmptyState
        icon="🎓"
        title="No fellow profile found yet"
        description="Your fellow profile is created automatically once your application is accepted into a cohort."
        action={
          <LinkButton href="/dashboard/applicant" variant="primary">
            View my applications
          </LinkButton>
        }
      />
    );
  }

  const [announcements, notifications] = await Promise.all([
    getAnnouncementsForAudience(["ALL", "FELLOWS"]),
    getNotificationsForUser(session.sub, 5),
  ]);

  const enrollments = fellow.user.enrollments;
  const completedCourses = enrollments.filter((e) => e.status === "COMPLETED").length;
  const activeMentorAssignment = fellow.mentorAssignments.find((a) => a.status === "ACTIVE");
  const upcomingSessions = activeMentorAssignment?.sessions.filter((s) => s.status === "SCHEDULED") ?? [];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${session.name.split(" ")[0]}`}
        description={`${fellow.cohort.programme.name} · ${fellow.cohort.name} · Fellow #${fellow.fellowNumber}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Programme Progress" value={`${fellow.progressPercent}%`} icon="📈" />
        <StatCard label="Courses Completed" value={`${completedCourses}/${enrollments.length}`} icon="📚" />
        <StatCard label="Mentor Sessions" value={upcomingSessions.length} hint="Upcoming" icon="🤝" />
        <StatCard label="Certificates" value={fellow.certificates.length} icon="🎓" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DashboardCard title="Programme Progress">
            <ProgressBar percent={fellow.progressPercent} tone="gold" />
            <p className="mt-3 text-sm text-navy-500">
              You&apos;re {fellow.progressPercent}% through {fellow.cohort.programme.name}. Keep going!
            </p>
          </DashboardCard>

          <DashboardCard title="My Mentor" action={<Link href="/dashboard/fellow/mentor" className="text-sm font-semibold text-navy-700">View →</Link>}>
            {activeMentorAssignment ? (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-100 text-sm font-bold text-navy-700">
                  {activeMentorAssignment.mentor.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-950">{activeMentorAssignment.mentor.user.name}</p>
                  <p className="text-xs text-navy-500">
                    {activeMentorAssignment.mentor.title} · {activeMentorAssignment.mentor.organisation}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-navy-500">You have not yet been assigned a mentor. Your programme coordinator will match you soon.</p>
            )}
            {upcomingSessions.length ? (
              <ul className="mt-4 space-y-2 border-t border-navy-50 pt-4">
                {upcomingSessions.slice(0, 3).map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-sm">
                    <span className="text-navy-700">Mentoring session</span>
                    <span className="font-medium text-navy-500">{formatDate(s.scheduledAt)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </DashboardCard>

          <DashboardCard title="My Courses" action={<Link href="/dashboard/fellow/learning" className="text-sm font-semibold text-navy-700">View all →</Link>}>
            {enrollments.length ? (
              <ul className="space-y-4">
                {enrollments.slice(0, 4).map((e) => (
                  <li key={e.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-navy-800">{e.course.title}</span>
                      <span className="text-xs text-navy-500">{e.progressPercent}%</span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar percent={e.progressPercent} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-navy-500">
                You&apos;re not enrolled in any courses yet.{" "}
                <Link href="/learning" className="font-semibold text-navy-900 underline">
                  Browse the Learning Hub
                </Link>
                .
              </p>
            )}
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Announcements">
            {announcements.length ? (
              <ul className="space-y-4">
                {announcements.slice(0, 4).map((a) => (
                  <li key={a.id} className="border-b border-navy-50 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-navy-900">{a.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-navy-500">{a.body}</p>
                    <p className="mt-1 text-[11px] text-navy-400">{formatDate(a.publishedAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-navy-500">No announcements yet.</p>
            )}
          </DashboardCard>

          <DashboardCard title="Notifications">
            {notifications.length ? (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li key={n.id} className="flex items-start gap-2 text-sm">
                    <Badge tone={n.isRead ? "gray" : "gold"} className="mt-0.5 shrink-0">
                      {n.isRead ? "Read" : "New"}
                    </Badge>
                    <span className="text-navy-700">{n.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-navy-500">You&apos;re all caught up.</p>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

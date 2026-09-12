import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader, DashboardCard, ProgressBar } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/card";
import { LogSessionForm } from "@/components/dashboard/log-session-form";
import { formatDate } from "@/lib/utils";

export default async function MentorFellowDetailPage({ params }: PageProps<"/dashboard/mentor/fellows/[id]">) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const mentor = await db.mentor.findUnique({ where: { userId: session.sub } });
  if (!mentor) notFound();

  const assignment = await db.mentorAssignment.findFirst({
    where: { fellowId: id, mentorId: mentor.id },
    include: {
      fellow: { include: { user: { include: { profile: true } }, cohort: { include: { programme: true } } } },
      sessions: { orderBy: { scheduledAt: "desc" } },
    },
  });

  if (!assignment) notFound();

  const { fellow } = assignment;

  return (
    <div>
      <PageHeader title={fellow.user.name} description={`${fellow.cohort.programme.name} · ${fellow.cohort.name} · Fellow #${fellow.fellowNumber}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <DashboardCard title="Profile">
            <p className="text-sm text-navy-600">{fellow.user.profile?.bio ?? "No bio provided yet."}</p>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-semibold text-navy-800">Email:</span> {fellow.user.email}
              </p>
              {fellow.user.profile?.institution ? (
                <p>
                  <span className="font-semibold text-navy-800">Institution:</span> {fellow.user.profile.institution}
                </p>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(fellow.user.profile?.skills ?? []).map((s) => (
                <Badge key={s} tone="navy">
                  {s}
                </Badge>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Programme Progress">
            <ProgressBar percent={fellow.progressPercent} tone="gold" />
            <p className="mt-2 text-sm text-navy-500">{fellow.progressPercent}% complete</p>
          </DashboardCard>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <DashboardCard title="Log a Mentoring Session">
            <LogSessionForm mentorAssignmentId={assignment.id} />
          </DashboardCard>

          <DashboardCard title="Session History">
            {assignment.sessions.length ? (
              <ul className="divide-y divide-navy-50">
                {assignment.sessions.map((s) => (
                  <li key={s.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-navy-900">{formatDate(s.scheduledAt)}</p>
                      <Badge tone={s.status === "COMPLETED" ? "green" : s.status === "CANCELLED" ? "red" : "gold"}>{s.status}</Badge>
                    </div>
                    {s.mentorNotes ? <p className="mt-1 text-sm text-navy-600">{s.mentorNotes}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-navy-500">No sessions logged yet.</p>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getFellowByUserId } from "@/lib/data";
import { PageHeader, DashboardCard } from "@/components/dashboard/widgets";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function FellowMentorPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const fellow = await getFellowByUserId(session.sub);
  const assignment = fellow?.mentorAssignments.find((a) => a.status === "ACTIVE") ?? fellow?.mentorAssignments[0];

  return (
    <div>
      <PageHeader title="My Mentor" description="Your assigned mentor and mentoring session history." />

      {!assignment ? (
        <EmptyState icon="🤝" title="No mentor assigned yet" description="Your programme coordinator will match you with a mentor soon." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <DashboardCard className="lg:col-span-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 text-lg font-bold text-navy-700">
              {assignment.mentor.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <p className="mt-4 text-lg font-bold text-navy-950">{assignment.mentor.user.name}</p>
            <p className="text-sm font-medium text-gold-700">{assignment.mentor.title}</p>
            <p className="text-sm text-navy-500">{assignment.mentor.organisation}</p>
            <p className="mt-4 text-sm leading-relaxed text-navy-600">{assignment.mentor.bio}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {assignment.mentor.expertiseAreas.map((a) => (
                <Badge key={a} tone="navy">
                  {a}
                </Badge>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Mentoring Sessions" className="lg:col-span-2">
            {assignment.sessions.length ? (
              <ul className="divide-y divide-navy-50">
                {assignment.sessions.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{formatDate(s.scheduledAt)}</p>
                      <p className="text-xs text-navy-500">{s.durationMinutes} minutes</p>
                    </div>
                    <Badge tone={s.status === "COMPLETED" ? "green" : s.status === "CANCELLED" ? "red" : "gold"}>
                      {s.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-navy-500">No sessions have been scheduled yet.</p>
            )}
          </DashboardCard>
        </div>
      )}
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getMentorByUserId } from "@/lib/data";
import { PageHeader, StatCard, DashboardCard } from "@/components/dashboard/widgets";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/card";

export default async function MentorOverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const mentor = await getMentorByUserId(session.sub);

  if (!mentor) {
    return <EmptyState icon="🧑‍🏫" title="No mentor profile found" description="Contact a CitizensNexus administrator to set up your mentor profile." />;
  }

  const activeAssignments = mentor.assignments.filter((a) => a.status === "ACTIVE");
  const allSessions = mentor.assignments.flatMap((a) => a.sessions);
  const upcoming = allSessions.filter((s) => s.status === "SCHEDULED");
  const completed = allSessions.filter((s) => s.status === "COMPLETED");

  return (
    <div>
      <PageHeader title={`Welcome, ${session.name.split(" ")[0]}`} description="Your mentoring dashboard at CitizensNexus." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Assigned Fellows" value={activeAssignments.length} icon="🧑‍🎓" />
        <StatCard label="Upcoming Sessions" value={upcoming.length} icon="🗓️" />
        <StatCard label="Completed Sessions" value={completed.length} icon="✅" />
      </div>

      <DashboardCard title="My Fellows" className="mt-6" action={<Link href="/dashboard/mentor/fellows" className="text-sm font-semibold text-navy-700">View all →</Link>}>
        {activeAssignments.length ? (
          <ul className="divide-y divide-navy-50">
            {activeAssignments.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-sm font-bold text-navy-700">
                    {a.fellow.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{a.fellow.user.name}</p>
                    <p className="text-xs text-navy-500">{a.fellow.cohort.programme.name} · {a.fellow.cohort.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone="gold">{a.fellow.progressPercent}% progress</Badge>
                  <Link href={`/dashboard/mentor/fellows/${a.fellowId}`} className="text-sm font-semibold text-navy-900 underline">
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-navy-500">You have not been assigned any fellows yet.</p>
        )}
      </DashboardCard>
    </div>
  );
}

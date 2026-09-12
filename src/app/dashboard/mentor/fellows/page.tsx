import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMentorByUserId } from "@/lib/data";
import { PageHeader, DataTable, ProgressBar } from "@/components/dashboard/widgets";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

export default async function MentorFellowsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const mentor = await getMentorByUserId(session.sub);
  const assignments = mentor?.assignments ?? [];

  return (
    <div>
      <PageHeader title="My Fellows" description="All fellows you have mentored or are currently mentoring." />
      {assignments.length ? (
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-[var(--shadow-card)]">
          <DataTable
            rows={assignments}
            keyFn={(a) => a.id}
            columns={[
              { header: "Fellow", render: (a) => <span className="font-semibold text-navy-950">{a.fellow.user.name}</span> },
              { header: "Cohort", render: (a) => a.fellow.cohort.name },
              {
                header: "Progress",
                render: (a) => (
                  <div className="w-32">
                    <ProgressBar percent={a.fellow.progressPercent} />
                  </div>
                ),
              },
              { header: "Sessions", render: (a) => a.sessions.length },
              {
                header: "",
                render: (a) => (
                  <Link href={`/dashboard/mentor/fellows/${a.fellowId}`} className="font-semibold text-navy-900 underline">
                    View
                  </Link>
                ),
              },
            ]}
          />
        </div>
      ) : (
        <EmptyState icon="🧑‍🎓" title="No fellows assigned yet" />
      )}
    </div>
  );
}

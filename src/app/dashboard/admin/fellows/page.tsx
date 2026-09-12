import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard, ProgressBar } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/card";
import type { Fellow, User, Cohort, Programme } from "@prisma/client";

export default async function AdminFellowsPage() {
  const fellows = await db.fellow.findMany({
    include: { user: true, cohort: { include: { programme: true } } },
    orderBy: { joinedAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Fellows" description={`${fellows.length} fellows across all cohorts.`} />
      <DashboardCard>
        <DataTable<Fellow & { user: User; cohort: Cohort & { programme: Programme } }>
          rows={fellows}
          keyFn={(f) => f.id}
          columns={[
            { header: "Fellow #", render: (f) => f.fellowNumber },
            { header: "Name", render: (f) => <span className="font-semibold text-navy-950">{f.user.name}</span> },
            { header: "Cohort", render: (f) => `${f.cohort.programme.name} · ${f.cohort.name}` },
            { header: "Status", render: (f) => <Badge tone={f.status === "ACTIVE" ? "green" : f.status === "GRADUATED" ? "gold" : "gray"}>{f.status}</Badge> },
            {
              header: "Progress",
              render: (f) => (
                <div className="w-32">
                  <ProgressBar percent={f.progressPercent} />
                </div>
              ),
            },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/card";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_TONE } from "@/lib/constants";
import { formatDateShort, cn } from "@/lib/utils";
import type { Application, User, Programme, Cohort } from "@prisma/client";

export default async function AdminApplicationsPage({ searchParams }: PageProps<"/dashboard/admin/applications">) {
  const { status } = await searchParams;
  const selected = typeof status === "string" ? status : undefined;

  const applications = await db.application.findMany({
    where: selected ? { status: selected as Application["status"] } : undefined,
    include: { user: true, programme: true, cohort: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = Object.keys(APPLICATION_STATUS_LABELS);

  return (
    <div>
      <PageHeader title="Applications" description={`${applications.length} applications.`} />

      <div className="mb-5 flex flex-wrap gap-2">
        <Link
          href="/dashboard/admin/applications"
          className={cn("rounded-full border px-3.5 py-1.5 text-xs font-semibold", !selected ? "border-navy-900 bg-navy-900 text-white" : "border-navy-200 text-navy-700")}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/dashboard/admin/applications?status=${s}`}
            className={cn("rounded-full border px-3.5 py-1.5 text-xs font-semibold", selected === s ? "border-navy-900 bg-navy-900 text-white" : "border-navy-200 text-navy-700")}
          >
            {APPLICATION_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <DashboardCard>
        <DataTable<Application & { user: User; programme: Programme; cohort: Cohort | null }>
          rows={applications}
          keyFn={(a) => a.id}
          columns={[
            { header: "Applicant", render: (a) => <span className="font-semibold text-navy-950">{a.user.name}</span> },
            { header: "Programme", render: (a) => a.programme.name },
            { header: "Cohort", render: (a) => a.cohort?.name ?? "—" },
            { header: "Status", render: (a) => <Badge tone={APPLICATION_STATUS_TONE[a.status]}>{APPLICATION_STATUS_LABELS[a.status]}</Badge> },
            { header: "Score", render: (a) => a.score ?? "—" },
            { header: "Submitted", render: (a) => (a.submittedAt ? formatDateShort(a.submittedAt) : "—") },
            {
              header: "",
              render: (a) => (
                <Link href={`/dashboard/admin/applications/${a.id}`} className="font-semibold text-navy-900 underline">
                  Review
                </Link>
              ),
            },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

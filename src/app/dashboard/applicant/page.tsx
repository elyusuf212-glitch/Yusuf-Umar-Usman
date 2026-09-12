import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getUserApplications } from "@/lib/data";
import { PageHeader, DashboardCard, DataTable } from "@/components/dashboard/widgets";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_TONE } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";
import type { Application, Programme, Cohort } from "@prisma/client";

export default async function ApplicantOverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const applications = await getUserApplications(session.sub);

  return (
    <div>
      <PageHeader
        title="My Applications"
        description="Track the status of every application you've submitted to CitizensNexus programmes."
        action={
          <LinkButton href="/apply" size="sm">
            Apply to a Programme
          </LinkButton>
        }
      />

      <DashboardCard>
        {applications.length ? (
          <DataTable<Application & { programme: Programme; cohort: Cohort | null }>
            rows={applications}
            keyFn={(a) => a.id}
            columns={[
              { header: "Programme", render: (a) => <span className="font-semibold text-navy-950">{a.programme.name}</span> },
              { header: "Cohort", render: (a) => a.cohort?.name ?? "—" },
              {
                header: "Status",
                render: (a) => <Badge tone={APPLICATION_STATUS_TONE[a.status]}>{APPLICATION_STATUS_LABELS[a.status]}</Badge>,
              },
              { header: "Last updated", render: (a) => formatDateShort(a.updatedAt) },
              {
                header: "",
                render: (a) =>
                  a.status === "DRAFT" ? (
                    <Link href={`/apply/${a.programme.slug}`} className="font-semibold text-navy-900 underline">
                      Continue
                    </Link>
                  ) : (
                    <span className="text-navy-300">—</span>
                  ),
              },
            ]}
          />
        ) : (
          <EmptyState
            icon="📝"
            title="You haven't applied to any programmes yet"
            description="Browse open programmes and start your application."
            action={
              <LinkButton href="/apply" variant="primary">
                Browse Programmes
              </LinkButton>
            }
          />
        )}
      </DashboardCard>
    </div>
  );
}

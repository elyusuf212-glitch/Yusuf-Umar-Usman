import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import type { Programme } from "@prisma/client";

export default async function AdminProgrammesPage() {
  const programmes = await db.programme.findMany({
    include: { _count: { select: { applications: true, cohorts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Programmes"
        description="Create and manage CitizensNexus programmes."
        action={
          <LinkButton href="/dashboard/admin/programmes/new" size="sm">
            + New Programme
          </LinkButton>
        }
      />
      <DashboardCard>
        <DataTable<Programme & { _count: { applications: number; cohorts: number } }>
          rows={programmes}
          keyFn={(p) => p.id}
          columns={[
            { header: "Name", render: (p) => <span className="font-semibold text-navy-950">{p.name}</span> },
            { header: "Status", render: (p) => <Badge tone={p.status === "OPEN_FOR_APPLICATIONS" ? "green" : "navy"}>{p.status.replaceAll("_", " ")}</Badge> },
            { header: "Cohorts", render: (p) => p._count.cohorts },
            { header: "Applications", render: (p) => p._count.applications },
            {
              header: "",
              render: (p) => (
                <Link href={`/dashboard/admin/programmes/${p.id}/edit`} className="font-semibold text-navy-900 underline">
                  Edit
                </Link>
              ),
            },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

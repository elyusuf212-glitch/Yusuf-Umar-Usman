import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import type { Project } from "@prisma/client";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({ include: { sdgs: { include: { sdg: true } } }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Civic and community projects mapped to the SDGs."
        action={
          <LinkButton href="/dashboard/admin/projects/new" size="sm">
            + New Project
          </LinkButton>
        }
      />
      <DashboardCard>
        <DataTable<Project & { sdgs: { sdg: { number: number } }[] }>
          rows={projects}
          keyFn={(p) => p.id}
          columns={[
            { header: "Title", render: (p) => <span className="font-semibold text-navy-950">{p.title}</span> },
            { header: "Location", render: (p) => p.location ?? "—" },
            { header: "Year", render: (p) => p.year },
            { header: "SDGs", render: (p) => p.sdgs.map((s) => s.sdg.number).join(", ") || "—" },
            { header: "Status", render: (p) => <Badge tone={p.status === "COMPLETED" ? "green" : "gold"}>{p.status}</Badge> },
            {
              header: "",
              render: (p) => (
                <Link href={`/projects/${p.slug}`} className="font-semibold text-navy-900 underline">
                  View
                </Link>
              ),
            },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

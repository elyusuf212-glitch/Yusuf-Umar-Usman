import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { OPPORTUNITY_CATEGORIES } from "@/lib/constants";
import type { Opportunity } from "@prisma/client";

export default async function AdminOpportunitiesPage() {
  const opportunities = await db.opportunity.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Opportunities"
        description="Manage jobs, internships, scholarships, fellowships, grants and more."
        action={
          <LinkButton href="/dashboard/admin/opportunities/new" size="sm">
            + New Opportunity
          </LinkButton>
        }
      />
      <DashboardCard>
        <DataTable<Opportunity>
          rows={opportunities}
          keyFn={(o) => o.id}
          columns={[
            { header: "Title", render: (o) => <span className="font-semibold text-navy-950">{o.title}</span> },
            { header: "Organisation", render: (o) => o.organisation },
            { header: "Category", render: (o) => OPPORTUNITY_CATEGORIES.find((c) => c.value === o.category)?.label ?? o.category },
            { header: "Status", render: (o) => <Badge tone={o.isPublished ? "green" : "gray"}>{o.isPublished ? "Published" : "Hidden"}</Badge> },
            {
              header: "",
              render: (o) => (
                <Link href={`/dashboard/admin/opportunities/${o.id}/edit`} className="font-semibold text-navy-900 underline">
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

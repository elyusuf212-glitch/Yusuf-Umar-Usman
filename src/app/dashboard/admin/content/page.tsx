import { db } from "@/lib/db";
import { PageHeader, DashboardCard, DataTable } from "@/components/dashboard/widgets";
import { TestimonialForm, ResourceForm } from "@/components/dashboard/content-forms";
import { Badge } from "@/components/ui/card";
import type { Testimonial, Resource } from "@prisma/client";

export default async function AdminContentPage() {
  const [testimonials, resources] = await Promise.all([
    db.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
    db.resource.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <PageHeader title="Content" description="Manage success stories and downloadable resources." />

      <DashboardCard title="Add a Success Story" className="mb-6">
        <TestimonialForm />
      </DashboardCard>

      <DashboardCard title="Success Stories" className="mb-6">
        <DataTable<Testimonial>
          rows={testimonials}
          keyFn={(t) => t.id}
          columns={[
            { header: "Author", render: (t) => <span className="font-semibold text-navy-950">{t.authorName}</span> },
            { header: "Role", render: (t) => t.authorRole ?? "—" },
            { header: "Featured", render: (t) => <Badge tone={t.isFeatured ? "gold" : "gray"}>{t.isFeatured ? "Yes" : "No"}</Badge> },
          ]}
        />
      </DashboardCard>

      <DashboardCard title="Add a Resource" className="mb-6">
        <ResourceForm />
      </DashboardCard>

      <DashboardCard title="Resources">
        <DataTable<Resource>
          rows={resources}
          keyFn={(r) => r.id}
          columns={[
            { header: "Title", render: (r) => <span className="font-semibold text-navy-950">{r.title}</span> },
            { header: "Type", render: (r) => r.resourceType },
            { header: "Category", render: (r) => r.category ?? "—" },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

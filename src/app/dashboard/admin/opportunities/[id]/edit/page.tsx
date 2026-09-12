import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/widgets";
import { OpportunityForm } from "@/components/dashboard/opportunity-form";

export default async function EditOpportunityPage({ params }: PageProps<"/dashboard/admin/opportunities/[id]/edit">) {
  const { id } = await params;
  const opportunity = await db.opportunity.findUnique({ where: { id } });
  if (!opportunity) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${opportunity.title}`} />
      <OpportunityForm
        opportunityId={opportunity.id}
        initial={{
          title: opportunity.title,
          organisation: opportunity.organisation,
          description: opportunity.description,
          eligibility: opportunity.eligibility ?? "",
          location: opportunity.location ?? "",
          deadline: opportunity.deadline ? opportunity.deadline.toISOString().slice(0, 10) : "",
          applicationUrl: opportunity.applicationUrl,
          category: opportunity.category,
          isFeatured: opportunity.isFeatured,
          isPublished: opportunity.isPublished,
        }}
      />
    </div>
  );
}

import { PageHeader } from "@/components/dashboard/widgets";
import { OpportunityForm } from "@/components/dashboard/opportunity-form";

export default function NewOpportunityPage() {
  return (
    <div>
      <PageHeader title="New Opportunity" />
      <OpportunityForm />
    </div>
  );
}

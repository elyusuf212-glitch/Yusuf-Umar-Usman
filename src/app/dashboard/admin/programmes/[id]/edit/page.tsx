import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader, DashboardCard } from "@/components/dashboard/widgets";
import { ProgrammeForm } from "@/components/dashboard/programme-form";
import { CohortManager } from "@/components/dashboard/cohort-manager";

function toDateInput(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default async function EditProgrammePage({ params }: PageProps<"/dashboard/admin/programmes/[id]/edit">) {
  const { id } = await params;
  const programme = await db.programme.findUnique({ where: { id }, include: { cohorts: { orderBy: { year: "desc" } } } });
  if (!programme) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${programme.name}`} />
      <div className="space-y-6">
        <ProgrammeForm
          programmeId={programme.id}
          initial={{
            name: programme.name,
            description: programme.description,
            theme: programme.theme ?? "",
            startDate: toDateInput(programme.startDate),
            endDate: toDateInput(programme.endDate),
            applicationDeadline: toDateInput(programme.applicationDeadline),
            location: programme.location ?? "",
            deliveryFormat: programme.deliveryFormat,
            eligibility: programme.eligibility ?? "",
            slots: programme.slots.toString(),
            status: programme.status,
          }}
        />

        <DashboardCard title="Cohorts">
          <CohortManager
            programmeId={programme.id}
            cohorts={programme.cohorts.map((c) => ({ id: c.id, name: c.name, year: c.year, status: c.status }))}
          />
        </DashboardCard>
      </div>
    </div>
  );
}

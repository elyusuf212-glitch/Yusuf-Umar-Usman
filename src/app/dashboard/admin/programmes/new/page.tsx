import { PageHeader } from "@/components/dashboard/widgets";
import { ProgrammeForm } from "@/components/dashboard/programme-form";

export default function NewProgrammePage() {
  return (
    <div>
      <PageHeader title="New Programme" description="Create a new CitizensNexus leadership programme." />
      <ProgrammeForm />
    </div>
  );
}

import { PageHeader } from "@/components/dashboard/widgets";
import { ProjectForm } from "@/components/dashboard/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader title="New Project" description="Showcase a civic or community-impact project." />
      <ProjectForm />
    </div>
  );
}

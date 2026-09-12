import { PageHeader } from "@/components/dashboard/widgets";
import { CourseNewForm } from "@/components/dashboard/course-new-form";

export default function NewCoursePage() {
  return (
    <div>
      <PageHeader title="New Course" description="Add modules and lessons after creating the course." />
      <CourseNewForm />
    </div>
  );
}

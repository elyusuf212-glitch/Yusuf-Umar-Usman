import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/widgets";
import { CourseBuilder } from "@/components/dashboard/course-builder";

export default async function AdminCourseDetailPage({ params }: PageProps<"/dashboard/admin/courses/[id]">) {
  const { id } = await params;
  const course = await db.course.findUnique({
    where: { id },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });
  if (!course) notFound();

  return (
    <div>
      <PageHeader title={course.title} description={course.description} />
      <CourseBuilder courseId={course.id} isPublished={course.isPublished} modules={course.modules} />
    </div>
  );
}

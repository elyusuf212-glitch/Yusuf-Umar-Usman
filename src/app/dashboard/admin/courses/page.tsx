import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import type { Course } from "@prisma/client";

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    include: { _count: { select: { modules: true, enrollments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Manage the CitizensNexus Learning Hub."
        action={
          <LinkButton href="/dashboard/admin/courses/new" size="sm">
            + New Course
          </LinkButton>
        }
      />
      <DashboardCard>
        <DataTable<Course & { _count: { modules: number; enrollments: number } }>
          rows={courses}
          keyFn={(c) => c.id}
          columns={[
            { header: "Title", render: (c) => <span className="font-semibold text-navy-950">{c.title}</span> },
            { header: "Category", render: (c) => c.category },
            { header: "Modules", render: (c) => c._count.modules },
            { header: "Enrollments", render: (c) => c._count.enrollments },
            { header: "Status", render: (c) => <Badge tone={c.isPublished ? "green" : "gray"}>{c.isPublished ? "Published" : "Draft"}</Badge> },
            {
              header: "",
              render: (c) => (
                <Link href={`/dashboard/admin/courses/${c.id}`} className="font-semibold text-navy-900 underline">
                  Manage
                </Link>
              ),
            },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

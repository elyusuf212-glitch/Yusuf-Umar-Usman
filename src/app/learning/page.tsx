import type { Metadata } from "next";
import Link from "next/link";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { Card, Badge } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublishedCourses } from "@/lib/data";

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "Structured courses across leadership, entrepreneurship, digital & AI skills, advocacy, research and more.",
};

export default async function LearningHubPage() {
  const courses = await getPublishedCourses();

  return (
    <Section tone="light" className="pt-12">
      <Container>
        <SectionHeading
          eyebrow="Learning Hub"
          title="Build in-demand leadership & professional skills"
          description="Structured courses, modules and lessons with progress tracking — built for the CitizensNexus community."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.length ? (
            courses.map((course) => {
              const lessonCount = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
              return (
                <Link key={course.id} href={`/learning/${course.slug}`}>
                  <Card className="h-full p-6">
                    <Badge tone="navy">{course.category}</Badge>
                    <h3 className="mt-4 text-lg font-bold text-navy-950">{course.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-navy-600">{course.description}</p>
                    <p className="mt-4 text-xs font-semibold text-navy-500">
                      {course.modules.length} modules · {lessonCount} lessons
                    </p>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState icon="📚" title="Courses are being added" />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

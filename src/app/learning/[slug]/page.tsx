import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCourseBySlug } from "@/lib/data";
import { Section, Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/card";
import { EnrollInCourseButton } from "@/components/marketing/action-buttons";

export async function generateMetadata({ params }: PageProps<"/learning/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return { title: course?.title ?? "Course", description: course?.description };
}

const CONTENT_ICON: Record<string, string> = { VIDEO: "🎥", PDF: "📄", ARTICLE: "📰", QUIZ: "❓", ASSIGNMENT: "📝" };

export default async function CourseDetailPage({ params }: PageProps<"/learning/[slug]">) {
  const { slug } = await params;
  const [course, session] = await Promise.all([getCourseBySlug(slug), getSession()]);
  if (!course || !course.isPublished) notFound();

  const alreadyEnrolled = session
    ? Boolean(await db.enrollment.findUnique({ where: { userId_courseId: { userId: session.sub, courseId: course.id } } }))
    : false;

  const lessonCount = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <Section tone="light" className="pt-12">
      <Container className="max-w-3xl">
        <Badge tone="navy">{course.category}</Badge>
        <h1 className="mt-4 text-3xl font-bold text-navy-950">{course.title}</h1>
        <p className="mt-4 text-navy-600">{course.description}</p>
        <p className="mt-2 text-sm font-semibold text-navy-500">
          {course.modules.length} modules · {lessonCount} lessons
        </p>

        <div className="mt-8">
          <EnrollInCourseButton courseId={course.id} alreadyEnrolled={alreadyEnrolled} />
        </div>

        <div className="mt-10 space-y-4">
          {course.modules.map((module, idx) => (
            <div key={module.id} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
              <p className="text-xs font-bold uppercase tracking-wide text-gold-600">Module {idx + 1}</p>
              <h2 className="mt-1 text-lg font-bold text-navy-950">{module.title}</h2>
              {module.description ? <p className="mt-1 text-sm text-navy-500">{module.description}</p> : null}
              <ul className="mt-4 divide-y divide-navy-50">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-center gap-3 py-2.5 text-sm text-navy-700">
                    <span>{CONTENT_ICON[lesson.contentType] ?? "📄"}</span>
                    {lesson.title}
                    {lesson.durationMinutes ? <span className="ml-auto text-xs text-navy-400">{lesson.durationMinutes} min</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

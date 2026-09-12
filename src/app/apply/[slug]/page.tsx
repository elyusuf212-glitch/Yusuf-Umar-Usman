import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { ApplicationForm } from "@/components/marketing/application-form";
import { EmptyState } from "@/components/ui/empty-state";

export async function generateMetadata({ params }: PageProps<"/apply/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const programme = await db.programme.findUnique({ where: { slug } });
  return { title: programme ? `Apply — ${programme.name}` : "Apply" };
}

export default async function ApplyToProgrammePage({ params }: PageProps<"/apply/[slug]">) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=/apply/${slug}`);
  }

  const programme = await db.programme.findUnique({
    where: { slug },
    include: { cohorts: { where: { status: "APPLICATIONS_OPEN" }, orderBy: { year: "desc" } } },
  });

  if (!programme) notFound();

  const existingApplication = await db.application.findFirst({
    where: { userId: session.sub, programmeId: programme.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Section tone="light" className="pt-12">
      <Container className="max-w-4xl">
        <SectionHeading eyebrow="Application Portal" title={`Apply to ${programme.name}`} />

        {!programme.cohorts.length ? (
          <div className="mt-8">
            <EmptyState icon="⏳" title="Applications are not currently open for this programme" />
          </div>
        ) : existingApplication && existingApplication.status !== "DRAFT" ? (
          <div className="mt-8">
            <EmptyState
              icon="✅"
              title={`You have already submitted an application (status: ${existingApplication.status.replaceAll("_", " ")})`}
              description="You can track your application status from your dashboard."
            />
          </div>
        ) : (
          <ApplicationForm
            programmeId={programme.id}
            cohorts={programme.cohorts.map((c) => ({ id: c.id, name: c.name }))}
            existing={existingApplication}
          />
        )}
      </Container>
    </Section>
  );
}

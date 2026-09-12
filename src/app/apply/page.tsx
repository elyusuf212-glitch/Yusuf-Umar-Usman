import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { Card, Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Application Portal",
  description: "Apply to a CitizensNexus leadership programme or fellowship cohort.",
};

export default async function ApplyPage() {
  const programmes = await db.programme.findMany({
    where: { status: "OPEN_FOR_APPLICATIONS" },
    include: { cohorts: { where: { status: "APPLICATIONS_OPEN" } } },
    orderBy: { applicationDeadline: "asc" },
  });

  return (
    <Section tone="light" className="pt-12">
      <Container>
        <SectionHeading
          eyebrow="Application Portal"
          title="Apply to a CitizensNexus programme"
          description="Select a programme below to start your application. You can save your progress as a draft and submit when you're ready."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.length ? (
            programmes.map((programme) => (
              <Card key={programme.id} className="p-6">
                <Badge tone="green">Applications Open</Badge>
                <h3 className="mt-3 text-lg font-bold text-navy-950">{programme.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-navy-600">{programme.description}</p>
                {programme.applicationDeadline ? (
                  <p className="mt-3 text-xs font-semibold text-gold-700">
                    Deadline: {formatDateShort(programme.applicationDeadline)}
                  </p>
                ) : null}
                <LinkButton href={`/apply/${programme.slug}`} className="mt-5 w-full">
                  Start Application
                </LinkButton>
              </Card>
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                icon="📝"
                title="No programmes are currently accepting applications"
                description="Check back soon, or explore our full programme catalogue."
                action={
                  <Link href="/programmes" className="font-semibold text-navy-900 underline">
                    View all programmes
                  </Link>
                }
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

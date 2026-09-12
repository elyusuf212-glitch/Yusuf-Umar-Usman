import type { Metadata } from "next";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { ProgrammeCard } from "@/components/marketing/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllProgrammes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Explore CitizensNexus leadership programmes — from fellowship cohorts to skills-focused tracks in leadership, entrepreneurship, digital & AI skills and more.",
};

export default async function ProgrammesPage() {
  const programmes = await getAllProgrammes();

  return (
    <Section tone="light" className="pt-12">
      <Container>
        <SectionHeading
          eyebrow="Programmes"
          title="Leadership programmes for every stage of your journey"
          description="From flagship fellowship cohorts to focused skills tracks — find the CitizensNexus programme that matches your goals."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.length ? (
            programmes.map((p) => <ProgrammeCard key={p.id} programme={p} />)
          ) : (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState icon="🎓" title="No programmes published yet" />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

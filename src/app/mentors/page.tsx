import type { Metadata } from "next";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { MentorCard } from "@/components/marketing/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllMentors } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mentors",
  description: "Meet the CitizensNexus mentor network — experienced professionals guiding young African leaders.",
};

export default async function MentorsPage() {
  const mentors = await getAllMentors();

  return (
    <Section tone="light" className="pt-12">
      <Container>
        <SectionHeading
          eyebrow="Mentors"
          title="Our mentor network"
          description="Experienced professionals across sectors volunteering their time to guide the next generation of leaders."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mentors.length ? (
            mentors.map((m) => <MentorCard key={m.id} mentor={m} />)
          ) : (
            <div className="sm:col-span-2 lg:col-span-4">
              <EmptyState icon="🧑‍🏫" title="Mentor profiles coming soon" />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

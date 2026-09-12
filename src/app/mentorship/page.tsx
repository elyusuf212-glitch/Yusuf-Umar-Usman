import type { Metadata } from "next";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { MentorCard } from "@/components/marketing/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { getFeaturedMentors } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mentorship",
  description: "How CitizensNexus mentorship works — one-on-one guidance from experienced professionals for young African leaders.",
};

const STEPS = [
  { step: "1", title: "You're matched", text: "Every fellow is thoughtfully matched with a mentor based on goals and expertise." },
  { step: "2", title: "Structured sessions", text: "Regular one-on-one sessions with clear focus areas and feedback." },
  { step: "3", title: "Track your growth", text: "Progress, session notes and feedback are tracked in your dashboard." },
  { step: "4", title: "Build a lasting relationship", text: "Many mentor-fellow pairs continue collaborating beyond the programme." },
];

export default async function MentorshipPage() {
  const mentors = await getFeaturedMentors(8);

  return (
    <>
      <Section tone="navy" className="pt-16">
        <Container>
          <SectionHeading
            eyebrow="Mentorship"
            title="Guidance that turns potential into leadership"
            description="CitizensNexus pairs every fellow with an experienced mentor for structured, goal-driven mentorship throughout their programme."
            tone="dark"
          />
          <LinkButton href="/apply" variant="gold" size="lg" className="mt-8">
            Apply for Mentorship
          </LinkButton>
        </Container>
      </Section>

      <Section tone="light">
        <Container>
          <SectionHeading eyebrow="How it works" title="Our mentorship model" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.step} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-sm font-bold text-gold-700">
                  {s.step}
                </span>
                <p className="mt-4 font-bold text-navy-950">{s.title}</p>
                <p className="mt-1 text-sm text-navy-500">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeading eyebrow="Our mentors" title="Learn from experienced changemakers" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mentors.length ? (
              mentors.map((m) => <MentorCard key={m.id} mentor={m} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-4">
                <EmptyState icon="🧑‍🏫" title="Mentor profiles coming soon" />
              </div>
            )}
          </div>
          <div className="mt-10 text-center">
            <LinkButton href="/mentors" variant="outline">
              View all mentors
            </LinkButton>
          </div>
        </Container>
      </Section>

      <Section tone="light">
        <Container className="text-center">
          <SectionHeading eyebrow="Become a mentor" title="Share your experience with the next generation" align="center" />
          <p className="mx-auto mt-4 max-w-xl text-navy-600">
            Are you an experienced professional interested in mentoring young African leaders? We&apos;d love to hear from you.
          </p>
          <LinkButton href="/contact" variant="primary" size="lg" className="mt-6">
            Become a Mentor
          </LinkButton>
        </Container>
      </Section>
    </>
  );
}

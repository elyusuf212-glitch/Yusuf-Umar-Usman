import type { Metadata } from "next";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { TestimonialCard } from "@/components/marketing/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllTestimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Success Stories",
  description: "Stories from CitizensNexus fellows, mentors and partners on leadership, mentorship and impact.",
};

export default async function StoriesPage() {
  const testimonials = await getAllTestimonials();

  return (
    <Section tone="light" className="pt-12">
      <Container>
        <SectionHeading eyebrow="Success Stories" title="Voices of the CitizensNexus community" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.length ? (
            testimonials.map((t) => <TestimonialCard key={t.id} testimonial={t} />)
          ) : (
            <div className="lg:col-span-3">
              <EmptyState icon="💬" title="Success stories are being collected" />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

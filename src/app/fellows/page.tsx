import type { Metadata } from "next";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { Badge } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllFellows } from "@/lib/data";

export const metadata: Metadata = {
  title: "Fellows",
  description: "Meet the CitizensNexus Fellows — young leaders building skills, projects and impact across Nigeria and Africa.",
};

export default async function FellowsPage() {
  const fellows = await getAllFellows();

  return (
    <Section tone="light" className="pt-12">
      <Container>
        <SectionHeading
          eyebrow="Fellowship"
          title="Meet the CitizensNexus Fellows"
          description="Young leaders selected through a competitive process to build leadership, professional and civic-impact skills."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fellows.length ? (
            fellows.map((fellow) => (
              <div key={fellow.id} className="rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-[var(--shadow-card)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 text-lg font-bold text-navy-700">
                  {fellow.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <p className="mt-3 font-bold text-navy-950">{fellow.user.name}</p>
                <p className="text-xs text-navy-500">{fellow.cohort.name}</p>
                <Badge tone="gold" className="mt-3">
                  {fellow.status}
                </Badge>
                {fellow.user.profile?.headline ? (
                  <p className="mt-3 line-clamp-2 text-xs text-navy-500">{fellow.user.profile.headline}</p>
                ) : null}
              </div>
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-4">
              <EmptyState icon="🎓" title="Fellow profiles will appear here once cohorts are announced" />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

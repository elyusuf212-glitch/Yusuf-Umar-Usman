import type { Metadata } from "next";
import Link from "next/link";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { OpportunityCard } from "@/components/marketing/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import { OPPORTUNITY_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { OpportunityCategory } from "@prisma/client";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Browse jobs, internships, scholarships, fellowships, grants and more for young people across Nigeria and Africa.",
};

export default async function OpportunitiesPage({ searchParams }: PageProps<"/opportunities">) {
  const { category } = await searchParams;
  const selected = typeof category === "string" ? category : undefined;

  const opportunities = await db.opportunity.findMany({
    where: {
      isPublished: true,
      ...(selected ? { category: selected as OpportunityCategory } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <Section tone="light" className="pt-12">
      <Container>
        <SectionHeading
          eyebrow="Opportunities"
          title="Opportunities for young people"
          description="Jobs, internships, scholarships, fellowships, grants, competitions and more — curated for the CitizensNexus community."
        />

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/opportunities"
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium",
              !selected ? "border-navy-900 bg-navy-900 text-white" : "border-navy-200 text-navy-700 hover:border-navy-400"
            )}
          >
            All
          </Link>
          {OPPORTUNITY_CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/opportunities?category=${c.value}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium",
                selected === c.value ? "border-navy-900 bg-navy-900 text-white" : "border-navy-200 text-navy-700 hover:border-navy-400"
              )}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.length ? (
            opportunities.map((o) => <OpportunityCard key={o.id} opportunity={o} />)
          ) : (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState icon="📌" title="No opportunities found" description="Try a different category or check back soon." />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { Card, Badge } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublishedResources } from "@/lib/data";

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides, templates and resources for young leaders in the CitizensNexus community.",
};

const TYPE_ICON: Record<string, string> = { PDF: "📄", LINK: "🔗", TEMPLATE: "🗂️", GUIDE: "📘", VIDEO: "🎥" };

export default async function ResourcesPage() {
  const resources = await getPublishedResources();

  return (
    <Section tone="light" className="pt-12">
      <Container>
        <SectionHeading eyebrow="Resources" title="Guides & templates for young leaders" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.length ? (
            resources.map((r) => (
              <Card key={r.id} className="p-6">
                <span className="text-2xl">{TYPE_ICON[r.resourceType] ?? "📄"}</span>
                <div className="mt-3 flex items-center justify-between">
                  <Badge tone="navy">{r.category ?? r.resourceType}</Badge>
                </div>
                <h3 className="mt-3 font-bold text-navy-950">{r.title}</h3>
                {r.description ? <p className="mt-1 text-sm text-navy-500">{r.description}</p> : null}
                <a
                  href={r.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-semibold text-navy-900 underline"
                >
                  Access resource →
                </a>
              </Card>
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState icon="📁" title="Resources are being added" />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

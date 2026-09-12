import type { Metadata } from "next";
import Link from "next/link";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { ProjectCard } from "@/components/marketing/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllProjects, getSdgImpact } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects & SDG Impact",
  description: "Civic and community projects led by CitizensNexus fellows, mapped to the UN Sustainable Development Goals.",
};

export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const { sdg } = await searchParams;
  const selectedSdg = typeof sdg === "string" ? Number(sdg) : undefined;

  const [allProjects, sdgs] = await Promise.all([getAllProjects(), getSdgImpact()]);
  const projects = selectedSdg
    ? allProjects.filter((p) => p.sdgs.some((ps) => ps.sdg.number === selectedSdg))
    : allProjects;

  return (
    <>
      <Section tone="light" className="pt-12">
        <Container>
          <SectionHeading
            eyebrow="Impact"
            title="Civic & community projects"
            description="Real projects led by CitizensNexus fellows — mapped to the UN Sustainable Development Goals."
          />
        </Container>
      </Section>

      <Section tone="navy" id="sdgs" className="py-12">
        <Container>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gold-300">Filter by SDG</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/projects"
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold",
                !selectedSdg ? "border-white bg-white text-navy-950" : "border-white/30 text-white hover:bg-white/10"
              )}
            >
              All Projects
            </Link>
            {sdgs.map((s) => (
              <Link
                key={s.id}
                href={`/projects?sdg=${s.number}#sdgs`}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold",
                  selectedSdg === s.number ? "text-navy-950" : "border-white/30 text-white hover:bg-white/10"
                )}
                style={selectedSdg === s.number ? { backgroundColor: s.colorHex, borderColor: s.colorHex } : undefined}
              >
                SDG {s.number} · {s.name}
                <span className="ml-1.5 text-white/70">({s.projects.length})</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="light">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.length ? (
              projects.map((p) => <ProjectCard key={p.id} project={p} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState icon="🌍" title="No projects found for this SDG yet" />
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Section, Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/card";

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.project.findUnique({ where: { slug } });
  return { title: project?.title ?? "Project", description: project?.description };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await db.project.findUnique({
    where: { slug },
    include: { sdgs: { include: { sdg: true } }, members: { include: { user: true } }, programme: true },
  });
  if (!project) notFound();

  return (
    <Section tone="light" className="pt-12">
      <Container className="max-w-3xl">
        <div className="flex flex-wrap gap-2">
          {project.sdgs.map(({ sdg }) => (
            <span key={sdg.id} className="rounded px-2 py-1 text-xs font-bold text-white" style={{ backgroundColor: sdg.colorHex }}>
              SDG {sdg.number} · {sdg.name}
            </span>
          ))}
        </div>
        <h1 className="mt-4 text-3xl font-bold text-navy-950">{project.title}</h1>
        <p className="mt-2 text-sm font-semibold text-navy-500">
          {project.location} · {project.year} · <Badge tone={project.status === "COMPLETED" ? "green" : "gold"}>{project.status}</Badge>
        </p>

        <p className="mt-8 leading-relaxed text-navy-700">{project.description}</p>

        {project.problem ? (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-navy-950">The Problem</h2>
            <p className="mt-2 text-navy-600">{project.problem}</p>
          </div>
        ) : null}
        {project.solution ? (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-navy-950">Our Solution</h2>
            <p className="mt-2 text-navy-600">{project.solution}</p>
          </div>
        ) : null}
        {project.impactSummary ? (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-navy-950">Impact</h2>
            <p className="mt-2 text-navy-600">{project.impactSummary}</p>
          </div>
        ) : null}
        {project.resultsSummary ? (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-navy-950">Results</h2>
            <p className="mt-2 text-navy-600">{project.resultsSummary}</p>
          </div>
        ) : null}

        {project.members.length ? (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-navy-950">Team</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {project.members.map((m) => (
                <li key={m.id} className="rounded-full bg-navy-50 px-3 py-1 text-sm text-navy-700">
                  {m.user.name} <span className="text-navy-400">— {m.roleInProject}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

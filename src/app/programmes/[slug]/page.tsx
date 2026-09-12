import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { EventCard } from "@/components/marketing/cards";
import { getProgrammeBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/programmes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const programme = await getProgrammeBySlug(slug);
  return {
    title: programme?.name ?? "Programme",
    description: programme?.description,
  };
}

export default async function ProgrammeDetailPage({ params }: PageProps<"/programmes/[slug]">) {
  const { slug } = await params;
  const programme = await getProgrammeBySlug(slug);
  if (!programme) notFound();

  const canApply = programme.status === "OPEN_FOR_APPLICATIONS";

  return (
    <>
      <Section tone="navy" className="pt-16">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="gold">{programme.theme ?? "Leadership"}</Badge>
            <Badge tone="navy" className="bg-white/10 text-white">
              {programme.status.replaceAll("_", " ")}
            </Badge>
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold sm:text-4xl">{programme.name}</h1>
          <p className="mt-4 max-w-2xl text-navy-200">{programme.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            {canApply ? (
              <LinkButton href={`/apply/${programme.slug}`} variant="gold" size="lg">
                Apply Now
              </LinkButton>
            ) : (
              <LinkButton href="/contact" variant="outline-light" size="lg">
                Get Notified
              </LinkButton>
            )}
          </div>
        </Container>
      </Section>

      <Section tone="light">
        <Container className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="text-xl font-bold text-navy-950">Eligibility</h2>
              <p className="mt-2 text-navy-600">{programme.eligibility ?? "Open to all young people meeting general CitizensNexus criteria."}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-950">Cohorts</h2>
              {programme.cohorts.length ? (
                <ul className="mt-3 space-y-3">
                  {programme.cohorts.map((c) => (
                    <li key={c.id} className="flex items-center justify-between rounded-xl border border-navy-100 p-4">
                      <div>
                        <p className="font-semibold text-navy-900">{c.name}</p>
                        <p className="text-xs text-navy-500">{c.year}</p>
                      </div>
                      <Badge tone="navy">{c.status.replaceAll("_", " ")}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-navy-500">Cohorts for this programme will be announced soon.</p>
              )}
            </div>

            {programme.resources.length ? (
              <div>
                <h2 className="text-xl font-bold text-navy-950">Resources</h2>
                <ul className="mt-3 space-y-2">
                  {programme.resources.map((r) => (
                    <li key={r.id}>
                      <a href={r.fileUrl} className="font-semibold text-navy-900 underline" target="_blank" rel="noopener noreferrer">
                        {r.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <h2 className="text-xl font-bold text-navy-950">Related Events</h2>
              {programme.events.length ? (
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {programme.events.map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-navy-500">No events scheduled yet.</p>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-navy-500">Delivery format</dt>
                  <dd className="text-navy-900">{programme.deliveryFormat.replaceAll("_", " ")}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-500">Location</dt>
                  <dd className="text-navy-900">{programme.location ?? "Nationwide"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-500">Available slots</dt>
                  <dd className="text-navy-900">{programme.slots || "TBA"}</dd>
                </div>
                {programme.applicationDeadline ? (
                  <div>
                    <dt className="font-semibold text-navy-500">Application deadline</dt>
                    <dd className="text-navy-900">{formatDate(programme.applicationDeadline)}</dd>
                  </div>
                ) : null}
                {programme.startDate ? (
                  <div>
                    <dt className="font-semibold text-navy-500">Start date</dt>
                    <dd className="text-navy-900">{formatDate(programme.startDate)}</dd>
                  </div>
                ) : null}
              </dl>
              {canApply ? (
                <LinkButton href={`/apply/${programme.slug}`} className="mt-6 w-full">
                  Apply Now
                </LinkButton>
              ) : null}
            </div>

            {!programme.coordinators.length ? null : (
              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
                <h3 className="text-sm font-bold text-navy-950">Programme Coordinators</h3>
                <ul className="mt-3 space-y-2">
                  {programme.coordinators.map((c) => (
                    <li key={c.id} className="text-sm text-navy-700">
                      {c.user.name} <span className="text-navy-400">— {c.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </Container>
      </Section>
    </>
  );
}

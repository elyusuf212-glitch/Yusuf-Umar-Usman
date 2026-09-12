import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Section, Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/card";
import { RegisterForEventButton } from "@/components/marketing/action-buttons";
import { EVENT_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug } });
  return { title: event?.title ?? "Event", description: event?.description };
}

export default async function EventDetailPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const [event, session] = await Promise.all([
    db.event.findUnique({ where: { slug }, include: { _count: { select: { registrations: true } } } }),
    getSession(),
  ]);

  if (!event || !event.isPublished) notFound();

  const alreadyRegistered = session
    ? Boolean(await db.eventRegistration.findUnique({ where: { eventId_userId: { eventId: event.id, userId: session.sub } } }))
    : false;

  const label = EVENT_TYPES.find((t) => t.value === event.eventType)?.label ?? event.eventType;

  return (
    <Section tone="light" className="pt-12">
      <Container className="max-w-3xl">
        <Badge tone="gold">{label}</Badge>
        <h1 className="mt-4 text-3xl font-bold text-navy-950">{event.title}</h1>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-500">
          <span>🗓️ {formatDate(event.startAt)}</span>
          <span>📍 {event.mode === "ONLINE" ? "Online" : event.location ?? "TBA"}</span>
          {event.speaker ? <span>🎤 {event.speaker}</span> : null}
          {event.capacity ? <span>👥 {event._count.registrations}/{event.capacity} registered</span> : null}
        </div>
        <p className="prose-nexus mt-8 leading-relaxed text-navy-700">{event.description}</p>

        <div className="mt-8">
          <RegisterForEventButton eventId={event.id} alreadyRegistered={alreadyRegistered} />
        </div>
      </Container>
    </Section>
  );
}

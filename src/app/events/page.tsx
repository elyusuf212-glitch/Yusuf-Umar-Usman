import type { Metadata } from "next";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { EventCard } from "@/components/marketing/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events",
  description: "CitizensNexus events — trainings, webinars, leadership conversations, town halls and networking sessions.",
};

export default async function EventsPage() {
  const events = await getAllEvents();
  const now = new Date();
  const upcoming = events.filter((e) => e.startAt >= now);
  const past = events.filter((e) => e.startAt < now);

  return (
    <Section tone="light" className="pt-12">
      <Container>
        <SectionHeading eyebrow="Events" title="Events calendar" description="Trainings, webinars, leadership conversations and community gatherings." />

        <h2 className="mt-10 text-lg font-bold text-navy-950">Upcoming</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.length ? (
            upcoming.map((e) => <EventCard key={e.id} event={e} />)
          ) : (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState icon="🗓️" title="No upcoming events scheduled" />
            </div>
          )}
        </div>

        {past.length ? (
          <>
            <h2 className="mt-14 text-lg font-bold text-navy-950">Past Events</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 opacity-70">
              {past.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </>
        ) : null}
      </Container>
    </Section>
  );
}

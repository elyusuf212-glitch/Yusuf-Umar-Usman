import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/widgets";
import { EventForm } from "@/components/dashboard/event-form";

function toLocalInput(date: Date | null): string {
  if (!date) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function EditEventPage({ params }: PageProps<"/dashboard/admin/events/[id]/edit">) {
  const { id } = await params;
  const event = await db.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${event.title}`} />
      <EventForm
        eventId={event.id}
        initial={{
          title: event.title,
          description: event.description,
          eventType: event.eventType,
          mode: event.mode,
          startAt: toLocalInput(event.startAt),
          endAt: toLocalInput(event.endAt),
          location: event.location ?? "",
          onlineLink: event.onlineLink ?? "",
          speaker: event.speaker ?? "",
          capacity: event.capacity?.toString() ?? "",
          isPublished: event.isPublished,
        }}
      />
    </div>
  );
}

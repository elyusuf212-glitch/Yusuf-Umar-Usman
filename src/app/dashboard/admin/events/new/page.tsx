import { PageHeader } from "@/components/dashboard/widgets";
import { EventForm } from "@/components/dashboard/event-form";

export default function NewEventPage() {
  return (
    <div>
      <PageHeader title="New Event" />
      <EventForm />
    </div>
  );
}

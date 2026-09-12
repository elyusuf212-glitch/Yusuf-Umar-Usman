import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Event } from "@prisma/client";

export default async function AdminEventsPage() {
  const events = await db.event.findMany({ include: { _count: { select: { registrations: true } } }, orderBy: { startAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Events"
        description="Manage trainings, webinars, conversations and community events."
        action={
          <LinkButton href="/dashboard/admin/events/new" size="sm">
            + New Event
          </LinkButton>
        }
      />
      <DashboardCard>
        <DataTable<Event & { _count: { registrations: number } }>
          rows={events}
          keyFn={(e) => e.id}
          columns={[
            { header: "Title", render: (e) => <span className="font-semibold text-navy-950">{e.title}</span> },
            { header: "Date", render: (e) => formatDate(e.startAt) },
            { header: "Registrations", render: (e) => e._count.registrations },
            { header: "Status", render: (e) => <Badge tone={e.isPublished ? "green" : "gray"}>{e.isPublished ? "Published" : "Hidden"}</Badge> },
            {
              header: "",
              render: (e) => (
                <Link href={`/dashboard/admin/events/${e.id}/edit`} className="font-semibold text-navy-900 underline">
                  Edit
                </Link>
              ),
            },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Announcement } from "@prisma/client";

export default async function AdminAnnouncementsPage() {
  const announcements = await db.announcement.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Broadcast updates to fellows, mentors or the whole community."
        action={
          <LinkButton href="/dashboard/admin/announcements/new" size="sm">
            + New Announcement
          </LinkButton>
        }
      />
      <DashboardCard>
        <DataTable<Announcement>
          rows={announcements}
          keyFn={(a) => a.id}
          columns={[
            { header: "Title", render: (a) => <span className="font-semibold text-navy-950">{a.title}</span> },
            { header: "Audience", render: (a) => <Badge tone="navy">{a.audience}</Badge> },
            { header: "Published", render: (a) => formatDate(a.publishedAt) },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

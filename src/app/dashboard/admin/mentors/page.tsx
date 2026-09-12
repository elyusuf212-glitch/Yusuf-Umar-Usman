import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/card";
import type { Mentor, User } from "@prisma/client";

export default async function AdminMentorsPage() {
  const mentors = await db.mentor.findMany({
    include: { user: true, _count: { select: { assignments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Mentors" description={`${mentors.length} mentors in the network. Change a user's role to Mentor from the Users page to add one.`} />
      <DashboardCard>
        <DataTable<Mentor & { user: User; _count: { assignments: number } }>
          rows={mentors}
          keyFn={(m) => m.id}
          columns={[
            { header: "Name", render: (m) => <span className="font-semibold text-navy-950">{m.user.name}</span> },
            { header: "Title", render: (m) => m.title ?? "—" },
            { header: "Organisation", render: (m) => m.organisation ?? "—" },
            { header: "Assigned Fellows", render: (m) => m._count.assignments },
            { header: "Status", render: (m) => <Badge tone={m.isActive ? "green" : "gray"}>{m.isActive ? "Active" : "Inactive"}</Badge> },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

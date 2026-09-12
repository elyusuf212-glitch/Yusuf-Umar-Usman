import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard } from "@/components/dashboard/widgets";
import { RoleSelect } from "@/components/dashboard/role-select";
import { Badge } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
import type { User } from "@prisma/client";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div>
      <PageHeader title="Users" description={`${users.length} registered users across all roles.`} />
      <DashboardCard>
        <DataTable<User>
          rows={users}
          keyFn={(u) => u.id}
          columns={[
            { header: "Name", render: (u) => <span className="font-semibold text-navy-950">{u.name}</span> },
            { header: "Email", render: (u) => u.email },
            { header: "Role", render: (u) => <RoleSelect userId={u.id} currentRole={u.role} /> },
            { header: "Status", render: (u) => <Badge tone={u.isActive ? "green" : "red"}>{u.isActive ? "Active" : "Inactive"}</Badge> },
            { header: "Joined", render: (u) => formatDateShort(u.createdAt) },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

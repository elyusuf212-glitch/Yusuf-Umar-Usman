import { getAdminOverviewStats, getSdgProjectCounts } from "@/lib/admin-data";
import { PageHeader, StatCard, DashboardCard } from "@/components/dashboard/widgets";
import { SimpleBarChart } from "@/components/dashboard/charts";

export default async function AdminReportsPage() {
  const [stats, sdgCounts] = await Promise.all([getAdminOverviewStats(), getSdgProjectCounts()]);

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Export programme data and review SDG impact."
        action={
          <a
            href="/api/admin/reports/applications"
            className="inline-flex items-center justify-center rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Export Applications (CSV)
          </a>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Applications" value={stats.applications} />
        <StatCard label="Active Fellows" value={stats.activeFellows} />
        <StatCard label="Community Projects" value={stats.projects} />
      </div>

      <DashboardCard title="Projects by SDG" className="mt-6">
        <SimpleBarChart data={sdgCounts.map((s) => ({ ...s, name: `SDG ${s.number}` }))} dataKey="count" labelKey="name" />
      </DashboardCard>
    </div>
  );
}

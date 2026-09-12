import { getSiteStats } from "@/lib/data";
import { PageHeader, DashboardCard } from "@/components/dashboard/widgets";
import { ImpactStatsForm } from "@/components/dashboard/impact-stats-form";

export default async function AdminSettingsPage() {
  const stats = await getSiteStats();

  return (
    <div>
      <PageHeader title="Settings" description="Manage editable homepage content." />

      <DashboardCard title="Homepage Impact Statistics">
        <ImpactStatsForm initial={stats} />
      </DashboardCard>
    </div>
  );
}

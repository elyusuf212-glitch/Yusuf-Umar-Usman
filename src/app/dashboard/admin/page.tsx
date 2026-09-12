import {
  getAdminOverviewStats,
  getApplicationsByStatus,
  getApplicationsByProgramme,
  getUserGrowthByMonth,
  getCourseCompletionStats,
} from "@/lib/admin-data";
import { PageHeader, StatCard, DashboardCard } from "@/components/dashboard/widgets";
import { SimpleBarChart, TrendLineChart, StatusPieChart } from "@/components/dashboard/charts";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#94a3b8",
  SUBMITTED: "#121c46",
  UNDER_REVIEW: "#dfa233",
  SHORTLISTED: "#edbd53",
  INTERVIEW: "#c78a22",
  ACCEPTED: "#10b981",
  WAITLISTED: "#64748b",
  REJECTED: "#ef4444",
};

const ENROLLMENT_COLORS: Record<string, string> = {
  NOT_STARTED: "#94a3b8",
  IN_PROGRESS: "#dfa233",
  COMPLETED: "#10b981",
};

export default async function AdminOverviewPage() {
  const [stats, byStatus, byProgramme, userGrowth, courseStats] = await Promise.all([
    getAdminOverviewStats(),
    getApplicationsByStatus(),
    getApplicationsByProgramme(),
    getUserGrowthByMonth(),
    getCourseCompletionStats(),
  ]);

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Platform overview and programme performance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" />
        <StatCard label="Active Fellows" value={stats.activeFellows} icon="🎓" />
        <StatCard label="Mentors" value={stats.mentors} icon="🧑‍🏫" />
        <StatCard label="Applications" value={stats.applications} icon="📝" />
        <StatCard label="Programmes" value={stats.programmes} icon="📋" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Events" value={stats.events} icon="🗓️" />
        <StatCard label="Courses" value={stats.courses} icon="📚" />
        <StatCard label="Projects" value={stats.projects} icon="🌍" />
        <StatCard label="Opportunities" value={stats.opportunities} icon="📌" />
        <StatCard label="Partners" value={stats.partners} icon="🤝" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Applications by Programme">
          {byProgramme.length ? (
            <SimpleBarChart data={byProgramme} dataKey="applications" labelKey="name" />
          ) : (
            <p className="py-10 text-center text-sm text-navy-400">No applications yet.</p>
          )}
        </DashboardCard>

        <DashboardCard title="Applications by Status">
          {byStatus.length ? (
            <StatusPieChart
              data={byStatus.map((s) => ({ name: APPLICATION_STATUS_LABELS[s.status] ?? s.status, value: s.count, color: STATUS_COLORS[s.status] ?? "#94a3b8" }))}
            />
          ) : (
            <p className="py-10 text-center text-sm text-navy-400">No applications yet.</p>
          )}
        </DashboardCard>

        <DashboardCard title="User Growth (last 6 months)">
          <TrendLineChart data={userGrowth} dataKey="count" labelKey="month" />
        </DashboardCard>

        <DashboardCard title="Learning Progress">
          {courseStats.length ? (
            <StatusPieChart
              data={courseStats.map((c) => ({ name: c.status.replaceAll("_", " "), value: c.count, color: ENROLLMENT_COLORS[c.status] ?? "#94a3b8" }))}
            />
          ) : (
            <p className="py-10 text-center text-sm text-navy-400">No enrollments yet.</p>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}

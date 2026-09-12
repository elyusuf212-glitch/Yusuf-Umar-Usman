import { redirect } from "next/navigation";
import { getSession, ROLE_LABELS } from "@/lib/auth";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";

const NAV: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard/admin", icon: "🏠" },
  { label: "Users", href: "/dashboard/admin/users", icon: "👥" },
  { label: "Fellows", href: "/dashboard/admin/fellows", icon: "🎓" },
  { label: "Mentors", href: "/dashboard/admin/mentors", icon: "🧑‍🏫" },
  { label: "Programmes", href: "/dashboard/admin/programmes", icon: "📋" },
  { label: "Applications", href: "/dashboard/admin/applications", icon: "📝" },
  { label: "Courses", href: "/dashboard/admin/courses", icon: "📚" },
  { label: "Events", href: "/dashboard/admin/events", icon: "🗓️" },
  { label: "Opportunities", href: "/dashboard/admin/opportunities", icon: "📌" },
  { label: "Projects", href: "/dashboard/admin/projects", icon: "🌍" },
  { label: "Certificates", href: "/dashboard/admin/certificates", icon: "🎖️" },
  { label: "Announcements", href: "/dashboard/admin/announcements", icon: "📢" },
  { label: "Content", href: "/dashboard/admin/content", icon: "🖋️" },
  { label: "Partners", href: "/dashboard/admin/partners", icon: "🤝" },
  { label: "Reports", href: "/dashboard/admin/reports", icon: "📊" },
  { label: "Settings", href: "/dashboard/admin/settings", icon: "⚙️" },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "PROGRAMME_MANAGER")) {
    redirect("/login?next=/dashboard/admin");
  }

  return (
    <DashboardShell navItems={NAV} roleLabel={ROLE_LABELS[session.role]} userName={session.name}>
      {children}
    </DashboardShell>
  );
}

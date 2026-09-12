import { redirect } from "next/navigation";
import { getSession, ROLE_LABELS } from "@/lib/auth";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";

const NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/mentor", icon: "🏠" },
  { label: "My Fellows", href: "/dashboard/mentor/fellows", icon: "🧑‍🎓" },
  { label: "My Profile", href: "/dashboard/mentor/profile", icon: "👤" },
];

export default async function MentorDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/mentor");

  return (
    <DashboardShell navItems={NAV} roleLabel={ROLE_LABELS[session.role]} userName={session.name}>
      {children}
    </DashboardShell>
  );
}

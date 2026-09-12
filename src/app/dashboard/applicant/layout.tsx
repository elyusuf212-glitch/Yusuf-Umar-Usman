import { redirect } from "next/navigation";
import { getSession, ROLE_LABELS } from "@/lib/auth";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";

const NAV: DashboardNavItem[] = [
  { label: "My Applications", href: "/dashboard/applicant", icon: "📝" },
  { label: "My Profile", href: "/dashboard/applicant/profile", icon: "👤" },
];

export default async function ApplicantDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/applicant");

  return (
    <DashboardShell navItems={NAV} roleLabel={ROLE_LABELS[session.role]} userName={session.name}>
      {children}
    </DashboardShell>
  );
}

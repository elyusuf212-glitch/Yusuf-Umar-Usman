import { redirect } from "next/navigation";
import { getSession, ROLE_LABELS } from "@/lib/auth";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";

const NAV: DashboardNavItem[] = [{ label: "Overview", href: "/dashboard/partner", icon: "🏠" }];

export default async function PartnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/partner");

  return (
    <DashboardShell navItems={NAV} roleLabel={ROLE_LABELS[session.role]} userName={session.name}>
      {children}
    </DashboardShell>
  );
}

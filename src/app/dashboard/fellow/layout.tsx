import { redirect } from "next/navigation";
import { getSession, ROLE_LABELS } from "@/lib/auth";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";

const NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/fellow", icon: "🏠" },
  { label: "Learning Hub", href: "/dashboard/fellow/learning", icon: "📚" },
  { label: "My Mentor", href: "/dashboard/fellow/mentor", icon: "🤝" },
  { label: "Certificates", href: "/dashboard/fellow/certificates", icon: "🎓" },
  { label: "My Profile", href: "/dashboard/fellow/profile", icon: "👤" },
];

export default async function FellowDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/fellow");

  return (
    <DashboardShell navItems={NAV} roleLabel={ROLE_LABELS[session.role]} userName={session.name}>
      {children}
    </DashboardShell>
  );
}

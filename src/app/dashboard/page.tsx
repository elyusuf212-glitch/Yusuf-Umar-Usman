import { redirect } from "next/navigation";
import { getSession, dashboardPathForRole } from "@/lib/auth";

export default async function DashboardRedirectPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/dashboard");
  }
  redirect(dashboardPathForRole(session.role));
}

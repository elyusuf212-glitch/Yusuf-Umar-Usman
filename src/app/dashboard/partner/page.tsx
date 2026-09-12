import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPartnerByUserId, getSiteStats, getFeaturedProjects, getFeaturedOpportunities } from "@/lib/data";
import { PageHeader, StatCard, DashboardCard } from "@/components/dashboard/widgets";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";

export default async function PartnerOverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [partner, stats, projects, opportunities] = await Promise.all([
    getPartnerByUserId(session.sub),
    getSiteStats(),
    getFeaturedProjects(3),
    getFeaturedOpportunities(3),
  ]);

  return (
    <div>
      <PageHeader
        title={partner ? partner.organisationName : `Welcome, ${session.name}`}
        description="Partner impact overview and CitizensNexus programme outcomes."
      />

      {!partner ? (
        <EmptyState
          icon="🤝"
          title="Your partner profile is being set up"
          description="An administrator will finish linking your organisation shortly. In the meantime, explore impact below."
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Recent Community Projects">
          {projects.length ? (
            <ul className="space-y-3">
              {projects.map((p) => (
                <li key={p.id} className="border-b border-navy-50 pb-3 last:border-0">
                  <p className="text-sm font-semibold text-navy-900">{p.title}</p>
                  <p className="text-xs text-navy-500">{p.location} · {p.year}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-navy-500">No projects published yet.</p>
          )}
        </DashboardCard>

        <DashboardCard title="Support an Opportunity">
          {opportunities.length ? (
            <ul className="space-y-3">
              {opportunities.map((o) => (
                <li key={o.id} className="border-b border-navy-50 pb-3 last:border-0">
                  <p className="text-sm font-semibold text-navy-900">{o.title}</p>
                  <p className="text-xs text-navy-500">{o.organisation}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-navy-500">No opportunities published yet.</p>
          )}
        </DashboardCard>
      </div>

      <div className="mt-6">
        <LinkButton href="/partners" variant="outline">
          Submit a Partnership Enquiry
        </LinkButton>
      </div>
    </div>
  );
}

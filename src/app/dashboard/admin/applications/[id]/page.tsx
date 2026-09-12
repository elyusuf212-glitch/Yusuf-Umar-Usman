import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader, DashboardCard } from "@/components/dashboard/widgets";
import { ApplicationReviewPanel } from "@/components/dashboard/application-review-panel";
import { Badge } from "@/components/ui/card";

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="border-b border-navy-50 pb-3 last:border-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">{label}</dt>
      <dd className="mt-1 text-sm text-navy-800">{value}</dd>
    </div>
  );
}

export default async function AdminApplicationDetailPage({ params }: PageProps<"/dashboard/admin/applications/[id]">) {
  const { id } = await params;
  const application = await db.application.findUnique({
    where: { id },
    include: { user: { include: { profile: true } }, programme: true, cohort: true },
  });
  if (!application) notFound();

  const personalInfo = (application.personalInfo ?? {}) as Record<string, string>;
  const education = (application.education ?? {}) as Record<string, string>;
  const professionalBackground = (application.professionalBackground ?? {}) as Record<string, string>;
  const portfolioLinks = (application.portfolioLinks ?? {}) as Record<string, string>;
  const essayResponses = (application.essayResponses ?? {}) as Record<string, string>;

  return (
    <div>
      <PageHeader
        title={application.user.name}
        description={`Applying to ${application.programme.name}${application.cohort ? ` · ${application.cohort.name}` : ""}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DashboardCard title="Personal Information">
            <dl className="space-y-3">
              <Field label="Full name" value={personalInfo.fullName} />
              <Field label="Email" value={application.user.email} />
              <Field label="Phone" value={personalInfo.phone} />
              <Field label="Date of birth" value={personalInfo.dateOfBirth} />
              <Field label="Gender" value={personalInfo.gender} />
              <Field label="State of origin" value={personalInfo.stateOfOrigin} />
              <Field label="State of residence" value={personalInfo.stateOfResidence} />
            </dl>
          </DashboardCard>

          <DashboardCard title="Education & Professional Background">
            <dl className="space-y-3">
              <Field label="Institution" value={education.institution} />
              <Field label="Field of study" value={education.fieldOfStudy} />
              <Field label="Level" value={education.level} />
              <Field label="Graduation year" value={education.graduationYear} />
              <Field label="Current status" value={professionalBackground.currentStatus} />
              <Field label="Organisation" value={professionalBackground.organisation} />
              <Field label="Role" value={professionalBackground.role} />
            </dl>
          </DashboardCard>

          <DashboardCard title="Leadership, Community & Motivation">
            <dl className="space-y-3">
              <Field label="Leadership experience" value={application.leadershipExperience} />
              <Field label="Community involvement" value={application.communityInvolvement} />
              <Field label="Motivation" value={application.motivation} />
              <Field label="Career aspirations" value={application.careerAspirations} />
              <Field label="Challenges" value={application.challenges} />
              <Field label="Programme expectations" value={application.programmeExpectations} />
              <Field label="Biggest achievement" value={essayResponses.biggestAchievement} />
              <Field label="Change you want to see" value={essayResponses.changeYouWantToSee} />
            </dl>
            {application.skills.length ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {application.skills.map((s) => (
                  <Badge key={s} tone="navy">
                    {s}
                  </Badge>
                ))}
              </div>
            ) : null}
          </DashboardCard>

          {(portfolioLinks.linkedin || portfolioLinks.portfolio || portfolioLinks.twitter) ? (
            <DashboardCard title="Portfolio">
              <dl className="space-y-3">
                <Field label="LinkedIn" value={portfolioLinks.linkedin} />
                <Field label="Portfolio" value={portfolioLinks.portfolio} />
                <Field label="X / Twitter" value={portfolioLinks.twitter} />
              </dl>
            </DashboardCard>
          ) : null}
        </div>

        <div>
          <ApplicationReviewPanel
            applicationId={application.id}
            initialStatus={application.status}
            initialScore={application.score}
            initialNotes={application.reviewerNotes}
          />
        </div>
      </div>
    </div>
  );
}

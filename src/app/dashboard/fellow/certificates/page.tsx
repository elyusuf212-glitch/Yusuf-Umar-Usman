import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getFellowByUserId } from "@/lib/data";
import { PageHeader, DashboardCard } from "@/components/dashboard/widgets";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function FellowCertificatesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const fellow = await getFellowByUserId(session.sub);
  const certificates = fellow?.certificates ?? [];

  return (
    <div>
      <PageHeader title="My Certificates" description="Digital certificates issued upon programme completion." />
      {certificates.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((cert) => (
            <DashboardCard key={cert.id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Certificate of Completion</p>
              <p className="mt-2 text-lg font-bold text-navy-950">{cert.programmeName}</p>
              <p className="text-sm text-navy-500">Issued {formatDate(cert.issuedAt)}</p>
              <p className="mt-2 font-mono text-xs text-navy-400">ID: {cert.certificateCode}</p>
              <Link
                href={`/certificates/verify?code=${cert.certificateCode}`}
                className="mt-4 inline-block text-sm font-semibold text-navy-900 underline"
              >
                View verification page →
              </Link>
            </DashboardCard>
          ))}
        </div>
      ) : (
        <EmptyState icon="🎓" title="No certificates yet" description="Certificates are issued automatically once you complete a programme." />
      )}
    </div>
  );
}

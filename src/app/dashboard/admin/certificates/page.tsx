import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard } from "@/components/dashboard/widgets";
import { IssueCertificateForm } from "@/components/dashboard/issue-certificate-form";
import { formatDateShort } from "@/lib/utils";
import type { Certificate, User } from "@prisma/client";

export default async function AdminCertificatesPage() {
  const [certificates, eligibleFellows] = await Promise.all([
    db.certificate.findMany({ include: { user: true }, orderBy: { issuedAt: "desc" } }),
    db.fellow.findMany({
      where: { status: "ACTIVE", certificates: { none: {} } },
      include: { user: true, cohort: { include: { programme: true } } },
    }),
  ]);

  return (
    <div>
      <PageHeader title="Certificates" description="Issue and track digital certificates." />

      <DashboardCard title="Issue a Certificate" className="mb-6">
        <IssueCertificateForm
          fellows={eligibleFellows.map((f) => ({ id: f.id, label: `${f.user.name} — ${f.cohort.programme.name} (${f.cohort.name})` }))}
        />
      </DashboardCard>

      <DashboardCard title="Issued Certificates">
        <DataTable<Certificate & { user: User }>
          rows={certificates}
          keyFn={(c) => c.id}
          columns={[
            { header: "Fellow", render: (c) => <span className="font-semibold text-navy-950">{c.user.name}</span> },
            { header: "Programme", render: (c) => c.programmeName },
            { header: "Certificate ID", render: (c) => <span className="font-mono text-xs">{c.certificateCode}</span> },
            { header: "Issued", render: (c) => formatDateShort(c.issuedAt) },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

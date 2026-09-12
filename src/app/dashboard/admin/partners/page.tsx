import { db } from "@/lib/db";
import { PageHeader, DataTable, DashboardCard } from "@/components/dashboard/widgets";
import { Badge } from "@/components/ui/card";
import { PartnerToggle } from "@/components/dashboard/partner-toggle";
import { PartnerNewForm } from "@/components/dashboard/partner-new-form";
import { formatDateShort } from "@/lib/utils";
import type { Partner, PartnershipInquiry } from "@prisma/client";

export default async function AdminPartnersPage() {
  const [partners, inquiries] = await Promise.all([
    db.partner.findMany({ orderBy: { createdAt: "desc" } }),
    db.partnershipInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  return (
    <div>
      <PageHeader title="Partners" description="Manage partner organisations and review partnership enquiries." />

      <DashboardCard title="Add a Partner" className="mb-6">
        <PartnerNewForm />
      </DashboardCard>

      <DashboardCard title="Partner Organisations" className="mb-6">
        <DataTable<Partner>
          rows={partners}
          keyFn={(p) => p.id}
          columns={[
            { header: "Organisation", render: (p) => <span className="font-semibold text-navy-950">{p.organisationName}</span> },
            { header: "Type", render: (p) => p.type.replaceAll("_", " ") },
            { header: "Approved", render: (p) => <Badge tone={p.isApproved ? "green" : "gray"}>{p.isApproved ? "Yes" : "No"}</Badge> },
            { header: "Featured", render: (p) => <Badge tone={p.isFeatured ? "gold" : "gray"}>{p.isFeatured ? "Yes" : "No"}</Badge> },
            {
              header: "",
              render: (p) => (
                <div className="flex gap-2">
                  <PartnerToggle partnerId={p.id} field="isApproved" value={p.isApproved} onLabel="Unapprove" offLabel="Approve" />
                  <PartnerToggle partnerId={p.id} field="isFeatured" value={p.isFeatured} onLabel="Unfeature" offLabel="Feature" />
                </div>
              ),
            },
          ]}
        />
      </DashboardCard>

      <DashboardCard title="Partnership Enquiries">
        <DataTable<PartnershipInquiry>
          rows={inquiries}
          keyFn={(i) => i.id}
          columns={[
            { header: "Organisation", render: (i) => <span className="font-semibold text-navy-950">{i.organisationName}</span> },
            { header: "Contact", render: (i) => `${i.contactName} · ${i.contactEmail}` },
            { header: "Message", className: "max-w-xs truncate", render: (i) => i.message },
            { header: "Received", render: (i) => formatDateShort(i.createdAt) },
          ]}
        />
      </DashboardCard>
    </div>
  );
}

import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { Input, Label } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Verify a Certificate",
  description: "Verify the authenticity of a CitizensNexus certificate.",
};

export default async function VerifyCertificatePage({ searchParams }: PageProps<"/certificates/verify">) {
  const { code } = await searchParams;
  const certificateCode = typeof code === "string" ? code.trim() : undefined;

  const certificate = certificateCode
    ? await db.certificate.findUnique({ where: { certificateCode }, include: { user: true, cohort: true } })
    : null;

  return (
    <Section tone="light" className="pt-12">
      <Container className="max-w-2xl">
        <SectionHeading eyebrow="Certificate Verification" title="Verify a CitizensNexus certificate" description="Enter a certificate ID to confirm its authenticity." />

        <form method="GET" className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="code">Certificate ID</Label>
            <Input id="code" name="code" defaultValue={certificateCode} placeholder="e.g. CN-2025-00042" />
          </div>
          <Button type="submit">Verify</Button>
        </form>

        {certificateCode ? (
          <div className="mt-8">
            {certificate ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">✓ Valid Certificate</p>
                <p className="mt-3 text-lg font-bold text-navy-950">{certificate.user.name}</p>
                <p className="text-navy-700">{certificate.programmeName}{certificate.cohort ? ` · ${certificate.cohort.name}` : ""}</p>
                <p className="mt-2 text-sm text-navy-500">Issued {formatDate(certificate.issuedAt)}</p>
                <p className="mt-1 font-mono text-xs text-navy-400">ID: {certificate.certificateCode}</p>
                <p className="mt-4 text-sm text-navy-600">
                  Signed by {certificate.signatoryName}, {certificate.signatoryTitle}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-bold uppercase tracking-wide text-red-700">✕ Certificate Not Found</p>
                <p className="mt-2 text-sm text-red-700">We couldn&apos;t find a certificate with that ID. Please check and try again.</p>
              </div>
            )}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

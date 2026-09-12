import type { Metadata } from "next";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { PartnerLogo } from "@/components/marketing/cards";
import { PartnershipForm } from "@/components/marketing/partnership-form";
import { EmptyState } from "@/components/ui/empty-state";
import { getAllPartners } from "@/lib/data";

export const metadata: Metadata = {
  title: "Partners",
  description: "Partner with CitizensNexus — NGOs, government institutions, universities and private-sector organisations building the future of youth leadership in Africa.",
};

const PARTNER_TYPES = [
  { icon: "🏛️", title: "Government Institutions", text: "Policy alignment and civic-engagement collaboration." },
  { icon: "🌍", title: "NGOs & Development Orgs", text: "Joint programming and community-impact initiatives." },
  { icon: "🎓", title: "Universities", text: "Academic partnerships, research and student pipelines." },
  { icon: "🏢", title: "Private Sector", text: "Talent pipelines, sponsorships and skills partnerships." },
];

export default async function PartnersPage() {
  const partners = await getAllPartners();

  return (
    <>
      <Section tone="navy" className="pt-16">
        <Container>
          <SectionHeading
            eyebrow="Partners"
            title="Build the future of youth leadership with us"
            description="CitizensNexus partners with NGOs, government institutions, universities and private-sector organisations to scale youth leadership development across Africa."
            tone="dark"
          />
        </Container>
      </Section>

      <Section tone="light">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNER_TYPES.map((t) => (
              <div key={t.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
                <span className="text-2xl">{t.icon}</span>
                <p className="mt-3 font-bold text-navy-950">{t.title}</p>
                <p className="mt-1 text-sm text-navy-500">{t.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeading eyebrow="Current partners" title="Institutions building this ecosystem with us" align="center" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {partners.length ? (
              partners.map((p) => <PartnerLogo key={p.id} partner={p} />)
            ) : (
              <div className="col-span-2 sm:col-span-4">
                <EmptyState icon="🤝" title="Partner organisations coming soon" />
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section tone="light">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Become a partner" title="Submit a partnership enquiry" align="center" />
          <div className="mt-8">
            <PartnershipForm />
          </div>
        </Container>
      </Section>
    </>
  );
}

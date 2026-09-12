import type { Metadata } from "next";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the CitizensNexus team.",
};

export default function ContactPage() {
  return (
    <Section tone="light" className="pt-12">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Get in touch"
            description="Questions about programmes, partnerships, mentorship or media? We'd love to hear from you."
          />
          <div className="mt-8 space-y-4 text-sm text-navy-600">
            <p>
              <span className="font-semibold text-navy-900">Email:</span> hello@citizensnexus.africa
            </p>
            <p>
              <span className="font-semibold text-navy-900">Location:</span> Lagos, Nigeria (serving fellows across Africa)
            </p>
          </div>
        </div>
        <ContactForm />
      </Container>
    </Section>
  );
}

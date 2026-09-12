import type { Metadata } from "next";
import { Section, Container, SectionHeading } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { getSiteStats, getFeaturedPartners } from "@/lib/data";
import { PartnerLogo } from "@/components/marketing/cards";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "About CitizensNexus",
  description:
    "Learn about CitizensNexus — the youth leadership, mentorship and civic-impact platform connecting citizens, developing leaders and creating impact across Nigeria and Africa.",
};

const VALUES = [
  { title: "Purpose", text: "Every fellow discovers and pursues a clear sense of purpose." },
  { title: "Integrity", text: "We build trust with institutions, mentors and young people alike." },
  { title: "Excellence", text: "High standards in programming, mentorship and impact measurement." },
  { title: "Collaboration", text: "Leadership is built in community, not isolation." },
  { title: "Innovation", text: "We embrace digital tools and AI-readiness for the future of work." },
  { title: "Impact", text: "Every activity is designed to produce measurable, real-world outcomes." },
];

export default async function AboutPage() {
  const [stats, partners] = await Promise.all([getSiteStats(), getFeaturedPartners(6)]);

  return (
    <>
      <Section tone="navy" className="pt-16">
        <Container>
          <SectionHeading
            eyebrow="About CitizensNexus"
            title="Connecting Citizens. Developing Leaders. Creating Impact."
            description="CitizensNexus identifies, develops, connects and empowers young people across Nigeria and Africa to become effective leaders and changemakers — through mentorship, structured learning, civic-impact projects and a professional network."
            tone="dark"
          />
        </Container>
      </Section>

      <Section tone="light">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-navy-950">Our Mission</h2>
            <p className="mt-4 leading-relaxed text-navy-600">
              To build a generation of purpose-driven young African leaders equipped with the mindset,
              skills, mentorship and networks to solve real problems in their communities and beyond.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy-950">Our Vision</h2>
            <p className="mt-4 leading-relaxed text-navy-600">
              A future where every young person on the continent has access to the mentorship,
              opportunities and platforms they need to lead — from their community to the global stage.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeading eyebrow="What we do" title="A full ecosystem for youth leadership development" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🎓", title: "Fellowship Cohorts", text: "Structured, mentor-guided leadership cohorts." },
              { icon: "🤝", title: "Mentorship", text: "One-on-one mentorship from experienced professionals." },
              { icon: "📚", title: "Learning Hub", text: "Courses across 14+ leadership & professional disciplines." },
              { icon: "📌", title: "Opportunities", text: "Curated jobs, scholarships, grants and fellowships." },
              { icon: "🌍", title: "Civic Projects", text: "Real projects mapped to the UN SDGs." },
              { icon: "🌐", title: "Community", text: "A professional network of fellows, mentors and partners." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-3 font-bold text-navy-950">{item.title}</p>
                <p className="mt-1 text-sm text-navy-500">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="light">
        <Container>
          <SectionHeading eyebrow="Our values" title="What guides our work" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-navy-100 p-5">
                <p className="font-bold text-navy-950">{v.title}</p>
                <p className="mt-1 text-sm text-navy-500">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <div className="border-y border-navy-100 bg-white">
        <Container className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-extrabold text-navy-950">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-navy-500">{stat.label}</p>
            </div>
          ))}
        </Container>
      </div>

      <Section tone="light">
        <Container>
          <SectionHeading eyebrow="Our partners" title="Working with credible institutions" align="center" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {partners.length ? partners.map((p) => <PartnerLogo key={p.id} partner={p} />) : <div className="col-span-full"><EmptyState icon="🤝" title="Partner organisations coming soon" /></div>}
          </div>
        </Container>
      </Section>

      <Section tone="navy" className="text-center">
        <Container>
          <h2 className="text-3xl font-bold">Ready to build your leadership journey?</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LinkButton href="/programmes" variant="gold" size="lg">
              Explore Programmes
            </LinkButton>
            <LinkButton href="/contact" variant="outline-light" size="lg">
              Get in Touch
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}

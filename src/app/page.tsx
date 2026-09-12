import { Hero } from "@/components/marketing/hero";
import { Section, SectionHeading, Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ProgrammeCard,
  OpportunityCard,
  MentorCard,
  EventCard,
  ProjectCard,
  TestimonialCard,
  PartnerLogo,
} from "@/components/marketing/cards";
import {
  getSiteStats,
  getFeaturedProgrammes,
  getFeaturedOpportunities,
  getFeaturedMentors,
  getUpcomingEvents,
  getFeaturedProjects,
  getFeaturedTestimonials,
  getFeaturedPartners,
  getAllFellows,
} from "@/lib/data";
import { LEARNING_CATEGORIES } from "@/lib/constants";

export default async function HomePage() {
  const [stats, programmes, opportunities, mentors, events, projects, testimonials, partners, fellows] =
    await Promise.all([
      getSiteStats(),
      getFeaturedProgrammes(),
      getFeaturedOpportunities(3),
      getFeaturedMentors(),
      getUpcomingEvents(3),
      getFeaturedProjects(),
      getFeaturedTestimonials(),
      getFeaturedPartners(),
      getAllFellows(),
    ]);

  const fellowSpotlight = fellows[0];

  return (
    <>
      <Hero />

      {/* Impact stats */}
      <div className="border-b border-navy-100 bg-white">
        <Container className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-extrabold text-navy-950 sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-navy-500 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </Container>
      </div>

      {/* What is CitizensNexus */}
      <Section tone="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="What is CitizensNexus?"
                title="A digital home for Africa's next generation of leaders."
                description="CitizensNexus is where ambitious young people discover mentorship, structured leadership development, civic-impact projects and a professional network — all in one platform built for credibility and scale."
              />
              <ul className="mt-8 space-y-4">
                {[
                  "Structured fellowship cohorts with mentors and coordinators",
                  "An LMS-style Learning Hub across 14+ leadership disciplines",
                  "Curated opportunities: jobs, scholarships, grants & fellowships",
                  "Civic-impact projects mapped to the UN Sustainable Development Goals",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-navy-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-xs font-bold text-gold-700">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <WhyCard icon="🎯" title="Purpose-driven" text="Every fellow is matched to programmes aligned with their goals." />
              <WhyCard icon="🤝" title="Mentor-guided" text="One-on-one mentorship from experienced professionals." />
              <WhyCard icon="📈" title="Trackable growth" text="Transparent progress across learning, mentorship and projects." />
              <WhyCard icon="🌍" title="Impact-focused" text="Projects that contribute to real community and SDG outcomes." />
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured programmes */}
      <Section tone="sand">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Programmes" title="Featured leadership programmes" />
            <LinkButton href="/programmes" variant="outline" size="sm">
              View all programmes
            </LinkButton>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.length ? (
              programmes.map((programme) => <ProgrammeCard key={programme.id} programme={programme} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState icon="🎓" title="Programmes are being finalised" description="New CitizensNexus programmes will appear here as soon as they're published." />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Opportunities */}
      <Section tone="light">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Opportunities" title="Current opportunities for young people" />
            <LinkButton href="/opportunities" variant="outline" size="sm">
              Browse all opportunities
            </LinkButton>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.length ? (
              opportunities.map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState icon="📌" title="No opportunities published yet" />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Featured mentors */}
      <Section tone="navy">
        <Container>
          <SectionHeading eyebrow="Mentors" title="Learn from experienced changemakers" tone="dark" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mentors.length ? (
              mentors.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-4">
                <EmptyState icon="🧑‍🏫" title="Mentor profiles coming soon" />
              </div>
            )}
          </div>
          <div className="mt-10 text-center">
            <LinkButton href="/mentors" variant="outline-light" size="md">
              Meet all mentors
            </LinkButton>
          </div>
        </Container>
      </Section>

      {/* Fellow spotlight */}
      {fellowSpotlight ? (
        <Section tone="sand">
          <Container>
            <div className="grid items-center gap-10 rounded-3xl bg-white p-8 shadow-[var(--shadow-card)] lg:grid-cols-[auto_1fr] lg:p-12">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-navy-950 text-3xl font-bold text-gold-300 lg:h-32 lg:w-32">
                {fellowSpotlight.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gold-600">Fellow Spotlight</p>
                <h3 className="mt-2 text-2xl font-bold text-navy-950">{fellowSpotlight.user.name}</h3>
                <p className="mt-1 text-sm font-semibold text-navy-500">
                  {fellowSpotlight.cohort.programme.name} · {fellowSpotlight.cohort.name}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-navy-600">
                  {fellowSpotlight.user.profile?.bio ??
                    "A dedicated CitizensNexus fellow building leadership, civic and professional skills through mentorship, learning and real-world projects."}
                </p>
                <LinkButton href="/fellows" variant="outline" size="sm" className="mt-6">
                  Meet the fellows
                </LinkButton>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Impact stats / SDG teaser + Projects */}
      <Section tone="light">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Impact" title="Civic & community projects" />
            <LinkButton href="/projects" variant="outline" size="sm">
              View all projects
            </LinkButton>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.length ? (
              projects.map((project) => <ProjectCard key={project.id} project={project} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState icon="🌍" title="Projects will be published as fellows launch them" />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Upcoming events */}
      <Section tone="sand">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Events" title="Upcoming events" />
            <LinkButton href="/events" variant="outline" size="sm">
              See full calendar
            </LinkButton>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.length ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState icon="🗓️" title="No upcoming events scheduled" />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Learning hub teaser */}
      <Section tone="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Learning Hub"
                title="Build in-demand leadership and professional skills"
                description="Structured courses, modules and lessons across leadership, entrepreneurship, digital & AI skills, advocacy, research and more — with progress tracking built in."
              />
              <LinkButton href="/learning" variant="primary" size="md" className="mt-6">
                Explore the Learning Hub
              </LinkButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {LEARNING_CATEGORIES.map((cat) => (
                <span key={cat} className="rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-700">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Success stories */}
      <Section tone="navy">
        <Container>
          <SectionHeading eyebrow="Success Stories" title="Voices of the CitizensNexus community" tone="dark" align="center" />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.length ? (
              testimonials.map((t) => <TestimonialCard key={t.id} testimonial={t} />)
            ) : (
              <div className="lg:col-span-3">
                <EmptyState icon="💬" title="Success stories are being collected" />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Partners */}
      <Section tone="light">
        <Container>
          <SectionHeading eyebrow="Partners" title="Institutions building this ecosystem with us" align="center" />
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

      {/* Final CTA */}
      <Section tone="navy" className="text-center">
        <Container>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
            Ready to turn your potential into impact?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-200">
            Join thousands of young Africans building leadership skills, finding mentors and creating
            real community impact through CitizensNexus.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LinkButton href="/apply" variant="gold" size="lg">
              Start Your Application
            </LinkButton>
            <LinkButton href="/about" variant="outline-light" size="lg">
              Learn More
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}

function WhyCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-[var(--shadow-card)]">
      <span className="text-2xl">{icon}</span>
      <p className="mt-3 text-sm font-bold text-navy-950">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-navy-500">{text}</p>
    </div>
  );
}

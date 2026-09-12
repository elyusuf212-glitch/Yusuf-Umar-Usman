import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" aria-hidden />
      <div
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-500/20 blur-3xl"
        aria-hidden
      />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-navy-500/30 blur-3xl" aria-hidden />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
              Youth Leadership · Mentorship · Civic Impact
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Your Purpose.
              <br />
              Your People.
              <br />
              <span className="text-gold-300">Your Impact.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100">
              CitizensNexus connects young people with the mentorship, skills, opportunities and
              networks they need to turn potential into meaningful impact.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <LinkButton href="/programmes" variant="gold" size="lg">
                Explore Programmes
              </LinkButton>
              <LinkButton href="/register" variant="outline-light" size="lg">
                Join CitizensNexus
              </LinkButton>
            </div>
            <p className="mt-8 text-sm text-navy-300">
              Trusted by NGOs, government institutions, universities and private-sector partners
              across Nigeria and Africa.
            </p>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="translate-y-8 space-y-4">
                <HeroCard title="20 Fellows" subtitle="Selected from 280 applicants — CitizensNexus 1.0" />
                <HeroCard title="16 Skill Areas" subtitle="From leadership to AI & data" tone="gold" />
              </div>
              <div className="space-y-4">
                <HeroCard title="200+ Mentors" subtitle="Guiding the next generation of leaders" tone="gold" />
                <HeroCard title="17 SDGs" subtitle="Every project maps to real-world impact" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function HeroCard({ title, subtitle, tone = "navy" }: { title: string; subtitle: string; tone?: "navy" | "gold" }) {
  return (
    <div
      className={
        tone === "gold"
          ? "rounded-2xl border border-gold-400/30 bg-gold-400/10 p-5 backdrop-blur"
          : "rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
      }
    >
      <p className={tone === "gold" ? "text-xl font-bold text-gold-200" : "text-xl font-bold text-white"}>{title}</p>
      <p className="mt-1.5 text-sm text-navy-200">{subtitle}</p>
    </div>
  );
}

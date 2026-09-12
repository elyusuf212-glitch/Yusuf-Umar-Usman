import Link from "next/link";
import type { Programme, Opportunity, Event, Mentor, User, Project, Sdg, ProjectSDG, Testimonial, Partner } from "@prisma/client";
import { Card, Badge } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
import { OPPORTUNITY_CATEGORIES, EVENT_TYPES } from "@/lib/constants";

export function ProgrammeCard({ programme }: { programme: Programme }) {
  return (
    <Link href={`/programmes/${programme.slug}`}>
      <Card className="group h-full p-6">
        <div className="flex items-center justify-between gap-2">
          <Badge tone="gold">{programme.theme ?? "Leadership"}</Badge>
          <Badge tone={programme.status === "OPEN_FOR_APPLICATIONS" ? "green" : "navy"}>
            {programme.status.replaceAll("_", " ")}
          </Badge>
        </div>
        <h3 className="mt-4 text-lg font-bold text-navy-950 group-hover:text-navy-700">{programme.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-600">{programme.description}</p>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-navy-500">
          {programme.location ? <span>📍 {programme.location}</span> : null}
          {programme.slots ? <span>🎓 {programme.slots} slots</span> : null}
        </div>
      </Card>
    </Link>
  );
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const label = OPPORTUNITY_CATEGORIES.find((c) => c.value === opportunity.category)?.label ?? opportunity.category;
  return (
    <Card className="h-full p-6">
      <div className="flex items-center justify-between gap-2">
        <Badge tone="navy">{label}</Badge>
        {opportunity.isFeatured ? <Badge tone="gold">Featured</Badge> : null}
      </div>
      <h3 className="mt-4 text-base font-bold text-navy-950">{opportunity.title}</h3>
      <p className="mt-1 text-sm font-medium text-navy-500">{opportunity.organisation}</p>
      <p className="mt-3 line-clamp-2 text-sm text-navy-600">{opportunity.description}</p>
      <div className="mt-5 flex items-center justify-between text-xs font-medium text-navy-500">
        <span>{opportunity.location ?? "Remote / Various"}</span>
        {opportunity.deadline ? <span>Deadline: {formatDateShort(opportunity.deadline)}</span> : null}
      </div>
      <a
        href={opportunity.applicationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex text-sm font-semibold text-navy-900 underline decoration-gold-400 decoration-2 underline-offset-4"
      >
        View & Apply →
      </a>
    </Card>
  );
}

export function EventCard({ event }: { event: Event }) {
  const label = EVENT_TYPES.find((t) => t.value === event.eventType)?.label ?? event.eventType;
  return (
    <Link href={`/events/${event.slug}`}>
      <Card className="flex h-full gap-4 p-6">
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-navy-950 text-white">
          <span className="text-xs font-semibold uppercase text-gold-300">
            {new Intl.DateTimeFormat("en-NG", { month: "short" }).format(event.startAt)}
          </span>
          <span className="text-xl font-bold">{new Intl.DateTimeFormat("en-NG", { day: "numeric" }).format(event.startAt)}</span>
        </div>
        <div>
          <Badge tone="gray">{label}</Badge>
          <h3 className="mt-2 text-base font-bold text-navy-950">{event.title}</h3>
          <p className="mt-1 text-xs font-medium text-navy-500">
            {event.mode === "ONLINE" ? "Online" : event.location ?? "Lagos, Nigeria"}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export function MentorCard({ mentor }: { mentor: Mentor & { user: User } }) {
  return (
    <Card className="h-full p-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy-100 text-2xl font-bold text-navy-700">
        {mentor.user.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
      </div>
      <h3 className="mt-4 text-base font-bold text-navy-950">{mentor.user.name}</h3>
      <p className="text-sm font-medium text-gold-700">{mentor.title}</p>
      <p className="text-xs text-navy-500">{mentor.organisation}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {mentor.expertiseAreas.slice(0, 3).map((area) => (
          <Badge key={area} tone="navy" className="text-[11px]">
            {area}
          </Badge>
        ))}
      </div>
    </Card>
  );
}

type ProjectWithSdgs = Project & { sdgs: (ProjectSDG & { sdg: Sdg })[] };

export function ProjectCard({ project }: { project: ProjectWithSdgs }) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="h-full overflow-hidden">
        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950 text-4xl">
          🌍
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-1.5">
            {project.sdgs.slice(0, 3).map(({ sdg }) => (
              <span
                key={sdg.id}
                className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                style={{ backgroundColor: sdg.colorHex }}
              >
                SDG {sdg.number}
              </span>
            ))}
          </div>
          <h3 className="mt-3 text-base font-bold text-navy-950">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-navy-600">{project.description}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-navy-500">
            {project.location} · {project.year}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="flex h-full flex-col justify-between p-7">
      <p className="text-lg leading-relaxed text-navy-800">“{testimonial.quote}”</p>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-100 text-sm font-bold text-gold-800">
          {testimonial.authorName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <p className="text-sm font-bold text-navy-950">{testimonial.authorName}</p>
          <p className="text-xs text-navy-500">{testimonial.authorRole}</p>
        </div>
      </div>
    </Card>
  );
}

export function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <div className="flex h-20 items-center justify-center rounded-xl border border-navy-100 bg-white px-6 text-center text-sm font-bold text-navy-500">
      {partner.organisationName}
    </div>
  );
}

# CitizensNexus

**Connecting Citizens. Developing Leaders. Creating Impact.**

CitizensNexus is a youth leadership, mentorship, learning, networking and civic-impact
platform that identifies, develops, connects and empowers young people across Nigeria
and Africa to become effective leaders and changemakers.

This repository contains a working, database-backed implementation: a full public
marketing site plus secure, role-based dashboards for Fellows, Mentors, Administrators
and Partners, built on Next.js, PostgreSQL and Prisma.

---

## 1. Tech stack & key decisions

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Server Components for data, Route Handlers for mutations |
| Styling | Tailwind CSS v4 | Custom navy/gold design system defined in `src/app/globals.css` via `@theme` |
| Database | PostgreSQL | See schema in `prisma/schema.prisma` |
| ORM | Prisma **6.19.3** | Prisma 7/8 (installed as the `latest` tag at the time of building) requires a breaking driver-adapter config (`prisma.config.ts` + `@prisma/adapter-pg`) that is still an RC-quality workflow; pinning to the last stable Prisma 6 release keeps the classic `datasource { url = env(...) }` schema and a stable CLI. Revisit this pin once Prisma 7 stabilizes. |
| Auth | Custom cookie-based session (bcrypt + `jose` HS256 JWT) | NextAuth/Auth.js v5's App Router support was still evolving against this Next.js/React version at build time, so a small, fully-owned auth module (`src/lib/auth.ts`) was used instead — httpOnly/secure/SameSite cookies, bcrypt password hashing, and role-based route protection via `src/proxy.ts` (Next 16 renamed `middleware.ts` → `proxy.ts`). This is documented so it can be swapped for Auth.js later without changing the data model (the `User.passwordHash` field is compatible with a credentials provider). |
| Forms | React Hook Form + Zod | `src/lib/validation.ts` |
| Charts | Recharts | `src/components/dashboard/charts.tsx` |
| File storage | *Not wired up* | Architecture assumes Cloudinary/S3-compatible storage for avatars, certificates PDFs and resource uploads later; current forms accept URLs (e.g. resources, mentor LinkedIn) rather than direct uploads. See §7. |

### Documented assumptions

Per the brief's instruction to make sensible assumptions rather than block on questions:

- **Roles**: `ADMIN`, `PROGRAMME_MANAGER` (full admin dashboard access), `MENTOR`, `FELLOW`, `PARTNER`, and `MEMBER` (a registered user who has not yet been accepted as a Fellow — this is the "Applicant" experience).
- **Fellow creation is automatic**: accepting an `Application` (status → `ACCEPTED`) in the admin dashboard atomically creates a `Fellow` record, upgrades the user's role to `FELLOW`, and sends a notification — modeling the workflow in the brief (§34) exactly.
- **Certificates**: issuing a certificate from the admin dashboard also marks the Fellow `GRADUATED` and sets progress to 100%. Certificate codes are verifiable at the public `/certificates/verify` page (no login required), matching the "public certificate verification page" requirement.
- **Email/SMS notifications**: the `Notification` model and in-app notification center are fully implemented; the architecture is ready for a transactional email provider (see `.env.example`), but no outbound email/SMS is actually sent in this environment — that would need a provider key and is explicitly called out as a limitation.
- **Rate limiting**: a lightweight in-memory limiter (`src/lib/rate-limit.ts`) protects auth/contact/partnership endpoints from brute-force/spam in a single-instance deployment. For multi-instance production deployments, swap in a shared store (Redis, Upstash, etc.).

---

## 2. Getting started locally

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (a local instance, or a hosted one e.g. Supabase/Neon/RDS)

### Setup

```bash
npm install
cp .env.example .env
# edit .env: set DATABASE_URL to your Postgres connection string
#            set AUTH_SECRET to a long random string (openssl rand -base64 32)

npx prisma db push      # create tables from prisma/schema.prisma (or `npm run db:push`)
npm run db:seed         # populate realistic sample data (see accounts below)
npm run dev             # start the app at http://localhost:3000
```

### Demo accounts

All seeded accounts share the password **`CitizensNexus2025!`**

| Role | Email |
|---|---|
| Administrator | `admin@citizensnexus.africa` |
| Programme Manager | `manager@citizensnexus.africa` |
| Mentor (×5) | `mentor1@citizensnexus.africa` … `mentor5@citizensnexus.africa` |
| Fellow (×20) | `fellow1@citizensnexus.africa` … `fellow20@citizensnexus.africa` |
| Partner | `partner@citizensnexus.africa` |
| Applicant (Member, has a submitted application) | `applicant@citizensnexus.africa` |

### Database migrations (production workflow)

`db push` (used above) is convenient for local development because it does not
generate a migration history. For production, generate a proper migration once
your schema is stable:

```bash
npm run db:migrate -- --name init      # creates prisma/migrations/*, applies it
npx prisma migrate deploy              # run in CI/production to apply pending migrations
```

`npm run db:studio` opens Prisma Studio to browse/edit data visually.

---

## 3. Project structure

```
prisma/
  schema.prisma        # full data model (see §4)
  seed.ts               # realistic sample data
src/
  app/
    (public pages)      # /, /about, /programmes, /mentorship, /fellows, /mentors,
                         # /opportunities, /events, /learning, /projects, /stories,
                         # /resources, /partners, /contact, /login, /register,
                         # /apply, /certificates/verify
    dashboard/
      admin/             # full admin console (see §5)
      fellow/            # fellow dashboard
      mentor/            # mentor dashboard
      partner/           # partner dashboard
      applicant/         # applicant ("Member") dashboard
    api/                 # Route Handlers — auth, applications, admin CRUD, etc.
  components/
    ui/                  # Button, Card, Form primitives, EmptyState…
    layout/              # Navbar, Footer, Logo
    marketing/            # Hero, cards, application form, contact/partnership forms
    dashboard/            # DashboardShell, charts, widgets, admin forms
  lib/
    auth.ts               # session creation/verification, password hashing
    roles.ts               # client-safe role helpers (no server-only imports)
    db.ts                   # Prisma client singleton
    data.ts / admin-data.ts  # typed data-access functions used by pages
    validation.ts             # Zod schemas
    constants.ts               # nav, SDGs, categories, labels shared across app
  proxy.ts                # role-based route protection (Next 16's middleware)
```

---

## 4. Data model

The full schema lives in `prisma/schema.prisma`. It covers, at minimum, every
entity requested in the brief: `User`/`Profile`, `Programme`/`Cohort`,
`Application`, `Fellow`, `Mentor`/`MentorAssignment`/`MentorSession`,
`Course`/`CourseModule`/`Lesson`/`Enrollment`/`Assignment`/`Submission`,
`Event`/`EventRegistration`, `Opportunity`, `Project`/`Sdg`/`ProjectSDG`,
`Certificate`, `Notification`, `Message`, `Announcement`, `Partner`,
`Resource`, `Testimonial`, `SiteSetting`, `AuditLog`, plus supporting join
tables (`ProgrammeCoordinator`, `ProjectMember`, `Attendance`) and a
`PartnershipInquiry` model for the partner enquiry form.

Relationships are fully normalized (see the file for exact foreign keys and
`@@unique` constraints) — e.g. `Application` is unique per
`(userId, programmeId, cohortId)`, `Fellow.userId` is unique (one fellow
profile per user), `MentorAssignment` is unique per `(mentorId, fellowId)`.

---

## 5. What's implemented

This is a working MVP, not a mockup — every button/link either performs a
real database operation or navigates to a real page.

**Public site**: Home (live stats, featured programmes/opportunities/mentors/
events/projects/stories/partners, all editable/seed-driven), About, Programmes
(+ detail with cohorts/events/resources), Mentorship, Fellows, Mentors,
Opportunities (filterable), Events (+ detail with registration), Learning Hub
(+ course detail with enrollment), Projects (+ SDG filter/detail), Success
Stories, Resources, Partners (+ partnership enquiry form), Contact,
Login/Register, Application Portal, public Certificate Verification.

**Application Portal**: full multi-section form (personal info, education,
professional background, leadership/community experience, skills, motivation,
portfolio, references, essays) with save-as-draft, submit, and status
tracking (`Draft → Submitted → Under Review → Shortlisted → Interview →
Accepted/Waitlisted/Rejected`).

**Fellow dashboard**: overview (progress, mentor, courses, announcements,
notifications), Learning Hub with enrollment progress, mentor + session
history, certificates, editable profile.

**Mentor dashboard**: assigned fellows roster, per-fellow detail with session
logging (notes, status), editable mentor profile shown on the public Mentors
page.

**Partner dashboard**: impact overview, featured projects/opportunities, link
to the partnership enquiry form.

**Admin dashboard**: overview with live charts (applications by
programme/status, user growth, learning progress via Recharts); Users (role
management); Fellows & Mentors (rosters); Programmes (create/edit + cohort
manager); Applications (filter, full review panel, score/notes, and
**accept → auto-creates Fellow + upgrades role + notifies** exactly per the
brief's workflow); Courses (module/lesson builder + publish toggle);
Events & Opportunities (create/edit); Announcements (broadcast with
notification fan-out); Projects (SDG-tagged); Certificates (issue + verify);
Content (testimonials & resources); Partners (approve/feature + view
enquiries); Reports (CSV export of all applications, SDG impact chart);
Settings (editable homepage impact statistics).

**Security**: bcrypt password hashing, httpOnly/secure/SameSite session
cookies, role-based middleware (`src/proxy.ts`) protecting every
`/dashboard/*` route by role, Zod validation on every mutation endpoint,
constant-shape login responses (no user enumeration), in-memory rate limiting
on auth/contact/partnership endpoints, audit logging (`AuditLog`) for
sensitive admin actions.

**SEO**: per-page metadata (title/description/OpenGraph), `sitemap.xml`
(including all dynamic programme/event/course/project URLs), `robots.txt`,
semantic HTML throughout.

---

## 6. Known limitations (by design, for this environment)

These are explicitly *not* faked — they are either out of scope for a
from-scratch build in this environment, or intentionally deferred:

- **No outbound email/SMS.** The `Notification` data model and in-app
  notification center work fully; wiring an actual email provider (Resend,
  SendGrid, etc.) or SMS gateway (Termii, Twilio) is a config-only change —
  add the API key to `.env` and call it from the same places `Notification`
  records are already created (e.g. `src/app/api/admin/applications/[id]/route.ts`).
- **No file uploads.** Profile photos, certificate PDFs and resource files
  are stored as URLs, not uploaded binaries. Swap in Cloudinary/S3 by adding
  an upload endpoint and pointing the existing URL fields at it.
- **No PDF certificate generation.** `Certificate.pdfUrl` exists in the schema
  for this; verification works fully today via the public lookup page.
- **AI features (mentor matching, opportunity recommendations, CV feedback,
  chatbot)** are explicitly *not* implemented, per the brief's instruction not
  to pretend AI features exist unless they do. The data model (skills,
  interests, expertise areas as structured fields) is shaped so these can be
  added later without a schema migration.
- **Prisma 6, not 7/8.** See the table in §1.

---

## 7. Deployment

The app is Vercel-compatible out of the box.

1. Provision a PostgreSQL database (Vercel Postgres, Supabase, Neon, RDS, etc.).
2. Set environment variables in your hosting provider (see `.env.example`):
   `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`.
3. Run migrations against the production database:
   `npx prisma migrate deploy`
4. (Optional, first deploy only) seed initial content:
   `npm run db:seed`
5. Deploy (`vercel deploy` or connect the Git repository in the Vercel
   dashboard). Build command: `npm run build`. Prisma's client is generated
   automatically via the `postinstall`-less flow — if you add one, run
   `npx prisma generate`.

For a non-Vercel Node host, `npm run build && npm run start` serves the app.

---

## 8. Future scalability (architected for, not built)

The data model and API layer were designed so the following can be added
without breaking changes: a mobile app (the API routes are already JSON, not
tied to server-rendered forms), WhatsApp/SMS notifications (fan out from the
existing `Notification` creation points), AI mentor/opportunity matching and
CV feedback (structured `skills`/`expertiseAreas`/`interests` fields exist on
`Profile`, `Mentor`, and `Application`), automated certificate generation,
email campaigns, multilingual support (all copy lives in components, not yet
externalized to an i18n layer, but nothing blocks adding one), and
regional/country-level programme chapters (the `Programme`/`Cohort` model
already supports unlimited concurrent programmes with independent
locations/formats).

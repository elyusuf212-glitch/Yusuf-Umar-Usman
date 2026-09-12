import { db } from "@/lib/db";
import { IMPACT_STATS_DEFAULT } from "@/lib/constants";

export async function getSiteStats() {
  const setting = await db.siteSetting.findUnique({ where: { key: "impact_stats" } });
  if (setting?.value) return setting.value as { label: string; value: string }[];
  return IMPACT_STATS_DEFAULT;
}

export async function getFeaturedProgrammes(take = 3) {
  return db.programme.findMany({
    where: { status: { in: ["PUBLISHED", "OPEN_FOR_APPLICATIONS", "IN_PROGRESS"] } },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getAllProgrammes() {
  return db.programme.findMany({
    where: { status: { not: "DRAFT" } },
    orderBy: { createdAt: "desc" },
    include: { cohorts: true },
  });
}

export async function getProgrammeBySlug(slug: string) {
  return db.programme.findUnique({
    where: { slug },
    include: {
      cohorts: { orderBy: { year: "desc" } },
      coordinators: { include: { user: true } },
      courses: true,
      events: { where: { isPublished: true }, orderBy: { startAt: "asc" } },
      resources: true,
    },
  });
}

export async function getUpcomingEvents(take = 4) {
  return db.event.findMany({
    where: { isPublished: true, startAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
    take,
  });
}

export async function getAllEvents() {
  return db.event.findMany({ where: { isPublished: true }, orderBy: { startAt: "asc" } });
}

export async function getFeaturedOpportunities(take = 5) {
  return db.opportunity.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take,
  });
}

export async function getAllOpportunities() {
  return db.opportunity.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" } });
}

export async function getFeaturedMentors(take = 4) {
  return db.mentor.findMany({
    where: { isActive: true },
    include: { user: true },
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllMentors() {
  return db.mentor.findMany({ where: { isActive: true }, include: { user: true }, orderBy: { createdAt: "desc" } });
}

export async function getAllFellows() {
  return db.fellow.findMany({
    include: { user: { include: { profile: true } }, cohort: { include: { programme: true } } },
    orderBy: { joinedAt: "desc" },
  });
}

export async function getFeaturedTestimonials(take = 3) {
  return db.testimonial.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take,
  });
}

export async function getAllTestimonials() {
  return db.testimonial.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" } });
}

export async function getFeaturedProjects(take = 3) {
  return db.project.findMany({
    include: { sdgs: { include: { sdg: true } } },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getAllProjects() {
  return db.project.findMany({
    include: { sdgs: { include: { sdg: true } }, programme: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSdgImpact() {
  const sdgs = await db.sdg.findMany({ orderBy: { number: "asc" }, include: { projects: true } });
  return sdgs;
}

export async function getFeaturedPartners(take = 8) {
  return db.partner.findMany({ where: { isApproved: true }, orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }], take });
}

export async function getAllPartners() {
  return db.partner.findMany({ where: { isApproved: true }, orderBy: { createdAt: "desc" } });
}

export async function getPublishedCourses() {
  return db.course.findMany({
    where: { isPublished: true },
    include: { modules: { include: { lessons: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseBySlug(slug: string) {
  return db.course.findUnique({
    where: { slug },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });
}

export async function getPublishedResources() {
  return db.resource.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" } });
}

export async function getFellowByUserId(userId: string) {
  return db.fellow.findUnique({
    where: { userId },
    include: {
      user: { include: { profile: true, enrollments: { include: { course: true } } } },
      cohort: { include: { programme: true } },
      mentorAssignments: { include: { mentor: { include: { user: true } }, sessions: { orderBy: { scheduledAt: "asc" } } } },
      certificates: true,
    },
  });
}

export async function getMentorByUserId(userId: string) {
  return db.mentor.findUnique({
    where: { userId },
    include: {
      user: true,
      assignments: {
        include: {
          fellow: { include: { user: { include: { profile: true } }, cohort: { include: { programme: true } } } },
          sessions: { orderBy: { scheduledAt: "asc" } },
        },
      },
    },
  });
}

export async function getPartnerByUserId(userId: string) {
  return db.partner.findUnique({ where: { userId } });
}

export async function getUserApplications(userId: string) {
  return db.application.findMany({
    where: { userId },
    include: { programme: true, cohort: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getNotificationsForUser(userId: string, take = 10) {
  return db.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take });
}

export async function getAnnouncementsForAudience(audiences: string[]) {
  return db.announcement.findMany({
    where: { isPublished: true, audience: { in: audiences as never[] } },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });
}

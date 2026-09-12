import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/programmes",
    "/mentorship",
    "/fellows",
    "/mentors",
    "/opportunities",
    "/events",
    "/learning",
    "/projects",
    "/stories",
    "/resources",
    "/partners",
    "/contact",
    "/login",
    "/register",
    "/apply",
    "/certificates/verify",
  ].map((path) => ({ url: `${SITE.url}${path}`, lastModified: new Date() }));

  const [programmes, events, courses, projects] = await Promise.all([
    db.programme.findMany({ where: { status: { not: "DRAFT" } }, select: { slug: true, updatedAt: true } }),
    db.event.findMany({ where: { isPublished: true }, select: { slug: true, createdAt: true } }),
    db.course.findMany({ where: { isPublished: true }, select: { slug: true, createdAt: true } }),
    db.project.findMany({ select: { slug: true, createdAt: true } }),
  ]);

  return [
    ...staticRoutes,
    ...programmes.map((p) => ({ url: `${SITE.url}/programmes/${p.slug}`, lastModified: p.updatedAt })),
    ...events.map((e) => ({ url: `${SITE.url}/events/${e.slug}`, lastModified: e.createdAt })),
    ...courses.map((c) => ({ url: `${SITE.url}/learning/${c.slug}`, lastModified: c.createdAt })),
    ...projects.map((p) => ({ url: `${SITE.url}/projects/${p.slug}`, lastModified: p.createdAt })),
  ];
}

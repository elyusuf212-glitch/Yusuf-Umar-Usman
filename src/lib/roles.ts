import type { Role } from "@prisma/client";

// Client-safe role helpers — no server-only imports here.

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  PROGRAMME_MANAGER: "Programme Manager",
  MENTOR: "Mentor",
  FELLOW: "Fellow",
  PARTNER: "Partner",
  MEMBER: "Member",
};

export function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "ADMIN":
    case "PROGRAMME_MANAGER":
      return "/dashboard/admin";
    case "MENTOR":
      return "/dashboard/mentor";
    case "FELLOW":
      return "/dashboard/fellow";
    case "PARTNER":
      return "/dashboard/partner";
    default:
      return "/dashboard/applicant";
  }
}

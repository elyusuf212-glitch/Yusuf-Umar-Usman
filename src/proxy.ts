import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "cn_session";

const ROLE_PREFIXES: Record<string, string[]> = {
  "/dashboard/admin": ["ADMIN", "PROGRAMME_MANAGER"],
  "/dashboard/mentor": ["MENTOR"],
  "/dashboard/fellow": ["FELLOW"],
  "/dashboard/partner": ["PARTNER"],
  "/dashboard/applicant": ["MEMBER", "FELLOW", "MENTOR", "PARTNER", "ADMIN", "PROGRAMME_MANAGER"],
};

async function getRoleFromToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedPrefix = Object.keys(ROLE_PREFIXES).find((prefix) => pathname.startsWith(prefix));

  if (!matchedPrefix) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const role = await getRoleFromToken(token);

  if (!role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedRoles = ROLE_PREFIXES[matchedPrefix];
  if (!allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

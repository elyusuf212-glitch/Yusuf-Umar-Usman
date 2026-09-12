import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const { ok } = rateLimit(`login:${clientKeyFromRequest(request)}`, 10, 15 * 60 * 1000);
  if (!ok) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await db.user.findUnique({ where: { email: normalizedEmail } });

  // Constant-shape response whether the user exists or not, to avoid user enumeration.
  const invalidResponse = () => NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  if (!user || !user.isActive) {
    return invalidResponse();
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return invalidResponse();
  }

  const token = await createSessionToken({ sub: user.id, email: user.email, name: user.name, role: user.role });
  await setSessionCookie(token);

  await db.auditLog.create({
    data: { userId: user.id, action: "USER_LOGIN", entityType: "User", entityId: user.id },
  });

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

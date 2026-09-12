import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const { ok } = rateLimit(`register:${clientKeyFromRequest(request)}`, 10, 15 * 60 * 1000);
  if (!ok) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { name, email, password, phone } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      phone,
      role: "MEMBER",
      profile: { create: {} },
    },
  });

  await db.auditLog.create({
    data: { userId: user.id, action: "USER_REGISTERED", entityType: "User", entityId: user.id },
  });

  const token = await createSessionToken({ sub: user.id, email: user.email, name: user.name, role: user.role });
  await setSessionCookie(token);

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
}

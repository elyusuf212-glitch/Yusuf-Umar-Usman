import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({ eventId: z.string() });

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in to register for this event." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const event = await db.event.findUnique({ where: { id: parsed.data.eventId }, include: { _count: { select: { registrations: true } } } });
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  if (event.capacity && event._count.registrations >= event.capacity) {
    return NextResponse.json({ error: "This event is fully booked." }, { status: 409 });
  }

  const registration = await db.eventRegistration.upsert({
    where: { eventId_userId: { eventId: event.id, userId: session.sub } },
    create: { eventId: event.id, userId: session.sub },
    update: {},
  });

  await db.notification.create({
    data: {
      userId: session.sub,
      type: "EVENT_REMINDER",
      title: "Event registration confirmed",
      body: `You're registered for "${event.title}".`,
    },
  });

  return NextResponse.json({ registration }, { status: 201 });
}

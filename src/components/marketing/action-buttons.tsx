"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RegisterForEventButton({ eventId, alreadyRegistered }: { eventId: string; alreadyRegistered: boolean }) {
  const router = useRouter();
  const [registered, setRegistered] = useState(alreadyRegistered);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/event-registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });
    setBusy(false);
    if (res.status === 401) {
      router.push(`/login?next=/events`);
      return;
    }
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Something went wrong.");
      return;
    }
    setRegistered(true);
    router.refresh();
  }

  if (registered) {
    return <Button variant="outline" size="lg" disabled>You&apos;re registered ✓</Button>;
  }

  return (
    <div>
      <Button size="lg" onClick={onClick} disabled={busy}>
        {busy ? "Registering…" : "Register for this event"}
      </Button>
      {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

export function EnrollInCourseButton({ courseId, alreadyEnrolled }: { courseId: string; alreadyEnrolled: boolean }) {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(alreadyEnrolled);
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    const res = await fetch("/api/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    setBusy(false);
    if (res.status === 401) {
      router.push(`/login`);
      return;
    }
    if (res.ok) {
      setEnrolled(true);
      router.push("/dashboard/fellow/learning");
    }
  }

  if (enrolled) {
    return <Button variant="outline" size="lg" disabled>Enrolled ✓</Button>;
  }

  return (
    <Button size="lg" onClick={onClick} disabled={busy}>
      {busy ? "Enrolling…" : "Enroll in this course"}
    </Button>
  );
}

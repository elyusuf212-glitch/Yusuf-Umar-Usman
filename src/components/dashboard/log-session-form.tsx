"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function LogSessionForm({ mentorAssignmentId }: { mentorAssignmentId: string }) {
  const router = useRouter();
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("45");
  const [status, setStatus] = useState("COMPLETED");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/mentor-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorAssignmentId, scheduledAt, durationMinutes, status, mentorNotes: notes }),
    });
    setBusy(false);
    setScheduledAt("");
    setNotes("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField className="mb-0">
          <Label htmlFor="scheduledAt" required>
            Date & time
          </Label>
          <Input id="scheduledAt" type="datetime-local" required value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        </FormField>
        <FormField className="mb-0">
          <Label htmlFor="duration">Duration (min)</Label>
          <Input id="duration" type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
        </FormField>
        <FormField className="mb-0">
          <Label htmlFor="status">Status</Label>
          <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
        </FormField>
      </div>
      <FormField className="mb-0">
        <Label htmlFor="notes">Session notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What was discussed, progress observed, next steps…" />
      </FormField>
      <Button type="submit" size="sm" disabled={busy}>
        {busy ? "Logging…" : "Log Session"}
      </Button>
    </form>
  );
}

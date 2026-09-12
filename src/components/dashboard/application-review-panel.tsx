"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Select, Input, Textarea, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";

export function ApplicationReviewPanel({
  applicationId,
  initialStatus,
  initialScore,
  initialNotes,
}: {
  applicationId: string;
  initialStatus: string;
  initialScore: number | null;
  initialNotes: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [score, setScore] = useState(initialScore?.toString() ?? "");
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setSaved(false);
    await fetch(`/api/admin/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, score: score ? Number(score) : undefined, reviewerNotes: notes }),
    });
    setBusy(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="mb-4 text-base font-bold text-navy-950">Review</h2>
      <FormField>
        <Label>Status</Label>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField>
        <Label>Score (0–100)</Label>
        <Input type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} />
      </FormField>
      <FormField>
        <Label>Reviewer notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
      </FormField>
      <div className="flex items-center gap-4">
        <Button onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save Review"}
        </Button>
        {saved ? <span className="text-sm font-medium text-emerald-600">Saved</span> : null}
      </div>
      {status === "ACCEPTED" ? (
        <p className="mt-3 text-xs text-navy-500">Accepting will automatically create a Fellow profile and grant dashboard access.</p>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EVENT_TYPES } from "@/lib/constants";

export interface EventFormValues {
  title: string;
  description: string;
  eventType: string;
  mode: string;
  startAt: string;
  endAt: string;
  location: string;
  onlineLink: string;
  speaker: string;
  capacity: string;
  isPublished: boolean;
}

const EMPTY: EventFormValues = {
  title: "",
  description: "",
  eventType: "TRAINING",
  mode: "ONLINE",
  startAt: "",
  endAt: "",
  location: "",
  onlineLink: "",
  speaker: "",
  capacity: "",
  isPublished: true,
};

export function EventForm({ eventId, initial }: { eventId?: string; initial?: EventFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<EventFormValues>(initial ?? EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const url = eventId ? `/api/admin/events/${eventId}` : "/api/admin/events";
    const res = await fetch(url, {
      method: eventId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, capacity: values.capacity || undefined }),
    });
    setBusy(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Something went wrong.");
      return;
    }
    router.push("/dashboard/admin/events");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
      {error ? <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField className="sm:col-span-2">
          <Label required>Title</Label>
          <Input value={values.title} onChange={(e) => set("title", e.target.value)} required />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label required>Description</Label>
          <Textarea value={values.description} onChange={(e) => set("description", e.target.value)} required />
        </FormField>
        <FormField>
          <Label>Event type</Label>
          <Select value={values.eventType} onChange={(e) => set("eventType", e.target.value)}>
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField>
          <Label>Mode</Label>
          <Select value={values.mode} onChange={(e) => set("mode", e.target.value)}>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="HYBRID">Hybrid</option>
          </Select>
        </FormField>
        <FormField>
          <Label required>Start date & time</Label>
          <Input type="datetime-local" value={values.startAt} onChange={(e) => set("startAt", e.target.value)} required />
        </FormField>
        <FormField>
          <Label>End date & time</Label>
          <Input type="datetime-local" value={values.endAt} onChange={(e) => set("endAt", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Location</Label>
          <Input value={values.location} onChange={(e) => set("location", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Online link</Label>
          <Input value={values.onlineLink} onChange={(e) => set("onlineLink", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Speaker</Label>
          <Input value={values.speaker} onChange={(e) => set("speaker", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Capacity</Label>
          <Input type="number" value={values.capacity} onChange={(e) => set("capacity", e.target.value)} />
        </FormField>
        <FormField>
          <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" checked={values.isPublished} onChange={(e) => set("isPublished", e.target.checked)} />
            Published
          </label>
        </FormField>
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : eventId ? "Save changes" : "Publish event"}
      </Button>
    </form>
  );
}

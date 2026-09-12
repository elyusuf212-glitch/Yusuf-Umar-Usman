"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export interface ProgrammeFormValues {
  name: string;
  description: string;
  theme: string;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  location: string;
  deliveryFormat: string;
  eligibility: string;
  slots: string;
  status: string;
}

const EMPTY: ProgrammeFormValues = {
  name: "",
  description: "",
  theme: "",
  startDate: "",
  endDate: "",
  applicationDeadline: "",
  location: "",
  deliveryFormat: "HYBRID",
  eligibility: "",
  slots: "0",
  status: "DRAFT",
};

export function ProgrammeForm({ programmeId, initial }: { programmeId?: string; initial?: ProgrammeFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<ProgrammeFormValues>(initial ?? EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProgrammeFormValues>(key: K, value: ProgrammeFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const url = programmeId ? `/api/admin/programmes/${programmeId}` : "/api/admin/programmes";
    const res = await fetch(url, {
      method: programmeId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setBusy(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Something went wrong.");
      return;
    }
    router.push("/dashboard/admin/programmes");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
      {error ? <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField className="sm:col-span-2">
          <Label required>Programme name</Label>
          <Input value={values.name} onChange={(e) => set("name", e.target.value)} required />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label required>Description</Label>
          <Textarea value={values.description} onChange={(e) => set("description", e.target.value)} required />
        </FormField>
        <FormField>
          <Label>Theme</Label>
          <Input value={values.theme} onChange={(e) => set("theme", e.target.value)} placeholder="e.g. Leadership & Mindset" />
        </FormField>
        <FormField>
          <Label>Status</Label>
          <Select value={values.status} onChange={(e) => set("status", e.target.value)}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="OPEN_FOR_APPLICATIONS">Open for Applications</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </FormField>
        <FormField>
          <Label>Delivery format</Label>
          <Select value={values.deliveryFormat} onChange={(e) => set("deliveryFormat", e.target.value)}>
            <option value="IN_PERSON">In-Person</option>
            <option value="VIRTUAL">Virtual</option>
            <option value="HYBRID">Hybrid</option>
          </Select>
        </FormField>
        <FormField>
          <Label>Location</Label>
          <Input value={values.location} onChange={(e) => set("location", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Available slots</Label>
          <Input type="number" value={values.slots} onChange={(e) => set("slots", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Start date</Label>
          <Input type="date" value={values.startDate} onChange={(e) => set("startDate", e.target.value)} />
        </FormField>
        <FormField>
          <Label>End date</Label>
          <Input type="date" value={values.endDate} onChange={(e) => set("endDate", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Application deadline</Label>
          <Input type="date" value={values.applicationDeadline} onChange={(e) => set("applicationDeadline", e.target.value)} />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label>Eligibility</Label>
          <Textarea value={values.eligibility} onChange={(e) => set("eligibility", e.target.value)} />
        </FormField>
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : programmeId ? "Save changes" : "Create programme"}
      </Button>
    </form>
  );
}

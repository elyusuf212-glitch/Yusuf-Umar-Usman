"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { OPPORTUNITY_CATEGORIES } from "@/lib/constants";

export interface OpportunityFormValues {
  title: string;
  organisation: string;
  description: string;
  eligibility: string;
  location: string;
  deadline: string;
  applicationUrl: string;
  category: string;
  isFeatured: boolean;
  isPublished: boolean;
}

const EMPTY: OpportunityFormValues = {
  title: "",
  organisation: "",
  description: "",
  eligibility: "",
  location: "",
  deadline: "",
  applicationUrl: "",
  category: "JOB",
  isFeatured: false,
  isPublished: true,
};

export function OpportunityForm({ opportunityId, initial }: { opportunityId?: string; initial?: OpportunityFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<OpportunityFormValues>(initial ?? EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof OpportunityFormValues>(key: K, value: OpportunityFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const url = opportunityId ? `/api/admin/opportunities/${opportunityId}` : "/api/admin/opportunities";
    const res = await fetch(url, {
      method: opportunityId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setBusy(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Something went wrong.");
      return;
    }
    router.push("/dashboard/admin/opportunities");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
      {error ? <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField>
          <Label required>Title</Label>
          <Input value={values.title} onChange={(e) => set("title", e.target.value)} required />
        </FormField>
        <FormField>
          <Label required>Organisation</Label>
          <Input value={values.organisation} onChange={(e) => set("organisation", e.target.value)} required />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label required>Description</Label>
          <Textarea value={values.description} onChange={(e) => set("description", e.target.value)} required />
        </FormField>
        <FormField>
          <Label>Category</Label>
          <Select value={values.category} onChange={(e) => set("category", e.target.value)}>
            {OPPORTUNITY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField>
          <Label>Location</Label>
          <Input value={values.location} onChange={(e) => set("location", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Deadline</Label>
          <Input type="date" value={values.deadline} onChange={(e) => set("deadline", e.target.value)} />
        </FormField>
        <FormField>
          <Label required>Application URL</Label>
          <Input type="url" value={values.applicationUrl} onChange={(e) => set("applicationUrl", e.target.value)} required placeholder="https://" />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label>Eligibility</Label>
          <Textarea value={values.eligibility} onChange={(e) => set("eligibility", e.target.value)} />
        </FormField>
        <FormField>
          <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" checked={values.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
            Feature this opportunity
          </label>
        </FormField>
        <FormField>
          <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" checked={values.isPublished} onChange={(e) => set("isPublished", e.target.checked)} />
            Published
          </label>
        </FormField>
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : opportunityId ? "Save changes" : "Publish opportunity"}
      </Button>
    </form>
  );
}

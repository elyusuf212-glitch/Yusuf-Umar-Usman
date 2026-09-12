"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";

interface CohortRow {
  id: string;
  name: string;
  year: number;
  status: string;
}

export function CohortManager({ programmeId, cohorts }: { programmeId: string; cohorts: CohortRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [status, setStatus] = useState("UPCOMING");
  const [busy, setBusy] = useState(false);

  async function addCohort(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch(`/api/admin/programmes/${programmeId}/cohorts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, year, status }),
    });
    setBusy(false);
    setName("");
    router.refresh();
  }

  return (
    <div>
      {cohorts.length ? (
        <ul className="mb-5 space-y-2">
          {cohorts.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-lg border border-navy-100 px-4 py-2.5">
              <span className="text-sm font-semibold text-navy-900">
                {c.name} <span className="text-navy-400">({c.year})</span>
              </span>
              <Badge tone="navy">{c.status.replaceAll("_", " ")}</Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-5 text-sm text-navy-500">No cohorts yet — add one below.</p>
      )}

      <form onSubmit={addCohort} className="grid gap-3 sm:grid-cols-4 sm:items-end">
        <FormField className="mb-0 sm:col-span-2">
          <Label>Cohort name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CitizensNexus 1.0" required />
        </FormField>
        <FormField className="mb-0">
          <Label>Year</Label>
          <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
        </FormField>
        <FormField className="mb-0">
          <Label>Status</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="UPCOMING">Upcoming</option>
            <option value="APPLICATIONS_OPEN">Applications Open</option>
            <option value="SELECTION">Selection</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
          </Select>
        </FormField>
        <Button type="submit" size="sm" disabled={busy} className="sm:col-span-4 sm:w-fit">
          {busy ? "Adding…" : "Add cohort"}
        </Button>
      </form>
    </div>
  );
}

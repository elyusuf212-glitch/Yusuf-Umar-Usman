"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SDG_LIST } from "@/lib/constants";

export function ProjectForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    title: "",
    description: "",
    problem: "",
    solution: "",
    location: "",
    status: "ONGOING",
    year: new Date().getFullYear().toString(),
    impactSummary: "",
  });
  const [sdgNumbers, setSdgNumbers] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function toggleSdg(n: number) {
    setSdgNumbers((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, sdgNumbers }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/dashboard/admin/projects");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
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
          <Label>Problem</Label>
          <Textarea value={values.problem} onChange={(e) => set("problem", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Solution</Label>
          <Textarea value={values.solution} onChange={(e) => set("solution", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Location</Label>
          <Input value={values.location} onChange={(e) => set("location", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Year</Label>
          <Input type="number" value={values.year} onChange={(e) => set("year", e.target.value)} />
        </FormField>
        <FormField>
          <Label>Status</Label>
          <Select value={values.status} onChange={(e) => set("status", e.target.value)}>
            <option value="PROPOSED">Proposed</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </Select>
        </FormField>
        <FormField className="sm:col-span-2">
          <Label>Impact summary</Label>
          <Textarea value={values.impactSummary} onChange={(e) => set("impactSummary", e.target.value)} />
        </FormField>
      </div>

      <Label>SDG alignment</Label>
      <div className="mt-2 mb-5 flex flex-wrap gap-2">
        {SDG_LIST.map((s) => (
          <button
            type="button"
            key={s.number}
            onClick={() => toggleSdg(s.number)}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold"
            style={
              sdgNumbers.includes(s.number)
                ? { backgroundColor: s.colorHex, borderColor: s.colorHex, color: "white" }
                : { borderColor: "#d6ddee", color: "#2a3b78" }
            }
          >
            SDG {s.number}
          </button>
        ))}
      </div>

      <Button type="submit" disabled={busy}>
        {busy ? "Publishing…" : "Publish project"}
      </Button>
    </form>
  );
}

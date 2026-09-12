"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Label, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function ImpactStatsForm({ initial }: { initial: { label: string; value: string }[] }) {
  const router = useRouter();
  const [stats, setStats] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(i: number, key: "label" | "value", value: string) {
    setStats((s) => s.map((stat, idx) => (idx === i ? { ...stat, [key]: value } : stat)));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/admin/settings/impact-stats", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stats }),
    });
    setBusy(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="grid gap-5 sm:grid-cols-2">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-navy-100 p-4">
            <FormField className="mb-3">
              <Label>Value</Label>
              <Input value={stat.value} onChange={(e) => update(i, "value", e.target.value)} />
            </FormField>
            <FormField className="mb-0">
              <Label>Label</Label>
              <Input value={stat.label} onChange={(e) => update(i, "label", e.target.value)} />
            </FormField>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save homepage stats"}
        </Button>
        {saved ? <span className="text-sm font-medium text-emerald-600">Saved</span> : null}
      </div>
    </form>
  );
}

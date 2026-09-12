"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface FellowOption {
  id: string;
  label: string;
}

export function IssueCertificateForm({ fellows }: { fellows: FellowOption[] }) {
  const router = useRouter();
  const [fellowId, setFellowId] = useState(fellows[0]?.id ?? "");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fellowId) return;
    setBusy(true);
    await fetch("/api/admin/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fellowId }),
    });
    setBusy(false);
    router.refresh();
  }

  if (!fellows.length) {
    return <p className="text-sm text-navy-500">All active fellows already have certificates, or there are no fellows yet.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
      <div className="min-w-64 flex-1">
        <FormField className="mb-0">
          <Label>Fellow</Label>
          <Select value={fellowId} onChange={(e) => setFellowId(e.target.value)}>
            {fellows.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Issuing…" : "Issue Certificate"}
      </Button>
    </form>
  );
}

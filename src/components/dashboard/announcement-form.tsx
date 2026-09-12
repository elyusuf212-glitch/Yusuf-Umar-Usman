"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function AnnouncementForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("ALL");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, audience }),
    });
    setBusy(false);
    router.push("/dashboard/admin/announcements");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
      <FormField>
        <Label required>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </FormField>
      <FormField>
        <Label required>Message</Label>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} required rows={5} />
      </FormField>
      <FormField>
        <Label>Audience</Label>
        <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
          <option value="ALL">Everyone</option>
          <option value="FELLOWS">Fellows</option>
          <option value="MENTORS">Mentors</option>
        </Select>
      </FormField>
      <Button type="submit" disabled={busy}>
        {busy ? "Publishing…" : "Publish announcement"}
      </Button>
    </form>
  );
}

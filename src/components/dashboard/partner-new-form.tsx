"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function PartnerNewForm() {
  const router = useRouter();
  const [organisationName, setOrganisationName] = useState("");
  const [type, setType] = useState("NGO");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/admin/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organisationName, type, website, description }),
    });
    setBusy(false);
    setOrganisationName("");
    setWebsite("");
    setDescription("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 sm:items-end">
      <FormField className="mb-0">
        <Label>Organisation name</Label>
        <Input value={organisationName} onChange={(e) => setOrganisationName(e.target.value)} required />
      </FormField>
      <FormField className="mb-0">
        <Label>Type</Label>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="NGO">NGO</option>
          <option value="GOVERNMENT">Government</option>
          <option value="PRIVATE_SECTOR">Private Sector</option>
          <option value="UNIVERSITY">University</option>
          <option value="DEVELOPMENT_ORG">Development Organisation</option>
          <option value="MULTILATERAL">Multilateral</option>
        </Select>
      </FormField>
      <FormField className="mb-0">
        <Label>Website</Label>
        <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
      </FormField>
      <FormField className="mb-0 sm:col-span-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormField>
      <Button type="submit" size="sm" disabled={busy} className="sm:col-span-2 sm:w-fit">
        {busy ? "Adding…" : "Add partner"}
      </Button>
    </form>
  );
}

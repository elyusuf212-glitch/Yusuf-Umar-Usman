"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function TestimonialForm() {
  const router = useRouter();
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [quote, setQuote] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName, authorRole, quote, isFeatured: true }),
    });
    setBusy(false);
    setAuthorName("");
    setAuthorRole("");
    setQuote("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 sm:items-end">
      <FormField className="mb-0">
        <Label>Author name</Label>
        <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
      </FormField>
      <FormField className="mb-0">
        <Label>Author role</Label>
        <Input value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} placeholder="e.g. CitizensNexus 1.0 Fellow" />
      </FormField>
      <FormField className="mb-0 sm:col-span-2">
        <Label>Quote</Label>
        <Textarea value={quote} onChange={(e) => setQuote(e.target.value)} required />
      </FormField>
      <Button type="submit" size="sm" disabled={busy} className="sm:col-span-2 sm:w-fit">
        {busy ? "Publishing…" : "Publish testimonial"}
      </Button>
    </form>
  );
}

export function ResourceForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [resourceType, setResourceType] = useState("LINK");
  const [fileUrl, setFileUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/admin/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, resourceType, fileUrl }),
    });
    setBusy(false);
    setTitle("");
    setFileUrl("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 sm:items-end">
      <FormField className="mb-0">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </FormField>
      <FormField className="mb-0">
        <Label>Category</Label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. CV Templates" />
      </FormField>
      <FormField className="mb-0">
        <Label>Type</Label>
        <Select value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
          <option value="LINK">Link</option>
          <option value="PDF">PDF</option>
          <option value="TEMPLATE">Template</option>
          <option value="GUIDE">Guide</option>
          <option value="VIDEO">Video</option>
        </Select>
      </FormField>
      <FormField className="mb-0">
        <Label>URL</Label>
        <Input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} required placeholder="https://" />
      </FormField>
      <Button type="submit" size="sm" disabled={busy} className="sm:col-span-2 sm:w-fit">
        {busy ? "Adding…" : "Add resource"}
      </Button>
    </form>
  );
}

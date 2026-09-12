"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LEARNING_CATEGORIES } from "@/lib/constants";

export function CourseNewForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(LEARNING_CATEGORIES[0]);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, isPublished: false }),
    });
    const json = await res.json();
    setBusy(false);
    if (res.ok) {
      router.push(`/dashboard/admin/courses/${json.course.id}`);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
      <FormField>
        <Label required>Course title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </FormField>
      <FormField>
        <Label required>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </FormField>
      <FormField>
        <Label>Category</Label>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {LEARNING_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </FormField>
      <Button type="submit" disabled={busy}>
        {busy ? "Creating…" : "Create course"}
      </Button>
    </form>
  );
}

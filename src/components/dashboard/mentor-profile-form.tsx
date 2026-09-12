"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface Values {
  title: string;
  organisation: string;
  bio: string;
  yearsExperience: string;
  linkedin: string;
  expertiseAreas: string;
  mentorshipAreas: string;
}

export function MentorProfileForm({ initial }: { initial: Values }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/mentor-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        yearsExperience: values.yearsExperience ? Number(values.yearsExperience) : undefined,
        expertiseAreas: values.expertiseAreas.split(",").map((s) => s.trim()).filter(Boolean),
        mentorshipAreas: values.mentorshipAreas.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField>
          <Label htmlFor="title">Professional title</Label>
          <Input id="title" value={values.title} onChange={(e) => update("title", e.target.value)} />
        </FormField>
        <FormField>
          <Label htmlFor="organisation">Organisation</Label>
          <Input id="organisation" value={values.organisation} onChange={(e) => update("organisation", e.target.value)} />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label htmlFor="bio">Biography</Label>
          <Textarea id="bio" value={values.bio} onChange={(e) => update("bio", e.target.value)} />
        </FormField>
        <FormField>
          <Label htmlFor="years">Years of experience</Label>
          <Input id="years" type="number" value={values.yearsExperience} onChange={(e) => update("yearsExperience", e.target.value)} />
        </FormField>
        <FormField>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" value={values.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label htmlFor="expertise">Areas of expertise (comma-separated)</Label>
          <Input id="expertise" value={values.expertiseAreas} onChange={(e) => update("expertiseAreas", e.target.value)} />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label htmlFor="mentorship">Areas of mentorship (comma-separated)</Label>
          <Input id="mentorship" value={values.mentorshipAreas} onChange={(e) => update("mentorshipAreas", e.target.value)} />
        </FormField>
      </div>
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save profile"}
        </Button>
        {saved ? <span className="text-sm font-medium text-emerald-600">Saved</span> : null}
      </div>
    </form>
  );
}

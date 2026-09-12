"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface ProfileFormValues {
  name: string;
  phone: string;
  headline: string;
  bio: string;
  location: string;
  state: string;
  education: string;
  institution: string;
  linkedin: string;
  twitter: string;
  website: string;
  skills: string;
}

export function ProfileForm({ initial }: { initial: ProfileFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
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
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={values.name} onChange={(e) => update("name", e.target.value)} />
        </FormField>
        <FormField>
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" value={values.phone} onChange={(e) => update("phone", e.target.value)} />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label htmlFor="headline">Professional headline</Label>
          <Input
            id="headline"
            placeholder="e.g. Civic Tech Advocate & Aspiring Policy Analyst"
            value={values.headline}
            onChange={(e) => update("headline", e.target.value)}
          />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={values.bio} onChange={(e) => update("bio", e.target.value)} />
        </FormField>
        <FormField>
          <Label htmlFor="location">City</Label>
          <Input id="location" value={values.location} onChange={(e) => update("location", e.target.value)} />
        </FormField>
        <FormField>
          <Label htmlFor="state">State</Label>
          <Input id="state" value={values.state} onChange={(e) => update("state", e.target.value)} />
        </FormField>
        <FormField>
          <Label htmlFor="institution">Institution</Label>
          <Input id="institution" value={values.institution} onChange={(e) => update("institution", e.target.value)} />
        </FormField>
        <FormField>
          <Label htmlFor="education">Field of study / education</Label>
          <Input id="education" value={values.education} onChange={(e) => update("education", e.target.value)} />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label htmlFor="skills">Skills (comma-separated)</Label>
          <Input id="skills" value={values.skills} onChange={(e) => update("skills", e.target.value)} />
        </FormField>
        <FormField>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" value={values.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
        </FormField>
        <FormField>
          <Label htmlFor="twitter">X / Twitter</Label>
          <Input id="twitter" value={values.twitter} onChange={(e) => update("twitter", e.target.value)} />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label htmlFor="website">Website / Portfolio</Label>
          <Input id="website" value={values.website} onChange={(e) => update("website", e.target.value)} />
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

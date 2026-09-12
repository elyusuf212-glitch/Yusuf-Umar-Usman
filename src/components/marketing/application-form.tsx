"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Application } from "@prisma/client";
import { Label, Input, Textarea, Select, FormField, FieldHint } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FELLOW_DEVELOPMENT_AREAS } from "@/lib/constants";

interface FormState {
  cohortId: string;
  personalInfo: { fullName: string; dateOfBirth: string; gender: string; stateOfOrigin: string; stateOfResidence: string; phone: string };
  education: { institution: string; fieldOfStudy: string; level: string; graduationYear: string };
  professionalBackground: { currentStatus: string; organisation: string; role: string };
  leadershipExperience: string;
  communityInvolvement: string;
  skills: string[];
  motivation: string;
  careerAspirations: string;
  challenges: string;
  programmeExpectations: string;
  portfolioLinks: { linkedin: string; portfolio: string; twitter: string };
  referenceContacts: { name: string; relationship: string; contact: string };
  essayResponses: { biggestAchievement: string; changeYouWantToSee: string };
}

function buildInitialState(cohorts: { id: string; name: string }[], existing: Application | null): FormState {
  const personalInfo = (existing?.personalInfo as Partial<FormState["personalInfo"]>) ?? {};
  const education = (existing?.education as Partial<FormState["education"]>) ?? {};
  const professionalBackground = (existing?.professionalBackground as Partial<FormState["professionalBackground"]>) ?? {};
  const portfolioLinks = (existing?.portfolioLinks as Partial<FormState["portfolioLinks"]>) ?? {};
  const referenceContacts = (existing?.referenceContacts as Partial<FormState["referenceContacts"]>) ?? {};
  const essayResponses = (existing?.essayResponses as Partial<FormState["essayResponses"]>) ?? {};

  return {
    cohortId: existing?.cohortId ?? cohorts[0]?.id ?? "",
    personalInfo: {
      fullName: personalInfo.fullName ?? "",
      dateOfBirth: personalInfo.dateOfBirth ?? "",
      gender: personalInfo.gender ?? "",
      stateOfOrigin: personalInfo.stateOfOrigin ?? "",
      stateOfResidence: personalInfo.stateOfResidence ?? "",
      phone: personalInfo.phone ?? "",
    },
    education: {
      institution: education.institution ?? "",
      fieldOfStudy: education.fieldOfStudy ?? "",
      level: education.level ?? "",
      graduationYear: education.graduationYear ?? "",
    },
    professionalBackground: {
      currentStatus: professionalBackground.currentStatus ?? "",
      organisation: professionalBackground.organisation ?? "",
      role: professionalBackground.role ?? "",
    },
    leadershipExperience: existing?.leadershipExperience ?? "",
    communityInvolvement: existing?.communityInvolvement ?? "",
    skills: existing?.skills ?? [],
    motivation: existing?.motivation ?? "",
    careerAspirations: existing?.careerAspirations ?? "",
    challenges: existing?.challenges ?? "",
    programmeExpectations: existing?.programmeExpectations ?? "",
    portfolioLinks: {
      linkedin: portfolioLinks.linkedin ?? "",
      portfolio: portfolioLinks.portfolio ?? "",
      twitter: portfolioLinks.twitter ?? "",
    },
    referenceContacts: {
      name: referenceContacts.name ?? "",
      relationship: referenceContacts.relationship ?? "",
      contact: referenceContacts.contact ?? "",
    },
    essayResponses: {
      biggestAchievement: essayResponses.biggestAchievement ?? "",
      changeYouWantToSee: essayResponses.changeYouWantToSee ?? "",
    },
  };
}

export function ApplicationForm({
  programmeId,
  cohorts,
  existing,
}: {
  programmeId: string;
  cohorts: { id: string; name: string }[];
  existing: Application | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => buildInitialState(cohorts, existing));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState<"draft" | "submit" | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setNested<K extends keyof FormState>(key: K, field: string, value: string) {
    setForm((f) => ({ ...f, [key]: { ...(f[key] as object), [field]: value } }));
  }

  function toggleSkill(skill: string) {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter((s) => s !== skill) : [...f.skills, skill],
    }));
  }

  async function save(action: "draft" | "submit") {
    setBusy(action);
    setError(null);
    setSuccess(null);
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programmeId, action, data: form }),
    });
    const json = await res.json();
    setBusy(null);
    if (!res.ok) {
      setError(json.error ?? "Something went wrong. Please review the form and try again.");
      return;
    }
    if (action === "submit") {
      router.push("/dashboard/applicant?submitted=1");
      return;
    }
    setSuccess("Draft saved. You can come back and finish this application anytime.");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save("submit");
      }}
      className="mt-8 space-y-8"
    >
      {error ? <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}
      {success ? <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</div> : null}

      <FormSection title="Cohort">
        <FormField>
          <Label required>Which cohort are you applying to?</Label>
          <Select value={form.cohortId} onChange={(e) => set("cohortId", e.target.value)}>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>
      </FormSection>

      <FormSection title="Personal Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField>
            <Label required>Full name</Label>
            <Input value={form.personalInfo.fullName} onChange={(e) => setNested("personalInfo", "fullName", e.target.value)} />
          </FormField>
          <FormField>
            <Label required>Date of birth</Label>
            <Input type="date" value={form.personalInfo.dateOfBirth} onChange={(e) => setNested("personalInfo", "dateOfBirth", e.target.value)} />
          </FormField>
          <FormField>
            <Label required>Gender</Label>
            <Select value={form.personalInfo.gender} onChange={(e) => setNested("personalInfo", "gender", e.target.value)}>
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </Select>
          </FormField>
          <FormField>
            <Label required>Phone number</Label>
            <Input value={form.personalInfo.phone} onChange={(e) => setNested("personalInfo", "phone", e.target.value)} />
          </FormField>
          <FormField>
            <Label required>State of origin</Label>
            <Input value={form.personalInfo.stateOfOrigin} onChange={(e) => setNested("personalInfo", "stateOfOrigin", e.target.value)} />
          </FormField>
          <FormField>
            <Label required>State of residence</Label>
            <Input value={form.personalInfo.stateOfResidence} onChange={(e) => setNested("personalInfo", "stateOfResidence", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Education">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField>
            <Label required>Institution</Label>
            <Input value={form.education.institution} onChange={(e) => setNested("education", "institution", e.target.value)} />
          </FormField>
          <FormField>
            <Label required>Field of study</Label>
            <Input value={form.education.fieldOfStudy} onChange={(e) => setNested("education", "fieldOfStudy", e.target.value)} />
          </FormField>
          <FormField>
            <Label required>Level</Label>
            <Select value={form.education.level} onChange={(e) => setNested("education", "level", e.target.value)}>
              <option value="">Select</option>
              <option>Secondary School</option>
              <option>Undergraduate</option>
              <option>Graduate</option>
              <option>Postgraduate</option>
            </Select>
          </FormField>
          <FormField>
            <Label required>Graduation year (expected or actual)</Label>
            <Input value={form.education.graduationYear} onChange={(e) => setNested("education", "graduationYear", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Professional Background">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField>
            <Label required>Current status</Label>
            <Select value={form.professionalBackground.currentStatus} onChange={(e) => setNested("professionalBackground", "currentStatus", e.target.value)}>
              <option value="">Select</option>
              <option>Student</option>
              <option>Employed</option>
              <option>Self-employed / Entrepreneur</option>
              <option>Unemployed / Job seeking</option>
              <option>NYSC</option>
            </Select>
          </FormField>
          <FormField>
            <Label>Organisation (if applicable)</Label>
            <Input value={form.professionalBackground.organisation} onChange={(e) => setNested("professionalBackground", "organisation", e.target.value)} />
          </FormField>
          <FormField className="sm:col-span-2">
            <Label>Role / title</Label>
            <Input value={form.professionalBackground.role} onChange={(e) => setNested("professionalBackground", "role", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Leadership & Community">
        <FormField>
          <Label required>Describe your leadership experience</Label>
          <Textarea value={form.leadershipExperience} onChange={(e) => set("leadershipExperience", e.target.value)} />
        </FormField>
        <FormField>
          <Label required>Describe your community involvement</Label>
          <Textarea value={form.communityInvolvement} onChange={(e) => set("communityInvolvement", e.target.value)} />
        </FormField>
      </FormSection>

      <FormSection title="Skills">
        <Label required>Select your top skill areas</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {FELLOW_DEVELOPMENT_AREAS.map((skill) => (
            <button
              type="button"
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                form.skills.includes(skill)
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-200 bg-white text-navy-700 hover:border-navy-400"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </FormSection>

      <FormSection title="Motivation & Expectations">
        <FormField>
          <Label required>Why do you want to join this programme?</Label>
          <Textarea value={form.motivation} onChange={(e) => set("motivation", e.target.value)} />
        </FormField>
        <FormField>
          <Label required>What are your career aspirations?</Label>
          <Textarea value={form.careerAspirations} onChange={(e) => set("careerAspirations", e.target.value)} />
        </FormField>
        <FormField>
          <Label required>What challenges have shaped you?</Label>
          <Textarea value={form.challenges} onChange={(e) => set("challenges", e.target.value)} />
        </FormField>
        <FormField>
          <Label required>What do you expect from this programme?</Label>
          <Textarea value={form.programmeExpectations} onChange={(e) => set("programmeExpectations", e.target.value)} />
        </FormField>
      </FormSection>

      <FormSection title="Portfolio & References">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField>
            <Label>LinkedIn</Label>
            <Input value={form.portfolioLinks.linkedin} onChange={(e) => setNested("portfolioLinks", "linkedin", e.target.value)} />
          </FormField>
          <FormField>
            <Label>Portfolio / website</Label>
            <Input value={form.portfolioLinks.portfolio} onChange={(e) => setNested("portfolioLinks", "portfolio", e.target.value)} />
          </FormField>
          <FormField>
            <Label>X / Twitter</Label>
            <Input value={form.portfolioLinks.twitter} onChange={(e) => setNested("portfolioLinks", "twitter", e.target.value)} />
          </FormField>
        </div>
        <FieldHint>Optional, but strongly recommended.</FieldHint>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <FormField>
            <Label>Reference name</Label>
            <Input value={form.referenceContacts.name} onChange={(e) => setNested("referenceContacts", "name", e.target.value)} />
          </FormField>
          <FormField>
            <Label>Relationship</Label>
            <Input value={form.referenceContacts.relationship} onChange={(e) => setNested("referenceContacts", "relationship", e.target.value)} />
          </FormField>
          <FormField>
            <Label>Contact</Label>
            <Input value={form.referenceContacts.contact} onChange={(e) => setNested("referenceContacts", "contact", e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Essay Questions">
        <FormField>
          <Label>What is your biggest achievement so far?</Label>
          <Textarea value={form.essayResponses.biggestAchievement} onChange={(e) => setNested("essayResponses", "biggestAchievement", e.target.value)} />
        </FormField>
        <FormField>
          <Label>What change do you want to see in your community?</Label>
          <Textarea value={form.essayResponses.changeYouWantToSee} onChange={(e) => setNested("essayResponses", "changeYouWantToSee", e.target.value)} />
        </FormField>
      </FormSection>

      <div className="flex flex-wrap gap-4 border-t border-navy-100 pt-6">
        <Button type="button" variant="outline" onClick={() => save("draft")} disabled={busy !== null}>
          {busy === "draft" ? "Saving…" : "Save as Draft"}
        </Button>
        <Button type="submit" disabled={busy !== null}>
          {busy === "submit" ? "Submitting…" : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="mb-5 text-base font-bold text-navy-950">{title}</h2>
      {children}
    </div>
  );
}

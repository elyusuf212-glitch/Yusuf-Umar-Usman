"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Select, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";

interface LessonRow {
  id: string;
  title: string;
  contentType: string;
}
interface ModuleRow {
  id: string;
  title: string;
  lessons: LessonRow[];
}

const CONTENT_ICON: Record<string, string> = { VIDEO: "🎥", PDF: "📄", ARTICLE: "📰", QUIZ: "❓", ASSIGNMENT: "📝" };

export function CourseBuilder({ courseId, isPublished, modules }: { courseId: string; isPublished: boolean; modules: ModuleRow[] }) {
  const router = useRouter();
  const [published, setPublished] = useState(isPublished);
  const [moduleTitle, setModuleTitle] = useState("");
  const [busy, setBusy] = useState(false);

  async function addModule(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch(`/api/admin/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: moduleTitle }),
    });
    setBusy(false);
    setModuleTitle("");
    router.refresh();
  }

  async function togglePublish() {
    const next = !published;
    setPublished(next);
    await fetch(`/api/admin/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: next }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-navy-100 bg-white p-5 shadow-[var(--shadow-card)]">
        <div>
          <p className="font-bold text-navy-950">Publish status</p>
          <p className="text-sm text-navy-500">Published courses appear in the public Learning Hub.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={published ? "green" : "gray"}>{published ? "Published" : "Draft"}</Badge>
          <Button size="sm" variant="outline" onClick={togglePublish}>
            {published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      {modules.map((m) => (
        <ModuleCard key={m.id} module={m} />
      ))}

      <form onSubmit={addModule} className="rounded-2xl border border-dashed border-navy-200 bg-white p-5">
        <FormField className="mb-3">
          <Label>Add a module</Label>
          <Input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} placeholder="e.g. Foundations of Leadership" required />
        </FormField>
        <Button type="submit" size="sm" disabled={busy}>
          {busy ? "Adding…" : "Add module"}
        </Button>
      </form>
    </div>
  );
}

function ModuleCard({ module }: { module: ModuleRow }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("ARTICLE");
  const [busy, setBusy] = useState(false);

  async function addLesson(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch(`/api/admin/modules/${module.id}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, contentType }),
    });
    setBusy(false);
    setTitle("");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-bold text-navy-950">{module.title}</h3>
      <ul className="mt-3 divide-y divide-navy-50">
        {module.lessons.map((l) => (
          <li key={l.id} className="flex items-center gap-2 py-2 text-sm text-navy-700">
            <span>{CONTENT_ICON[l.contentType] ?? "📄"}</span> {l.title}
          </li>
        ))}
      </ul>
      <form onSubmit={addLesson} className="mt-4 flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <Label className="mb-1">Lesson title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label className="mb-1">Type</Label>
          <Select value={contentType} onChange={(e) => setContentType(e.target.value)}>
            <option value="ARTICLE">Article</option>
            <option value="VIDEO">Video</option>
            <option value="PDF">PDF</option>
            <option value="QUIZ">Quiz</option>
            <option value="ASSIGNMENT">Assignment</option>
          </Select>
        </div>
        <Button type="submit" size="sm" variant="outline" disabled={busy}>
          {busy ? "Adding…" : "Add lesson"}
        </Button>
      </form>
    </div>
  );
}

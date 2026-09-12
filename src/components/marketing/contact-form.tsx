"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { Label, Input, Textarea, FieldError, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactInput) {
    setStatus("idle");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setStatus("sent");
      reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
        <p className="font-bold">Message sent!</p>
        <p className="mt-1 text-sm">Thanks for reaching out — the CitizensNexus team will respond soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]" noValidate>
      {status === "error" ? <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">Something went wrong. Please try again.</div> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField>
          <Label htmlFor="name" required>
            Name
          </Label>
          <Input id="name" {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </FormField>
        <FormField>
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input id="email" type="email" {...register("email")} />
          <FieldError>{errors.email?.message}</FieldError>
        </FormField>
        <FormField className="sm:col-span-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" {...register("subject")} />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label htmlFor="message" required>
            Message
          </Label>
          <Textarea id="message" rows={5} {...register("message")} />
          <FieldError>{errors.message?.message}</FieldError>
        </FormField>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnershipInquirySchema, type PartnershipInquiryInput } from "@/lib/validation";
import { Label, Input, Textarea, FieldError, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function PartnershipForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartnershipInquiryInput>({ resolver: zodResolver(partnershipInquirySchema) });

  async function onSubmit(values: PartnershipInquiryInput) {
    setStatus("idle");
    const res = await fetch("/api/partnership-inquiries", {
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
        <p className="font-bold">Enquiry received!</p>
        <p className="mt-1 text-sm">Thank you for your interest in partnering with CitizensNexus. Our partnerships team will be in touch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-[var(--shadow-card)]" noValidate>
      {status === "error" ? <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">Something went wrong. Please try again.</div> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField className="sm:col-span-2">
          <Label htmlFor="organisationName" required>
            Organisation name
          </Label>
          <Input id="organisationName" {...register("organisationName")} />
          <FieldError>{errors.organisationName?.message}</FieldError>
        </FormField>
        <FormField>
          <Label htmlFor="contactName" required>
            Contact name
          </Label>
          <Input id="contactName" {...register("contactName")} />
          <FieldError>{errors.contactName?.message}</FieldError>
        </FormField>
        <FormField>
          <Label htmlFor="contactEmail" required>
            Contact email
          </Label>
          <Input id="contactEmail" type="email" {...register("contactEmail")} />
          <FieldError>{errors.contactEmail?.message}</FieldError>
        </FormField>
        <FormField className="sm:col-span-2">
          <Label htmlFor="contactPhone">Phone number</Label>
          <Input id="contactPhone" {...register("contactPhone")} />
        </FormField>
        <FormField className="sm:col-span-2">
          <Label htmlFor="message" required>
            Tell us about your interest in partnering with CitizensNexus
          </Label>
          <Textarea id="message" rows={5} {...register("message")} />
          <FieldError>{errors.message?.message}</FieldError>
        </FormField>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit Enquiry"}
      </Button>
    </form>
  );
}

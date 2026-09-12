"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/lib/validation";
import { AuthShell } from "@/components/marketing/auth-shell";
import { Label, Input, FieldError, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setServerError(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell
      title="Join CitizensNexus"
      subtitle="Create your account to apply for programmes, access the Learning Hub, and build your leadership profile."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-navy-900 underline">
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError ? (
          <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</div>
        ) : null}

        <FormField>
          <Label htmlFor="name" required>
            Full name
          </Label>
          <Input id="name" type="text" autoComplete="name" {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </FormField>

        <FormField>
          <Label htmlFor="email" required>
            Email address
          </Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          <FieldError>{errors.email?.message}</FieldError>
        </FormField>

        <FormField>
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        </FormField>

        <FormField>
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
          <FieldError>{errors.password?.message}</FieldError>
        </FormField>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create my account"}
        </Button>

        <p className="mt-4 text-xs text-navy-400">
          By registering you agree to CitizensNexus&apos;s community guidelines and privacy practices.
        </p>
      </form>
    </AuthShell>
  );
}

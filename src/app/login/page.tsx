"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { AuthShell } from "@/components/marketing/auth-shell";
import { Label, Input, FieldError, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setServerError(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    router.push(searchParams.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your CitizensNexus journey — track your application, learning and mentorship."
      footer={
        <p>
          New to CitizensNexus?{" "}
          <Link href="/register" className="font-semibold text-navy-900 underline">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError ? (
          <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</div>
        ) : null}

        <FormField>
          <Label htmlFor="email" required>
            Email address
          </Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          <FieldError>{errors.email?.message}</FieldError>
        </FormField>

        <FormField>
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
          <FieldError>{errors.password?.message}</FieldError>
        </FormField>

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

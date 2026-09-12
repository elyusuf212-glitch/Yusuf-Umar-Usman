import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <Logo />
          <h1 className="mt-8 text-2xl font-bold text-navy-950 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-navy-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-sm text-navy-500">{footer}</div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-navy-950 lg:block">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" aria-hidden />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" aria-hidden />
        <div className="relative flex h-full flex-col justify-end p-14 text-white">
          <p className="text-2xl font-bold leading-snug">
            “CitizensNexus gave me the mentorship, structure and network I needed to turn an idea into a
            real community project.”
          </p>
          <p className="mt-4 text-sm font-semibold text-gold-300">CitizensNexus 1.0 Fellow</p>
        </div>
      </div>
    </div>
  );
}

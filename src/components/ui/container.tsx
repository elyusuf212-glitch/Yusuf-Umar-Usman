import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({
  className,
  children,
  id,
  tone = "light",
}: {
  className?: string;
  children: ReactNode;
  id?: string;
  tone?: "light" | "sand" | "navy";
}) {
  const toneClasses = {
    light: "bg-white",
    sand: "bg-sand-50",
    navy: "bg-navy-950 text-white",
  } as const;
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", toneClasses[tone], className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-xs font-bold uppercase tracking-[0.18em]",
            tone === "dark" ? "text-gold-300" : "text-gold-600"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-3xl font-bold sm:text-4xl",
          tone === "dark" ? "text-white" : "text-navy-950"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-navy-100" : "text-navy-600")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

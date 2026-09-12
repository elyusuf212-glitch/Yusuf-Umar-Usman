import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-navy-100 bg-white shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({
  className,
  children,
  tone = "navy",
}: {
  className?: string;
  children: ReactNode;
  tone?: "navy" | "gold" | "green" | "red" | "gray";
}) {
  const tones = {
    navy: "bg-navy-50 text-navy-700",
    gold: "bg-gold-100 text-gold-800",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    gray: "bg-gray-100 text-gray-700",
  } as const;
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

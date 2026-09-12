import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const VARIANT_CLASSES = {
  primary: "bg-navy-900 text-white hover:bg-navy-800 focus-visible:outline-navy-900",
  gold: "bg-gold-400 text-navy-950 hover:bg-gold-300 focus-visible:outline-gold-500",
  outline:
    "border border-navy-200 text-navy-900 bg-white hover:bg-navy-50 focus-visible:outline-navy-900",
  ghost: "text-navy-900 hover:bg-navy-50 focus-visible:outline-navy-900",
  "outline-light":
    "border border-white/30 text-white hover:bg-white/10 focus-visible:outline-white",
} as const;

const SIZE_CLASSES = {
  sm: "text-sm px-4 py-2 gap-1.5",
  md: "text-sm px-5 py-2.5 gap-2",
  lg: "text-base px-7 py-3.5 gap-2",
} as const;

type Variant = keyof typeof VARIANT_CLASSES;
type Size = keyof typeof SIZE_CLASSES;

const base =
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link href={href} className={cn(base, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)} {...props}>
      {children}
    </Link>
  );
}

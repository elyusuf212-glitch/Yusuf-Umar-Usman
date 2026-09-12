import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "block w-full rounded-lg border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-950 placeholder:text-navy-300 shadow-sm transition focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100 disabled:bg-navy-50 disabled:text-navy-400";

export function Label({ className, children, required, ...props }: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode; required?: boolean }) {
  return (
    <label className={cn("mb-1.5 block text-sm font-semibold text-navy-800", className)} {...props}>
      {children}
      {required ? <span className="ml-0.5 text-gold-600">*</span> : null}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-28 resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={cn(fieldBase, "pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-sm font-medium text-red-600">{children}</p>;
}

export function FieldHint({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-sm text-navy-500">{children}</p>;
}

export function FormField({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mb-5", className)}>{children}</div>;
}

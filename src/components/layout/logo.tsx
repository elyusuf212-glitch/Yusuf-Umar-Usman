import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 font-display", className)}>
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold",
          dark ? "bg-gold-400 text-navy-950" : "bg-navy-950 text-gold-300"
        )}
      >
        CN
      </span>
      <span className={cn("text-lg font-bold leading-none", dark ? "text-white" : "text-navy-950")}>
        Citizens<span className={dark ? "text-gold-300" : "text-gold-600"}>Nexus</span>
      </span>
    </Link>
  );
}

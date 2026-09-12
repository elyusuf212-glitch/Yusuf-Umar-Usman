"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: string;
}

export function DashboardShell({
  navItems,
  roleLabel,
  userName,
  children,
}: {
  navItems: DashboardNavItem[];
  roleLabel: string;
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const sidebarContent = (
    <>
      <div className="px-5 py-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-50 hover:text-navy-950"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-navy-100 p-4">
        <p className="truncate text-sm font-semibold text-navy-950">{userName}</p>
        <p className="text-xs text-navy-500">{roleLabel}</p>
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] bg-sand-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-100 bg-white lg:flex">
        {sidebarContent}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-white shadow-xl">{sidebarContent}</aside>
        </div>
      ) : null}

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-navy-100 bg-white px-4 py-3 lg:hidden">
          <Logo />
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-navy-900"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
        </div>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { Logo } from "@/components/layout/logo";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dashboardPathForRole } from "@/lib/roles";
import type { Role } from "@prisma/client";

interface NavbarSession {
  name: string;
  role: Role;
}

export function Navbar({ session }: { session: NavbarSession | null }) {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => item.children && setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-50 hover:text-navy-950",
                  pathname === item.href && "bg-navy-50 text-navy-950"
                )}
              >
                {item.label}
                {item.children ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                ) : null}
              </Link>
              {item.children && activeDropdown === item.label ? (
                <div className="absolute left-0 top-full w-72 rounded-2xl border border-navy-100 bg-white p-2 shadow-[var(--shadow-card-hover)]">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-3.5 py-2.5 transition hover:bg-navy-50"
                    >
                      <p className="text-sm font-semibold text-navy-950">{child.label}</p>
                      {child.description ? <p className="text-xs text-navy-500">{child.description}</p> : null}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <LinkButton href={dashboardPathForRole(session.role)} variant="primary" size="sm">
              My Dashboard
            </LinkButton>
          ) : (
            <>
              <LinkButton href="/login" variant="ghost" size="sm">
                Login
              </LinkButton>
              <LinkButton href="/register" variant="gold" size="sm">
                Join CitizensNexus
              </LinkButton>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-navy-900 lg:hidden"
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          )}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-navy-100 bg-white px-4 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col">
            {NAV_LINKS.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-semibold text-navy-900"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="ml-3 flex flex-col border-l border-navy-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-navy-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-navy-100 pt-4">
            {session ? (
              <LinkButton href={dashboardPathForRole(session.role)} variant="primary" size="md">
                My Dashboard
              </LinkButton>
            ) : (
              <>
                <LinkButton href="/login" variant="outline" size="md">
                  Login
                </LinkButton>
                <LinkButton href="/register" variant="gold" size="md">
                  Join CitizensNexus
                </LinkButton>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

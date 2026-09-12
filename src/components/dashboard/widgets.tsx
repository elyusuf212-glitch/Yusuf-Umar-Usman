import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-navy-950 sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-navy-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, hint, icon }: { label: string; value: string | number; hint?: string; icon?: string }) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">{label}</p>
        {icon ? <span className="text-lg">{icon}</span> : null}
      </div>
      <p className="mt-2 text-3xl font-bold text-navy-950">{value}</p>
      {hint ? <p className="mt-1 text-xs text-navy-400">{hint}</p> : null}
    </div>
  );
}

export function ProgressBar({ percent, tone = "navy" }: { percent: number; tone?: "navy" | "gold" }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-navy-100">
      <div
        className={cn("h-full rounded-full", tone === "gold" ? "bg-gold-400" : "bg-navy-900")}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function DashboardCard({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-navy-100 bg-white p-5 shadow-[var(--shadow-card)] sm:p-6", className)}>
      {title ? (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-navy-950">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function DataTable<T>({
  columns,
  rows,
  keyFn,
  emptyMessage = "No records found.",
}: {
  columns: { header: string; render: (row: T) => ReactNode; className?: string }[];
  rows: T[];
  keyFn: (row: T) => string;
  emptyMessage?: string;
}) {
  if (!rows.length) {
    return <p className="py-10 text-center text-sm text-navy-400">{emptyMessage}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-navy-100 text-xs font-semibold uppercase tracking-wide text-navy-500">
            {columns.map((col) => (
              <th key={col.header} className={cn("py-3 pr-4", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={keyFn(row)} className="border-b border-navy-50 last:border-0">
              {columns.map((col) => (
                <td key={col.header} className={cn("py-3 pr-4 align-middle text-navy-800", col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

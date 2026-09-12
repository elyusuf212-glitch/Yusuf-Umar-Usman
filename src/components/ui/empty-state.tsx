import type { ReactNode } from "react";

export function EmptyState({ icon = "📭", title, description, action }: { icon?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-navy-200 bg-navy-50/50 px-6 py-16 text-center">
      <span className="text-4xl">{icon}</span>
      <h3 className="mt-4 text-lg font-bold text-navy-900">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-navy-500">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

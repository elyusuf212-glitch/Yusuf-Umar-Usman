"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import { Select } from "@/components/ui/form";
import { ROLE_LABELS } from "@/lib/roles";

const ROLES: Role[] = ["MEMBER", "FELLOW", "MENTOR", "PARTNER", "PROGRAMME_MANAGER", "ADMIN"];

export function RoleSelect({ userId, currentRole }: { userId: string; currentRole: Role }) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [busy, setBusy] = useState(false);

  async function onChange(newRole: Role) {
    setBusy(true);
    setRole(newRole);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <Select value={role} disabled={busy} onChange={(e) => onChange(e.target.value as Role)} className="w-44">
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {ROLE_LABELS[r]}
        </option>
      ))}
    </Select>
  );
}

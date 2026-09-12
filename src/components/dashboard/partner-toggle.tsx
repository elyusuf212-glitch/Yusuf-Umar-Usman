"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PartnerToggle({ partnerId, field, value, onLabel, offLabel }: { partnerId: string; field: "isApproved" | "isFeatured"; value: boolean; onLabel: string; offLabel: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const next = !current;
    await fetch(`/api/admin/partners/${partnerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: next }),
    });
    setCurrent(next);
    setBusy(false);
    router.refresh();
  }

  return (
    <Button size="sm" variant="outline" onClick={toggle} disabled={busy}>
      {current ? onLabel : offLabel}
    </Button>
  );
}

"use client";

import { useState } from "react";

const STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  completed: "bg-ink/5 text-ink border-ink/10",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusControl({ id, status, adminKey }: { id: number; status: string; adminKey: string }) {
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  const update = async (next: string) => {
    const prev = value;
    setValue(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) setValue(prev);
    } catch {
      setValue(prev);
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => update(e.target.value)}
      aria-label="Appointment status"
      className={`h-10 rounded-full border px-4 text-sm capitalize outline-none ${STYLES[value] ?? ""}`}
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}

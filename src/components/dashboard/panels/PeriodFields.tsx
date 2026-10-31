"use client";

import { TextInput, Toggle } from "../fields";

export interface Period {
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  periodNote: string;
}

export function PeriodFields({ value, onChange }: { value: Period; onChange: (patch: Partial<Period>) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextInput label="Start" value={value.startDate} placeholder="YYYY or YYYY-MM" maxLength={7} onChange={(startDate) => onChange({ startDate })} />
      {value.isCurrent ? (
        <div className="flex items-end pb-2 text-sm text-slate-400">Ongoing — shows the “Present” label</div>
      ) : (
        <TextInput label="End" value={value.endDate} placeholder="YYYY or YYYY-MM" maxLength={7} onChange={(endDate) => onChange({ endDate })} />
      )}
      <Toggle label="Ongoing" checked={value.isCurrent} onChange={(isCurrent) => onChange({ isCurrent })} />
      <TextInput label="Note (optional)" value={value.periodNote} placeholder="e.g. Expected Jan. 2026" onChange={(periodNote) => onChange({ periodNote })} />
    </div>
  );
}

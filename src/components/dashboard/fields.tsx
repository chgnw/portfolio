"use client";

import { useId, useState, type ReactNode } from "react";
import { FiChevronDown, FiChevronUp, FiArrowUp, FiArrowDown, FiTrash2, FiPlus } from "react-icons/fi";

export const inputCls =
  "w-full rounded-md bg-slate-900/70 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/50";

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function TextInput({
  label, value, onChange, placeholder, hint, type = "text", maxLength,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: ReactNode; type?: string; maxLength?: number }) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <input id={id} type={type} className={inputCls} value={value} placeholder={placeholder} maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

export function TextArea({
  label, value, onChange, placeholder, hint, rows = 4,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: ReactNode; rows?: number }) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <textarea id={id} rows={rows} className={`${inputCls} resize-y`} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-emerald-500" : "bg-slate-600"}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${checked ? "left-4.5" : "left-0.5"}`} />
      </button>
      {label}
    </label>
  );
}

export function Select({
  label, value, onChange, options, hint,
}: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; hint?: ReactNode }) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <select id={id} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}
    </Field>
  );
}

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success";
const variants: Record<Variant, string> = {
  primary: "bg-sky-500 text-slate-950 hover:bg-sky-400",
  success: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
  secondary: "bg-slate-700 text-slate-100 hover:bg-slate-600",
  danger: "bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30",
  ghost: "text-slate-300 hover:bg-slate-800",
};

export function Button({
  children, onClick, variant = "secondary", disabled, type = "button", title, className = "",
}: { children: ReactNode; onClick?: () => void; variant?: Variant; disabled?: boolean; type?: "button" | "submit"; title?: string; className?: string }) {
  return (
    <button type={type} title={title} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function PanelHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-slate-800 bg-slate-900/50 p-4 ${className}`}>{children}</div>;
}

/**
 * Generic list editor: add / remove / reorder / collapse.
 */
export function ListEditor<T extends { id: string }>({
  items, onChange, renderItem, title, create, addLabel = "Add", empty = "Nothing here yet.", isActive,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  title: (item: T) => string;
  create: () => T;
  addLabel?: string;
  empty?: string;
  isActive?: (item: T) => boolean;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm italic text-slate-500">{empty}</p>}
      {items.map((item, i) => {
        const isOpen = open.has(item.id);
        const inactive = isActive ? !isActive(item) : false;
        return (
          <div key={item.id} className={`rounded-lg border bg-slate-900/50 ${inactive ? "border-dashed border-slate-700 opacity-70" : "border-slate-800"}`}>
            <div className="flex items-center gap-2 px-3 py-2">
              <button type="button" onClick={() => toggle(item.id)} className="flex flex-1 items-center gap-2 text-left text-sm font-medium text-slate-200 min-w-0">
                {isOpen ? <FiChevronUp className="shrink-0" /> : <FiChevronDown className="shrink-0" />}
                <span className="truncate">{title(item) || <span className="italic text-slate-500">Untitled</span>}</span>
                {inactive && <span className="shrink-0 rounded bg-slate-700 px-1.5 py-0.5 text-[10px] uppercase text-slate-300">hidden</span>}
              </button>
              <Button variant="ghost" title="Move up" onClick={() => move(i, -1)} disabled={i === 0}><FiArrowUp /></Button>
              <Button variant="ghost" title="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1}><FiArrowDown /></Button>
              <Button variant="ghost" title="Remove" onClick={() => {
                if (confirm(`Remove "${title(item) || "this item"}"?`)) onChange(items.filter((x) => x.id !== item.id));
              }}><FiTrash2 className="text-red-400" /></Button>
            </div>
            {isOpen && (
              <div className="space-y-4 border-t border-slate-800 p-4">
                {renderItem(item, (patch) => onChange(items.map((x) => (x.id === item.id ? { ...x, ...patch } : x))), i)}
              </div>
            )}
          </div>
        );
      })}
      <Button variant="secondary" onClick={() => {
        const item = create();
        onChange([...items, item]);
        setOpen((prev) => new Set(prev).add(item.id));
      }}>
        <FiPlus /> {addLabel}
      </Button>
    </div>
  );
}

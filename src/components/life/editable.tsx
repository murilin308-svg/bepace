import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Inline editing primitives — every value in the app is a field you can click
 * and change. Commit on blur or Enter, revert on Escape.
 */

export function EditText({
  value,
  onCommit,
  placeholder = "—",
  className,
  multiline,
  rows = 3,
}: {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);

  const commit = () => {
    const next = draft.trim();
    if (next !== value) onCommit(next);
  };

  const base = cn(
    "w-full rounded-lg border border-transparent bg-transparent px-2 py-1 -mx-2 text-sm outline-none transition-colors",
    "hover:border-hairline hover:bg-surface-2/60 focus:border-accent-orange/50 focus:bg-surface-2",
    "placeholder:text-muted-foreground",
    className,
  );

  if (multiline) {
    return (
      <textarea
        value={draft}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Escape") setDraft(value);
        }}
        className={cn(base, "resize-none leading-relaxed")}
      />
    );
  }

  return (
    <input
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          setDraft(value);
          e.currentTarget.blur();
        }
      }}
      className={base}
    />
  );
}

export function EditNumber({
  value,
  onCommit,
  min = 0,
  max = 100,
  suffix,
  className,
}: {
  value: number;
  onCommit: (next: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const n = Math.max(min, Math.min(max, Number(draft) || 0));
    setDraft(String(n));
    if (n !== value) onCommit(n);
  };

  return (
    <span className="inline-flex items-baseline gap-0.5">
      <input
        value={draft}
        inputMode="numeric"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className={cn(
          "w-12 rounded-lg border border-transparent bg-transparent px-1.5 py-1 text-right text-xs tabular-nums outline-none transition-colors",
          "hover:border-hairline hover:bg-surface-2/60 focus:border-accent-orange/50 focus:bg-surface-2",
          className,
        )}
      />
      {suffix ? <span className="text-[11px] text-muted-foreground">{suffix}</span> : null}
    </span>
  );
}

export function EditSelect({
  value,
  options,
  onCommit,
  className,
}: {
  value: string;
  options: readonly string[];
  onCommit: (next: string) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onCommit(e.target.value)}
      className={cn(
        "cursor-pointer appearance-none rounded-lg border border-transparent bg-transparent px-2 py-1 text-[11px] text-muted-foreground outline-none transition-colors",
        "hover:border-hairline hover:bg-surface-2/60 focus:border-accent-orange/50",
        className,
      )}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-surface-2 text-foreground">
          {o}
        </option>
      ))}
    </select>
  );
}

export function DeleteButton({
  onDelete,
  label = "Delete",
}: {
  onDelete: () => void;
  label?: string;
}) {
  const [armed, setArmed] = useState(false);
  return armed ? (
    <span className="inline-flex items-center gap-1">
      <button
        onClick={() => {
          setArmed(false);
          onDelete();
        }}
        aria-label={`Confirm ${label}`}
        className="grid h-7 w-7 place-items-center rounded-lg bg-accent-orange text-black"
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setArmed(false)}
        aria-label="Cancel"
        className="grid h-7 w-7 place-items-center rounded-lg border border-hairline text-muted-foreground hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  ) : (
    <button
      onClick={() => setArmed(true)}
      aria-label={label}
      className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-surface-2 hover:text-foreground"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}

export function AddRow({
  placeholder,
  onAdd,
  cta = "Add",
}: {
  placeholder: string;
  onAdd: (value: string) => void;
  cta?: string;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    onAdd(v);
    setValue("");
    ref.current?.focus();
  };

  return (
    <div className="flex items-center gap-2 border-t border-hairline px-6 py-3">
      <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <input
        ref={ref}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="shrink-0 rounded-lg border border-hairline px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-accent-orange/40 hover:text-foreground disabled:opacity-40"
      >
        {cta}
      </button>
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="eyebrow mb-1">{children}</p>;
}

export function ActionButton({
  children,
  onClick,
  variant = "accent",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "accent" | "ghost";
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-opacity disabled:opacity-50",
        variant === "accent"
          ? "bg-accent-orange text-black hover:opacity-90"
          : "border border-hairline bg-surface-1 font-medium text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

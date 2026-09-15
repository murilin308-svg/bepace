import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Panel, PageHeader, EmptyState, Progress, Tag } from "@/components/life/primitives";
import {
  AddRow,
  DeleteButton,
  EditNumber,
  EditSelect,
  EditText,
  FieldLabel,
} from "@/components/life/editable";
import { useCollection, useCreate, useRemove, useUpdate, type TableName } from "@/lib/db";
import { cn } from "@/lib/utils";

export type ModuleField =
  | { key: string; label: string; type: "text" | "textarea" }
  | { key: string; label: string; type: "number"; min?: number; max?: number; suffix?: string }
  | { key: string; label: string; type: "select"; options: readonly string[] }
  | { key: string; label: string; type: "check" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

/**
 * Módulo editável genérico do BEPACE.
 * Tudo o que aparece na tela é um campo clicável — salva ao sair do campo.
 */
export function ModuleBoard({
  table,
  eyebrow,
  title,
  description,
  addPlaceholder,
  titleKey = "title",
  fields,
  defaults = {},
  filterKey,
  progressKey,
  extra,
}: {
  table: TableName;
  eyebrow: string;
  title: string;
  description?: string;
  addPlaceholder: string;
  titleKey?: string;
  fields: readonly ModuleField[];
  defaults?: Row;
  filterKey?: string;
  progressKey?: string;
  extra?: React.ReactNode;
}) {
  const { data = [], isLoading } = useCollection<Row>(table);
  const create = useCreate(table);
  const update = useUpdate(table);
  const remove = useRemove(table);
  const [filter, setFilter] = useState("Todos");

  const filterOptions = useMemo(() => {
    if (!filterKey) return [];
    const field = fields.find((f) => f.key === filterKey);
    const fromField = field && field.type === "select" ? [...field.options] : [];
    const fromData = data.map((r) => String(r[filterKey] ?? "")).filter(Boolean);
    return ["Todos", ...Array.from(new Set([...fromField, ...fromData]))];
  }, [filterKey, fields, data]);

  const rows = filterKey && filter !== "Todos"
    ? data.filter((r) => String(r[filterKey]) === filter)
    : data;

  const set = (id: string, key: string, value: unknown) =>
    update.mutate({ id, values: { [key]: value } });

  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} {...(description ? { description } : {})} />

      {extra}

      <Panel className="mb-6">
        <AddRow
          placeholder={addPlaceholder}
          cta="Adicionar"
          onAdd={(value) => create.mutate({ ...defaults, [titleKey]: value })}
        />
      </Panel>

      {filterOptions.length > 2 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {filterOptions.map((o) => (
            <button
              key={o}
              onClick={() => setFilter(o)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                filter === o
                  ? "border-accent-orange/40 bg-accent-orange/10 text-accent-orange"
                  : "border-hairline bg-surface-1 text-muted-foreground hover:text-foreground",
              )}
            >
              {o}
            </button>
          ))}
        </div>
      ) : null}

      {isLoading ? (
        <Panel>
          <div className="flex items-center justify-center gap-2 py-16 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Carregando…
          </div>
        </Panel>
      ) : rows.length === 0 ? (
        <Panel>
          <EmptyState title="Nada aqui ainda" hint="Use o campo acima para criar o primeiro item." />
        </Panel>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((row, i) => (
            <Panel key={row['id']} delay={Math.min(i, 8) * 0.03} className="flex flex-col">
              <div className="flex items-start gap-2 px-6 pt-5">
                <div className="min-w-0 flex-1">
                  <EditText
                    value={String(row[titleKey] ?? "")}
                    placeholder="Sem título"
                    className="text-[15px] font-medium"
                    onCommit={(v) => set(row['id'], titleKey, v)}
                  />
                </div>
                <DeleteButton onDelete={() => remove.mutate(row['id'])} label="Excluir" />
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 pt-3">
                {fields
                  .filter((f) => f.type === "select" || f.type === "check")
                  .map((f) =>
                    f.type === "select" ? (
                      <EditSelect
                        key={f.key}
                        value={String(row[f.key] ?? f.options[0])}
                        options={f.options}
                        onCommit={(v) => set(row['id'], f.key, v)}
                        className="border-hairline bg-surface-2/60"
                      />
                    ) : (
                      <label
                        key={f.key}
                        className="inline-flex cursor-pointer items-center gap-2 text-[11px] text-muted-foreground"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(row[f.key])}
                          onChange={(e) => set(row['id'], f.key, e.target.checked)}
                          className="h-3.5 w-3.5 accent-[var(--accent-orange)]"
                        />
                        {f.label}
                      </label>
                    ),
                  )}
              </div>

              {fields.some((f) => f.type === "number") ? (
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 px-6">
                  {fields
                    .filter((f) => f.type === "number")
                    .map((f) => (
                      <div key={f.key}>
                        <FieldLabel>{f.label}</FieldLabel>
                        <EditNumber
                          value={Number(row[f.key] ?? 0)}
                          min={"min" in f ? (f.min ?? 0) : 0}
                          max={"max" in f ? (f.max ?? 100000) : 100000}
                          {...("suffix" in f && f.suffix ? { suffix: f.suffix } : {})}
                          onCommit={(v) => set(row['id'], f.key, v)}
                          className="w-16 text-left text-sm"
                        />
                      </div>
                    ))}
                </div>
              ) : null}

              {progressKey ? (
                <div className="mt-4 px-6">
                  <Progress value={Number(row[progressKey] ?? 0)} />
                </div>
              ) : null}

              <div className="mt-4 flex-1 space-y-3 px-6 pb-5">
                {fields
                  .filter((f) => f.type === "text" || f.type === "textarea")
                  .map((f) => (
                    <div key={f.key}>
                      <FieldLabel>{f.label}</FieldLabel>
                      <EditText
                        value={String(row[f.key] ?? "")}
                        placeholder="—"
                        multiline={f.type === "textarea"}
                        rows={3}
                        className="text-[13px] text-muted-foreground"
                        onCommit={(v) => set(row['id'], f.key, v)}
                      />
                    </div>
                  ))}
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

export function LibraryPicker({
  title,
  items,
  onPick,
}: {
  title: string;
  items: readonly { label: string; values: Row }[];
  onPick: (values: Row) => void;
}) {
  return (
    <Panel className="mb-6">
      <div className="px-6 pt-5 pb-3">
        <p className="eyebrow">{title}</p>
      </div>
      <div className="flex flex-wrap gap-2 px-6 pb-5">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={() => onPick(it.values)}
            className="rounded-full border border-hairline bg-surface-2/60 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-accent-orange/40 hover:text-foreground"
          >
            + {it.label}
          </button>
        ))}
      </div>
    </Panel>
  );
}

export { Tag };

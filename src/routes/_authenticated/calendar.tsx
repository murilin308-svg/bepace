import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/life/app-shell";
import { EmptyState, PageHeader, Panel, PanelHead } from "@/components/life/primitives";
import { useCollection, useCreate, useRemove, useUpdate } from "@/lib/db";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/calendar")({
  head: () => ({
    meta: [
      { title: "Calendário — BEPACE" },
      {
        name: "description",
        content:
          "Sua semana em um calendário limpo, com categorias pessoal, profissional, estudos e saúde.",
      },
      { property: "og:title", content: "Calendário — BEPACE" },
      { property: "og:description", content: "Planeje a semana com clareza no BEPACE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);
const CATEGORIES = ["Pessoal", "Profissional", "Estudos", "Saúde"] as const;

const catStyle: Record<string, string> = {
  Saúde: "bg-accent-orange/15 border-accent-orange/40",
  Profissional: "bg-surface-3 border-border",
  Estudos: "bg-surface-3 border-border",
  Pessoal: "bg-surface-3 border-border",
};

function CalendarPage() {
  const { data: events = [] } = useCollection<Row>("events");
  const create = useCreate("events");
  const update = useUpdate("events");
  const remove = useRemove("events");

  const [filter, setFilter] = useState<string>("Todos");
  const [form, setForm] = useState({
    title: "",
    day: 0,
    start_hour: 9,
    end_hour: 10,
    category: "Pessoal" as string,
  });

  const rows = useMemo(
    () => (filter === "Todos" ? events : events.filter((e) => e['category'] === filter)),
    [events, filter],
  );

  const add = () => {
    const title = form.title.trim();
    if (!title) return;
    create.mutate({
      title,
      day: form.day,
      start_hour: form.start_hour,
      end_hour: Math.max(form.end_hour, form.start_hour + 1),
      category: form.category,
    });
    setForm({ ...form, title: "" });
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tempo"
        title="Calendário"
        description="Sua semana em blocos, por categoria. Clique em um compromisso para editar."
      />

      <Panel className="mb-6">
        <PanelHead title="Novo compromisso" hint="Título, dia, horário e categoria" />
        <div className="grid gap-3 border-t border-hairline px-6 py-5 sm:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))_auto]">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Ex.: Reunião de equipe"
            className="rounded-lg border border-hairline bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-accent-orange/40"
          />
          <select
            value={form.day}
            onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
            className="rounded-lg border border-hairline bg-surface-2 px-3 py-2 text-sm outline-none"
          >
            {DAYS.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={form.start_hour}
            onChange={(e) => setForm({ ...form, start_hour: Number(e.target.value) })}
            className="rounded-lg border border-hairline bg-surface-2 px-3 py-2 text-sm outline-none"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, "0")}:00
              </option>
            ))}
          </select>
          <select
            value={form.end_hour}
            onChange={(e) => setForm({ ...form, end_hour: Number(e.target.value) })}
            className="rounded-lg border border-hairline bg-surface-2 px-3 py-2 text-sm outline-none"
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, "0")}:00
              </option>
            ))}
          </select>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-lg border border-hairline bg-surface-2 px-3 py-2 text-sm outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={add}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-orange px-4 py-2 text-xs font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </button>
        </div>
      </Panel>

      <div className="mb-6 flex flex-wrap gap-2">
        {["Todos", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] transition-colors",
              filter === c
                ? "border-accent-orange/40 bg-accent-orange/10 text-accent-orange"
                : "border-hairline bg-surface-1 text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <Panel>
        <PanelHead title="Semana" hint={`${rows.length} compromissos`} />
        {rows.length === 0 ? (
          <EmptyState title="Semana livre" hint="Use o campo acima para criar o primeiro compromisso." />
        ) : (
          <div className="grid gap-px border-t border-hairline bg-hairline sm:grid-cols-7">
            {DAYS.map((d, i) => {
              const dayEvents = rows
                .filter((e) => Number(e['day']) === i)
                .sort((a, b) => Number(a['start_hour']) - Number(b['start_hour']));
              return (
                <div key={d} className="min-h-[160px] bg-surface-1 p-3">
                  <p className="eyebrow mb-3">{d}</p>
                  <div className="space-y-2">
                    {dayEvents.map((e) => (
                      <div
                        key={e['id']}
                        className={cn(
                          "group rounded-lg border px-2.5 py-2",
                          catStyle[String(e['category'])] ?? "bg-surface-3 border-border",
                        )}
                      >
                        <div className="flex items-start gap-1.5">
                          <input
                            defaultValue={String(e['title'] ?? "")}
                            onBlur={(ev) => {
                              const v = ev.target.value.trim();
                              if (v && v !== e['title'])
                                update.mutate({ id: e['id'], values: { title: v } });
                            }}
                            className="min-w-0 flex-1 bg-transparent text-[12px] outline-none"
                          />
                          <button
                            onClick={() => remove.mutate(e['id'])}
                            className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label="Excluir compromisso"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="mt-1 text-[10px] tabular-nums text-muted-foreground">
                          {String(e['start_hour']).padStart(2, "0")}:00 –{" "}
                          {String(e['end_hour']).padStart(2, "0")}:00 · {e['category']}
                        </p>
                      </div>
                    ))}
                    {dayEvents.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground">—</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <p className="mt-6 text-[11px] text-muted-foreground">
        A sincronização com Google, Outlook e Teams entra quando você liberar o acesso a essas contas.
      </p>
    </AppShell>
  );
}

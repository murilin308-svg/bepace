import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { AppShell } from "@/components/life/app-shell";
import { PageHeader, Panel, PanelHead, Progress, Tag } from "@/components/life/primitives";
import { goals, lifeAreas } from "@/lib/life-os";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/goals")({
  head: () => ({
    meta: [
      { title: "Goals — Life OS" },
      {
        name: "description",
        content:
          "Turn a vision into objectives, goals and tasks across health, career, finance, relationships, knowledge and travel.",
      },
      { property: "og:title", content: "Goals — Life OS" },
      {
        property: "og:description",
        content: "Vision → objective → goal → task. The architecture of the life you want.",
      },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  const [area, setArea] = useState<string>("All");
  const filtered = area === "All" ? goals : goals.filter((g) => g.area === area);
  const avg = Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Goals"
        title="The life you're building"
        description="Every objective carries a vision above it and tasks below it, so progress is never abstract."
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-accent-orange px-4 py-2.5 text-xs font-semibold text-black transition-opacity hover:opacity-90">
            <Plus className="h-3.5 w-3.5" />
            New objective
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {["All", ...lifeAreas].map((a) => (
          <button
            key={a}
            onClick={() => setArea(a)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
              area === a
                ? "border-accent-orange/40 bg-accent-orange/12 text-foreground"
                : "border-hairline bg-surface-1 text-muted-foreground hover:text-foreground",
            )}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHead title="Objectives" hint={`${filtered.length} active · ${avg}% average progress`} />
          <ul>
            {filtered.map((g) => (
              <li key={g.id} className="border-t border-hairline p-6">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <p className="eyebrow">{g.vision}</p>
                    <h3 className="mt-1.5 truncate text-base font-semibold tracking-tight">
                      {g.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground">{g.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-semibold tabular-nums">{g.progress}%</p>
                    <p className="text-[11px] text-muted-foreground">{g.status}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Progress value={g.progress} accent={g.priority === "High"} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Tag accent={g.priority === "High"}>{g.priority} priority</Tag>
                  <Tag>{g.area}</Tag>
                  <Tag>Due {g.due}</Tag>
                </div>

                <ul className="mt-4 space-y-2 border-t border-hairline pt-4">
                  {g.tasks.map((t) => (
                    <li key={t.title} className="flex items-center gap-3 text-sm">
                      <span
                        className={
                          t.done
                            ? "grid h-4 w-4 shrink-0 place-items-center rounded-md bg-accent-orange"
                            : "h-4 w-4 shrink-0 rounded-md border border-border"
                        }
                      >
                        {t.done ? <Check className="h-2.5 w-2.5 text-black" /> : null}
                      </span>
                      <span className={t.done ? "text-muted-foreground line-through" : ""}>
                        {t.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-4 lg:col-span-4">
          <Panel raised delay={0.05}>
            <PanelHead title="By area" hint="Where your attention goes" />
            <div className="space-y-3 px-6 pb-6">
              {lifeAreas.map((a) => {
                const inArea = goals.filter((g) => g.area === a);
                const value = inArea.length
                  ? Math.round(inArea.reduce((s, g) => s + g.progress, 0) / inArea.length)
                  : 0;
                return (
                  <div key={a}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs">{a}</span>
                      <span className="text-[11px] tabular-nums text-muted-foreground">
                        {value}%
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <Progress value={value} accent={value >= 60} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel delay={0.1}>
            <PanelHead title="Connected" hint="Goals feed the rest of the system" />
            <ul className="space-y-3 px-6 pb-6 text-xs text-muted-foreground">
              <li>· Tasks appear as calendar blocks</li>
              <li>· Completed goals raise the Life Score</li>
              <li>· Journal entries can be linked to an objective</li>
              <li>· Travel goals sync with the Travel module</li>
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Flame, Plus } from "lucide-react";
import { AppShell } from "@/components/life/app-shell";
import { Metric, PageHeader, Panel, PanelHead, Progress } from "@/components/life/primitives";
import { habits } from "@/lib/life-os";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "Habits — Life OS" },
      {
        name: "description",
        content:
          "Track streaks, consistency and completion rate for the daily habits that quietly build the rest of your life.",
      },
      { property: "og:title", content: "Habits — Life OS" },
      {
        property: "og:description",
        content: "Streaks, consistency and completion rate — without the noise.",
      },
    ],
  }),
  component: HabitsPage,
});

function HabitsPage() {
  const [done, setDone] = useState<Record<string, boolean>>(
    Object.fromEntries(habits.map((h) => [h.id, h.doneToday])),
  );
  const completed = Object.values(done).filter(Boolean).length;
  const avg = Math.round(habits.reduce((a, h) => a + h.consistency, 0) / habits.length);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Habits"
        title="What you do repeatedly"
        description="Small, boring, decisive. Every completion moves the Life Score."
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-accent-orange px-4 py-2.5 text-xs font-semibold text-black transition-opacity hover:opacity-90">
            <Plus className="h-3.5 w-3.5" />
            New habit
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="grid grid-cols-2 divide-x divide-y divide-hairline sm:grid-cols-4 sm:divide-y-0 lg:col-span-12">
          <Metric label="Today" value={`${completed}/${habits.length}`} sub="Completed" />
          <Metric label="Consistency" value={`${avg}%`} sub="Last 30 days" />
          <Metric label="Longest streak" value="34d" sub="Exercise" />
          <Metric label="Active habits" value={String(habits.length)} sub="Across 3 areas" />
        </Panel>

        <Panel className="lg:col-span-7" delay={0.05}>
          <PanelHead title="Today" hint="Tap to complete" />
          <ul>
            {habits.map((h) => (
              <li
                key={h.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-t border-hairline px-6 py-4"
              >
                <button
                  onClick={() => setDone((d) => ({ ...d, [h.id]: !d[h.id] }))}
                  aria-label={`Toggle ${h.name}`}
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors",
                    done[h.id]
                      ? "border-accent-orange bg-accent-orange"
                      : "border-border hover:border-foreground/40",
                  )}
                >
                  {done[h.id] ? <Check className="h-3.5 w-3.5 text-black" /> : null}
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{h.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {h.area} · best {h.best} days
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
                  <Flame className="h-3.5 w-3.5 text-accent-orange" />
                  {h.streak}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-4 lg:col-span-5">
          <Panel raised delay={0.1}>
            <PanelHead title="Last 14 days" hint="One row per habit" />
            <div className="space-y-3 px-6 pb-6">
              {habits.map((h) => (
                <div key={h.id}>
                  <p className="text-[11px] text-muted-foreground">{h.name}</p>
                  <div className="mt-1.5 flex gap-1">
                    {h.last14.map((v, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-4 flex-1 rounded-[3px]",
                          v ? "bg-accent-orange/80" : "bg-surface-3",
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel delay={0.15}>
            <PanelHead title="Consistency" hint="Completion rate per habit" />
            <div className="space-y-3 px-6 pb-6">
              {habits.map((h) => (
                <div key={h.id}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs">{h.name}</span>
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {h.consistency}%
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={h.consistency} accent={h.consistency >= 75} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

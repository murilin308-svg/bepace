import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { PageHeader, Panel, PanelHead, Progress, Tag } from "@/components/life/primitives";
import { journal } from "@/lib/life-os";

export const Route = createFileRoute("/_authenticated/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Life OS" },
      {
        name: "description",
        content:
          "A daily record of mood, energy, gratitude and learnings that becomes a timeline of your life.",
      },
      { property: "og:title", content: "Journal — Life OS" },
      {
        property: "og:description",
        content: "Mood, energy, gratitude and learnings — a timeline of your life.",
      },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Journal"
        title="The record of your days"
        description="Two minutes a day. Over a year it becomes the most valuable data in the system."
        action={
          <button className="rounded-xl bg-accent-orange px-4 py-2.5 text-xs font-semibold text-black transition-opacity hover:opacity-90">
            Write today
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-8" raised>
          <PanelHead title="Timeline" hint="Most recent first" />
          <ul>
            {journal.map((e) => (
              <li key={e.id} className="border-t border-hairline p-6">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <p className="eyebrow">{e.date}</p>
                    <p className="mt-2 text-sm leading-relaxed">{e.highlight}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Tag accent>{e.mood}</Tag>
                    <p className="mt-2 text-[11px] text-muted-foreground">Energy {e.energy}/5</p>
                  </div>
                </div>

                <dl className="mt-5 grid gap-4 border-t border-hairline pt-4 sm:grid-cols-2">
                  <div>
                    <dt className="eyebrow">Gratitude</dt>
                    <dd className="mt-1 text-xs text-muted-foreground">{e.gratitude}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Learning</dt>
                    <dd className="mt-1 text-xs text-muted-foreground">{e.learning}</dd>
                  </div>
                </dl>

                {e.linkedGoal ? (
                  <p className="mt-4 text-[11px] text-muted-foreground">
                    Linked objective · <span className="text-foreground">{e.linkedGoal}</span>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-4 lg:col-span-4">
          <Panel delay={0.05}>
            <PanelHead title="Mood this month" hint="Distribution" />
            <div className="space-y-3 px-6 pb-6">
              {[
                { label: "Great", value: 34 },
                { label: "Good", value: 46 },
                { label: "Neutral", value: 15 },
                { label: "Low", value: 5 },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs">{m.label}</span>
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {m.value}%
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={m.value} accent={m.label === "Great" || m.label === "Good"} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel delay={0.1}>
            <PanelHead title="Today's check-in" hint="Progressive disclosure — start small" />
            <div className="space-y-4 px-6 pb-6">
              <div>
                <p className="eyebrow">Mood</p>
                <div className="mt-2 flex gap-2">
                  {["Great", "Good", "Neutral", "Low"].map((m, i) => (
                    <button
                      key={m}
                      className={
                        i === 1
                          ? "rounded-lg border border-accent-orange/40 bg-accent-orange/12 px-3 py-1.5 text-xs"
                          : "rounded-lg border border-hairline bg-surface-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                      }
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow">Reflection</p>
                <textarea
                  rows={4}
                  placeholder="What mattered today?"
                  className="mt-2 w-full resize-none rounded-xl border border-hairline bg-surface-2 p-3 text-xs outline-none placeholder:text-muted-foreground focus:border-accent-orange/50"
                />
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

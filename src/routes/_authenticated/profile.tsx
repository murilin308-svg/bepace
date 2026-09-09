import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import {
  Metric,
  PageHeader,
  Panel,
  PanelHead,
  Progress,
  ScoreRing,
  Sparkline,
} from "@/components/life/primitives";
import { goals, habits, lifeScore, notes, travelStats, user } from "@/lib/life-os";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — BEPACE" },
      {
        name: "description",
        content:
          "Your personal statistics: Life Score history, goals completed, habits active, notes written and countries visited.",
      },
      { property: "og:title", content: "Profile — BEPACE" },
      {
        property: "og:description",
        content: "The long view of your own evolution.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Profile" title={user.name} description={`Member since ${user.memberSince} · ${user.timezone}`} />

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-4" raised>
          <div className="flex flex-col items-center px-6 py-8">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-surface-3 text-xl font-semibold">
              {user.initials}
            </span>
            <p className="mt-4 text-base font-semibold tracking-tight">{user.name}</p>
            <p className="text-xs text-muted-foreground">@{user.handle}</p>
            <div className="mt-6">
              <ScoreRing value={lifeScore.current} size={140} />
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground">
              Average score this year · 71
            </p>
          </div>
        </Panel>

        <div className="space-y-4 lg:col-span-8">
          <Panel className="grid grid-cols-2 divide-x divide-y divide-hairline sm:grid-cols-3 sm:divide-y-0" delay={0.05}>
            <Metric label="Days using BEPACE" value="512" />
            <Metric label="Goals completed" value="9" />
            <Metric label="Habits active" value={String(habits.length)} />
            <Metric label="Notes created" value={String(notes.length * 9)} />
            <Metric label="Countries visited" value={String(travelStats.countries)} />
            <Metric label="Consistency" value="82%" />
          </Panel>

          <Panel delay={0.1}>
            <PanelHead title="Life Score evolution" hint="Last 7 weeks" />
            <div className="px-6 pb-6">
              <Sparkline data={lifeScore.weekly} height={72} />
              <div className="mt-4 grid gap-4 border-t border-hairline pt-4 sm:grid-cols-2">
                <div>
                  <p className="eyebrow">Working well</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    {lifeScore.strengths.map((s) => (
                      <li key={s}>· {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow">Needs attention</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    {lifeScore.attention.map((s) => (
                      <li key={s}>· {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Panel>

          <Panel delay={0.15}>
            <PanelHead title="Objectives progress" />
            <div className="space-y-3 px-6 pb-6">
              {goals.map((g) => (
                <div key={g.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-xs">{g.title}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {g.progress}%
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={g.progress} accent={g.priority === "High"} />
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

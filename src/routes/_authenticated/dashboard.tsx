import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Clock } from "lucide-react";
import { AppShell } from "@/components/life/app-shell";
import {
  Metric,
  Panel,
  PanelHead,
  Progress,
  ScoreRing,
  Sparkline,
  Tag,
} from "@/components/life/primitives";
import {
  activity,
  events,
  goals,
  habits,
  lifeScore,
  notes,
  travelStats,
  user,
  weekPlan,
} from "@/lib/life-os";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Life OS — Your Personal Command Center" },
      {
        name: "description",
        content:
          "Life OS brings goals, habits, calendar, notes, travel and journal into one calm command center for your life.",
      },
      { property: "og:title", content: "Life OS — Your Personal Command Center" },
      {
        property: "og:description",
        content:
          "One place to see where you are, where you're going and how you're evolving.",
      },
    ],
  }),
  component: Dashboard,
});

function useDayLabel() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    setLabel(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);
  return label;
}

function Dashboard() {
  const dayLabel = useDayLabel();
  const todayEvents = events.filter((e) => e.day <= 1).slice(0, 4);
  const doneHabits = habits.filter((h) => h.doneToday).length;

  return (
    <AppShell>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 pb-8 sm:flex sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow min-h-4">{dayLabel}</p>
          <h1 className="mt-2 text-display text-3xl leading-none sm:text-[2.6rem]">
            Good afternoon, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            Three things matter today: the threshold run, the design review, and closing the
            weekly plan.
          </p>
        </div>
        <Link
          to="/journal"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent-orange px-4 py-2.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
        >
          Daily check-in
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Life Score */}
        <Panel className="lg:col-span-5" raised>
          <PanelHead title="Life Score" hint="Consistency, execution and evolution" />
          <div className="flex flex-col items-center gap-6 px-6 pb-6 sm:flex-row sm:items-center">
            <ScoreRing value={lifeScore.current} />
            <div className="w-full min-w-0 space-y-4">
              <div>
                <p className="eyebrow">This week</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-semibold text-accent-orange">+{lifeScore.delta}</span> vs
                  last week
                </p>
                <Sparkline data={lifeScore.weekly} />
              </div>
              <div className="space-y-2">
                {lifeScore.strengths.slice(0, 2).map((s) => (
                  <p key={s} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent-orange" />
                    {s}
                  </p>
                ))}
                {lifeScore.attention.slice(0, 1).map((s) => (
                  <p key={s} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Clock className="mt-0.5 h-3 w-3 shrink-0" />
                    {s}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        {/* Today */}
        <Panel className="lg:col-span-4" delay={0.04}>
          <PanelHead title="Today" hint={`${todayEvents.length} commitments`} action={<Tag>Calendar</Tag>} />
          <ul>
            {todayEvents.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-4 border-t border-hairline px-6 py-3.5 first:border-t-0"
              >
                <span className="w-12 shrink-0 text-xs tabular-nums text-muted-foreground">
                  {String(e.start).padStart(2, "0")}:00
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">{e.title}</span>
                <span
                  className={
                    e.category === "Health"
                      ? "h-1.5 w-1.5 shrink-0 rounded-full bg-accent-orange"
                      : "h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40"
                  }
                />
              </li>
            ))}
          </ul>
          <div className="border-t border-hairline px-6 py-3">
            <Link to="/calendar" className="text-xs text-muted-foreground hover:text-foreground">
              Open calendar →
            </Link>
          </div>
        </Panel>

        {/* Habits today */}
        <Panel className="lg:col-span-3" delay={0.08}>
          <PanelHead title="Habits" hint={`${doneHabits} of ${habits.length} done`} />
          <ul className="px-6 pb-5">
            {habits.slice(0, 5).map((h) => (
              <li key={h.id} className="flex items-center gap-3 py-2">
                <span
                  className={
                    h.doneToday
                      ? "grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-orange"
                      : "h-5 w-5 shrink-0 rounded-full border border-border"
                  }
                >
                  {h.doneToday ? <Check className="h-3 w-3 text-black" /> : null}
                </span>
                <span
                  className={
                    h.doneToday
                      ? "min-w-0 flex-1 truncate text-sm text-muted-foreground line-through"
                      : "min-w-0 flex-1 truncate text-sm"
                  }
                >
                  {h.name}
                </span>
                <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                  {h.streak}d
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Priority goals */}
        <Panel className="lg:col-span-7" delay={0.12}>
          <PanelHead
            title="Priority objectives"
            hint="Vision → objective → goal → task"
            action={
              <Link to="/goals" className="text-xs text-muted-foreground hover:text-foreground">
                All goals →
              </Link>
            }
          />
          <ul>
            {goals.slice(0, 4).map((g) => (
              <li key={g.id} className="border-t border-hairline px-6 py-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{g.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {g.area} · due {g.due}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {g.progress}%
                  </span>
                </div>
                <div className="mt-3">
                  <Progress value={g.progress} accent={g.priority === "High"} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Weekly plan */}
        <Panel className="lg:col-span-5" delay={0.16}>
          <PanelHead title="Weekly planning" hint="Load per day" />
          <div className="space-y-3 px-6 pb-6">
            {weekPlan.map((d) => (
              <div key={d.day} className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-3">
                <span className="text-[11px] text-muted-foreground">{d.day}</span>
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-xs">{d.focus}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {d.load}%
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={d.load} accent={d.load > 70} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Stats strip */}
        <Panel className="grid grid-cols-2 divide-x divide-y divide-hairline sm:grid-cols-4 sm:divide-y-0 lg:col-span-8" delay={0.2}>
          <Metric label="Monthly score" value="+17" sub="Since April" />
          <Metric label="Goals shipped" value="9" sub="This year" />
          <Metric label="Consistency" value="82%" sub="Last 30 days" />
          <Metric label="Notes" value={String(notes.length * 9)} sub="Across 5 folders" />
        </Panel>

        {/* Next trip */}
        <Panel className="lg:col-span-4" delay={0.24}>
          <PanelHead title="Next trip" hint={travelStats.next} action={<Tag accent>Planned</Tag>} />
          <div className="px-6 pb-6">
            <p className="text-display text-2xl">Lisbon</p>
            <p className="mt-1 text-xs text-muted-foreground">
              14 days · {travelStats.countries} countries visited · {travelStats.worldPercent}% of
              the world
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag>Portugal</Tag>
              <Tag>Europe</Tag>
              <Tag>Work remote</Tag>
            </div>
            <Link
              to="/travel"
              className="mt-5 inline-block text-xs text-muted-foreground hover:text-foreground"
            >
              Open travel →
            </Link>
          </div>
        </Panel>

        {/* Latest notes */}
        <Panel className="lg:col-span-6" delay={0.28}>
          <PanelHead
            title="Latest notes"
            action={
              <Link to="/notes" className="text-xs text-muted-foreground hover:text-foreground">
                All notes →
              </Link>
            }
          />
          <ul>
            {notes.slice(0, 3).map((n) => (
              <li key={n.id} className="border-t border-hairline px-6 py-4">
                <p className="truncate text-sm font-medium">{n.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.excerpt}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{n.updated}</p>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Activity */}
        <Panel className="lg:col-span-6" delay={0.32}>
          <PanelHead title="Recent activity" hint="Across every module" />
          <ul className="px-6 pb-6">
            {activity.map((a) => (
              <li key={a.detail} className="flex items-start gap-3 py-2.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-orange" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs">
                    <span className="text-muted-foreground">{a.label} · </span>
                    {a.detail}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{a.when}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}

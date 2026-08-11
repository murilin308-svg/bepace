import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AppShell } from "@/components/life/app-shell";
import { PageHeader, Panel, Tag } from "@/components/life/primitives";
import { events } from "@/lib/life-os";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Life OS" },
      {
        name: "description",
        content:
          "A premium calendar with day, week, month and year views, categories and reminders — built for planning a life, not just a schedule.",
      },
      { property: "og:title", content: "Calendar — Life OS" },
      {
        property: "og:description",
        content: "Day, week, month and year views for planning a life.",
      },
    ],
  }),
  component: CalendarPage,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 15 }, (_, i) => i + 7);
const views = ["Day", "Week", "Month", "Year"] as const;

const categoryStyle: Record<string, string> = {
  Work: "bg-surface-3 border-border",
  Health: "bg-accent-orange/12 border-accent-orange/40",
  Personal: "bg-surface-3 border-border",
  Travel: "bg-surface-3 border-border",
};

function WeekView() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))] border-b border-hairline">
          <div />
          {days.map((d, i) => (
            <div key={d} className="px-2 py-3 text-center">
              <p className="eyebrow">{d}</p>
              <p
                className={cn(
                  "mx-auto mt-1 grid h-7 w-7 place-items-center rounded-full text-sm tabular-nums",
                  i === 1 ? "bg-accent-orange font-semibold text-black" : "text-muted-foreground",
                )}
              >
                {10 + i}
              </p>
            </div>
          ))}
        </div>

        <div className="relative grid grid-cols-[56px_repeat(7,minmax(0,1fr))]">
          <div>
            {hours.map((h) => (
              <div key={h} className="h-14 pr-2 text-right text-[10px] tabular-nums text-muted-foreground">
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>
          {days.map((d, dayIndex) => (
            <div key={d} className="relative border-l border-hairline">
              {hours.map((h) => (
                <div key={h} className="h-14 border-b border-hairline/60" />
              ))}
              {events
                .filter((e) => e.day === dayIndex)
                .map((e) => (
                  <div
                    key={e.id}
                    className={cn(
                      "absolute right-1 left-1 overflow-hidden rounded-lg border px-2 py-1.5",
                      categoryStyle[e.category],
                    )}
                    style={{
                      top: (e.start - 7) * 56 + 2,
                      height: (e.end - e.start) * 56 - 6,
                    }}
                  >
                    <p className="truncate text-[11px] font-medium">{e.title}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {String(e.start).padStart(2, "0")}:00
                    </p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MonthView() {
  return (
    <div className="grid grid-cols-7 border-t border-l border-hairline">
      {Array.from({ length: 35 }, (_, i) => {
        const dayNum = i - 2;
        const inMonth = dayNum > 0 && dayNum <= 31;
        const hasEvent = inMonth && [3, 8, 11, 12, 17, 24, 26].includes(dayNum);
        return (
          <div key={i} className="h-24 border-r border-b border-hairline p-2">
            <span
              className={cn(
                "text-xs tabular-nums",
                inMonth ? "text-muted-foreground" : "text-muted-foreground/30",
                dayNum === 11 && "font-semibold text-foreground",
              )}
            >
              {inMonth ? dayNum : ""}
            </span>
            {hasEvent ? (
              <div className="mt-2 space-y-1">
                <div className="truncate rounded-md border border-accent-orange/40 bg-accent-orange/12 px-1.5 py-0.5 text-[10px]">
                  Deep work
                </div>
                {dayNum % 2 === 0 ? (
                  <div className="truncate rounded-md border border-border bg-surface-3 px-1.5 py-0.5 text-[10px]">
                    Training
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function YearView() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return (
    <div className="grid gap-4 p-6 sm:grid-cols-3 lg:grid-cols-4">
      {months.map((m, mi) => (
        <div key={m} className="rounded-xl border border-hairline bg-surface-2 p-3">
          <p className="text-xs font-medium">{m}</p>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full",
                  (i * (mi + 2)) % 6 === 0 ? "bg-accent-orange/70" : "bg-surface-3",
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DayView() {
  return (
    <div className="p-6">
      <ul className="space-y-2">
        {events
          .filter((e) => e.day === 1)
          .map((e) => (
            <li
              key={e.id}
              className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-hairline bg-surface-2 px-4 py-4"
            >
              <span className="text-xs tabular-nums text-muted-foreground">
                {String(e.start).padStart(2, "0")}:00
              </span>
              <span className="min-w-0 truncate text-sm">{e.title}</span>
              <Tag accent={e.category === "Health"}>{e.category}</Tag>
            </li>
          ))}
      </ul>
    </div>
  );
}

function CalendarPage() {
  const [view, setView] = useState<(typeof views)[number]>("Week");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Calendar"
        title="August 2026"
        description="Events, trips and goal tasks in one timeline. Drag & drop, recurrence and reminders."
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-hairline bg-surface-1 p-0.5">
              {views.map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs transition-colors",
                    view === v
                      ? "bg-surface-3 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-xl bg-accent-orange text-black transition-opacity hover:opacity-90">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <Panel>
        <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
          <div className="flex items-center gap-1">
            <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="ml-2 text-xs text-muted-foreground">Week 33 · Aug 10 – Aug 16</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Tag accent>Health</Tag>
            <Tag>Work</Tag>
            <Tag>Personal</Tag>
            <Tag>Travel</Tag>
          </div>
        </div>

        {view === "Week" ? <WeekView /> : null}
        {view === "Month" ? <MonthView /> : null}
        {view === "Year" ? <YearView /> : null}
        {view === "Day" ? <DayView /> : null}
      </Panel>
    </AppShell>
  );
}

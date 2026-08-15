import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import { AppShell } from "@/components/life/app-shell";
import { Metric, PageHeader, Panel, PanelHead, Tag } from "@/components/life/primitives";
import { travelStats, trips, type Trip } from "@/lib/life-os";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/travel")({
  head: () => ({
    meta: [
      { title: "Travel — Life OS" },
      {
        name: "description",
        content:
          "Map the countries you've visited, planned and dream of — with cities, memories and travel statistics in one place.",
      },
      { property: "og:title", content: "Travel — Life OS" },
      {
        property: "og:description",
        content: "Visited, planned, wishlist — a world map of the life you've lived.",
      },
    ],
  }),
  component: TravelPage,
});

const statusColor: Record<Trip["status"], string> = {
  Visited: "bg-accent-orange",
  Planned: "bg-foreground/70",
  Wishlist: "bg-muted-foreground/50",
};

/** Simplified continent silhouettes — decorative 2D world map. */
const landmasses = [
  "M60,70 L120,52 L165,74 L152,120 L108,150 L74,126 Z",
  "M120,160 L160,150 L176,206 L150,262 L124,232 L118,196 Z",
  "M226,52 L286,44 L300,72 L268,96 L232,86 Z",
  "M232,100 L282,96 L296,150 L268,208 L240,164 Z",
  "M300,60 L392,44 L430,84 L396,132 L330,120 L306,92 Z",
  "M372,148 L420,150 L432,196 L392,206 L366,180 Z",
];

function WorldMap({ selected, onSelect }: { selected: string; onSelect: (code: string) => void }) {
  const pins = [
    { code: "PT", x: 214, y: 84 },
    { code: "FR", x: 226, y: 74 },
    { code: "IT", x: 240, y: 84 },
    { code: "NO", x: 232, y: 52 },
    { code: "JP", x: 396, y: 82 },
    { code: "AR", x: 140, y: 232 },
    { code: "CL", x: 130, y: 236 },
  ];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-hairline bg-surface-2">
      <svg viewBox="0 0 460 280" className="h-full w-full">
        {landmasses.map((d, i) => (
          <path key={i} d={d} className="fill-surface-3 stroke-border" strokeWidth={0.8} />
        ))}
        {pins.map((p) => {
          const trip = trips.find((t) => t.code === p.code);
          if (!trip) return null;
          const active = selected === p.code;
          return (
            <g key={p.code} onClick={() => onSelect(p.code)} className="cursor-pointer">
              {active ? (
                <circle cx={p.x} cy={p.y} r={9} className="fill-accent-orange/20" />
              ) : null}
              <circle
                cx={p.x}
                cy={p.y}
                r={active ? 4 : 3}
                className={cn(
                  trip.status === "Visited"
                    ? "fill-accent-orange"
                    : trip.status === "Planned"
                      ? "fill-foreground"
                      : "fill-muted-foreground",
                )}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Globe() {
  return (
    <div className="relative grid place-items-center py-6">
      <div className="relative h-52 w-52 rounded-full border border-border bg-surface-2 shadow-[inset_0_18px_50px_-30px_oklch(1_0_0/0.18)]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full border border-hairline"
            style={{ transform: `rotateY(70deg) rotateZ(${i * 45}deg)`, borderRadius: "50%" }}
          />
        ))}
        {[30, 50, 70, 90, 110, 130, 150].map((top) => (
          <span
            key={top}
            className="absolute left-0 h-px w-full bg-hairline"
            style={{ top }}
          />
        ))}
        <span className="absolute top-[62px] left-[70px] h-2 w-2 rounded-full bg-accent-orange" />
        <span className="absolute top-[108px] left-[112px] h-1.5 w-1.5 rounded-full bg-accent-orange/70" />
        <span className="absolute top-[140px] left-[62px] h-1.5 w-1.5 rounded-full bg-foreground/60" />
      </div>
      <p className="mt-5 text-[11px] text-muted-foreground">
        3D globe view · {travelStats.worldPercent}% of the world visited
      </p>
    </div>
  );
}

function TravelPage() {
  const [selected, setSelected] = useState("PT");
  const [mode, setMode] = useState<"Map" | "Globe">("Map");
  const trip = trips.find((t) => t.code === selected) ?? trips[0]!;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Travel"
        title="Where you've been, where you're going"
        description="Visited, planned and wishlist countries — with the cities, dates and memories attached."
        action={
          <div className="flex items-center rounded-xl border border-hairline bg-surface-1 p-0.5">
            {(["Map", "Globe"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-xs transition-colors",
                  mode === m
                    ? "bg-surface-3 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-8" raised>
          <PanelHead
            title={mode === "Map" ? "World map" : "Globe"}
            hint="Select a country to open its memories"
            action={
              <div className="hidden items-center gap-3 text-[11px] text-muted-foreground sm:flex">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-orange" /> Visited
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" /> Planned
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" /> Wishlist
                </span>
              </div>
            }
          />
          <div className="px-6 pb-6">
            {mode === "Map" ? (
              <WorldMap selected={selected} onSelect={setSelected} />
            ) : (
              <Globe />
            )}
          </div>
        </Panel>

        <div className="space-y-4 lg:col-span-4">
          <Panel delay={0.05}>
            <PanelHead title={trip.country} hint={trip.dates} action={<Tag accent>{trip.status}</Tag>} />
            <div className="px-6 pb-6">
              <p className="text-sm text-muted-foreground">{trip.memory}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {trip.cities.map((c) => (
                  <Tag key={c}>{c}</Tag>
                ))}
              </div>
              {trip.rating > 0 ? (
                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < trip.rating
                          ? "fill-accent-orange text-accent-orange"
                          : "text-muted-foreground/40",
                      )}
                    />
                  ))}
                </div>
              ) : null}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg border border-hairline bg-surface-3"
                  />
                ))}
              </div>
            </div>
          </Panel>

          <Panel delay={0.1}>
            <PanelHead title="Countries" />
            <ul className="max-h-[240px] overflow-y-auto pb-3">
              {trips.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setSelected(t.code)}
                    className={cn(
                      "flex w-full items-center gap-3 px-6 py-2.5 text-left transition-colors",
                      selected === t.code ? "bg-surface-2" : "hover:bg-surface-2/60",
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", statusColor[t.status])} />
                    <span className="min-w-0 flex-1 truncate text-sm">{t.country}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{t.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel className="grid grid-cols-2 divide-x divide-y divide-hairline sm:grid-cols-3 lg:col-span-12 lg:grid-cols-6 lg:divide-y-0" delay={0.15}>
          <Metric label="Countries" value={String(travelStats.countries)} />
          <Metric label="Continents" value={String(travelStats.continents)} />
          <Metric label="Cities" value={String(travelStats.cities)} />
          <Metric label="Days travelling" value={String(travelStats.daysTravelled)} />
          <Metric label="World seen" value={`${travelStats.worldPercent}%`} />
          <Metric label="Next" value="Lisbon" sub="In 32 days" />
        </Panel>
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/life/app-shell";
import { PageHeader, Panel, PanelHead, Tag } from "@/components/life/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — BEPACE" },
      {
        name: "description",
        content:
          "Account, security, notifications, appearance, language, integrations and privacy controls for BEPACE.",
      },
      { property: "og:title", content: "Settings — BEPACE" },
      {
        property: "og:description",
        content: "Account, appearance, integrations and privacy.",
      },
    ],
  }),
  component: SettingsPage,
});

const sections = [
  "Account",
  "Security",
  "Notifications",
  "Appearance",
  "Language",
  "Integrations",
  "Privacy",
] as const;

function Row({
  title,
  hint,
  control,
}: {
  title: string;
  hint?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-hairline px-6 py-4">
      <div className="min-w-0">
        <p className="truncate text-sm">{title}</p>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function Toggle({ on }: { on?: boolean }) {
  const [value, setValue] = useState(!!on);
  return (
    <button
      onClick={() => setValue((v) => !v)}
      aria-pressed={value}
      className={cn(
        "relative h-6 w-11 rounded-full border transition-colors",
        value ? "border-accent-orange bg-accent-orange" : "border-border bg-surface-3",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4.5 w-4.5 rounded-full transition-all",
          value ? "left-[22px] bg-black" : "left-0.5 bg-foreground/70",
        )}
        style={{ height: 18, width: 18 }}
      />
    </button>
  );
}

function SettingsPage() {
  const [section, setSection] = useState<(typeof sections)[number]>("Appearance");
  const [theme, setTheme] = useState("Dark");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Settings"
        title="How the system behaves"
        description="Dark is the primary, most refined experience. Everything else is optional."
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-3">
          <nav className="p-4">
            <ul className="space-y-0.5">
              {sections.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => setSection(s)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      section === s
                        ? "bg-surface-2 text-foreground"
                        : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
                    )}
                  >
                    <span>{s}</span>
                    {section === s ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-orange" />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </Panel>

        <div className="space-y-4 lg:col-span-9">
          <Panel raised delay={0.05}>
            <PanelHead title={section} hint="Only what matters here" />
            {section === "Appearance" ? (
              <>
                <div className="border-t border-hairline px-6 py-5">
                  <p className="text-sm">Theme</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {["Dark", "Light", "System"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          "rounded-xl border p-4 text-left transition-colors",
                          theme === t
                            ? "border-accent-orange/40 bg-accent-orange/8"
                            : "border-hairline bg-surface-2 hover:border-border",
                        )}
                      >
                        <span
                          className={cn(
                            "block h-14 rounded-lg border border-border",
                            t === "Light" ? "bg-[oklch(0.95_0_0)]" : "bg-[oklch(0.14_0_0)]",
                          )}
                        />
                        <span className="mt-3 block text-xs font-medium">{t}</span>
                        {t === "Dark" ? (
                          <span className="mt-1 block text-[11px] text-muted-foreground">
                            Recommended
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
                <Row title="Reduce motion" hint="Softer transitions across the system" control={<Toggle />} />
                <Row title="Compact density" hint="Tighter cards and spacing" control={<Toggle />} />
                <Row title="Accent colour" hint="Orange is used sparingly by design" control={<Tag accent>Orange</Tag>} />
              </>
            ) : null}

            {section === "Account" ? (
              <>
                <Row title="Name" hint="Murilo Rovatti" control={<Tag>Edit</Tag>} />
                <Row title="Email" hint="murilo@lifeos.app" control={<Tag>Edit</Tag>} />
                <Row title="Timezone" hint="America/Sao_Paulo" control={<Tag>Edit</Tag>} />
              </>
            ) : null}

            {section === "Security" ? (
              <>
                <Row title="Two-factor authentication" hint="Recommended" control={<Toggle />} />
                <Row title="Active sessions" hint="2 devices" control={<Tag>Manage</Tag>} />
                <Row title="Password" hint="Last changed 3 months ago" control={<Tag>Change</Tag>} />
              </>
            ) : null}

            {section === "Notifications" ? (
              <>
                <Row title="Daily check-in reminder" hint="21:00" control={<Toggle on />} />
                <Row title="Habit nudges" control={<Toggle on />} />
                <Row title="Weekly review" hint="Sunday morning" control={<Toggle on />} />
                <Row title="Email digests" control={<Toggle />} />
              </>
            ) : null}

            {section === "Language" ? (
              <>
                <Row title="Interface language" hint="English" control={<Tag>Change</Tag>} />
                <Row title="Week starts on" hint="Monday" control={<Tag>Change</Tag>} />
                <Row title="Date format" hint="DD/MM/YYYY" control={<Tag>Change</Tag>} />
              </>
            ) : null}

            {section === "Integrations" ? (
              <>
                <Row title="Google Calendar" hint="Two-way sync" control={<Tag>Connect</Tag>} />
                <Row title="Outlook Calendar" control={<Tag>Connect</Tag>} />
                <Row title="Apple Calendar" control={<Tag>Connect</Tag>} />
                <Row title="Health data" hint="Coming with the Health module" control={<Tag>Soon</Tag>} />
              </>
            ) : null}

            {section === "Privacy" ? (
              <>
                <Row title="Private journal" hint="Hidden from every summary view" control={<Toggle on />} />
                <Row title="Analytics" hint="Anonymous product usage" control={<Toggle />} />
                <Row title="Export all data" hint="JSON archive" control={<Tag>Export</Tag>} />
                <Row title="Delete account" hint="This cannot be undone" control={<Tag>Delete</Tag>} />
              </>
            ) : null}
          </Panel>

          <Panel delay={0.1}>
            <PanelHead title="Coming modules" hint="The architecture is already prepared" />
            <div className="flex flex-wrap gap-2 px-6 pb-6">
              {["Finance", "Health", "AI Coach", "Reading", "Projects"].map((m) => (
                <Tag key={m}>{m}</Tag>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

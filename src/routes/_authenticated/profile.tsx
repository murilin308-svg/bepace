import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { Metric, PageHeader, Panel, PanelHead, Progress } from "@/components/life/primitives";
import { EditText, FieldLabel } from "@/components/life/editable";
import { useCollection, useProfile, useUpdateProfile } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Perfil — BEPACE" },
      {
        name: "description",
        content:
          "Seus dados, sua jornada e o progresso dos seus objetivos dentro do BEPACE.",
      },
      { property: "og:title", content: "Perfil — BEPACE" },
      { property: "og:description", content: "A visão de longo prazo da sua evolução." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function ProfilePage() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { data: vision = [] } = useCollection<Row>("vision_items");
  const { data: studies = [] } = useCollection<Row>("study_plans");
  const { data: workouts = [] } = useCollection<Row>("workouts");
  const { data: experiences = [] } = useCollection<Row>("experiences");
  const { data: prayers = [] } = useCollection<Row>("prayers");
  const { data: investments = [] } = useCollection<Row>("investments");

  const name = profile?.full_name ?? "Seu nome";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "B";

  const since = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <AppShell>
      <PageHeader
        eyebrow="Perfil"
        title={name}
        description={`No BEPACE desde ${since}`}
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-4" raised>
          <div className="flex flex-col items-center px-6 py-8">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-surface-3 text-xl font-semibold">
              {initials}
            </span>
            <div className="mt-6 w-full space-y-4">
              <div>
                <FieldLabel>Nome completo</FieldLabel>
                <EditText
                  value={profile?.full_name ?? ""}
                  placeholder="Seu nome"
                  className="text-sm"
                  onCommit={(v) => updateProfile.mutate({ full_name: v })}
                />
              </div>
              <div>
                <FieldLabel>Nome de usuário</FieldLabel>
                <EditText
                  value={profile?.handle ?? ""}
                  placeholder="@seuusuario"
                  className="text-sm"
                  onCommit={(v) => updateProfile.mutate({ handle: v })}
                />
              </div>
              <div>
                <FieldLabel>E-mail</FieldLabel>
                <p className="text-sm text-muted-foreground">{profile?.email ?? "—"}</p>
              </div>
            </div>
          </div>
        </Panel>

        <div className="space-y-4 lg:col-span-8">
          <Panel
            className="grid grid-cols-2 divide-x divide-y divide-hairline sm:grid-cols-3 sm:divide-y-0"
            delay={0.05}
          >
            <Metric label="Sonhos no mural" value={String(vision.length)} />
            <Metric label="Planos de estudo" value={String(studies.length)} />
            <Metric label="Treinos" value={String(workouts.length)} />
            <Metric label="Experiências" value={String(experiences.length)} />
            <Metric label="Orações" value={String(prayers.length)} />
            <Metric label="Ativos" value={String(investments.length)} />
          </Panel>

          <Panel delay={0.1}>
            <PanelHead title="Progresso da visão de futuro" hint="Seus sonhos mapeados" />
            {vision.length === 0 ? (
              <p className="px-6 pb-6 text-xs text-muted-foreground">
                Cadastre itens na Visão de Futuro para acompanhar aqui.
              </p>
            ) : (
              <div className="space-y-3 px-6 pb-6">
                {vision.map((v) => (
                  <div key={v['id']}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-xs">{v['title']}</span>
                      <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                        {Number(v['progress'] ?? 0)}%
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <Progress value={Number(v['progress'] ?? 0)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard, LibraryPicker } from "@/components/life/module-page";
import { useCreate } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/treinos")({
  head: () => ({
    meta: [
      { title: "Treinos — BEPACE" },
      { name: "description", content: "Treinos, desempenho, cargas e metas esportivas no BEPACE." },
      { property: "og:title", content: "Treinos — BEPACE" },
      { property: "og:description", content: "Planeje a semana de treino e registre a evolução." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkoutsPage,
});

const MODALITIES = [
  "Academia",
  "Cardio",
  "Corrida",
  "Futebol",
  "Tênis",
  "Natação",
  "Ciclismo",
  "Funcional",
] as const;
const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] as const;

const PRESETS = [
  { label: "Peito e tríceps", values: { name: "Peito e tríceps", modality: "Academia", duration_min: 60 } },
  { label: "Costas e bíceps", values: { name: "Costas e bíceps", modality: "Academia", duration_min: 60 } },
  { label: "Pernas completo", values: { name: "Pernas completo", modality: "Academia", duration_min: 70 } },
  { label: "Corrida 5K", values: { name: "Corrida 5K", modality: "Corrida", duration_min: 30 } },
  { label: "HIIT 20min", values: { name: "HIIT 20min", modality: "Cardio", duration_min: 20 } },
  { label: "Natação 1km", values: { name: "Natação 1km", modality: "Natação", duration_min: 40 } },
] as const;

function WorkoutsPage() {
  const create = useCreate("workouts");

  return (
    <AppShell>
      <ModuleBoard
        table="workouts"
        eyebrow="Performance"
        title="Treinos"
        description="Monte a semana, registre carga, tempo e desempenho de cada sessão."
        addPlaceholder="Novo treino — ex.: Ombro e abdômen"
        titleKey="name"
        filterKey="modality"
        defaults={{ modality: "Academia", weekday: "Segunda", duration_min: 60, load_kg: 0, performance: "", done: false }}
        extra={
          <LibraryPicker
            title="Treinos pré-definidos"
            items={PRESETS}
            onPick={(values) => create.mutate({ weekday: "Segunda", load_kg: 0, done: false, ...values })}
          />
        }
        fields={[
          { key: "modality", label: "Modalidade", type: "select", options: MODALITIES },
          { key: "weekday", label: "Dia", type: "select", options: DAYS },
          { key: "done", label: "Concluído", type: "check" },
          { key: "duration_min", label: "Duração (min)", type: "number", min: 0, max: 600 },
          { key: "load_kg", label: "Carga (kg)", type: "number", min: 0, max: 1000 },
          { key: "performance", label: "Desempenho / observações", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}

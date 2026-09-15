import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard, LibraryPicker } from "@/components/life/module-page";
import { Panel, Metric } from "@/components/life/primitives";
import { useCollection, useCreate } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/alimentacao")({
  head: () => ({
    meta: [
      { title: "Alimentação — BEPACE" },
      { name: "description", content: "Plano alimentar, calorias, água, peso e medidas no BEPACE." },
      { property: "og:title", content: "Alimentação — BEPACE" },
      { property: "og:description", content: "Monte seu plano e acompanhe a evolução do corpo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NutritionPage,
});

const GOALS = ["Ganho de Massa", "Perda de Gordura", "Manutenção", "Reeducação Alimentar"] as const;
const TYPES = ["Café da manhã", "Almoço", "Café da tarde", "Jantar", "Pré-treino", "Pós-treino", "Ceia"] as const;
const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] as const;

const SUGGESTED = [
  { label: "Ovos + aveia (café)", values: { name: "Ovos mexidos com aveia", meal_type: "Café da manhã", calories: 480, protein: 32 } },
  { label: "Frango + arroz (almoço)", values: { name: "Frango grelhado, arroz e salada", meal_type: "Almoço", calories: 620, protein: 45 } },
  { label: "Whey + fruta", values: { name: "Whey com banana", meal_type: "Pós-treino", calories: 300, protein: 30 } },
  { label: "Salmão + legumes", values: { name: "Salmão com legumes", meal_type: "Jantar", calories: 540, protein: 40 } },
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function NutritionPage() {
  const create = useCreate("meals");
  const { data: meals = [] } = useCollection<Row>("meals");

  const calories = meals.reduce((s, m) => s + Number(m['calories'] ?? 0), 0);
  const protein = meals.reduce((s, m) => s + Number(m['protein'] ?? 0), 0);

  return (
    <AppShell>
      <ModuleBoard
        table="meals"
        eyebrow="Saúde"
        title="Alimentação"
        description="Monte o plano da semana, controle calorias e proteína e gere sua lista de compras."
        addPlaceholder="Nova refeição — ex.: Omelete com queijo"
        titleKey="name"
        filterKey="weekday"
        defaults={{ meal_type: "Almoço", goal: "Manutenção", weekday: "Segunda", calories: 0, protein: 0, notes: "" }}
        extra={
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <Panel><Metric label="Refeições" value={String(meals.length)} /></Panel>
              <Panel delay={0.05}><Metric label="Calorias do plano" value={`${calories}`} sub="soma de todas as refeições" /></Panel>
              <Panel delay={0.1}><Metric label="Proteína" value={`${protein} g`} /></Panel>
            </div>
            <LibraryPicker
              title="Refeições sugeridas"
              items={SUGGESTED}
              onPick={(values) => create.mutate({ goal: "Manutenção", weekday: "Segunda", ...values })}
            />
          </>
        }
        fields={[
          { key: "meal_type", label: "Refeição", type: "select", options: TYPES },
          { key: "weekday", label: "Dia", type: "select", options: DAYS },
          { key: "goal", label: "Objetivo", type: "select", options: GOALS },
          { key: "calories", label: "Kcal", type: "number", min: 0, max: 5000 },
          { key: "protein", label: "Proteína (g)", type: "number", min: 0, max: 500 },
          { key: "notes", label: "Observações", type: "textarea" },
        ]}
      />

      <div className="mt-14">
        <ModuleBoard
          table="body_logs"
          eyebrow="Evolução"
          title="Peso, água e medidas"
          description="Um registro por dia. Clique nos números para atualizar."
          addPlaceholder="Novo registro — ex.: 09/09"
          titleKey="notes"
          defaults={{ weight_kg: 0, water_ml: 0, waist_cm: 0 }}
          fields={[
            { key: "weight_kg", label: "Peso (kg)", type: "number", min: 0, max: 400 },
            { key: "water_ml", label: "Água (ml)", type: "number", min: 0, max: 10000 },
            { key: "waist_cm", label: "Cintura (cm)", type: "number", min: 0, max: 300 },
          ]}
        />
      </div>
    </AppShell>
  );
}

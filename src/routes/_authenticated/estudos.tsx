import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard } from "@/components/life/module-page";

export const Route = createFileRoute("/_authenticated/estudos")({
  head: () => ({
    meta: [
      { title: "Estudos — BEPACE" },
      { name: "description", content: "Planos de estudo, metas, cronograma e horas estudadas no BEPACE." },
      { property: "og:title", content: "Estudos — BEPACE" },
      { property: "og:description", content: "Planos de estudo, metas, cronograma e horas estudadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EstudosPage,
});

const CATEGORIES = [
  "Idiomas",
  "Faculdade",
  "Certificações",
  "Cursos",
  "Desenvolvimento profissional",
] as const;

function EstudosPage() {
  return (
    <AppShell>
      <ModuleBoard
        table="study_plans"
        eyebrow="Aprendizado"
        title="Estudos"
        description="Seus planos de estudo, metas de horas, materiais e progresso em um só lugar."
        addPlaceholder="Novo plano — ex.: Inglês para fluência"
        filterKey="category"
        progressKey="progress"
        defaults={{
          category: "Cursos",
          goal: "",
          hours_target: 20,
          hours_done: 0,
          progress: 0,
          status: "Em andamento",
          material: "",
        }}
        fields={[
          { key: "category", label: "Categoria", type: "select", options: CATEGORIES },
          { key: "status", label: "Status", type: "select", options: ["Em andamento", "Concluído", "Pausado"] },
          { key: "hours_target", label: "Meta (h)", type: "number", min: 0, max: 10000, suffix: "h" },
          { key: "hours_done", label: "Estudado", type: "number", min: 0, max: 10000, suffix: "h" },
          { key: "progress", label: "Progresso", type: "number", min: 0, max: 100, suffix: "%" },
          { key: "goal", label: "Objetivo", type: "text" },
          { key: "material", label: "Materiais", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}

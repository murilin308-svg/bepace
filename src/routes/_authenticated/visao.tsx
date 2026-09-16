import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard } from "@/components/life/module-page";

export const Route = createFileRoute("/_authenticated/visao")({
  head: () => ({
    meta: [
      { title: "Visão de Futuro — BEPACE" },
      { name: "description", content: "Seu mural de metas e sonhos por categoria no BEPACE." },
      { property: "og:title", content: "Visão de Futuro — BEPACE" },
      { property: "og:description", content: "Mural de metas, sonhos e prazos por categoria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VisaoPage,
});

const CATEGORIES = [
  "Carreira",
  "Negócio",
  "Viagens",
  "Família",
  "Saúde",
  "Patrimônio",
  "Espiritualidade",
] as const;

function VisaoPage() {
  return (
    <AppShell>
      <ModuleBoard
        table="vision_items"
        eyebrow="Direção"
        title="Visão de Futuro"
        description="Seu mural do futuro: imagens, textos, metas e prazos organizados por categoria."
        addPlaceholder="Novo item — ex.: Conhecer o Japão"
        filterKey="category"
        progressKey="progress"
        defaults={{
          category: "Carreira",
          description: "",
          image_url: "",
          deadline: "",
          progress: 0,
        }}
        fields={[
          { key: "category", label: "Categoria", type: "select", options: CATEGORIES },
          { key: "deadline", label: "Prazo", type: "text" },
          { key: "progress", label: "Progresso", type: "number", min: 0, max: 100, suffix: "%" },
          { key: "image_url", label: "Imagem (link)", type: "text" },
          { key: "description", label: "Descrição", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}

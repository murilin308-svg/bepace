import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard } from "@/components/life/module-page";

export const Route = createFileRoute("/_authenticated/experiencias")({
  head: () => ({
    meta: [
      { title: "Experiências — BEPACE" },
      { name: "description", content: "Experiências que você quer viver, com prazo, status e anotações." },
      { property: "og:title", content: "Experiências — BEPACE" },
      { property: "og:description", content: "Experiências que você quer viver, com prazo, status e anotações." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExperienciasPage,
});

const CATEGORIES = [
  "Viagens",
  "Aventura",
  "Gastronomia",
  "Cultura",
  "Esportes",
  "Família",
  "Espiritual",
] as const;

function ExperienciasPage() {
  return (
    <AppShell>
      <ModuleBoard
        table="experiences"
        eyebrow="Vida"
        title="Experiências"
        description="Aquilo que você quer viver — organizado por categoria, prazo e status."
        addPlaceholder="Nova experiência — ex.: Ver a aurora boreal"
        filterKey="category"
        defaults={{
          category: "Viagens",
          status: "Planejando",
          deadline: "",
          notes: "",
          image_url: "",
        }}
        fields={[
          { key: "category", label: "Categoria", type: "select", options: CATEGORIES },
          { key: "status", label: "Status", type: "select", options: ["Planejando", "Agendado", "Vivido"] },
          { key: "deadline", label: "Prazo", type: "text" },
          { key: "image_url", label: "Link da foto", type: "text" },
          { key: "notes", label: "Anotações", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard } from "@/components/life/module-page";

export const Route = createFileRoute("/_authenticated/compras")({
  head: () => ({
    meta: [
      { title: "Lista de Compras — BEPACE" },
      { name: "description", content: "Itens por categoria, integrada ao seu plano alimentar." },
      { property: "og:title", content: "Lista de Compras — BEPACE" },
      { property: "og:description", content: "Itens por categoria, integrada ao seu plano alimentar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComprasPage,
});

const CATEGORIES = [
  "Hortifruti",
  "Proteínas",
  "Mercearia",
  "Bebidas",
  "Limpeza",
  "Higiene",
  "Suplementos",
  "Outros",
] as const;

function ComprasPage() {
  return (
    <AppShell>
      <ModuleBoard
        table="shopping_items"
        eyebrow="Rotina"
        title="Lista de Compras"
        description="Itens por categoria, com quantidade e marcação de comprado."
        addPlaceholder="Novo item — ex.: Ovos caipira"
        titleKey="name"
        filterKey="category"
        defaults={{ category: "Mercearia", quantity: "", done: false }}
        fields={[
          { key: "category", label: "Categoria", type: "select", options: CATEGORIES },
          { key: "done", label: "Comprado", type: "check" },
          { key: "quantity", label: "Quantidade", type: "text" },
        ]}
      />
    </AppShell>
  );
}

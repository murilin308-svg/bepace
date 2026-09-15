import { createFileRoute } from "@tanstack/react-router";
import { SoonPage } from "@/components/life/soon";

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
  component: () => (
    <SoonPage eyebrow="Rotina" title="Lista de Compras" description="Itens por categoria, integrada ao seu plano alimentar." hint="Chega na Parte 3 da construção." />
  ),
});

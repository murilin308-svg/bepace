import { createFileRoute } from "@tanstack/react-router";
import { SoonPage } from "@/components/life/soon";

export const Route = createFileRoute("/_authenticated/visao")({
  head: () => ({
    meta: [
      { title: "Visão de Futuro — BEPACE" },
      { name: "description", content: "Mural de metas e sonhos com imagens, prazos e categorias." },
      { property: "og:title", content: "Visão de Futuro — BEPACE" },
      { property: "og:description", content: "Mural de metas e sonhos com imagens, prazos e categorias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SoonPage eyebrow="Direção" title="Visão de Futuro" description="Mural de metas e sonhos com imagens, prazos e categorias." hint="Chega na Parte 2 da construção." />
  ),
});

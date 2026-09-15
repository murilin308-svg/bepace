import { createFileRoute } from "@tanstack/react-router";
import { SoonPage } from "@/components/life/soon";

export const Route = createFileRoute("/_authenticated/experiencias")({
  head: () => ({
    meta: [
      { title: "Experiências — BEPACE" },
      { name: "description", content: "A lista do que você quer viver, com prazo, status e notas." },
      { property: "og:title", content: "Experiências — BEPACE" },
      { property: "og:description", content: "A lista do que você quer viver, com prazo, status e notas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SoonPage eyebrow="Vida" title="Experiências" description="A lista do que você quer viver, com prazo, status e notas." hint="Chega na Parte 3 da construção." />
  ),
});

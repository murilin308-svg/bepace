import { createFileRoute } from "@tanstack/react-router";
import { SoonPage } from "@/components/life/soon";

export const Route = createFileRoute("/_authenticated/assistente")({
  head: () => ({
    meta: [
      { title: "Assistente IA — BEPACE" },
      { name: "description", content: "Converse e comande o BEPACE por linguagem natural." },
      { property: "og:title", content: "Assistente IA — BEPACE" },
      { property: "og:description", content: "Converse e comande o BEPACE por linguagem natural." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SoonPage eyebrow="Inteligência" title="Assistente IA" description="Converse e comande o BEPACE por linguagem natural." hint="Chega na Parte 4 da construção." />
  ),
});

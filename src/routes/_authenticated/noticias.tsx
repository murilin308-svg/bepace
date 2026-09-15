import { createFileRoute } from "@tanstack/react-router";
import { SoonPage } from "@/components/life/soon";

export const Route = createFileRoute("/_authenticated/noticias")({
  head: () => ({
    meta: [
      { title: "Notícias — BEPACE" },
      { name: "description", content: "Feed do seu setor com resumo por IA e notícias salvas." },
      { property: "og:title", content: "Notícias — BEPACE" },
      { property: "og:description", content: "Feed do seu setor com resumo por IA e notícias salvas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SoonPage eyebrow="Informação" title="Notícias" description="Feed do seu setor com resumo por IA e notícias salvas." hint="Chega na Parte 2 da construção." />
  ),
});

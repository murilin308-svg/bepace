import { createFileRoute } from "@tanstack/react-router";
import { SoonPage } from "@/components/life/soon";

export const Route = createFileRoute("/_authenticated/investimentos")({
  head: () => ({
    meta: [
      { title: "Investimentos — BEPACE" },
      { name: "description", content: "Patrimônio, rentabilidade e distribuição de ativos." },
      { property: "og:title", content: "Investimentos — BEPACE" },
      { property: "og:description", content: "Patrimônio, rentabilidade e distribuição de ativos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SoonPage eyebrow="Finanças" title="Investimentos" description="Patrimônio, rentabilidade e distribuição de ativos." hint="Chega na Parte 3 da construção." />
  ),
});

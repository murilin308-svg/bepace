import { createFileRoute } from "@tanstack/react-router";
import { SoonPage } from "@/components/life/soon";

export const Route = createFileRoute("/_authenticated/estudos")({
  head: () => ({
    meta: [
      { title: "Estudos — BEPACE" },
      { name: "description", content: "Planos de estudo, metas, cronograma e horas estudadas." },
      { property: "og:title", content: "Estudos — BEPACE" },
      { property: "og:description", content: "Planos de estudo, metas, cronograma e horas estudadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SoonPage eyebrow="Aprendizado" title="Estudos" description="Planos de estudo, metas, cronograma e horas estudadas." hint="Chega na Parte 2 da construção." />
  ),
});

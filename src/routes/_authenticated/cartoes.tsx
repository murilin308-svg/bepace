import { createFileRoute } from "@tanstack/react-router";
import { SoonPage } from "@/components/life/soon";

export const Route = createFileRoute("/_authenticated/cartoes")({
  head: () => ({
    meta: [
      { title: "Cartões — BEPACE" },
      { name: "description", content: "Limite, fatura atual, vencimento e gastos por categoria." },
      { property: "og:title", content: "Cartões — BEPACE" },
      { property: "og:description", content: "Limite, fatura atual, vencimento e gastos por categoria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SoonPage eyebrow="Finanças" title="Cartões" description="Limite, fatura atual, vencimento e gastos por categoria." hint="Chega na Parte 3 da construção." />
  ),
});

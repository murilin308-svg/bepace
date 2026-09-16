import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard } from "@/components/life/module-page";

export const Route = createFileRoute("/_authenticated/noticias")({
  head: () => ({
    meta: [
      { title: "Notícias — BEPACE" },
      { name: "description", content: "Feed de notícias personalizado por setor e interesses no BEPACE." },
      { property: "og:title", content: "Notícias — BEPACE" },
      { property: "og:description", content: "Feed personalizado por setor e interesses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NoticiasPage,
});

const SECTORS = [
  "Tecnologia",
  "Vendas",
  "Marketing",
  "Agronegócio",
  "Engenharia",
  "Construção",
  "Finanças",
  "Saúde",
] as const;

function NoticiasPage() {
  return (
    <AppShell>
      <ModuleBoard
        table="news_topics"
        eyebrow="Inteligência"
        title="Notícias"
        description="Defina setor, área e interesses para personalizar seu feed de notícias."
        addPlaceholder="Novo interesse — ex.: Inteligência Artificial"
        filterKey="sector"
        titleKey="topic"
        defaults={{ topic: "", sector: "Tecnologia" }}
        fields={[
          { key: "sector", label: "Setor", type: "select", options: SECTORS },
        ]}
      />

      <div className="mt-14">
        <ModuleBoard
          table="saved_news"
          eyebrow="Leitura salva"
          title="Notícias salvas"
          description="Guarde, favorite e anote um resumo das notícias mais importantes."
          addPlaceholder="Salvar notícia — ex.: Cole o título ou link"
          defaults={{ title: "", source: "", url: "", summary: "", favorite: false }}
          fields={[
            { key: "favorite", label: "Favorita", type: "check" },
            { key: "source", label: "Fonte", type: "text" },
            { key: "url", label: "Link", type: "text" },
            { key: "summary", label: "Resumo", type: "textarea" },
          ]}
        />
      </div>
    </AppShell>
  );
}

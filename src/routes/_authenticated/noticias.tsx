import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard } from "@/components/life/module-page";
import { Button } from "@/components/ui/button";
import { useCreate } from "@/lib/db";
import { getNews, type NewsArticle } from "@/lib/news.functions";

export const Route = createFileRoute("/_authenticated/noticias")({
  head: () => ({
    meta: [
      { title: "The Bepace News — Notícias do mundo" },
      { name: "description", content: "The Bepace News: notícias do mundo em português, organizadas por tema, com fotos e fontes originais." },
      { property: "og:title", content: "The Bepace News — Notícias do mundo" },
      { property: "og:description", content: "Notícias do mundo em português, organizadas por tema, com fotos e fontes originais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NoticiasPage,
});

const SERIF = { fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" };
const SANS = { fontFamily: "'Libre Franklin', 'Helvetica Neue', Arial, sans-serif" };
const MAST = { fontFamily: "'UnifrakturMaguntia', 'Old English Text MT', serif" };

const SECTIONS: { label: string; value?: string }[] = [
  { label: "Principais" },
  { label: "Brasil", value: "domestic" },
  { label: "Mundo", value: "world" },
  { label: "Negócios", value: "business" },
  { label: "Tecnologia", value: "technology" },
  { label: "Ciência", value: "science" },
  { label: "Saúde", value: "health" },
  { label: "Política", value: "politics" },
  { label: "Esportes", value: "sports" },
  { label: "Cultura", value: "entertainment" },
];

const SECTORS = ["Tecnologia", "Vendas", "Marketing", "Agronegócio", "Engenharia", "Construção", "Finanças", "Saúde"] as const;

function fmtDate(d: string | null) {
  if (!d) return "";
  const dt = new Date(d.replace(" ", "T") + (d.includes("Z") ? "" : "Z"));
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleString("pt-BR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function NoticiasPage() {
  const fetchNews = useServerFn(getNews);
  const [section, setSection] = useState(0);
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  }, []);
  const cat = SECTIONS[section]?.value;
  const { data, isLoading } = useQuery({
    queryKey: ["news", cat ?? ""],
    queryFn: () => fetchNews({ data: cat ? { category: cat } : {} }),
    staleTime: 30 * 60 * 1000,
  });
  const save = useCreate("saved_news");
  const items = data?.items ?? [];
  const imageUrls = new Set<string>();
  const illustratedIds = new Set(
    items.filter((a) => {
      if (!a.image || imageUrls.has(a.image) || imageUrls.size >= 3) return false;
      imageUrls.add(a.image);
      return true;
    }).map((a) => a.id),
  );
  const [lead, ...rest] = items;
  const side = rest.slice(0, 4);
  const more = rest.slice(4);

  const saveItem = (a: NewsArticle) => {
    save.mutate(
      { title: a.title, source: a.source, url: a.link, summary: a.description ?? "", favorite: false },
      { onSuccess: () => toast.success("Notícia salva") },
    );
  };

  return (
    <AppShell>
      <article className="mx-auto max-w-6xl text-foreground">
        {/* masthead */}
        <header className="border-b border-foreground/80 pb-3 text-center">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground" style={SANS}>
            <span className="capitalize">{today}</span>
            <span>Edição em português</span>
          </div>
          <h1 className="mt-3 text-5xl leading-none sm:text-7xl" style={MAST}>
            The Bepace News
          </h1>
          <p className="mt-2 text-[11px] italic text-muted-foreground" style={SERIF}>
            “Todas as notícias que importam para o seu dia.”
          </p>
        </header>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 border-b border-hairline py-2.5 text-[12px] font-medium" style={SANS}>
          {SECTIONS.map((s, i) => (
            <Button
              key={s.label}
              variant="ghost"
              onClick={() => setSection(i)}
              aria-pressed={i === section}
              className={`h-auto rounded-none p-0 text-[12px] hover:bg-transparent ${i === section ? "text-foreground underline underline-offset-4" : "text-muted-foreground hover:text-foreground"}`}
            >
              {s.label}
            </Button>
          ))}
        </nav>
        <div className="border-b-4 border-double border-foreground/60" />

        {isLoading ? (
          <p className="py-20 text-center italic text-muted-foreground" style={SERIF}>Carregando a edição…</p>
        ) : data?.error && !items.length ? (
          <p className="py-20 text-center italic text-muted-foreground" style={SERIF}>{data.error}</p>
        ) : !lead ? (
          <p className="py-20 text-center italic text-muted-foreground" style={SERIF}>Nenhuma notícia nesta seção agora.</p>
        ) : (
          <>
            <section className="grid gap-8 py-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <Story a={lead} big showImage={illustratedIds.has(lead.id)} onSave={saveItem} />
              <div className="divide-y divide-hairline lg:border-l lg:border-hairline lg:pl-8">
                {side.map((a) => (
                  <div key={a.id} className="py-4 first:pt-0">
                    <Story a={a} showImage={illustratedIds.has(a.id)} onSave={saveItem} />
                  </div>
                ))}
              </div>
            </section>
            {more.length > 0 && (
              <section className="grid gap-x-8 border-t border-foreground/60 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((a) => (
                  <div key={a.id} className="border-b border-hairline py-4">
                    <Story a={a} showImage={illustratedIds.has(a.id)} onSave={saveItem} />
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </article>

      <div className="mt-16 grid gap-14">
        <ModuleBoard
          table="saved_news"
          eyebrow="Leitura salva"
          title="Notícias salvas"
          description="Suas matérias guardadas, com fonte, link e resumo."
          addPlaceholder="Salvar notícia — cole o título"
          defaults={{ title: "", source: "", url: "", summary: "", favorite: false }}
          fields={[
            { key: "favorite", label: "Favorita", type: "check" },
            { key: "source", label: "Fonte", type: "text" },
            { key: "url", label: "Link", type: "text" },
            { key: "summary", label: "Resumo", type: "textarea" },
          ]}
        />
        <ModuleBoard
          table="news_topics"
          eyebrow="Interesses"
          title="Seus interesses"
          description="Temas que você acompanha."
          addPlaceholder="Novo interesse — ex.: Inteligência Artificial"
          filterKey="sector"
          titleKey="topic"
          defaults={{ topic: "", sector: "Tecnologia" }}
          fields={[{ key: "sector", label: "Setor", type: "select", options: SECTORS }]}
        />
      </div>
    </AppShell>
  );
}

function Story({ a, big, showImage, onSave }: { a: NewsArticle; big?: boolean; showImage: boolean; onSave: (a: NewsArticle) => void }) {
  return (
    <div>
      {showImage && a.image ? (
        <a href={a.link} target="_blank" rel="noopener noreferrer" className="mb-4 block">
          <img src={a.image} alt={a.title} loading="lazy" className="aspect-[16/9] w-full object-cover grayscale-[15%]" onError={(e) => (e.currentTarget.style.display = "none")} />
        </a>
      ) : null}
      <a href={a.link} target="_blank" rel="noopener noreferrer" className="group block">
        <h2 className={`${big ? "text-3xl sm:text-[2.6rem] leading-[1.08] font-bold" : "text-lg leading-snug font-semibold"} group-hover:underline decoration-1 underline-offset-4`} style={SERIF}>
          {a.title}
        </h2>
      </a>
      {a.description ? (
        <p className={`${big ? "mt-3 text-[15px]" : "mt-1.5 text-[13px] line-clamp-3"} leading-relaxed text-muted-foreground`} style={SERIF}>
          {a.description}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 text-[10.5px] uppercase tracking-wider text-muted-foreground" style={SANS}>
        <span className="font-semibold text-foreground/80">{a.source}</span>
        <span>{fmtDate(a.date)}</span>
        <a href={a.link} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Ler original ↗</a>
        <Button variant="ghost" onClick={() => onSave(a)} className="h-auto rounded-none p-0 text-[10.5px] uppercase tracking-wider hover:bg-transparent hover:text-accent-orange">Salvar</Button>
      </div>
    </div>
  );
}

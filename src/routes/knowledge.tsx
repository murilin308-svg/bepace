import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/life/app-shell";
import { EmptyState, PageHeader, Panel, PanelHead, Tag } from "@/components/life/primitives";
import { knowledge } from "@/lib/life-os";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge — Life OS" },
      {
        name: "description",
        content:
          "A personal library of ideas, insights, summaries and references, organised by collections and tags.",
      },
      { property: "og:title", content: "Knowledge — Life OS" },
      {
        property: "og:description",
        content: "Your personal library of ideas, insights and references.",
      },
    ],
  }),
  component: KnowledgePage,
});

function KnowledgePage() {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("All");
  const collections = ["All", ...new Set(knowledge.map((k) => k.collection))];

  const filtered = knowledge.filter(
    (k) =>
      (collection === "All" || k.collection === collection) &&
      (k.title + k.note + k.tags.join(" ")).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Knowledge"
        title="What you've learned, kept"
        description="Ideas and insights become searchable material instead of forgotten highlights."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="flex items-center gap-2.5 rounded-xl border border-hairline bg-surface-1 px-3 py-2.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ideas, insights, references"
            className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <button
              key={c}
              onClick={() => setCollection(c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                collection === c
                  ? "border-accent-orange/40 bg-accent-orange/12 text-foreground"
                  : "border-hairline bg-surface-1 text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Panel>
          <EmptyState title="Nothing found" hint="Try a different collection or search." />
        </Panel>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((k, i) => (
            <Panel key={k.id} delay={i * 0.04}>
              <PanelHead title={k.title} action={<Tag accent>{k.type}</Tag>} />
              <div className="px-6 pb-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{k.note}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Tag>{k.collection}</Tag>
                  {k.tags.map((t) => (
                    <Tag key={t}>#{t}</Tag>
                  ))}
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </AppShell>
  );
}

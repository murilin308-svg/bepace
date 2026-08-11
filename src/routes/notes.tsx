import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Star } from "lucide-react";
import { AppShell } from "@/components/life/app-shell";
import { EmptyState, PageHeader, Panel, Tag } from "@/components/life/primitives";
import { noteFolders, notes } from "@/lib/life-os";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Life OS" },
      {
        name: "description",
        content:
          "Capture ideas, rituals and references in a calm rich-text editor organised by folders, tags and favourites.",
      },
      { property: "og:title", content: "Notes — Life OS" },
      {
        property: "og:description",
        content: "A quiet place for ideas, rituals and references.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [folder, setFolder] = useState("All notes");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(notes[0]!.id);

  const filtered = notes.filter(
    (n) =>
      (folder === "All notes" || n.folder === folder) &&
      (n.title + n.excerpt + n.tags.join(" ")).toLowerCase().includes(query.toLowerCase()),
  );
  const note = notes.find((n) => n.id === selected) ?? filtered[0];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Notes"
        title="Everything you thought worth keeping"
        description="Folders for structure, tags for connection, favourites for what you return to."
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-3">
          <div className="p-4">
            <p className="eyebrow px-2 pb-2">Folders</p>
            <ul className="space-y-0.5">
              {noteFolders.map((f) => (
                <li key={f}>
                  <button
                    onClick={() => setFolder(f)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      folder === f
                        ? "bg-surface-2 text-foreground"
                        : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
                    )}
                  >
                    <span className="truncate">{f}</span>
                    {folder === f ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-orange" />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
            <div className="my-4 h-px bg-hairline" />
            <p className="eyebrow px-2 pb-2">Tags</p>
            <div className="flex flex-wrap gap-2 px-2">
              {[...new Set(notes.flatMap((n) => n.tags))].map((t) => (
                <Tag key={t}>#{t}</Tag>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="lg:col-span-4" delay={0.05}>
          <div className="border-b border-hairline p-4">
            <div className="flex items-center gap-2.5 rounded-xl border border-hairline bg-surface-2 px-3 py-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes"
                className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          {filtered.length === 0 ? (
            <EmptyState title="No notes here yet" hint="Try another folder or search term." />
          ) : (
            <ul className="max-h-[560px] overflow-y-auto">
              {filtered.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => setSelected(n.id)}
                    className={cn(
                      "w-full border-b border-hairline px-5 py-4 text-left transition-colors",
                      note?.id === n.id ? "bg-surface-2" : "hover:bg-surface-2/50",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{n.title}</span>
                      {n.favorite ? (
                        <Star className="h-3 w-3 shrink-0 fill-accent-orange text-accent-orange" />
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.excerpt}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {n.updated} · {n.folder}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="lg:col-span-5" raised delay={0.1}>
          {note ? (
            <article className="p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Tag accent>{note.folder}</Tag>
                {note.tags.map((t) => (
                  <Tag key={t}>#{t}</Tag>
                ))}
              </div>
              <h2 className="mt-5 text-display text-2xl">{note.title}</h2>
              <p className="mt-1 text-[11px] text-muted-foreground">Updated {note.updated}</p>
              <div className="mt-6 space-y-4">
                {note.body.map((p) => (
                  <p key={p} className="text-sm leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-8 border-t border-hairline pt-5">
                <p className="eyebrow">Checklist</p>
                <ul className="mt-3 space-y-2">
                  {["Review weekly", "Link to a goal", "Move insight to Knowledge"].map((c, i) => (
                    <li key={c} className="flex items-center gap-3 text-sm">
                      <span
                        className={
                          i === 0
                            ? "h-4 w-4 rounded-md bg-accent-orange"
                            : "h-4 w-4 rounded-md border border-border"
                        }
                      />
                      <span className={i === 0 ? "text-muted-foreground line-through" : ""}>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ) : (
            <EmptyState title="Select a note" />
          )}
        </Panel>
      </div>
    </AppShell>
  );
}

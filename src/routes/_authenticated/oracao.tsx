import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard, LibraryPicker } from "@/components/life/module-page";
import { useCreate } from "@/lib/db";
import { PRAYER_CATEGORIES, PRAYER_LIBRARY } from "@/lib/prayer-library";

export const Route = createFileRoute("/_authenticated/oracao")({
  head: () => ({
    meta: [
      { title: "Oração — BEPACE" },
      { name: "description", content: "Biblioteca de orações, pedidos e histórico espiritual no BEPACE." },
      { property: "og:title", content: "Oração — BEPACE" },
      { property: "og:description", content: "Fortaleça seus hábitos espirituais com clareza e constância." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrayerPage,
});

const CATEGORIES = PRAYER_CATEGORIES;

const LIBRARY = PRAYER_LIBRARY;

function PrayerPage() {
  const create = useCreate("prayers");

  return (
    <AppShell>
      <ModuleBoard
        table="prayers"
        eyebrow="Espiritualidade"
        title="Oração"
        description="Sua biblioteca de orações, o tempo dedicado e os pedidos em acompanhamento."
        addPlaceholder="Nova oração — ex.: Gratidão pela manhã"
        filterKey="category"
        defaults={{ category: "Gratidão", body: "", minutes: 5, favorite: false }}
        extra={
          <LibraryPicker
            title="Biblioteca de orações prontas"
            items={LIBRARY}
            onPick={(values) => create.mutate(values)}
          />
        }
        fields={[
          { key: "category", label: "Categoria", type: "select", options: CATEGORIES },
          { key: "favorite", label: "Favorita", type: "check" },
          { key: "minutes", label: "Minutos", type: "number", min: 0, max: 600, suffix: "min" },
          { key: "body", label: "Oração", type: "textarea" },
        ]}
      />

      <div className="mt-14">
        <ModuleBoard
          table="prayer_requests"
          eyebrow="Acompanhamento"
          title="Pedidos de oração"
          description="Registre o pedido e, quando vier, a resposta alcançada."
          addPlaceholder="Novo pedido — ex.: Cirurgia da minha mãe"
          defaults={{ status: "Em oração", person: "", answer: "" }}
          fields={[
            { key: "status", label: "Status", type: "select", options: ["Em oração", "Respondido", "Encerrado"] },
            { key: "person", label: "Por quem", type: "text" },
            { key: "answer", label: "Resposta alcançada", type: "textarea" },
          ]}
        />
      </div>
    </AppShell>
  );
}

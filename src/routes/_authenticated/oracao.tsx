import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard, LibraryPicker } from "@/components/life/module-page";
import { useCreate } from "@/lib/db";

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

const CATEGORIES = [
  "Gratidão",
  "Família",
  "Saúde",
  "Trabalho",
  "Finanças",
  "Propósitos",
  "Proteção",
] as const;

const LIBRARY = [
  { label: "Gratidão pela manhã", values: { title: "Gratidão pela manhã", category: "Gratidão", body: "Obrigado por mais um dia. Que eu use cada hora com propósito.", minutes: 5 } },
  { label: "Proteção da família", values: { title: "Proteção da família", category: "Família", body: "Guarde os meus, no corpo, na mente e no caminho.", minutes: 5 } },
  { label: "Sabedoria no trabalho", values: { title: "Sabedoria no trabalho", category: "Trabalho", body: "Dá-me discernimento nas decisões e paciência com as pessoas.", minutes: 5 } },
  { label: "Saúde e disciplina", values: { title: "Saúde e disciplina", category: "Saúde", body: "Que eu cuide do corpo que me foi confiado.", minutes: 5 } },
  { label: "Provisão e finanças", values: { title: "Provisão e finanças", category: "Finanças", body: "Que eu administre bem o pouco e o muito.", minutes: 5 } },
] as const;

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

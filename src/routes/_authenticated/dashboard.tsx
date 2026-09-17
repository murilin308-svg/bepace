import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/life/app-shell";
import { Metric, Panel, PanelHead, Progress, ScoreRing, Tag } from "@/components/life/primitives";
import { useCollection } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BEPACE" },
      {
        name: "description",
        content:
          "Índice BEPACE: sua nota geral em saúde, estudos, finanças, espiritualidade e objetivos.",
      },
      { property: "og:title", content: "Dashboard — BEPACE" },
      {
        property: "og:description",
        content: "Uma tela para ver onde você está e para onde está indo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function useDayLabel() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    setLabel(
      new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    );
  }, []);
  return label;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function Dashboard() {
  const dayLabel = useDayLabel();

  const { data: workouts = [] } = useCollection<Row>("workouts");
  const { data: meals = [] } = useCollection<Row>("meals");
  const { data: bodyLogs = [] } = useCollection<Row>("body_logs");
  const { data: studies = [] } = useCollection<Row>("study_plans");
  const { data: investments = [] } = useCollection<Row>("investments");
  const { data: cards = [] } = useCollection<Row>("cards");
  const { data: prayers = [] } = useCollection<Row>("prayers");
  const { data: requests = [] } = useCollection<Row>("prayer_requests");
  const { data: vision = [] } = useCollection<Row>("vision_items");
  const { data: experiences = [] } = useCollection<Row>("experiences");

  // ---- Índice BEPACE -------------------------------------------------------
  const doneWorkouts = workouts.filter((w) => w['done']).length;
  const saude = clamp(
    (workouts.length ? (doneWorkouts / workouts.length) * 60 : 0) +
      Math.min(meals.length, 7) * 3 +
      Math.min(bodyLogs.length, 5) * 3.8,
  );

  const estudos = studies.length
    ? clamp(studies.reduce((s, p) => s + Number(p['progress'] ?? 0), 0) / studies.length)
    : 0;

  const investedTotal = investments.reduce((s, r) => s + Number(r['amount'] ?? 0), 0);
  const limitTotal = cards.reduce((s, r) => s + Number(r['limit_amount'] ?? 0), 0);
  const invoiceTotal = cards.reduce((s, r) => s + Number(r['current_invoice'] ?? 0), 0);
  const cardHealth = limitTotal > 0 ? 100 - (invoiceTotal / limitTotal) * 100 : investedTotal > 0 ? 80 : 0;
  const financas = clamp((investedTotal > 0 ? 50 : 0) + cardHealth * 0.5);

  const answered = requests.filter((r) => String(r['status']) === "Respondido").length;
  const espiritualidade = clamp(
    Math.min(prayers.length, 6) * 8 +
      (requests.length ? (answered / requests.length) * 30 : 0) +
      Math.min(requests.length, 4) * 5,
  );

  const visionAvg = vision.length
    ? vision.reduce((s, v) => s + Number(v['progress'] ?? 0), 0) / vision.length
    : 0;
  const lived = experiences.filter((e) => String(e['status']) === "Vivido").length;
  const objetivos = clamp(
    visionAvg * 0.7 + (experiences.length ? (lived / experiences.length) * 30 : 0),
  );

  const pillars = [
    { label: "Saúde", value: saude, to: "/treinos" as const },
    { label: "Estudos", value: estudos, to: "/estudos" as const },
    { label: "Finanças", value: financas, to: "/investimentos" as const },
    { label: "Espiritualidade", value: espiritualidade, to: "/oracao" as const },
    { label: "Objetivos", value: objetivos, to: "/visao" as const },
  ];
  const indice = clamp(pillars.reduce((s, p) => s + p.value, 0) / pillars.length);

  const focus = [...pillars].sort((a, b) => a.value - b.value)[0];
  const strong = [...pillars].sort((a, b) => b.value - a.value)[0];

  const emptyState = pillars.every((p) => p.value === 0);

  return (
    <AppShell>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 pb-8 sm:flex sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow min-h-4">{dayLabel}</p>
          <h1 className="mt-2 text-display text-3xl leading-none sm:text-[2.6rem]">
            Índice BEPACE
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            {emptyState
              ? "Preencha seus módulos e sua nota geral aparece aqui, atualizada em tempo real."
              : `Seu ponto forte agora é ${strong?.label}. A área que mais pede atenção é ${focus?.label}.`}
          </p>
        </div>
        <Link
          to="/assistente"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent-orange px-4 py-2.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
        >
          Falar com a IA
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-5" raised>
          <PanelHead title="Nota geral" hint="Média dos cinco pilares da sua vida" />
          <div className="flex flex-col items-center gap-6 px-6 pb-6 sm:flex-row">
            <ScoreRing value={indice} />
            <div className="w-full min-w-0 space-y-3">
              {pillars.map((p) => (
                <Link key={p.label} to={p.to} className="block">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{p.label}</span>
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {p.value}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={p.value} accent={p.value >= 60} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="lg:col-span-7" delay={0.04}>
          <PanelHead
            title="Treinos da semana"
            hint={`${doneWorkouts} de ${workouts.length} concluídos`}
            action={
              <Link to="/treinos" className="text-xs text-muted-foreground hover:text-foreground">
                Abrir treinos →
              </Link>
            }
          />
          {workouts.length === 0 ? (
            <p className="px-6 pb-6 text-xs text-muted-foreground">
              Nenhum treino cadastrado ainda.
            </p>
          ) : (
            <ul>
              {workouts.slice(0, 5).map((w) => (
                <li
                  key={w['id']}
                  className="flex items-center gap-4 border-t border-hairline px-6 py-3.5"
                >
                  <span className="w-16 shrink-0 text-[11px] text-muted-foreground">
                    {w['weekday']}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">{w['name']}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {w['duration_min']} min
                  </span>
                  <span
                    className={
                      w['done']
                        ? "h-1.5 w-1.5 shrink-0 rounded-full bg-accent-orange"
                        : "h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="lg:col-span-4" delay={0.08}>
          <PanelHead title="Estudos" hint={`${studies.length} planos ativos`} />
          {studies.length === 0 ? (
            <p className="px-6 pb-6 text-xs text-muted-foreground">
              Cadastre um plano de estudo para acompanhar aqui.
            </p>
          ) : (
            <div className="space-y-3 px-6 pb-6">
              {studies.slice(0, 4).map((p) => (
                <div key={p['id']}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-xs">{p['title']}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {Number(p['hours_done'] ?? 0)}h/{Number(p['hours_target'] ?? 0)}h
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={Number(p['progress'] ?? 0)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel className="lg:col-span-4" delay={0.12}>
          <PanelHead title="Espiritualidade" hint={`${requests.length} pedidos`} action={<Tag>Oração</Tag>} />
          <div className="px-6 pb-6">
            <p className="text-display text-2xl">{answered} respondidos</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {prayers.length} orações na sua biblioteca pessoal.
            </p>
            <Link
              to="/oracao"
              className="mt-4 inline-block text-xs text-muted-foreground hover:text-foreground"
            >
              Abrir oração →
            </Link>
          </div>
        </Panel>

        <Panel className="lg:col-span-4" delay={0.16}>
          <PanelHead title="Visão de futuro" hint={`${vision.length} itens no mural`} />
          <div className="px-6 pb-6">
            <p className="text-display text-2xl">{clamp(visionAvg)}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Progresso médio dos seus sonhos mapeados.
            </p>
            <Link
              to="/visao"
              className="mt-4 inline-block text-xs text-muted-foreground hover:text-foreground"
            >
              Abrir mural →
            </Link>
          </div>
        </Panel>

        <Panel
          className="grid grid-cols-2 divide-x divide-y divide-hairline sm:grid-cols-4 sm:divide-y-0 lg:col-span-12"
          delay={0.2}
        >
          <Metric label="Investido" value={brl(investedTotal)} sub={`${investments.length} ativos`} />
          <Metric label="Faturas" value={brl(invoiceTotal)} sub={`${cards.length} cartões`} />
          <Metric
            label="Experiências"
            value={`${lived}/${experiences.length}`}
            sub="Já vividas"
          />
          <Metric label="Refeições" value={String(meals.length)} sub="No plano alimentar" />
        </Panel>
      </div>
    </AppShell>
  );
}

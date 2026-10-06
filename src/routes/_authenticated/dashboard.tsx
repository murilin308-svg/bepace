import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/life/app-shell";
import {
  Metric,
  Panel,
  PanelHead,
  Progress,
  Tag,
} from "@/components/life/primitives";
import {
  DeleteButton,
  EditNumber,
  EditText,
} from "@/components/life/editable";
import { PRAYER_LIBRARY } from "@/lib/prayer-library";
import {
  useCollection,
  useCreate,
  useProfile,
  useRemove,
  useUpdate,
} from "@/lib/db";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BEPACE" },
      {
        name: "description",
        content:
          "Comece o dia com oração e veja agenda, afazeres, treinos e estudos em uma única tela.",
      },
      { property: "og:title", content: "Dashboard — BEPACE" },
      {
        property: "og:description",
        content: "Oração, compromissos, treinos e estudos do seu dia em uma só tela.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

const DAYS_LONG = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const hourLabel = (h: unknown) => `${String(Number(h) || 0).padStart(2, "0")}:00`;

/** Data/hora reais só depois da hidratação — evita divergir entre servidor e navegador. */
function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/** Campo de criação rápida, compacto, para usar dentro dos painéis. */
function QuickAdd({
  placeholder,
  cta,
  onAdd,
}: {
  placeholder: string;
  cta: string;
  onAdd: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const submit = () => {
    const v = value.trim();
    if (!v) return;
    onAdd(v);
    setValue("");
  };
  return (
    <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-2/60 pl-3 pr-1.5 py-1.5 transition-colors focus-within:border-accent-orange/40">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="shrink-0 rounded-lg bg-accent-orange px-3 py-1.5 text-[11px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {cta}
      </button>
    </div>
  );
}

type Notice = { tone: "accent" | "warn" | "ok"; text: string };

const toneDot: Record<Notice["tone"], string> = {
  accent: "bg-accent-orange",
  warn: "bg-warning",
  ok: "bg-success",
};

function Dashboard() {
  const now = useNow();
  const { data: profile } = useProfile();

  const { data: prayers = [] } = useCollection<Row>("prayers");
  const { data: requests = [] } = useCollection<Row>("prayer_requests");
  const { data: events = [] } = useCollection<Row>("events");
  const { data: shopping = [] } = useCollection<Row>("shopping_items");
  const { data: workouts = [] } = useCollection<Row>("workouts");
  const { data: studies = [] } = useCollection<Row>("study_plans");
  const { data: meals = [] } = useCollection<Row>("meals");
  const { data: bodyLogs = [] } = useCollection<Row>("body_logs");
  const { data: investments = [] } = useCollection<Row>("investments");
  const { data: cards = [] } = useCollection<Row>("cards");
  const { data: vision = [] } = useCollection<Row>("vision_items");
  const { data: experiences = [] } = useCollection<Row>("experiences");

  const createPrayer = useCreate("prayers");
  const createEvent = useCreate("events");
  const createTask = useCreate("shopping_items");
  const updatePrayer = useUpdate("prayers");
  const updateRequest = useUpdate("prayer_requests");
  const updateEvent = useUpdate("events");
  const updateTask = useUpdate("shopping_items");
  const updateWorkout = useUpdate("workouts");
  const updateStudy = useUpdate("study_plans");
  const removeEvent = useRemove("events");

  const dayIndex = now ? (now.getDay() + 6) % 7 : -1;
  const todayName = now ? DAYS_LONG[dayIndex] : undefined;
  const isMorning = !now || now.getHours() < 19;
  const period = isMorning ? "Manhã" : "Noite";

  const firstName = (profile?.full_name ?? "").trim().split(" ")[0];
  const greeting = !now
    ? "Seu dia"
    : now.getHours() < 12
      ? "Bom dia"
      : now.getHours() < 18
        ? "Boa tarde"
        : "Boa noite";

  const dayLabel = useMemo(
    () =>
      now
        ? now.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
        : "",
    [now],
  );

  /* ---------------- hoje --------------------------------------------------- */
  const todaysEvents = useMemo(
    () =>
      events
        .filter((e) => Number(e["day"]) === dayIndex)
        .sort((a, b) => Number(a["start_hour"]) - Number(b["start_hour"])),
    [events, dayIndex],
  );

  const openTasks = useMemo(() => shopping.filter((s) => !s["done"]), [shopping]);
  const doneTasks = shopping.length - openTasks.length;

  const todaysWorkouts = useMemo(
    () => workouts.filter((w) => String(w["weekday"]) === todayName),
    [workouts, todayName],
  );

  const activeStudies = useMemo(
    () =>
      studies
        .filter((p) => String(p["status"]) !== "Concluído")
        .slice(0, 3),
    [studies],
  );

  const pendingRequests = useMemo(
    () => requests.filter((r) => String(r["status"]) === "Em oração"),
    [requests],
  );

  const recentPrayers = useMemo(
    () => prayers.filter((p) => String(p["period"] ?? "Manhã") === period),
    [prayers, period],
  );

  /* ---------------- avisos ------------------------------------------------- */
  const notices = useMemo<Notice[]>(() => {
    if (!now) return [];
    const out: Notice[] = [];
    const hour = now.getHours();

    const next = todaysEvents.find((e) => Number(e["start_hour"]) >= hour);
    if (next) {
      out.push({
        tone: "accent",
        text: `Próximo compromisso: ${String(next["title"])} às ${hourLabel(next["start_hour"])}`,
      });
    } else if (todaysEvents.length) {
      out.push({ tone: "ok", text: "Sua agenda de hoje já foi cumprida" });
    } else {
      out.push({ tone: "warn", text: "Nenhum compromisso hoje — que tal planejar um bloco?" });
    }

    if (pendingRequests.length) {
      out.push({
        tone: "accent",
        text: `${pendingRequests.length} ${pendingRequests.length === 1 ? "pedido de oração em" : "pedidos de oração em"} acompanhamento`,
      });
    }

    const pendingWorkout = todaysWorkouts.find((w) => !w["done"]);
    if (pendingWorkout) {
      out.push({ tone: "warn", text: `Treino de hoje ainda não concluído: ${String(pendingWorkout["name"])}` });
    } else if (todaysWorkouts.length) {
      out.push({ tone: "ok", text: "Treino de hoje concluído" });
    }

    if (openTasks.length) {
      out.push({
        tone: "warn",
        text: `${openTasks.length} ${openTasks.length === 1 ? "afazer pendente" : "afazeres pendentes"}`,
      });
    }

    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (const c of cards) {
      const due = Number(c["due_day"] ?? 0);
      if (!due) continue;
      const left = due >= dayOfMonth ? due - dayOfMonth : due + daysInMonth - dayOfMonth;
      if (left <= 3) {
        out.push({
          tone: "warn",
          text: `Fatura ${String(c["bank"] ?? "do cartão")} vence ${left === 0 ? "hoje" : `em ${left} ${left === 1 ? "dia" : "dias"}`}`,
        });
      }
    }

    return out.slice(0, 6);
  }, [now, todaysEvents, pendingRequests, todaysWorkouts, openTasks, cards]);

  /* ---------------- índice (ao final da tela) ------------------------------ */
  const doneWorkouts = workouts.filter((w) => w["done"]).length;
  const saude = clamp(
    (workouts.length ? (doneWorkouts / workouts.length) * 60 : 0) +
      Math.min(meals.length, 7) * 3 +
      Math.min(bodyLogs.length, 5) * 3.8,
  );
  const estudos = studies.length
    ? clamp(studies.reduce((s, p) => s + Number(p["progress"] ?? 0), 0) / studies.length)
    : 0;

  const investedTotal = investments.reduce((s, r) => s + Number(r["amount"] ?? 0), 0);
  const limitTotal = cards.reduce((s, r) => s + Number(r["limit_amount"] ?? 0), 0);
  const invoiceTotal = cards.reduce((s, r) => s + Number(r["current_invoice"] ?? 0), 0);
  const cardHealth = limitTotal > 0 ? 100 - (invoiceTotal / limitTotal) * 100 : investedTotal > 0 ? 80 : 0;
  const financas = clamp((investedTotal > 0 ? 50 : 0) + cardHealth * 0.5);

  const answered = requests.filter((r) => String(r["status"]) === "Respondido").length;
  const espiritualidade = clamp(
    Math.min(prayers.length, 6) * 8 +
      (requests.length ? (answered / requests.length) * 30 : 0) +
      Math.min(requests.length, 4) * 5,
  );

  const visionAvg = vision.length
    ? vision.reduce((s, v) => s + Number(v["progress"] ?? 0), 0) / vision.length
    : 0;
  const lived = experiences.filter((e) => String(e["status"]) === "Vivido").length;
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
  const hoursDone = studies.reduce((s, p) => s + Number(p["hours_done"] ?? 0), 0);

  return (
    <AppShell>
      {/* ---------------------------------------------------------------- topo */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
        <div className="min-w-0">
          <p className="eyebrow min-h-4">{dayLabel}</p>
          <h1 className="mt-2 text-display text-3xl leading-none sm:text-[2.6rem]">
            {greeting}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            {isMorning
              ? "Comece pelo momento de oração e siga para o que precisa ser feito hoje."
              : "Encerre o dia em oração e veja o que fica para amanhã."}
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

      {/* ------------------------------------------------------------- oração */}
      <Panel className="mb-6" raised>
        <PanelHead
          title={isMorning ? "Oração da manhã" : "Oração da noite"}
          hint={isMorning ? "Antes de abrir o dia" : "Para fechar o dia com clareza"}
          action={
            <Link to="/oracao" className="text-xs text-muted-foreground hover:text-foreground">
              Abrir oração →
            </Link>
          }
        />
        <div className="grid gap-8 border-t border-hairline px-6 py-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div>
            <QuickAdd
              placeholder="Escreva sua oração de agora…"
              cta="Guardar"
              onAdd={(title) =>
                createPrayer.mutate({
                  title,
                  category: "Gratidão",
                  body: "",
                  minutes: 5,
                  favorite: false,
                  period,
                })
              }
            />

            <p className="eyebrow mt-5 mb-2">Prontas para hoje</p>
            <div className="flex flex-wrap gap-2">
              {PRAYER_LIBRARY.map((it) => (
                <button
                  key={it.label}
                  onClick={() => createPrayer.mutate({ favorite: false, ...it.values, period })}
                  className="rounded-full border border-hairline bg-surface-2/60 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-accent-orange/40 hover:text-foreground"
                >
                  + {it.label}
                </button>
              ))}
            </div>

            <p className="eyebrow mt-6 mb-2">{isMorning ? "Suas orações da manhã" : "Suas orações da noite"}</p>
            {recentPrayers.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nenhuma oração para este horário — configure na aba Oração ou use um atalho acima.
              </p>
            ) : (
              <ul className="space-y-1">
                {recentPrayers.map((p) => (
                  <li
                    key={p["id"]}
                    className="group flex items-center gap-3 rounded-lg px-2 py-1.5 -mx-2 hover:bg-surface-2/60"
                  >
                    <div className="min-w-0 flex-1">
                      <EditText
                        value={String(p["title"] ?? "")}
                        className="text-[13px]"
                        onCommit={(v) => updatePrayer.mutate({ id: p["id"], values: { title: v } })}
                      />
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {Number(p["minutes"] ?? 0)}min
                    </span>
                    <Tag>{String(p["category"] ?? "—")}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:border-l lg:border-hairline lg:pl-8">
            <div className="flex items-baseline justify-between gap-3">
              <p className="eyebrow">Pedidos em oração</p>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {answered} respondidos
              </span>
            </div>
            {pendingRequests.length === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Nenhum pedido em acompanhamento agora.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pendingRequests.slice(0, 4).map((r) => (
                  <li
                    key={r["id"]}
                    className="flex items-start gap-3 rounded-xl border border-hairline bg-surface-2/40 px-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px]">{String(r["title"] ?? "—")}</p>
                      {r["person"] ? (
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                          por {String(r["person"])}
                        </p>
                      ) : null}
                    </div>
                    <button
                      onClick={() =>
                        updateRequest.mutate({
                          id: r["id"],
                          values: { status: "Respondido" },
                        })
                      }
                      className="shrink-0 rounded-lg border border-hairline px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:border-success/50 hover:text-success"
                    >
                      Respondido
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Panel>

      {/* ------------------------------------------- atividades do dia/avisos */}
      <div className="mb-6 grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-5" delay={0.04}>
          <PanelHead
            title="Agenda de hoje"
            hint={`${todaysEvents.length} ${todaysEvents.length === 1 ? "compromisso" : "compromissos"}`}
            action={
              <Link to="/calendar" className="text-xs text-muted-foreground hover:text-foreground">
                Abrir calendário →
              </Link>
            }
          />
          <div className="border-t border-hairline px-6 py-5">
            {todaysEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nenhum compromisso para hoje ainda.
              </p>
            ) : (
              <ul className="space-y-2">
                {todaysEvents.map((e) => (
                  <li
                    key={e["id"]}
                    className="group flex items-center gap-3 rounded-xl border border-hairline bg-surface-2/40 px-3 py-2"
                  >
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {hourLabel(e["start_hour"])}
                    </span>
                    <div className="min-w-0 flex-1">
                      <EditText
                        value={String(e["title"] ?? "")}
                        className="text-[13px]"
                        onCommit={(v) => updateEvent.mutate({ id: e["id"], values: { title: v } })}
                      />
                    </div>
                    <span className="hidden shrink-0 text-[11px] text-muted-foreground sm:block">
                      {String(e["category"] ?? "")}
                    </span>
                    <span className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                      <DeleteButton
                        label="Excluir compromisso"
                        onDelete={() => removeEvent.mutate(e["id"])}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <QuickAdd
                placeholder="Novo compromisso…"
                cta="Agendar"
                onAdd={(title) =>
                  createEvent.mutate({
                    title,
                    day: dayIndex,
                    start_hour: 9,
                    end_hour: 10,
                    category: "Pessoal",
                  })
                }
              />
            </div>
          </div>
        </Panel>

        <Panel className="lg:col-span-4" delay={0.08}>
          <PanelHead
            title="Afazeres"
            hint={
              doneTasks > 0
                ? `${openTasks.length} pendentes · ${doneTasks} concluídos`
                : `${openTasks.length} pendentes`
            }
            action={
              <Link to="/compras" className="text-xs text-muted-foreground hover:text-foreground">
                Abrir lista →
              </Link>
            }
          />
          <div className="border-t border-hairline px-6 py-5">
            {openTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nada pendente por aqui.</p>
            ) : (
              <ul className="space-y-1.5">
                {openTasks.slice(0, 6).map((t) => (
                  <li key={t["id"]} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => updateTask.mutate({ id: t["id"], values: { done: true } })}
                      className="h-3.5 w-3.5 shrink-0 accent-[var(--accent-orange)]"
                      aria-label={`Concluir ${String(t["name"] ?? "afazer")}`}
                    />
                    <span className="min-w-0 flex-1 truncate text-[13px]">
                      {String(t["name"] ?? "—")}
                    </span>
                    {t["quantity"] ? (
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {String(t["quantity"])}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <QuickAdd
                placeholder="Novo afazer…"
                cta="Adicionar"
                onAdd={(name) =>
                  createTask.mutate({ name, category: "Outros", quantity: "", done: false })
                }
              />
            </div>
          </div>
        </Panel>

        <Panel className="lg:col-span-3" delay={0.12}>
          <PanelHead title="Avisos" hint="O que pede sua atenção" />
          <ul className="space-y-2.5 border-t border-hairline px-6 py-5">
            {notices.length === 0 ? (
              <li className="text-xs text-muted-foreground">Tudo em ordem por agora.</li>
            ) : (
              notices.map((n, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", toneDot[n.tone])} />
                  <span className="text-[12px] leading-snug text-muted-foreground">{n.text}</span>
                </li>
              ))
            )}
          </ul>
        </Panel>
      </div>

      {/* ------------------------------------------------- treinos e estudos */}
      <div className="mb-6 grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-6" delay={0.04}>
          <PanelHead
            title="Treino de hoje"
            hint={todayName ? `${todayName} — ${todaysWorkouts.length} sessões` : "Carregando…"}
            action={
              <Link to="/treinos" className="text-xs text-muted-foreground hover:text-foreground">
                Abrir treinos →
              </Link>
            }
          />
          <div className="border-t border-hairline px-6 py-5">
            {todaysWorkouts.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nenhum treino marcado para hoje. Monte sua semana em Treinos.
              </p>
            ) : (
              <ul className="space-y-2">
                {todaysWorkouts.map((w) => (
                  <li
                    key={w["id"]}
                    className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-2/40 px-3 py-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(w["done"])}
                      onChange={() =>
                        updateWorkout.mutate({ id: w["id"], values: { done: !w["done"] } })
                      }
                      className="h-3.5 w-3.5 shrink-0 accent-[var(--accent-orange)]"
                      aria-label={`Concluir treino ${String(w["name"] ?? "")}`}
                    />
                    <div className="min-w-0 flex-1">
                      <EditText
                        value={String(w["name"] ?? "")}
                        className={cn("text-[13px]", w["done"] && "line-through opacity-60")}
                        onCommit={(v) => updateWorkout.mutate({ id: w["id"], values: { name: v } })}
                      />
                      <p className="mt-0.5 px-2 text-[11px] text-muted-foreground">
                        {String(w["modality"] ?? "—")} · {Number(w["duration_min"] ?? 0)} min
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>

        <Panel className="lg:col-span-6" delay={0.08}>
          <PanelHead
            title="Estudos do dia"
            hint={`${activeStudies.length} ${activeStudies.length === 1 ? "plano ativo" : "planos ativos"}`}
            action={
              <Link to="/estudos" className="text-xs text-muted-foreground hover:text-foreground">
                Abrir estudos →
              </Link>
            }
          />
          <div className="border-t border-hairline px-6 py-5">
            {activeStudies.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nenhum plano de estudo em andamento.
              </p>
            ) : (
              <div className="space-y-4">
                {activeStudies.map((p) => (
                  <div key={p["id"]}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 truncate text-[13px]">{String(p["title"] ?? "—")}</span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        <EditNumber
                          value={Number(p["hours_done"] ?? 0)}
                          min={0}
                          max={10000}
                          suffix="h"
                          className="w-12 text-right"
                          onCommit={(v) =>
                            updateStudy.mutate({ id: p["id"], values: { hours_done: v } })
                          }
                        />
                        <span className="ml-1">/ {Number(p["hours_target"] ?? 0)}h</span>
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <Progress value={Number(p["progress"] ?? 0)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </div>

      {/* ------------------------------- índice, finanças, visão e o resto */}
      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-5" delay={0.04}>
          <PanelHead
            title="Índice BEPACE"
            hint="Média dos cinco pilares"
            action={
              <span className="text-2xl font-semibold tabular-nums tracking-tight">{indice}</span>
            }
          />
          <div className="space-y-3 border-t border-hairline px-6 py-5">
            {pillars.map((p) => (
              <Link key={p.label} to={p.to} className="block">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xs text-muted-foreground">{p.label}</span>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{p.value}</span>
                </div>
                <div className="mt-1.5">
                  <Progress value={p.value} accent={p.value >= 60} />
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel className="lg:col-span-4" delay={0.08}>
          <PanelHead title="Investimentos e faturas" hint="Patrimônio e faturas" />
          <div className="space-y-4 border-t border-hairline px-6 py-5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs text-muted-foreground">Investido</span>
              <span className="text-sm font-semibold tabular-nums">{brl(investedTotal)}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs text-muted-foreground">Faturas em aberto</span>
              <span className="text-sm font-semibold tabular-nums">{brl(invoiceTotal)}</span>
            </div>
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-xs text-muted-foreground">Limite usado</span>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {limitTotal > 0 ? `${clamp((invoiceTotal / limitTotal) * 100)}%` : "—"}
                </span>
              </div>
              <Progress
                value={limitTotal > 0 ? clamp((invoiceTotal / limitTotal) * 100) : 0}
                accent={false}
              />
            </div>
            <div className="flex flex-wrap gap-4 pt-1">
              <Link
                to="/investimentos"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Abrir investimentos →
              </Link>
              <Link to="/cartoes" className="text-xs text-muted-foreground hover:text-foreground">
                Abrir cartões →
              </Link>
            </div>
          </div>
        </Panel>

        <Panel className="lg:col-span-3" delay={0.12}>
          <PanelHead
            title="Visão de futuro"
            hint={`${vision.length} itens · média ${clamp(visionAvg)}%`}
            action={
              <Link to="/visao" className="text-xs text-muted-foreground hover:text-foreground">
                Mural →
              </Link>
            }
          />
          <div className="space-y-3 border-t border-hairline px-6 py-5">
            {vision.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Monte seu mural de sonhos em Visão de Futuro.
              </p>
            ) : (
              vision.slice(0, 3).map((v) => (
                <div key={v["id"]}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate text-[12px]">{String(v["title"] ?? "—")}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {Number(v["progress"] ?? 0)}%
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Progress value={Number(v["progress"] ?? 0)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel
          className="grid grid-cols-2 divide-x divide-y divide-hairline sm:grid-cols-4 sm:divide-y-0 lg:col-span-12"
          delay={0.16}
        >
          <Metric label="Orações" value={String(prayers.length)} sub="Na sua biblioteca" />
          <Metric label="Horas de estudo" value={`${hoursDone}h`} sub="Somadas nos planos" />
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

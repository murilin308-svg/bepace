import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard } from "@/components/life/module-page";
import { Panel } from "@/components/life/primitives";
import { useCollection } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/investimentos")({
  head: () => ({
    meta: [
      { title: "Investimentos — BEPACE" },
      { name: "description", content: "Carteira por classe de ativo, valores e rentabilidade no BEPACE." },
      { property: "og:title", content: "Investimentos — BEPACE" },
      { property: "og:description", content: "Carteira por classe de ativo, valores e rentabilidade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvestimentosPage,
});

const CATEGORIES = [
  "Renda fixa",
  "Ações",
  "FIIs",
  "ETF",
  "Cripto",
  "Internacional",
] as const;

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

type Investment = { id: string; category: string; amount: number; return_pct: number };

function Summary() {
  const { data = [] } = useCollection<Investment>("investments");
  const total = data.reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const weighted =
    total > 0
      ? data.reduce((s, r) => s + Number(r.amount ?? 0) * Number(r.return_pct ?? 0), 0) / total
      : 0;

  const byCategory = CATEGORIES.map((c) => ({
    category: c,
    amount: data.filter((r) => r.category === c).reduce((s, r) => s + Number(r.amount ?? 0), 0),
  })).filter((c) => c.amount > 0);

  return (
    <Panel className="mb-6">
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4 px-6 pt-5">
        <div>
          <p className="eyebrow">Patrimônio investido</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{brl(total)}</p>
        </div>
        <div>
          <p className="eyebrow">Rentabilidade média</p>
          <p
            className="mt-1 text-2xl font-semibold tracking-tight"
            style={{ color: weighted < 0 ? "var(--danger, #F04438)" : "var(--accent-orange)" }}
          >
            {weighted.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="eyebrow">Ativos</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{data.length}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3 px-6 pb-5">
        {byCategory.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Adicione seus ativos abaixo para ver a distribuição da carteira.
          </p>
        ) : (
          byCategory.map((c) => {
            const pct = total > 0 ? (c.amount / total) * 100 : 0;
            return (
              <div key={c.category}>
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{c.category}</span>
                  <span>
                    {brl(c.amount)} · {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: "var(--accent-orange)" }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}

function InvestimentosPage() {
  return (
    <AppShell>
      <ModuleBoard
        table="investments"
        eyebrow="Finanças"
        title="Investimentos"
        description="Sua carteira por classe de ativo, com valor aplicado e rentabilidade."
        addPlaceholder="Novo ativo — ex.: Tesouro IPCA+ 2029"
        titleKey="name"
        filterKey="category"
        extra={<Summary />}
        defaults={{ category: "Renda fixa", amount: 0, return_pct: 0, broker: "" }}
        fields={[
          { key: "category", label: "Classe", type: "select", options: CATEGORIES },
          { key: "amount", label: "Valor (R$)", type: "number", min: 0, max: 100000000 },
          { key: "return_pct", label: "Rent. (%)", type: "number", min: -100, max: 1000, suffix: "%" },
          { key: "broker", label: "Corretora", type: "text" },
        ]}
      />
    </AppShell>
  );
}

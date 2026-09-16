import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/life/app-shell";
import { ModuleBoard } from "@/components/life/module-page";
import { Panel } from "@/components/life/primitives";
import { useCollection } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/cartoes")({
  head: () => ({
    meta: [
      { title: "Cartões — BEPACE" },
      { name: "description", content: "Cartões, limites, faturas e gastos por categoria no BEPACE." },
      { property: "og:title", content: "Cartões — BEPACE" },
      { property: "og:description", content: "Cartões, limites, faturas e gastos por categoria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartoesPage,
});

const BANKS = [
  "Nubank",
  "Inter",
  "Santander",
  "Bradesco",
  "Itaú",
  "Banco do Brasil",
  "C6 Bank",
  "Outro",
] as const;

const EXPENSE_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Assinaturas",
  "Outros",
] as const;

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

type Card = { id: string; limit_amount: number; current_invoice: number };

function Summary() {
  const { data = [] } = useCollection<Card>("cards");
  const limit = data.reduce((s, r) => s + Number(r.limit_amount ?? 0), 0);
  const invoice = data.reduce((s, r) => s + Number(r.current_invoice ?? 0), 0);
  const used = limit > 0 ? (invoice / limit) * 100 : 0;

  return (
    <Panel className="mb-6">
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4 px-6 pt-5">
        <div>
          <p className="eyebrow">Faturas em aberto</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{brl(invoice)}</p>
        </div>
        <div>
          <p className="eyebrow">Limite total</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{brl(limit)}</p>
        </div>
        <div>
          <p className="eyebrow">Limite usado</p>
          <p
            className="mt-1 text-2xl font-semibold tracking-tight"
            style={{ color: "var(--accent-orange)" }}
          >
            {used.toFixed(0)}%
          </p>
        </div>
      </div>
      <div className="px-6 pt-5 pb-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.min(used, 100)}%`, background: "var(--accent-orange)" }}
          />
        </div>
      </div>
    </Panel>
  );
}

function CartoesPage() {
  return (
    <AppShell>
      <div className="space-y-12">
        <ModuleBoard
          table="cards"
          eyebrow="Finanças"
          title="Cartões"
          description="Limites, faturas e vencimentos dos seus cartões de crédito."
          addPlaceholder="Novo cartão — ex.: Nubank Ultravioleta"
          titleKey="nickname"
          filterKey="bank"
          extra={<Summary />}
          defaults={{ bank: "Nubank", limit_amount: 0, current_invoice: 0, due_day: 10 }}
          fields={[
            { key: "bank", label: "Banco", type: "select", options: BANKS },
            { key: "limit_amount", label: "Limite (R$)", type: "number", min: 0, max: 10000000 },
            { key: "current_invoice", label: "Fatura (R$)", type: "number", min: 0, max: 10000000 },
            { key: "due_day", label: "Vencimento", type: "number", min: 1, max: 31 },
          ]}
        />

        <ModuleBoard
          table="card_expenses"
          eyebrow="Finanças"
          title="Gastos"
          description="Lançamentos por categoria para acompanhar para onde o dinheiro vai."
          addPlaceholder="Novo gasto — ex.: Mercado do mês"
          titleKey="description"
          filterKey="category"
          defaults={{
            category: "Outros",
            amount: 0,
            expense_date: new Date().toISOString().slice(0, 10),
          }}
          fields={[
            { key: "category", label: "Categoria", type: "select", options: EXPENSE_CATEGORIES },
            { key: "amount", label: "Valor (R$)", type: "number", min: 0, max: 10000000 },
            { key: "expense_date", label: "Data", type: "text" },
          ]}
        />
      </div>
    </AppShell>
  );
}

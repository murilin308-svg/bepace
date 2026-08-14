import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import logo from "@/assets/life-os-logo.jpg.asset.json";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Planos e preços — Life OS" },
      {
        name: "description",
        content:
          "Escolha seu plano do Life OS: Essential por R$ 59,90/mês ou Performance por R$ 97,90/mês — tudo que você precisa para operar sua vida em alta performance.",
      },
      { property: "og:title", content: "Planos e preços — Life OS" },
      {
        property: "og:description",
        content:
          "Duas opções, um sistema completo: metas, hábitos, tempo, notas, viagens e journal em alta performance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const ease = [0.16, 1, 0.3, 1] as const;

const plans = [
  {
    id: "essential",
    name: "Essential",
    price: "59,90",
    tagline: "O sistema base para retomar o controle.",
    featured: false,
    features: [
      { label: "Dashboard com Life Score", on: true },
      { label: "Metas, hábitos e calendário", on: true },
      { label: "Notas e journal ilimitados", on: true },
      { label: "Mapa de viagens", on: true },
      { label: "Relatórios semanais", on: true },
      { label: "Rituais de alta performance", on: false },
      { label: "Suporte prioritário 24/7", on: false },
    ],
  },
  {
    id: "performance",
    name: "Performance",
    price: "97,90",
    tagline: "A mistura completa para chegar onde você quer.",
    featured: true,
    features: [
      { label: "Tudo do plano Essential", on: true },
      { label: "Rituais de alta performance", on: true },
      { label: "Planejamento trimestral guiado", on: true },
      { label: "Análises profundas de tendência", on: true },
      { label: "Knowledge base avançada", on: true },
      { label: "Exportação e backup completos", on: true },
      { label: "Suporte prioritário 24/7", on: true },
    ],
  },
] as const;

function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-0">
      {/* Top bar — pill nav like the reference */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <img
            src={logo.url}
            alt="Life OS logo"
            className="h-9 w-9 rounded-full object-contain invert"
          />
          <span className="text-[13px] font-semibold tracking-[0.2em] uppercase">Life OS</span>
        </div>

        <nav className="flex items-center gap-1 rounded-full border border-hairline bg-surface-1 p-1.5">
          <Link
            to="/"
            aria-label="Fechar"
            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/"
            className="rounded-full px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <span className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-foreground">
            Pricing
          </span>
          <Link
            to="/knowledge"
            className="rounded-full px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Knowledge
          </Link>
          <Link
            to="/auth"
            className="rounded-full bg-foreground px-3.5 py-1.5 text-[11px] font-semibold text-black"
          >
            Sign in
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto w-full max-w-6xl overflow-hidden px-5 pb-24 sm:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="pt-10 text-center text-display text-6xl leading-[0.95] tracking-tight sm:pt-16 sm:text-[8rem]"
        >
          Pricing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease }}
          className="mx-auto -mt-2 max-w-lg text-center text-sm leading-relaxed text-muted-foreground sm:-mt-6"
        >
          Uma mistura completa de tudo que você precisa para chegar onde quer — em alta performance.
        </motion.p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease }}
              className={
                plan.featured
                  ? "layer-card-raised relative overflow-hidden p-7 sm:p-9"
                  : "layer-card relative overflow-hidden p-7 sm:p-9"
              }
            >
              {plan.featured ? (
                <span className="absolute top-6 right-6 rounded-full border border-accent-orange/40 px-2.5 py-1 text-[10px] tracking-[0.14em] text-accent-orange uppercase">
                  Mais escolhido
                </span>
              ) : null}

              <p className="eyebrow">{plan.name}</p>

              <div className="mt-5 flex items-end gap-1.5">
                <span className="text-sm text-muted-foreground">R$</span>
                <span className="text-display text-4xl leading-none sm:text-5xl">{plan.price}</span>
                <span className="pb-1 text-sm text-muted-foreground">/mês</span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{plan.tagline}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-3 text-xs">
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                        f.on
                          ? "border-accent-orange/40 text-accent-orange"
                          : "border-hairline text-muted-foreground/50"
                      }`}
                    >
                      {f.on ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </span>
                    <span className={f.on ? "text-foreground/90" : "text-muted-foreground/60"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/auth"
                className={`mt-9 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition-opacity hover:opacity-90 ${
                  plan.featured
                    ? "bg-accent-orange text-black"
                    : "border border-border bg-surface-2 text-foreground"
                }`}
              >
                Começar agora
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.article>
          ))}
        </div>

        <p className="mt-8 text-center text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
          Cancele quando quiser · Pagamento em reais
        </p>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-[11px] tracking-[0.14em] text-muted-foreground uppercase sm:px-8">
          <span>Life OS</span>
          <span>Clarity · Control · Evolution</span>
        </div>
      </footer>
    </div>
  );
}

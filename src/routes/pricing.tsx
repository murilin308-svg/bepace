import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import logo from "@/assets/life-os-logo.jpg.asset.json";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Planos e preços — BEPACE" },
      {
        name: "description",
        content:
          "Escolha seu plano do BEPACE: Essential por R$ 59,90/mês ou Performance por R$ 97,90/mês — tudo que você precisa para operar sua vida em alta performance.",
      },
      { property: "og:title", content: "Planos e preços — BEPACE" },
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
            alt="BEPACE logo"
            className="h-9 w-9 rounded-full object-contain invert"
          />
          <span className="text-[13px] font-semibold tracking-[0.2em] uppercase">BEPACE</span>
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

      <section className="relative mx-auto w-full max-w-5xl overflow-hidden px-5 pb-24 sm:px-8">
        {/* Watermark mark behind title and cards */}
        <motion.img
          src={logo.url}
          alt=""
          aria-hidden
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 0.055, scale: 1 }}
          transition={{ duration: 1.8, ease }}
          className="pointer-events-none absolute top-8 left-1/2 w-[620px] max-w-none -translate-x-1/2 rounded-full object-contain invert select-none sm:top-10 sm:w-[820px]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-surface-0 to-transparent"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="relative pt-8 text-center text-display text-5xl leading-[0.95] tracking-tight sm:pt-12 sm:text-[7rem]"
        >
          Pricing
        </motion.h1>

        <div className="relative mx-auto -mt-4 grid max-w-3xl gap-3 sm:-mt-10 sm:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease }}
              className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl sm:p-6 ${
                plan.featured
                  ? "border-foreground/12 bg-[oklch(0.17_0_0/0.72)] shadow-[0_40px_90px_-50px_oklch(0_0_0/1)]"
                  : "border-hairline bg-[oklch(0.13_0_0/0.62)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="eyebrow">{plan.name}</p>
                {plan.featured ? (
                  <span className="rounded-full border border-accent-orange/40 px-2 py-0.5 text-[9px] tracking-[0.12em] text-accent-orange uppercase">
                    Popular
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex items-end gap-1">
                <span className="pb-1 text-xs text-muted-foreground">R$</span>
                <span className="text-display text-3xl leading-none">{plan.price}</span>
                <span className="pb-1 text-xs text-muted-foreground">/mês</span>
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                {plan.tagline}
              </p>

              <ul className="mt-5 space-y-2">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5 text-[11px]">
                    <span
                      className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                        f.on
                          ? "border-accent-orange/40 text-accent-orange"
                          : "border-hairline text-muted-foreground/40"
                      }`}
                    >
                      {f.on ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                    </span>
                    <span className={f.on ? "text-foreground/85" : "text-muted-foreground/50"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/auth"
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[11px] font-semibold transition-opacity hover:opacity-90 ${
                  plan.featured
                    ? "bg-accent-orange text-black"
                    : "border border-border bg-[oklch(0.2_0_0/0.7)] text-foreground"
                }`}
              >
                Começar agora
                <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.article>
          ))}
        </div>

        <p className="relative mt-7 text-center text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          Cancele quando quiser · Pagamento em reais
        </p>
      </section>


      <footer className="border-t border-hairline">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-[11px] tracking-[0.14em] text-muted-foreground uppercase sm:px-8">
          <span>BEPACE</span>
          <span>Clarity · Control · Evolution</span>
        </div>
      </footer>
    </div>
  );
}

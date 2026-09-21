import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Compass,
  Globe2,
  NotebookPen,
  Repeat2,
  Target,
} from "lucide-react";
import logo from "@/assets/life-os-logo.jpg.asset.json";
import imgGoals from "@/assets/card-goals.jpg";
import imgHabits from "@/assets/card-habits.jpg";
import imgCalendar from "@/assets/card-calendar.jpg";
import imgNotes from "@/assets/card-notes.jpg";
import imgTravel from "@/assets/card-travel.jpg";
import imgJournal from "@/assets/card-journal.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BEPACE — Your Personal Command Center" },
      {
        name: "description",
        content:
          "BEPACE connects goals, habits, calendar, notes, travel and journal into one calm command center for your entire life.",
      },
      { property: "og:title", content: "BEPACE — Your Personal Command Center" },
      {
        property: "og:description",
        content:
          "One place to see where you are, where you're going and how you're evolving.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cover,
});

const ease = [0.16, 1, 0.3, 1] as const;

const modules = [
  {
    icon: Target,
    name: "Goals",
    line: "Vision broken into quarters, projects and today's next move.",
    image: imgGoals,
  },
  {
    icon: Repeat2,
    name: "Habits",
    line: "Streaks, consistency rings and the discipline behind the score.",
    image: imgHabits,
  },
  {
    icon: CalendarDays,
    name: "Calendar",
    line: "Day, week, month and year — one continuous sense of time.",
    image: imgCalendar,
  },
  {
    icon: NotebookPen,
    name: "Notes",
    line: "A calm three-pane workspace for everything you capture.",
    image: imgNotes,
  },
  {
    icon: Globe2,
    name: "Travel",
    line: "Countries lived, flown and dreamed of, mapped on a globe.",
    image: imgTravel,
  },
  {
    icon: BookOpen,
    name: "Journal",
    line: "Mood, energy and reflection tracked day after day.",
    image: imgJournal,
  },
] as const;

const pillars = [
  { k: "01", t: "Clarity", d: "Every area of life measured in one Life Score." },
  { k: "02", t: "Control", d: "Plan the week, then let the system hold the thread." },
  { k: "03", t: "Evolution", d: "Trends over months, not motivation over minutes." },
] as const;

function Cover() {
  return (
    <div className="min-h-screen bg-surface-0">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <Mark className="h-9 w-9" />
          <span className="text-[13px] font-semibold tracking-[0.2em] uppercase">BEPACE</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/auth"
            className="rounded-xl px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/pricing"
            className="rounded-xl bg-accent-orange px-3.5 py-2 text-xs font-semibold text-black transition-opacity hover:opacity-90"
          >
            Buy
          </Link>
        </div>
      </header>

      {/* Cover */}
      <section className="relative mx-auto w-full max-w-6xl overflow-hidden px-5 pt-10 pb-16 sm:px-8 sm:pt-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
          animate={{ opacity: 0.06, scale: 1, rotate: 0 }}
          transition={{ duration: 1.6, ease }}
          className="pointer-events-none absolute -top-24 -right-24 hidden lg:block"
          aria-hidden
        >
          <Mark className="h-[460px] w-[460px]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="eyebrow"
        >
          Personal operating system
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease }}
          className="mt-5 max-w-3xl text-display text-4xl leading-[1.03] sm:text-6xl lg:text-7xl"
        >
          Your life, in one
          <br />
          calm command center.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease }}
          className="mt-7 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          Not another productivity app. A single black surface where goals, habits, time, notes,
          travel and reflection finally talk to each other — and give you one honest answer about
          how your life is going.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link
            to="/pricing"
            className="group inline-flex items-center gap-2 rounded-xl bg-accent-orange px-5 py-3 text-xs font-semibold text-black transition-opacity hover:opacity-90"
          >
            Buy BEPACE
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-5 py-3 text-xs font-medium transition-colors hover:border-foreground/25"
          >
            Sign in
          </Link>
        </motion.div>

        {/* Pillars */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline sm:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.k}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36 + i * 0.08, ease }}
              className="bg-surface-1 p-7"
            >
              <span className="text-[11px] tracking-[0.2em] text-accent-orange">{p.k}</span>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">{p.t}</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modules as presentation cards */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="flex items-end justify-between gap-6 pb-8">
          <div>
            <p className="eyebrow">The modules</p>
            <h2 className="mt-3 text-display text-2xl sm:text-4xl">Eight surfaces, one system.</h2>
          </div>
          <Link
            to="/dashboard"
            className="hidden shrink-0 items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Ver o painel
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.06, ease }}
              whileHover={{ y: -4 }}
              className="layer-card group overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={m.image}
                  alt={`${m.name} module`}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-surface-1 via-surface-1/20 to-transparent" />
                <span className="absolute top-4 left-4 grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface-0/70 text-accent-orange backdrop-blur-md">
                  <m.icon className="h-[17px] w-[17px]" strokeWidth={1.6} />
                </span>
              </div>
              <div className="p-6 pt-4">
                <h3 className="text-sm font-semibold tracking-tight">{m.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.line}</p>
              </div>
            </motion.article>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease }}
            className="layer-card-raised flex flex-col justify-between p-6 sm:col-span-2 lg:col-span-3"
          >
            <div className="flex items-start gap-5">
              <Mark className="h-12 w-12 shrink-0" />
              <div>
                <p className="eyebrow">Life Score</p>
                <h3 className="mt-3 max-w-xl text-display text-xl leading-snug sm:text-2xl">
                  One number that tells the truth about your week — built from every module at once.
                </h3>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-orange px-4 py-2.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
              >
                Buy BEPACE
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/auth"
                className="text-[11px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </motion.div>
        </div>
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

function Mark({ className }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="BEPACE logo"
      className={`rounded-full object-contain invert ${className ?? ""}`}
    />
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Life OS" },
      {
        name: "description",
        content:
          "Sign in to Life OS, your personal command center for goals, habits, calendar, notes, travel and journal.",
      },
      { property: "og:title", content: "Sign in — Life OS" },
      {
        property: "og:description",
        content: "Enter your personal command center.",
      },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "reset";

function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.09_0_0)] p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-hairline bg-[oklch(0.125_0_0)] shadow-[0_60px_120px_-60px_oklch(0_0_0/1)] lg:grid-cols-[1.05fr_0.95fr]"
      >
        {/* Left — identity & concept */}
        <div className="relative flex min-h-[420px] flex-col justify-between p-8 sm:p-12">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-orange text-sm font-bold text-black">
              L
            </span>
            <span className="text-sm font-semibold tracking-[0.18em] uppercase">Life OS</span>
          </div>

          <div className="py-14">
            <p className="eyebrow">Personal operating system</p>
            <h1 className="mt-4 text-display text-4xl leading-[1.05] sm:text-5xl">
              Your life,
              <br />
              in one calm
              <br />
              command center.
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Goals, habits, calendar, notes, travel and journal — connected into a single view of
              where you are and where you're going.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            <span>Clarity</span>
            <span>Control</span>
            <span>Evolution</span>
          </div>

          <span className="pointer-events-none absolute top-1/2 -right-px hidden h-40 w-px -translate-y-1/2 bg-linear-to-b from-transparent via-border to-transparent lg:block" />
        </div>

        {/* Right — authentication panel, its own matte-black card */}
        <div className="p-4 sm:p-6 lg:py-10 lg:pr-10 lg:pl-0">
          <div className="h-full rounded-[2rem] border border-border bg-[oklch(0.165_0_0)] p-8 shadow-[inset_0_1px_0_0_oklch(1_0_0/0.05),0_40px_80px_-50px_oklch(0_0_0/1)] sm:p-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Reset password"}
              </h2>
              <span className="text-[11px] text-muted-foreground">
                {mode === "signup" ? "Free to start" : "Welcome back"}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {mode === "reset"
                ? "We'll send a recovery link to your email."
                : "Continue to your personal command center."}
            </p>

            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {mode === "signup" ? (
                <Field label="Full name" type="text" placeholder="Your name" />
              ) : null}
              <Field label="Email" type="email" placeholder="you@email.com" />
              {mode !== "reset" ? (
                <Field label="Password" type="password" placeholder="••••••••" />
              ) : null}

              {mode === "signin" ? (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <input type="checkbox" className="accent-[oklch(0.685_0.212_41.5)]" />
                    Keep me signed in
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode("reset")}
                    className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Forgot password?
                  </button>
                </div>
              ) : null}

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-orange py-3 text-xs font-semibold text-black transition-opacity hover:opacity-90"
              >
                {mode === "signin"
                  ? "Enter Life OS"
                  : mode === "signup"
                    ? "Create my account"
                    : "Send recovery link"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {mode !== "reset" ? (
              <>
                <div className="my-7 flex items-center gap-4">
                  <span className="h-px flex-1 bg-hairline" />
                  <span className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    or
                  </span>
                  <span className="h-px flex-1 bg-hairline" />
                </div>

                <button className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-[oklch(0.2_0_0)] py-3 text-xs font-medium transition-colors hover:border-foreground/25">
                  <GoogleMark />
                  Continue with Google
                </button>
              </>
            ) : null}

            <p className="mt-8 text-center text-[11px] text-muted-foreground">
              {mode === "signin" ? (
                <>
                  New here?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("signin")}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>

            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              <Link to="/" className="underline-offset-4 hover:underline">
                Preview the dashboard
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
}: {
  label: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-[oklch(0.135_0_0)] px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent-orange/60"
      />
    </label>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.24 1.4-1.66 4.1-5.4 4.1A6.2 6.2 0 1 1 16.1 7.5l2.7-2.6A9.9 9.9 0 1 0 12 22c5.7 0 9.5-4 9.5-9.6 0-.7-.08-1.3-.2-2.2H12Z"
      />
    </svg>
  );
}

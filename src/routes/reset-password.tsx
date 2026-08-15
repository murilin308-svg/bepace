import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import logo from "@/assets/life-os-logo.jpg.asset.json";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "New password — Life OS" },
      {
        name: "description",
        content: "Set a new password for your Life OS account and get back to your command center.",
      },
      { property: "og:title", content: "New password — Life OS" },
      { property: "og:description", content: "Set a new password for your Life OS account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.09_0_0)] p-4">
      <div className="w-full max-w-sm rounded-[2rem] border border-border bg-[oklch(0.165_0_0)] p-8 sm:p-10">
        <img
          src={logo.url}
          alt="Life OS logo"
          className="h-9 w-9 rounded-full object-contain invert"
        />
        <h1 className="mt-6 text-lg font-semibold tracking-tight">Set a new password</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Choose a new password to finish recovering your account.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="eyebrow">New password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-border bg-[oklch(0.135_0_0)] px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent-orange/60"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-[11px] text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-orange py-3 text-xs font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                Save new password
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

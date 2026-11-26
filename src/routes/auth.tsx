import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login — BEPACE" },
      {
        name: "description",
        content:
          "Entre no BEPACE e organize sua agenda, orações, estudos e objetivos.",
      },
      { property: "og:title", content: "Login — BEPACE" },
      { property: "og:description", content: "Entre no BEPACE para acompanhar seu dia e seus objetivos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "reset";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard", replace: true });
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/dashboard", replace: true });
          return;
        }
        setMessage({
          kind: "info",
          text: "Conta criada. Confirme o e-mail que enviamos para entrar no BEPACE.",
        });
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMessage({ kind: "info", text: "Enviamos um link de recuperação para o seu e-mail." });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "Não foi possível concluir. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setMessage(null);
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      setMessage({ kind: "error", text: "Não foi possível entrar com o Google." });
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  function changeMode(next: Mode) {
    setMode(next);
    setMessage(null);
    setShowPassword(false);
  }

  return (
    <main className="auth-stage bg-background text-foreground">
      <div className="auth-layout">
        <section className="auth-identity" aria-label="BEPACE">
          <span className="text-lg font-semibold">BEPACE</span>
          <div className="auth-emblem" aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
              <g stroke="currentColor" strokeWidth="6" strokeLinecap="square">
                <path d="M100 8v57M100 135v57M8 100h57M135 100h57" />
                <path d="m54 54 31 31m30 30 31 31m0-92-31 31m-30 30-31 31" />
              </g>
            </svg>
          </div>
          <span className="text-[10px] text-muted-foreground">© BEPACE. Todos os direitos reservados.</span>
        </section>

        <section className="auth-panel bg-surface-1" aria-labelledby="login-title">
          <Button
            type="button"
            variant="link"
            className="auth-mode-link h-auto p-0 text-[11px] font-normal text-muted-foreground"
            onClick={() => changeMode(mode === "signin" ? "signup" : "signin")}
            disabled={loading}
          >
            {mode === "signin" ? "Criar uma conta" : "Voltar ao login"}
          </Button>

          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <h1 id="login-title" className="mb-9 text-5xl font-normal leading-tight">
                {mode === "signin" ? "Login" : mode === "signup" ? "Criar conta" : "Recuperar senha"}
              </h1>
              <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
                {mode === "signup" ? (
                  <div className="sm:col-span-2">
                    <Field label="Nome completo" type="text" placeholder="Seu nome" value={fullName} onChange={setFullName} autoComplete="name" required />
                  </div>
                ) : null}
                <div className={mode === "reset" ? "sm:col-span-2" : ""}>
                  <Field label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={setEmail} autoComplete="email" required />
                </div>
                {mode !== "reset" ? (
                  <div>
                    <div className="relative">
                      <Field label="Senha" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={setPassword} autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
                      <Button type="button" variant="ghost" size="icon-sm" className="absolute right-0 bottom-1 h-7 w-7 text-muted-foreground hover:bg-transparent hover:text-foreground" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} title={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                    {mode === "signin" ? (
                      <Button type="button" variant="link" disabled={loading} onClick={() => changeMode("reset")} className="mt-2 h-auto p-0 text-[10px] font-normal text-muted-foreground">Esqueceu a senha?</Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
              {message ? (
                <p role={message.kind === "error" ? "alert" : "status"} className={`mt-6 text-xs leading-relaxed ${message.kind === "error" ? "text-destructive" : "text-muted-foreground"}`}>
                  {message.text}
                </p>
              ) : null}
            </div>

            <div className="auth-actions">
              {mode !== "reset" ? (
                <Button type="button" variant="ghost" onClick={handleGoogle} disabled={loading} className="h-auto justify-start px-0 py-3 text-[11px] font-normal text-muted-foreground hover:bg-transparent hover:text-foreground">
                  <GoogleMark /> Continuar com Google
                </Button>
              ) : <span />}
              <Button type="submit" disabled={loading} className="auth-submit rounded-full bg-primary text-primary-foreground hover:bg-primary/90" aria-label={mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link de recuperação"}>
                {loading ? <Loader2 className="animate-spin" /> : <span>{mode === "signin" ? "ENTRAR" : mode === "signup" ? "CRIAR" : "ENVIAR"}</span>}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({
  label, type, placeholder, value, onChange, autoComplete, required,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-medium text-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full min-w-0 rounded-none border-0 border-b border-foreground/40 bg-transparent py-2 pr-8 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground"
      />
    </label>
  );
}

function GoogleMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor"><path d="M12 10.2v3.9h5.4c-.24 1.4-1.66 4.1-5.4 4.1A6.2 6.2 0 1 1 16.1 7.5l2.7-2.6A9.9 9.9 0 1 0 12 22c5.7 0 9.5-4 9.5-9.6 0-.7-.08-1.3-.2-2.2H12Z" /></svg>;
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/life/app-shell";
import { PageHeader, Panel, PanelHead, Tag } from "@/components/life/primitives";
import { EditText, FieldLabel } from "@/components/life/editable";
import { useProfile, useUpdateProfile } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Configurações — BEPACE" },
      {
        name: "description",
        content: "Perfil, preferências, integrações, notificações, tema e segurança do BEPACE.",
      },
      { property: "og:title", content: "Configurações — BEPACE" },
      { property: "og:description", content: "Perfil, preferências, integrações e segurança." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const sections = [
  "Perfil",
  "Preferências",
  "Integrações",
  "Notificações",
  "Tema",
  "Segurança",
] as const;

function Row({
  title,
  hint,
  control,
}: {
  title: string;
  hint?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-hairline px-6 py-4">
      <div className="min-w-0">
        <p className="truncate text-sm">{title}</p>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function Toggle({ on }: { on?: boolean }) {
  const [value, setValue] = useState(!!on);
  return (
    <button
      onClick={() => setValue((v) => !v)}
      aria-pressed={value}
      className={cn(
        "relative h-6 w-11 rounded-full border transition-colors",
        value ? "border-accent-orange bg-accent-orange" : "border-border bg-surface-3",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 rounded-full transition-all",
          value ? "left-[22px] bg-black" : "left-0.5 bg-foreground/70",
        )}
        style={{ height: 18, width: 18 }}
      />
    </button>
  );
}

function SettingsPage() {
  const [section, setSection] = useState<(typeof sections)[number]>("Perfil");
  const [theme, setTheme] = useState("Escuro");
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();

  const save = (key: string, value: string) => updateProfile.mutate({ [key]: value });

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da sua conta.");
    void navigate({ to: "/auth" });
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Configurações"
        title="Como o sistema se comporta"
        description="O escuro é a experiência principal do BEPACE. Todo o resto é opcional."
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-3">
          <nav className="p-4">
            <ul className="space-y-0.5">
              {sections.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => setSection(s)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      section === s
                        ? "bg-surface-2 text-foreground"
                        : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
                    )}
                  >
                    <span>{s}</span>
                    {section === s ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-orange" />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </Panel>

        <div className="space-y-4 lg:col-span-9">
          <Panel raised delay={0.05}>
            <PanelHead title={section} hint="Apenas o que importa aqui" />

            {section === "Perfil" ? (
              <div className="space-y-4 border-t border-hairline px-6 py-5">
                <div>
                  <FieldLabel>Nome completo</FieldLabel>
                  <EditText
                    value={profile?.full_name ?? ""}
                    placeholder="Seu nome"
                    className="text-sm"
                    onCommit={(v) => save("full_name", v)}
                  />
                </div>
                <div>
                  <FieldLabel>Nome de usuário</FieldLabel>
                  <EditText
                    value={profile?.handle ?? ""}
                    placeholder="@seuusuario"
                    className="text-sm"
                    onCommit={(v) => save("handle", v)}
                  />
                </div>
                <div>
                  <FieldLabel>Fuso horário</FieldLabel>
                  <EditText
                    value={profile?.timezone ?? ""}
                    placeholder="America/Sao_Paulo"
                    className="text-sm"
                    onCommit={(v) => save("timezone", v)}
                  />
                </div>
                <div>
                  <FieldLabel>E-mail</FieldLabel>
                  <p className="text-sm text-muted-foreground">{profile?.email ?? "—"}</p>
                </div>
              </div>
            ) : null}

            {section === "Preferências" ? (
              <>
                <Row title="Semana começa em" hint="Segunda-feira" control={<Tag>Segunda</Tag>} />
                <Row title="Formato de data" hint="DD/MM/AAAA" control={<Tag>Brasil</Tag>} />
                <Row title="Moeda" hint="Real brasileiro" control={<Tag accent>R$</Tag>} />
                <Row title="Idioma" hint="Português do Brasil" control={<Tag>PT-BR</Tag>} />
              </>
            ) : null}

            {section === "Integrações" ? (
              <>
                <Row
                  title="Google Calendar"
                  hint="Precisa das suas credenciais do Google para conectar"
                  control={<Tag>Pendente</Tag>}
                />
                <Row title="Outlook / Teams" hint="Precisa das credenciais da Microsoft" control={<Tag>Pendente</Tag>} />
                <Row title="WhatsApp" hint="Precisa de acesso à API oficial do WhatsApp" control={<Tag>Pendente</Tag>} />
                <Row title="Notícias" hint="Precisa de uma chave de serviço de notícias" control={<Tag>Pendente</Tag>} />
              </>
            ) : null}

            {section === "Notificações" ? (
              <>
                <Row title="Lembrete diário" hint="21:00" control={<Toggle on />} />
                <Row title="Avisos de treino" control={<Toggle on />} />
                <Row title="Revisão semanal" hint="Domingo pela manhã" control={<Toggle on />} />
                <Row title="Resumos por e-mail" control={<Toggle />} />
              </>
            ) : null}

            {section === "Tema" ? (
              <>
                <div className="border-t border-hairline px-6 py-5">
                  <p className="text-sm">Aparência</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {["Escuro", "Claro", "Sistema"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          "rounded-xl border p-4 text-left transition-colors",
                          theme === t
                            ? "border-accent-orange/40 bg-accent-orange/8"
                            : "border-hairline bg-surface-2 hover:border-border",
                        )}
                      >
                        <span
                          className={cn(
                            "block h-14 rounded-lg border border-border",
                            t === "Claro" ? "bg-[oklch(0.95_0_0)]" : "bg-[oklch(0.145_0_0)]",
                          )}
                        />
                        <span className="mt-3 block text-xs font-medium">{t}</span>
                        {t === "Escuro" ? (
                          <span className="mt-1 block text-[11px] text-muted-foreground">
                            Recomendado
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
                <Row title="Menos animações" hint="Transições mais discretas" control={<Toggle />} />
                <Row title="Modo compacto" hint="Cards e espaçamentos menores" control={<Toggle />} />
                <Row title="Cor de destaque" hint="Laranja, usado com parcimônia" control={<Tag accent>Laranja</Tag>} />
              </>
            ) : null}

            {section === "Segurança" ? (
              <>
                <Row
                  title="Alterar senha"
                  hint="Enviamos um link para o seu e-mail"
                  control={
                    <button
                      onClick={async () => {
                        if (!profile?.email) return;
                        const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
                          redirectTo: `${window.location.origin}/reset-password`,
                        });
                        if (error) toast.error(error.message);
                        else toast.success("Link de redefinição enviado.");
                      }}
                      className="rounded-lg border border-hairline bg-surface-2 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Enviar link
                    </button>
                  }
                />
                <Row
                  title="Sair da conta"
                  hint="Encerra a sessão neste dispositivo"
                  control={
                    <button
                      onClick={() => void signOut()}
                      className="rounded-lg border border-hairline bg-surface-2 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Sair
                    </button>
                  }
                />
                <Row title="Diário privado" hint="Fora de qualquer resumo" control={<Toggle on />} />
              </>
            ) : null}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

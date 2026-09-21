import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { AppShell } from "@/components/life/app-shell";
import { PageHeader } from "@/components/life/primitives";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import logo from "@/assets/life-os-logo.jpg.asset.json";

export const Route = createFileRoute("/_authenticated/assistente")({
  head: () => ({
    meta: [
      { title: "Assistente IA — BEPACE" },
      {
        name: "description",
        content: "Converse com a inteligência do BEPACE e organize sua vida por texto.",
      },
      { property: "og:title", content: "Assistente IA — BEPACE" },
      { property: "og:description", content: "Converse com a inteligência do BEPACE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistentePage,
});

const STORAGE_KEY = "bepace.assistant.messages";

const SUGGESTIONS = [
  "Monte minha semana de treinos",
  "Como organizo meus estudos em 3 meses?",
  "Onde registro minhas metas de patrimônio?",
  "Sugira uma rotina de oração diária",
];

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as UIMessage[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function AssistentePage() {
  const [initial] = useState<UIMessage[]>(() => loadMessages());
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "bepace-assistant",
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error: Error) => toast.error(error.message),
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* armazenamento cheio: ignora */
    }
  }, [messages]);

  useEffect(() => {
    if (status === "ready") textareaRef.current?.focus();
  }, [status]);

  const busy = status === "submitted" || status === "streaming";

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    void sendMessage({ text: value });
  };

  const reset = () => {
    setMessages([]);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Inteligência"
        title="Assistente IA"
        description="Converse em linguagem natural para planejar, organizar e decidir com clareza."
        action={
          messages.length > 0 ? (
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface-2 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" /> Nova conversa
            </button>
          ) : undefined
        }
      />

      <div className="layer-card flex h-[calc(100vh-18rem)] min-h-[520px] flex-col overflow-hidden">
        <Conversation className="flex-1">
          <ConversationContent className="px-5 py-6">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={
                  <img
                    src={logo.url}
                    alt="BEPACE"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                }
                title="No que vamos avançar hoje?"
                description="Pergunte sobre treinos, estudos, finanças, oração ou seus objetivos."
              >
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-hairline bg-surface-2/60 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-accent-orange/40 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </ConversationEmptyState>
            ) : (
              messages.map((m) => (
                <Message from={m.role} key={m.id}>
                  <MessageContent>
                    {m.parts.map((part, i) =>
                      part.type === "text" ? (
                        <MessageResponse key={i}>{part.text}</MessageResponse>
                      ) : null,
                    )}
                  </MessageContent>
                </Message>
              ))
            )}

            {status === "submitted" ? (
              <div className="px-1 py-2">
                <Shimmer>Pensando…</Shimmer>
              </div>
            ) : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-hairline p-4">
          <PromptInput
            onSubmit={(message, event) => {
              event.preventDefault();
              send(message.text ?? "");
            }}
          >
            <PromptInputTextarea
              ref={textareaRef}
              autoFocus
              placeholder="Escreva para o BEPACE…"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={busy} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </AppShell>
  );
}

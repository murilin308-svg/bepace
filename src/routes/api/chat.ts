import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `Você é o assistente do BEPACE, um sistema operacional pessoal em português do Brasil.
O BEPACE organiza a vida do usuário em módulos: Calendário, Oração, Alimentação, Treinos, Estudos,
Notícias, Visão de Futuro, Lista de Compras, Experiências, Investimentos e Cartões.

Seu papel: ajudar o usuário a planejar, organizar e evoluir em alta performance —
saúde, produtividade, finanças, estudos, espiritualidade e objetivos.

Como responder:
- Sempre em português do Brasil, com tom calmo, direto e premium.
- Respostas curtas e acionáveis: no máximo 5 tópicos por resposta.
- Quando o usuário pedir algo que vive em um módulo, diga exatamente em qual tela do BEPACE registrar.
- Você ainda não escreve no banco de dados do usuário; oriente o registro em vez de prometer que salvou.
- Nunca invente dados do usuário que ele não tenha informado.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response(
            JSON.stringify({ error: "O assistente não está configurado." }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }

        const body = (await request.json()) as { messages?: UIMessage[] };
        const messages = body.messages ?? [];

        const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: {
            "Lovable-API-Key": key,
            "X-Lovable-AIG-SDK": "vercel-ai-sdk",
          },
          fetch: runIdFetch.fetch,
        });

        const result = streamText({
          model: lovable.responses("openai/gpt-6-astra"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});

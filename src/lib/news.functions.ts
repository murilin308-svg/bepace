import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  date: string | null;
  link: string;
  description: string | null;
  image: string | null;
};

const TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { at: number; items: NewsArticle[] }>();

export const getNews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ category: z.string().max(30).optional(), q: z.string().max(80).optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const key = `${data.category ?? ""}|${(data.q ?? "").toLowerCase()}`;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) return { items: hit.items, error: null as string | null };

    const apiKey = process.env["NEWSDATA_API_KEY"];
    if (!apiKey) return { items: [], error: "Chave de notícias não configurada." };

    const url = new URL("https://newsdata.io/api/1/latest");
    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("language", "pt");
    if (data.category) url.searchParams.set("category", data.category);
    if (data.q) url.searchParams.set("q", data.q);

    try {
      const res = await fetch(url);
      const json = (await res.json()) as {
        status?: string;
        results?: Array<Record<string, unknown>>;
      };
      if (!res.ok || json.status !== "success") {
        console.error("NewsData error", res.status, json);
        return { items: hit?.items ?? [], error: "Não foi possível carregar as notícias agora." };
      }
      const seen = new Set<string>();
      const items: NewsArticle[] = (json.results ?? [])
        .map((r) => ({
          id: String(r["article_id"] ?? r["link"] ?? ""),
          title: String(r["title"] ?? "").trim(),
          source: String(r["source_name"] ?? r["source_id"] ?? "—"),
          date: r["pubDate"] ? String(r["pubDate"]) : null,
          link: String(r["link"] ?? ""),
          description: r["description"] ? String(r["description"]).slice(0, 280) : null,
          image: r["image_url"] ? String(r["image_url"]) : null,
        }))
        .filter((a) => a.title && a.link && !seen.has(a.title) && seen.add(a.title));
      cache.set(key, { at: Date.now(), items });
      return { items, error: null as string | null };
    } catch (e) {
      console.error("NewsData fetch failed", e);
      return { items: hit?.items ?? [], error: "Não foi possível carregar as notícias agora." };
    }
  });

import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "BEPACE" },
      {
        name: "description",
        content: "BEPACE — seu sistema operacional pessoal. Entre para acessar seu painel.",
      },
      { property: "og:title", content: "BEPACE" },
      {
        property: "og:description",
        content: "Seu sistema operacional pessoal: oração, agenda, estudos, finanças e evolução.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
    throw redirect({ to: "/auth" });
  },
  component: () => null,
});

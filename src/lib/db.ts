import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type TableName =
  | "goals"
  | "habits"
  | "habit_logs"
  | "notes"
  | "events"
  | "journal_entries"
  | "trips"
  | "knowledge_items"
  | "prayers"
  | "prayer_requests"
  | "meals"
  | "body_logs"
  | "workouts"
  | "study_plans"
  | "news_topics"
  | "saved_news"
  | "vision_items"
  | "shopping_items"
  | "experiences"
  | "investments"
  | "cards"
  | "card_expenses";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

const client = supabase as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: (table: string) => any;
};

export async function currentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Not authenticated");
  return data.user.id;
}

export function useCollection<T = Row>(
  table: TableName,
  order: { column: string; ascending?: boolean } = { column: "created_at", ascending: false },
) {
  return useQuery({
    queryKey: [table],
    queryFn: async (): Promise<T[]> => {
      const { data, error } = await client
        .from(table)
        .select("*")
        .order(order.column, { ascending: order.ascending ?? false });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

function useInvalidate(table: TableName) {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: [table] });
    void qc.invalidateQueries({ queryKey: ["habit_logs"] });
  };
}

export function useCreate(table: TableName) {
  const invalidate = useInvalidate(table);
  return useMutation({
    mutationFn: async (values: Row) => {
      const user_id = await currentUserId();
      const { data, error } = await client
        .from(table)
        .insert({ ...values, user_id })
        .select()
        .single();
      if (error) throw error;
      return data as Row;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdate(table: TableName) {
  const invalidate = useInvalidate(table);
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Row }) => {
      const { error } = await client.from(table).update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRemove(table: TableName) {
  const invalidate = useInvalidate(table);
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await client.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });
}

/* ---------------- profile ---------------- */

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  handle: string | null;
  timezone: string | null;
  onboarding_status: string;
  created_at: string;
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<(Profile & { email?: string | undefined }) | null> => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("id", auth.user.id)
        .maybeSingle();
      if (error) throw error;
      const base =
        (data as Profile | null) ??
        ({
          id: auth.user.id,
          full_name: null,
          avatar_url: null,
          handle: null,
          timezone: null,
          onboarding_status: "pending",
          created_at: auth.user.created_at,
        } as Profile);
      return { ...base, email: auth.user.email ?? undefined };
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Row) => {
      const id = await currentUserId();
      const { error } = await client
        .from("profiles")
        .upsert({ id, ...values }, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["profile"] }),
    onError: (e: Error) => toast.error(e.message),
  });
}

/* ---------------- habit logs ---------------- */

export type HabitLog = { id: string; habit_id: string; log_date: string };

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function useHabitLogs() {
  return useQuery({
    queryKey: ["habit_logs"],
    queryFn: async (): Promise<HabitLog[]> => {
      const since = new Date();
      since.setDate(since.getDate() - 60);
      const { data, error } = await client
        .from("habit_logs")
        .select("*")
        .gte("log_date", since.toISOString().slice(0, 10));
      if (error) throw error;
      return (data ?? []) as HabitLog[];
    },
  });
}

export function useToggleHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      done,
    }: {
      habitId: string;
      date: string;
      done: boolean;
    }) => {
      const user_id = await currentUserId();
      if (done) {
        const { error } = await client
          .from("habit_logs")
          .delete()
          .eq("habit_id", habitId)
          .eq("log_date", date);
        if (error) throw error;
      } else {
        const { error } = await client
          .from("habit_logs")
          .insert({ habit_id: habitId, log_date: date, user_id });
        if (error) throw error;
      }
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["habit_logs"] }),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function lastDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function habitStats(habitId: string, logs: HabitLog[]) {
  const dates = new Set(logs.filter((l) => l.habit_id === habitId).map((l) => l.log_date));
  const window14 = lastDays(14).map((d) => dates.has(d));
  const window30 = lastDays(30).map((d) => dates.has(d));
  const consistency = Math.round((window30.filter(Boolean).length / 30) * 100);
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    if (dates.has(iso)) streak++;
    else if (i > 0) break;
  }
  return {
    doneToday: dates.has(todayISO()),
    last14: window14,
    consistency,
    streak,
    total: dates.size,
  };
}

/* ---------------- example data ---------------- */

export function useSeedExamples() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const user_id = await currentUserId();
      await client.from("goals").insert([
        {
          user_id,
          title: "Correr 10K abaixo de 50min",
          description: "Quatro sessões por semana e um longão.",
          area: "Health",
          priority: "High",
          due: "Dez 2026",
          progress: 40,
          status: "On track",
          vision: "Um corpo confiável pelos próximos 40 anos",
          tasks: [
            { title: "Bloco de base", done: true },
            { title: "Bloco de limiar", done: false },
          ],
        },
        {
          user_id,
          title: "12 meses de reserva",
          description: "Automatizar aportes e revisar a carteira por trimestre.",
          area: "Finance",
          priority: "Medium",
          due: "Dez 2026",
          progress: 25,
          status: "On track",
          vision: "Liberdade de escolha",
          tasks: [{ title: "Automatizar transferência", done: false }],
        },
      ]);
      const { data: habits } = await client
        .from("habits")
        .insert([
          { user_id, name: "Exercício", area: "Health" },
          { user_id, name: "Leitura", area: "Knowledge" },
          { user_id, name: "Dormir 7h+", area: "Health" },
        ])
        .select();
      if (habits?.length) {
        const logs: Row[] = [];
        for (const h of habits as Row[]) {
          for (const d of lastDays(6)) logs.push({ user_id, habit_id: h['id'], log_date: d });
        }
        await client.from("habit_logs").insert(logs);
      }
      await client.from("notes").insert([
        {
          user_id,
          title: "Primeiros princípios",
          folder: "Ideas",
          tags: ["sistema"],
          favorite: true,
          body: "O valor não está nos módulos, está nas conexões entre eles.",
        },
      ]);
      await client.from("events").insert([
        { user_id, title: "Treino", day: 0, start_hour: 7, end_hour: 8, category: "Health" },
        { user_id, title: "Deep work", day: 0, start_hour: 9, end_hour: 12, category: "Work" },
        { user_id, title: "Planejamento semanal", day: 2, start_hour: 8, end_hour: 9, category: "Personal" },
      ]);
      await client.from("journal_entries").insert([
        {
          user_id,
          entry_date: todayISO(),
          mood: "Good",
          energy: 4,
          highlight: "Comecei a usar o BEPACE de verdade.",
          gratitude: "Uma manhã tranquila.",
          learning: "Sistema simples é sistema usado.",
        },
      ]);
      await client.from("trips").insert([
        {
          user_id,
          country: "Portugal",
          code: "PT",
          status: "Planned",
          cities: ["Lisboa"],
          dates: "Set 2026",
          rating: 0,
          memory: "Duas semanas trabalhando de Lisboa.",
        },
      ]);
      await client.from("knowledge_items").insert([
        {
          user_id,
          title: "Escrever para decidir",
          type: "Idea",
          collection: "Personal",
          tags: ["escrita"],
          note: "Se a decisão não cabe em um parágrafo, ela ainda não foi entendida.",
        },
      ]);
    },
    onSuccess: () => {
      void qc.invalidateQueries();
      toast.success("Exemplos adicionados — edite ou apague à vontade");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  CalendarDays,
  CreditCard,
  Dumbbell,
  Gauge,
  GraduationCap,
  HandHeart,
  Landmark,
  Newspaper,
  PanelLeft,
  Salad,
  Search,
  Settings2,
  ShoppingCart,
  Sparkles,
  Stars,
  Telescope,
  User,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/db";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/calendar", label: "Calendário", icon: CalendarDays },
  { to: "/oracao", label: "Oração", icon: HandHeart },
  { to: "/alimentacao", label: "Alimentação", icon: Salad },
  { to: "/treinos", label: "Treinos", icon: Dumbbell },
  { to: "/estudos", label: "Estudos", icon: GraduationCap },
  { to: "/noticias", label: "Notícias", icon: Newspaper },
  { to: "/visao", label: "Visão de Futuro", icon: Telescope },
  { to: "/compras", label: "Lista de Compras", icon: ShoppingCart },
  { to: "/experiencias", label: "Experiências", icon: Stars },
  { to: "/investimentos", label: "Investimentos", icon: Landmark },
  { to: "/cartoes", label: "Cartões", icon: CreditCard },
  { to: "/assistente", label: "Assistente IA", icon: Bot },
] as const;

const secondary = [
  { to: "/profile", label: "Perfil", icon: User },
  { to: "/settings", label: "Configurações", icon: Settings2 },
] as const;


function NavList({
  items,
  collapsed,
  pathname,
  onNavigate,
}: {
  items: readonly { to: string; label: string; icon: typeof Gauge }[];
  collapsed: boolean;
  pathname: string;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-surface-2 text-foreground"
                  : "text-muted-foreground hover:bg-surface-1 hover:text-foreground",
              )}
            >
              {active ? (
                <span className="absolute top-1/2 left-0 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent-orange" />
              ) : null}
              <item.icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.6} />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarBody({
  collapsed,
  pathname,
  onNavigate,
}: {
  collapsed: boolean;
  pathname: string;
  onNavigate?: (() => void) | undefined;
}) {
  const { data: profile } = useProfile();
  const name = profile?.full_name || profile?.email || "Sua conta";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-3 px-5 pt-6 pb-7", collapsed && "px-4")}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-orange text-[13px] font-bold text-black">
          B
        </span>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">BEPACE</p>
            <p className="truncate text-[11px] text-muted-foreground">
              Organização em um só lugar
            </p>
          </div>
        ) : null}
      </div>

      <nav className={cn("flex-1 overflow-y-auto px-3", collapsed && "px-2")}>
        {!collapsed ? <p className="eyebrow px-3 pb-2">Módulos</p> : null}
        <NavList items={nav} collapsed={collapsed} pathname={pathname} onNavigate={onNavigate} />
        <div className="my-5 h-px bg-hairline" />
        {!collapsed ? <p className="eyebrow px-3 pb-2">Você</p> : null}
        <NavList items={secondary} collapsed={collapsed} pathname={pathname} onNavigate={onNavigate} />
      </nav>

      <div className={cn("border-t border-hairline p-3", collapsed && "p-2")}>
        <Link
          to="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-1"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-3 text-[11px] font-semibold">
            {initials || "•"}
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium">{name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">Índice BEPACE</span>
            </span>
          ) : null}
        </Link>
      </div>
    </div>
  );
}



export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen w-full bg-surface-0">
      {/* Desktop sidebar — integrated, not floating on top */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 252 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 hidden h-screen shrink-0 border-r border-hairline bg-sidebar lg:block"
      >
        <SidebarBody collapsed={collapsed} pathname={pathname} />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[264px] border-r border-hairline bg-sidebar lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="absolute top-5 right-4 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarBody
                collapsed={false}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-hairline bg-surface-0/85 px-4 py-3 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground lg:hidden"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
              className="hidden h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground lg:grid"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>

          <button className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-hairline bg-surface-1 px-3 py-2 text-left transition-colors hover:border-border sm:max-w-sm">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-xs text-muted-foreground">
              Buscar em tudo
            </span>
            <span className="ml-auto hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
              ⌘K
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-hairline bg-surface-1 px-3 py-1.5 text-[11px] text-muted-foreground sm:flex">
              <Sparkles className="h-3 w-3 text-accent-orange" />
              Semana em ritmo
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

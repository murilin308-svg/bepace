import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  CalendarDays,
  Compass,
  Gauge,
  Globe2,
  NotebookPen,
  PanelLeft,
  Repeat2,
  Search,
  Settings2,
  Sparkles,
  Target,
  User,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { user } from "@/lib/life-os";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/notes", label: "Notes", icon: NotebookPen },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/habits", label: "Habits", icon: Repeat2 },
  { to: "/travel", label: "Travel", icon: Globe2 },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/knowledge", label: "Knowledge", icon: Compass },
] as const;

const secondary = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings2 },
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
  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-3 px-5 pt-6 pb-7", collapsed && "px-4")}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-orange text-[13px] font-bold text-black">
          L
        </span>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">Life OS</p>
            <p className="truncate text-[11px] text-muted-foreground">Personal command center</p>
          </div>
        ) : null}
      </div>

      <nav className={cn("flex-1 overflow-y-auto px-3", collapsed && "px-2")}>
        {!collapsed ? <p className="eyebrow px-3 pb-2">Life</p> : null}
        <NavList items={nav} collapsed={collapsed} pathname={pathname} onNavigate={onNavigate} />
        <div className="my-5 h-px bg-hairline" />
        {!collapsed ? <p className="eyebrow px-3 pb-2">You</p> : null}
        <NavList items={secondary} collapsed={collapsed} pathname={pathname} onNavigate={onNavigate} />
      </nav>

      <div className={cn("border-t border-hairline p-3", collapsed && "p-2")}>
        <Link
          to="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-1"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-3 text-[11px] font-semibold">
            {user.initials}
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium">{user.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                Life Score 78
              </span>
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
              Search everything
            </span>
            <span className="ml-auto hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
              ⌘K
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-hairline bg-surface-1 px-3 py-1.5 text-[11px] text-muted-foreground sm:flex">
              <Sparkles className="h-3 w-3 text-accent-orange" />
              Week 33 · on track
            </span>
            <Link
              to="/auth"
              className="rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              Sign in
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

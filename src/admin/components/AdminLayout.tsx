import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, FolderOpen, Home, Wrench, Briefcase, FileText, Quote,
  Users, BriefcaseBusiness, Inbox, Settings, Bell, Menu, X, LogOut,
  ChevronDown, Image,
} from "lucide-react";
import { useAuth } from "../lib/auth";

type NavItem = { label: string; href: string; icon: typeof Home; soon?: boolean };
type NavGroup = { label: string; icon: typeof FolderOpen; items: NavItem[] };
type NavEntry = NavItem | NavGroup;

const isGroup = (e: NavEntry): e is NavGroup => "items" in e;

/** Mirrors the agreed sidebar tree. `soon` = module not built yet. */
const NAV: NavEntry[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Content",
    icon: FolderOpen,
    items: [
      { label: "Home Page", href: "/admin/home", icon: Home },
      { label: "Services", href: "/admin/services", icon: Wrench },
      { label: "Portfolio", href: "/admin/projects", icon: Briefcase },
      { label: "Blog", href: "/admin/posts", icon: FileText },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "Careers", href: "/admin/jobs", icon: BriefcaseBusiness },
    ],
  },
  { label: "Media", href: "/admin/media", icon: Image },
  {
    label: "Leads",
    icon: Inbox,
    items: [{ label: "Contact Submissions", href: "/admin/leads", icon: Inbox }],
  },
  {
    label: "Settings",
    icon: Settings,
    items: [
      { label: "General", href: "/admin/settings/general", icon: Settings },
      { label: "Menus", href: "/admin/settings/menus", icon: Menu },
      { label: "Email/SMTP", href: "/admin/settings/email", icon: Inbox },
      { label: "Backup", href: "/admin/settings/backup", icon: FolderOpen },
    ],
  },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
];

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const [location] = useLocation();
  const active = location === item.href;
  const Icon = item.icon;

  if (item.soon) {
    return (
      <span
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground/50 cursor-not-allowed"
        title="Not built yet"
      >
        <Icon size={16} />
        {item.label}
        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground/70">
          soon
        </span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-primary/15 text-primary font-semibold"
          : "text-foreground/70 hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon size={16} />
      {item.label}
    </Link>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState<Record<string, boolean>>({
    Content: true,
    Leads: true,
    Settings: false,
  });

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-border shrink-0">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-black text-xs">
          TG
        </div>
        <span className="font-display font-bold">Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map((entry) =>
          isGroup(entry) ? (
            <div key={entry.label}>
              <button
                onClick={() => setOpen((o) => ({ ...o, [entry.label]: !o[entry.label] }))}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:bg-muted transition-colors"
              >
                <entry.icon size={16} />
                {entry.label}
                <ChevronDown
                  size={14}
                  className={`ml-auto transition-transform ${open[entry.label] ? "" : "-rotate-90"}`}
                />
              </button>
              {open[entry.label] && (
                <div className="ml-3 pl-3 border-l border-border space-y-0.5 mt-0.5">
                  {entry.items.map((i) => (
                    <NavLink key={i.label} item={i} onNavigate={onNavigate} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink key={entry.label} item={entry} onNavigate={onNavigate} />
          )
        )}
      </nav>

      <div className="p-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate">{user?.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[100dvh] sticky top-0">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6">
          <button
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-display font-bold text-lg truncate">{title}</h1>
          <div className="ml-auto flex items-center gap-2">{actions}</div>
        </header>

        {user?.role === "viewer" && (
          <div className="px-4 sm:px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
            Read-only account — changes are disabled.
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export { X };

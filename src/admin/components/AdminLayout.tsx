import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, FolderOpen, Wrench, Briefcase, FileText, Quote,
  Users, BriefcaseBusiness, Inbox, Settings, Bell, Menu, X, LogOut,
  ChevronDown, Image, Shield, RefreshCw, History, Search, Sun, Moon
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { useTheme } from "../../hooks/use-theme";
import { CommandPalette } from "./CommandPalette";

type NavItem = { label: string; href: string; icon: any; soon?: boolean; adminOnly?: boolean };
type NavGroup = { label: string; icon: any; items: NavItem[] };
type NavEntry = NavItem | NavGroup;

const isGroup = (e: NavEntry): e is NavGroup => "items" in e;

const NAV: NavEntry[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Content",
    icon: FolderOpen,
    items: [
      { label: "Services", href: "/admin/services", icon: Wrench },
      { label: "Case Studies", href: "/admin/projects", icon: Briefcase },
      { label: "Blog", href: "/admin/posts", icon: FileText },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "Careers", href: "/admin/jobs", icon: BriefcaseBusiness },
    ],
  },
  { label: "Media Library", href: "/admin/media", icon: Image },
  {
    label: "Leads",
    icon: Inbox,
    items: [{ label: "Contact Inquiries", href: "/admin/leads", icon: Inbox }],
  },
  {
    label: "Tools & SEO",
    icon: RefreshCw,
    items: [
      { label: "301 Redirects", href: "/admin/redirects", icon: RefreshCw },
      { label: "Users & Roles", href: "/admin/users", icon: Shield, adminOnly: true },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: History, adminOnly: true },
    ],
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
  const active =
    location === item.href ||
    (item.href !== "/admin" && location.startsWith(item.href)) ||
    (item.href === "/admin/projects" && (location.startsWith("/admin/case-studies") || location.startsWith("/admin/projects")));
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
    "Tools & SEO": true,
    Settings: false,
  });

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-black text-xs">
            TG
          </div>
          <span className="font-display font-bold">Admin Portal</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map((entry) => {
          if (isGroup(entry)) {
            // Filter admin-only items if current user is not admin
            const visibleItems = entry.items.filter((i) => !i.adminOnly || user?.role === "admin");
            if (visibleItems.length === 0) return null;

            return (
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
                    {visibleItems.map((i) => (
                      <NavLink key={i.label} item={i} onNavigate={onNavigate} />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (entry.adminOnly && user?.role !== "admin") return null;
          return <NavLink key={entry.label} item={entry} onNavigate={onNavigate} />;
        })}
      </nav>

      <div className="p-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() || "TG"}
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
  const [cmdOpen, setCmdOpen] = useState(false);
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex">
      {/* Global Command Palette */}
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />

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
        {/* Admin Navigation Header */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-display font-bold text-lg truncate">{title}</h1>
          </div>

          {/* Center search shortcut */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <button
              onClick={() => setCmdOpen(true)}
              className="w-full flex items-center justify-between h-9 px-3 rounded-lg border border-border bg-background/50 hover:bg-background hover:border-primary/50 text-xs text-muted-foreground transition-all"
            >
              <span className="flex items-center gap-2">
                <Search size={14} /> Quick jump or search...
              </span>
              <kbd className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right header actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme switcher */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Page specific action buttons */}
            {actions}
          </div>
        </header>

        {user?.role === "viewer" && (
          <div className="px-4 sm:px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
            Read-only account — modifications are restricted.
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export { X };

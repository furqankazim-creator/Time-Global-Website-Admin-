import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Command } from "cmdk";
import {
  LayoutDashboard, FolderOpen, Home, Wrench, Briefcase, FileText,
  Quote, Users, BriefcaseBusiness, Inbox, Settings, Bell, Image,
  Plus, Search, ArrowRight, Shield, RefreshCw, History, Sun, Moon
} from "lucide-react";
import { useTheme } from "../../hooks/use-theme";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [, setLocation] = useLocation();
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const run = (action: () => void) => {
    onOpenChange(false);
    action();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full">
          <div className="flex items-center px-4 border-b border-border bg-muted/20">
            <Search size={16} className="text-muted-foreground mr-2.5 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Search admin pages, create items, or run actions..."
              className="w-full h-12 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-6 text-center text-xs text-muted-foreground">
              No matching commands found.
            </Command.Empty>

            <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/posts/new"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
              >
                <Plus size={15} className="text-primary" />
                <span>Write new blog post</span>
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/projects/new"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
              >
                <Plus size={15} className="text-primary" />
                <span>Add new project case study</span>
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/services/new"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
              >
                <Plus size={15} className="text-primary" />
                <span>Create service page</span>
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/media"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
              >
                <Image size={15} className="text-primary" />
                <span>Upload media asset</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Navigation" className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <Command.Item
                onSelect={() => run(() => setLocation("/admin"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <LayoutDashboard size={15} /> Dashboard
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/leads"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Inbox size={15} /> Contact Leads
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/home"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Home size={15} /> Home Page Manager
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/services"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Wrench size={15} /> Services
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/projects"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Briefcase size={15} /> Portfolio & Case Studies
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/posts"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <FileText size={15} /> Blog Posts
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/testimonials"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Quote size={15} /> Client Testimonials
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/team"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Users size={15} /> Team Members
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/jobs"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <BriefcaseBusiness size={15} /> Careers & Postings
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Administration & Tools" className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/users"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Shield size={15} /> Users & Permissions
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/redirects"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <RefreshCw size={15} /> 301 URL Redirects
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/audit-logs"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <History size={15} /> Audit Log Explorer
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setLocation("/admin/settings"))}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Settings size={15} /> Settings (General, Menus, SMTP)
                </span>
                <ArrowRight size={13} className="text-muted-foreground opacity-60" />
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Appearance" className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              <Command.Item
                onSelect={() => run(() => setTheme("light"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <Sun size={15} /> Switch to Light theme
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => setTheme("dark"))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-muted transition-colors"
              >
                <Moon size={15} /> Switch to Dark theme
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-[11px] text-muted-foreground">
            <span>Use ↑↓ to navigate</span>
            <span>Press Enter to select</span>
          </div>
        </Command>
      </div>
      <div className="fixed inset-0 -z-10" onClick={() => onOpenChange(false)} />
    </div>
  );
}

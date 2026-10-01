import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Plus, Wrench, Image, FileText, Quote, Briefcase, Inbox,
  TrendingUp, Users, Shield, RefreshCw, CheckCircle2, ArrowUpRight,
  Sparkles, Layers
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, Cell
} from "recharts";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";

type Dashboard = {
  cards: {
    leadsToday: number;
    newLeads: number;
    services: number;
    publishedServices: number;
    media: number;
    projects: number;
    activeProjects: number;
    posts: number;
    publishedPosts: number;
    pendingTestimonials: number;
    testimonials: number;
    team: number;
  };
  leadsTrend?: { date: string; count: number }[];
  leadsByStatus?: Record<string, number>;
  activity: {
    _id: string;
    action: string;
    actorEmail: string | null;
    success: boolean;
    createdAt: string;
  }[];
};

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  badge,
  href,
}: {
  label: string;
  value: number | null;
  hint?: string;
  icon: any;
  badge?: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors group">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
          <Icon size={16} />
        </div>
      </div>
      <div className="text-3xl font-bold mt-2 font-display text-foreground tracking-tight">
        {value ?? "—"}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>{value === null ? "Loading..." : hint}</span>
        {badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {badge}
          </span>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6",
  contacted: "#f59e0b",
  qualified: "#10b981",
  converted: "#8b5cf6",
  closed: "#6b7280",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api<{ data: Dashboard }>("/api/v1/admin/dashboard").then((r) => r.data),
    refetchInterval: 30_000,
  });

  // Default trend data if none exists yet
  const chartTrend = data?.leadsTrend && data.leadsTrend.length > 0
    ? data.leadsTrend.map((d) => ({
        date: d.date.slice(5), // "MM-DD"
        leads: d.count,
      }))
    : [
        { date: "Day 1", leads: 0 },
        { date: "Day 2", leads: 1 },
        { date: "Day 3", leads: 0 },
        { date: "Day 4", leads: 2 },
        { date: "Day 5", leads: 1 },
        { date: "Day 6", leads: 3 },
        { date: "Today", leads: data?.cards.leadsToday ?? 0 },
      ];

  const statusData = [
    { name: "New", count: data?.leadsByStatus?.new ?? data?.cards.newLeads ?? 0, color: "#3b82f6" },
    { name: "Contacted", count: data?.leadsByStatus?.contacted ?? 0, color: "#f59e0b" },
    { name: "Qualified", count: data?.leadsByStatus?.qualified ?? 0, color: "#10b981" },
    { name: "Converted", count: data?.leadsByStatus?.converted ?? 0, color: "#8b5cf6" },
    { name: "Closed", count: data?.leadsByStatus?.closed ?? 0, color: "#6b7280" },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      actions={
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Logged in as <strong className="text-foreground">{user?.email}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            {user?.role}
          </span>
        </div>
      }
    >
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {(error as Error).message}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <KpiCard
          label="Leads Today"
          value={isLoading ? null : data?.cards.leadsToday ?? 0}
          hint={`${data?.cards.newLeads ?? 0} unactioned`}
          icon={Inbox}
          badge={data?.cards.newLeads ? `${data.cards.newLeads} new` : undefined}
          href="/admin/leads"
        />
        <KpiCard
          label="Blog Posts"
          value={isLoading ? null : data?.cards.posts ?? 0}
          hint={`${data?.cards.publishedPosts ?? 0} published`}
          icon={FileText}
          href="/admin/posts"
        />
        <KpiCard
          label="Projects"
          value={isLoading ? null : data?.cards.projects ?? 0}
          hint={`${data?.cards.activeProjects ?? 0} published`}
          icon={Briefcase}
          href="/admin/projects"
        />
        <KpiCard
          label="Testimonials"
          value={isLoading ? null : data?.cards.testimonials ?? 0}
          hint={`${data?.cards.pendingTestimonials ?? 0} pending review`}
          icon={Quote}
          badge={data?.cards.pendingTestimonials ? "Review needed" : undefined}
          href="/admin/testimonials"
        />
        <KpiCard
          label="Services"
          value={isLoading ? null : data?.cards.services ?? 0}
          hint={`${data?.cards.publishedServices ?? 0} live on site`}
          icon={Wrench}
          href="/admin/services"
        />
        <KpiCard
          label="Media Assets"
          value={isLoading ? null : data?.cards.media ?? 0}
          hint="in library"
          icon={Image}
          href="/admin/media"
        />
      </div>

      {/* Analytics Visuals Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Trend Area Chart */}
        <section className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" /> Lead Inquiries Velocity
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                New contact submissions over the last 14 days
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              View Pipeline <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#leadGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Lead Status Funnel Breakdown */}
        <section className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-sm flex items-center gap-2 mb-1">
              <Layers size={16} className="text-primary" /> Pipeline Stages
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Current lead statuses across the funnel
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} width={70} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Action required</span>
            <span className="font-semibold text-foreground">
              {data?.cards.newLeads ?? 0} awaiting first reply
            </span>
          </div>
        </section>
      </div>

      {/* Shortcuts & Activity Feed Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions Shortcuts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm flex items-center gap-1.5">
              <Sparkles size={15} className="text-primary" /> Quick Actions
            </h2>
            <span className="text-[11px] text-muted-foreground">Press ⌘K anytime</span>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            {[
              { label: "Write blog post", href: "/admin/posts/new", icon: FileText },
              { label: "Add project case study", href: "/admin/projects/new", icon: Briefcase },
              { label: "Create service", href: "/admin/services/new", icon: Wrench },
              { label: "Upload media", href: "/admin/media", icon: Image },
              { label: "Manage users & roles", href: "/admin/users", icon: Shield },
              { label: "Configure 301 redirects", href: "/admin/redirects", icon: RefreshCw },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <s.icon size={15} className="text-primary/80 group-hover:text-primary" />
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
                <Plus size={14} className="text-muted-foreground opacity-60 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>

        {/* Activity feed */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm">Recent Audit Activity</h2>
            <Link href="/admin/audit-logs" className="text-xs text-primary font-medium hover:underline">
              View all audit logs →
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            {isLoading && <p className="px-4 py-8 text-center text-muted-foreground text-sm">Loading activity…</p>}
            {!isLoading && !data?.activity.length && (
              <p className="px-4 py-8 text-center text-muted-foreground text-sm">No activity recorded yet.</p>
            )}
            {data?.activity.map((a) => (
              <div key={a._id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    a.success ? "bg-primary" : "bg-destructive"
                  }`}
                />
                <code className="text-xs font-mono font-medium text-foreground">{a.action}</code>
                <span className="text-xs text-muted-foreground truncate">
                  {a.actorEmail ?? "system"}
                </span>
                <span className="ml-auto text-xs text-muted-foreground shrink-0 font-mono">
                  {timeAgo(a.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

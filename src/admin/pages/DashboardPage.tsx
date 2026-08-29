import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Wrench, Image, FileText, Quote, Briefcase, Inbox } from "lucide-react";
import { api } from "../lib/api";
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
  activity: {
    _id: string;
    action: string;
    actorEmail: string | null;
    success: boolean;
    createdAt: string;
  }[];
};

function Card({
  label, value, hint, icon: Icon,
}: { label: string; value: number | null; hint?: string; icon: typeof Wrench }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon size={16} className="text-muted-foreground/60" />
      </div>
      {/* null = module not built yet; show an em-dash, never a fake 0. */}
      <div className="text-3xl font-bold mt-2 font-display">{value ?? "—"}</div>
      <div className="text-xs text-muted-foreground mt-1">
        {value === null ? "Module not built yet" : hint}
      </div>
    </div>
  );
}

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api<{ data: Dashboard }>("/api/v1/admin/dashboard").then((r) => r.data),
  });

  return (
    <AdminLayout title="Dashboard">
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {(error as Error).message}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card
          label="New leads today"
          value={isLoading ? null : data?.cards.leadsToday ?? 0}
          hint={`${data?.cards.newLeads ?? 0} unactioned`}
          icon={Inbox}
        />
        <Card
          label="Blog posts"
          value={isLoading ? null : data?.cards.posts ?? 0}
          hint={`${data?.cards.publishedPosts ?? 0} published`}
          icon={FileText}
        />
        <Card
          label="Projects"
          value={isLoading ? null : data?.cards.projects ?? 0}
          hint={`${data?.cards.activeProjects ?? 0} active`}
          icon={Briefcase}
        />
        <Card
          label="Pending testimonials"
          value={isLoading ? null : data?.cards.pendingTestimonials ?? 0}
          hint={`of ${data?.cards.testimonials ?? 0} total`}
          icon={Quote}
        />
        <Card
          label="Services"
          value={isLoading ? null : data?.cards.services ?? 0}
          hint={`${data?.cards.publishedServices ?? 0} published`}
          icon={Wrench}
        />
        <Card
          label="Media files"
          value={isLoading ? null : data?.cards.media ?? 0}
          hint="in library"
          icon={Image}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Add-new shortcuts */}
        <section>
          <h2 className="font-semibold mb-3">Add new</h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {[
              { label: "Service", href: "/admin/services/new" },
              { label: "Project", href: "/admin/projects/new" },
              { label: "Blog post", href: "/admin/posts/new" },
              { label: "Testimonial", href: "/admin/testimonials/new" },
              { label: "Team member", href: "/admin/team/new" },
              { label: "Media upload", href: "/admin/media" },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <Plus size={15} className="text-primary" />
                <span className="text-sm font-medium">{s.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Activity feed */}
        <section className="lg:col-span-2">
          <h2 className="font-semibold mb-3">Recent activity</h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {isLoading && <p className="px-4 py-8 text-center text-muted-foreground text-sm">Loading…</p>}
            {!isLoading && !data?.activity.length && (
              <p className="px-4 py-8 text-center text-muted-foreground text-sm">No activity yet.</p>
            )}
            {data?.activity.map((a) => (
              <div key={a._id} className="flex items-center gap-3 px-4 py-3">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    a.success ? "bg-primary" : "bg-destructive"
                  }`}
                />
                <code className="text-xs font-mono text-foreground/80">{a.action}</code>
                <span className="text-xs text-muted-foreground truncate">
                  {a.actorEmail ?? "system"}
                </span>
                <span className="ml-auto text-xs text-muted-foreground shrink-0">
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

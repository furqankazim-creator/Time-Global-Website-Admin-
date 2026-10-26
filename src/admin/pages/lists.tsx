import { useState } from "react";
import { Link } from "wouter";
import { Star } from "lucide-react";
import { ResourceList, StatusPill } from "../components/ResourceList";
import type { Column } from "../components/DataTable";

const Title = ({ href, main, sub }: { href: string; main: string; sub?: string }) => (
  <div className="min-w-0">
    <Link href={href} className="font-medium hover:text-primary">
      {main}
    </Link>
    {sub && <div className="text-xs text-muted-foreground font-mono truncate">{sub}</div>}
  </div>
);

const filterCls =
  "h-9 px-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary";

/* ----------------------------- Case Studies --------------------------- */
type Project = {
  _id: string; title: string; slug: string; client: string;
  category: string; status: string; featured: boolean;
};

export function ProjectsListPage() {
  const [category, setCategory] = useState("");

  const columns: Column<Project>[] = [
    { key: "title", header: "Case Study", sortable: true, render: (r) => <Title href={`/admin/projects/${r._id}`} main={r.title} sub={`/${r.slug}`} /> },
    { key: "client", header: "Client", sortable: true, render: (r) => r.client || <span className="text-muted-foreground/40">—</span> },
    { key: "category", header: "Category", render: (r) => <span className="text-xs capitalize">{r.category.replace("-", " ")}</span> },
    { key: "status", header: "Status", sortable: true, render: (r) => <StatusPill status={r.status} /> },
    { key: "featured", header: "Featured", render: (r) => (r.featured ? <Star size={15} className="fill-amber-400 text-amber-400" /> : <span className="text-muted-foreground/40">—</span>) },
  ];

  return (
    <ResourceList<Project>
      title="Case Studies"
      resource="projects"
      newLabel="New Case Study"
      defaultSort="order"
      columns={columns}
      labelOf={(r) => r.title}
      emptyMessage="No case studies yet."
      extraParams={{ category }}
      filters={
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={filterCls}>
          <option value="">All categories</option>
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="custom-software">Custom software</option>
          <option value="ecommerce">E-commerce</option>
        </select>
      }
    />
  );
}

/* -------------------------------- Blog -------------------------------- */
type Post = {
  _id: string; title: string; slug: string; status: string;
  publishedAt: string | null; category: { name: string } | null;
};

export function PostsListPage() {
  const [status, setStatus] = useState("");

  const columns: Column<Post>[] = [
    { key: "title", header: "Post", sortable: true, render: (r) => <Title href={`/admin/posts/${r._id}`} main={r.title} sub={`/${r.slug}`} /> },
    { key: "category", header: "Category", render: (r) => r.category?.name ?? <span className="text-muted-foreground/40">—</span> },
    { key: "status", header: "Status", sortable: true, render: (r) => <StatusPill status={r.status} /> },
    {
      key: "publishedAt",
      header: "Published",
      sortable: true,
      render: (r) =>
        r.publishedAt ? (
          <span className="text-xs text-muted-foreground">{new Date(r.publishedAt).toLocaleDateString()}</span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        ),
    },
  ];

  return (
    <ResourceList<Post>
      title="Blog"
      resource="posts"
      newLabel="New post"
      defaultSort="-publishedAt"
      columns={columns}
      labelOf={(r) => r.title}
      emptyMessage="No posts yet."
      extraParams={{ status }}
      filters={
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={filterCls}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="archived">Archived</option>
        </select>
      }
    />
  );
}

/* ----------------------------- Testimonials --------------------------- */
type Testimonial = {
  _id: string; clientName: string; company: string;
  rating: number; approvalStatus: string; featured: boolean;
};

export function TestimonialsListPage() {
  const [approvalStatus, setApprovalStatus] = useState("");

  const columns: Column<Testimonial>[] = [
    { key: "clientName", header: "Client", sortable: true, render: (r) => <Title href={`/admin/testimonials/${r._id}`} main={r.clientName} sub={r.company} /> },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (r) => (
        <span className="flex gap-0.5">
          {Array.from({ length: r.rating }).map((_, i) => (
            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
          ))}
        </span>
      ),
    },
    { key: "approvalStatus", header: "Approval", render: (r) => <StatusPill status={r.approvalStatus} /> },
    { key: "featured", header: "Featured", render: (r) => (r.featured ? <Star size={15} className="fill-amber-400 text-amber-400" /> : <span className="text-muted-foreground/40">—</span>) },
  ];

  return (
    <ResourceList<Testimonial>
      title="Testimonials"
      resource="testimonials"
      newLabel="New testimonial"
      defaultSort="order"
      columns={columns}
      labelOf={(r) => r.clientName}
      emptyMessage="No testimonials yet."
      extraParams={{ approvalStatus }}
      filters={
        <select value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)} className={filterCls}>
          <option value="">All approvals</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      }
    />
  );
}

/* -------------------------------- Team -------------------------------- */
type Team = { _id: string; name: string; role: string; department: string; status: string };

export function TeamListPage() {
  const [department, setDepartment] = useState("");

  const columns: Column<Team>[] = [
    { key: "name", header: "Name", sortable: true, render: (r) => <Title href={`/admin/team/${r._id}`} main={r.name} sub={r.role} /> },
    { key: "department", header: "Department", sortable: true, render: (r) => <span className="text-xs capitalize">{r.department}</span> },
    { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <ResourceList<Team>
      title="Team"
      resource="team"
      newLabel="New member"
      defaultSort="order"
      columns={columns}
      labelOf={(r) => r.name}
      emptyMessage="No team members yet."
      extraParams={{ department }}
      filters={
        <select value={department} onChange={(e) => setDepartment(e.target.value)} className={filterCls}>
          <option value="">All departments</option>
          <option value="design">Design</option>
          <option value="development">Development</option>
          <option value="marketing">Marketing</option>
          <option value="management">Management</option>
        </select>
      }
    />
  );
}

/* -------------------------------- Stories ----------------------------- */
type StoryItem = {
  _id: string;
  title: string;
  slug: string;
  type: "success" | "lesson";
  tag: string;
  impact?: string;
  lesson?: string;
  order: number;
  status: string;
  imageUrl?: string;
  image?: { url: string; alt?: string };
};

export function StoriesListPage() {
  const [type, setType] = useState("");

  const columns: Column<StoryItem>[] = [
    {
      key: "title",
      header: "Story",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          {(r.imageUrl || r.image?.url) && (
            <img
              src={r.imageUrl || r.image?.url}
              alt={r.title}
              className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
            />
          )}
          <Title href={`/admin/stories/${r._id}`} main={r.title} sub={`/${r.slug}`} />
        </div>
      ),
    },
    {
      key: "type",
      header: "Category",
      render: (r) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-mono ${
            r.type === "lesson"
              ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
              : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {r.type === "lesson" ? "Hard Lesson" : "Success Story"}
        </span>
      ),
    },
    {
      key: "tag",
      header: "Tag",
      render: (r) => <span className="text-xs text-muted-foreground">{r.tag || "—"}</span>,
    },
    {
      key: "impact",
      header: "Impact / Key Lesson",
      render: (r) => (
        <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
          {r.impact || r.lesson || "—"}
        </span>
      ),
    },
    {
      key: "order",
      header: "Order",
      sortable: true,
      render: (r) => <span className="text-xs font-mono">{r.order ?? 0}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (r) => <StatusPill status={r.status} />,
    },
  ];

  return (
    <ResourceList<StoryItem>
      title="Stories (Wins & Lessons)"
      resource="stories"
      newLabel="New Story"
      defaultSort="order"
      columns={columns}
      labelOf={(r) => r.title}
      emptyMessage="No stories yet."
      extraParams={{ type }}
      filters={
        <select value={type} onChange={(e) => setType(e.target.value)} className={filterCls}>
          <option value="">All story types</option>
          <option value="success">Success Stories (Wins)</option>
          <option value="lesson">Hard Lessons (Failures)</option>
        </select>
      }
    />
  );
}

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";
import { DataTable, type Column, type Meta } from "../components/DataTable";

type Service = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "scheduled" | "archived";
  featured: boolean;
  order: number;
  updatedAt: string;
};

const STATUS_STYLES: Record<Service["status"], string> = {
  published: "bg-primary/15 text-primary",
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  archived: "bg-muted text-muted-foreground/60",
};

export default function ServicesListPage() {
  const { canEdit } = useAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("order");
  const [status, setStatus] = useState("");

  const params = new URLSearchParams({ page: String(page), limit: "20", sort });
  if (q) params.set("q", q);
  if (status) params.set("status", status);

  const { data, isLoading, error } = useQuery({
    queryKey: ["services", page, q, sort, status],
    queryFn: () => api<{ data: Service[]; meta: Meta }>(`/api/v1/admin/services?${params}`),
  });

  const del = useMutation({
    mutationFn: (id: string) => api(`/api/v1/admin/services/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
    meta: { success: "Service deleted" },
  });

  const columns: Column<Service>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (s) => (
        <div className="min-w-0">
          <Link href={`/admin/services/${s._id}`} className="font-medium hover:text-primary">
            {s.title}
          </Link>
          <div className="text-xs text-muted-foreground font-mono truncate">/{s.slug}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (s) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[s.status]}`}>
          {s.status}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (s) =>
        s.featured ? (
          <Star size={15} className="fill-amber-400 text-amber-400" />
        ) : (
          <span className="text-muted-foreground/40">—</span>
        ),
    },
    { key: "order", header: "Order", sortable: true, render: (s) => <span className="font-mono text-xs">{s.order}</span> },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/services/${s._id}`}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
            aria-label={`Edit ${s.title}`}
          >
            <Pencil size={15} />
          </Link>
          {canEdit && (
            <button
              onClick={() => {
                // Soft delete — recoverable, so a plain confirm is proportionate.
                if (confirm(`Move "${s.title}" to trash?`)) del.mutate(s._id);
              }}
              disabled={del.isPending}
              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-40"
              aria-label={`Delete ${s.title}`}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Services"
      actions={
        canEdit && (
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
          >
            <Plus size={15} /> New service
          </Link>
        )
      }
    >
      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        meta={data?.meta}
        loading={isLoading}
        error={error ? (error as Error).message : null}
        search={q}
        onSearch={(v) => {
          setQ(v);
          setPage(1); // a new search must reset to page 1, or you land out of range
        }}
        sort={sort}
        onSort={setSort}
        onPage={setPage}
        rowKey={(s) => s._id}
        emptyMessage="No services yet. Create your first one."
        toolbar={
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
        }
      />
    </AdminLayout>
  );
}

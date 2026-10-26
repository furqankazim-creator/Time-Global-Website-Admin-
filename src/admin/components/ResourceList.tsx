import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Pencil, Trash2, RotateCcw, Archive } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "./AdminLayout";
import { DataTable, type Column, type Meta } from "./DataTable";

type Props<T> = {
  title: string;
  /** API segment, e.g. "projects" — also the base for edit links. */
  resource: string;
  columns: Column<T>[];
  /** Label shown in the delete confirm + row actions. */
  labelOf: (row: T) => string;
  emptyMessage?: string;
  defaultSort?: string;
  filters?: ReactNode;
  /** Extra query params (from the `filters` controls). */
  extraParams?: Record<string, string>;
  newLabel?: string;
};

/**
 * Generic list screen. Every content module shares search, sort, pagination,
 * delete, soft-delete trash toggle, and RBAC behaviour.
 */
export function ResourceList<T extends { _id: string; deletedAt?: string | null }>({
  title, resource, columns, labelOf, emptyMessage, defaultSort = "-createdAt",
  filters, extraParams, newLabel = "New",
}: Props<T>) {
  const { canEdit } = useAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(defaultSort);
  const [showTrash, setShowTrash] = useState(false);

  const params = new URLSearchParams({
    page: String(page),
    limit: "20",
    sort,
    includeDeleted: String(showTrash),
  });
  if (q) params.set("q", q);
  for (const [k, v] of Object.entries(extraParams ?? {})) if (v) params.set(k, v);

  const { data, isLoading, error } = useQuery({
    queryKey: [resource, page, q, sort, showTrash, extraParams],
    queryFn: () => api<{ data: T[]; meta: Meta }>(`/api/v1/admin/${resource}?${params}`),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: [resource] });
    qc.invalidateQueries({ queryKey: ["cms"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
    try {
      localStorage.setItem("tg_cms_updated_at", String(Date.now()));
    } catch {}
  };

  const del = useMutation({
    mutationFn: (id: string) => api(`/api/v1/admin/${resource}/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
    meta: { success: "Moved to trash" },
  });

  const restore = useMutation({
    mutationFn: (id: string) => api(`/api/v1/admin/${resource}/${id}/restore`, { method: "POST" }),
    onSuccess: invalidate,
    meta: { success: "Restored from trash" },
  });

  // Filter rows if backend returned mixed deleted items when showTrash is true
  const rows = (data?.data ?? []).filter((r) =>
    showTrash ? r.deletedAt != null : r.deletedAt == null
  );

  const withActions: Column<T>[] = [
    ...columns,
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          {showTrash ? (
            canEdit && (
              <button
                onClick={() => confirm(`Restore "${labelOf(row)}"?`) && restore.mutate(row._id)}
                disabled={restore.isPending}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40"
                title={`Restore ${labelOf(row)}`}
              >
                <RotateCcw size={13} /> Restore
              </button>
            )
          ) : (
            <>
              <Link
                href={`/admin/${resource}/${row._id}`}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                aria-label={`Edit ${labelOf(row)}`}
              >
                <Pencil size={15} />
              </Link>
              {canEdit && (
                <button
                  onClick={() => confirm(`Move "${labelOf(row)}" to trash?`) && del.mutate(row._id)}
                  disabled={del.isPending}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-40"
                  aria-label={`Delete ${labelOf(row)}`}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title={title}
      actions={
        canEdit && (
          <Link
            href={`/admin/${resource}/new`}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
          >
            <Plus size={15} /> {newLabel}
          </Link>
        )
      }
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg text-xs font-medium">
          <button
            onClick={() => {
              setShowTrash(false);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              !showTrash ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => {
              setShowTrash(true);
              setPage(1);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              showTrash ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Archive size={13} /> Trash / Soft Deleted
          </button>
        </div>
      </div>

      <DataTable
        columns={withActions}
        rows={rows}
        meta={data?.meta}
        loading={isLoading}
        error={error ? (error as Error).message : null}
        search={q}
        onSearch={(v) => {
          setQ(v);
          setPage(1);
        }}
        sort={sort}
        onSort={setSort}
        onPage={setPage}
        rowKey={(r) => r._id}
        emptyMessage={showTrash ? "Trash is empty." : emptyMessage}
        toolbar={filters}
      />
    </AdminLayout>
  );
}

/** Shared status pill. */
export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-primary/15 text-primary",
    approved: "bg-primary/15 text-primary",
    draft: "bg-muted text-muted-foreground",
    pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    scheduled: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    rejected: "bg-destructive/15 text-destructive",
    archived: "bg-muted text-muted-foreground/60",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
        styles[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

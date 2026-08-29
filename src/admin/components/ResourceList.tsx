import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
 * delete and RBAC behaviour — so they can't drift apart.
 */
export function ResourceList<T extends { _id: string }>({
  title, resource, columns, labelOf, emptyMessage, defaultSort = "-createdAt",
  filters, extraParams, newLabel = "New",
}: Props<T>) {
  const { canEdit } = useAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(defaultSort);

  const params = new URLSearchParams({ page: String(page), limit: "20", sort });
  if (q) params.set("q", q);
  for (const [k, v] of Object.entries(extraParams ?? {})) if (v) params.set(k, v);

  const { data, isLoading, error } = useQuery({
    queryKey: [resource, page, q, sort, extraParams],
    queryFn: () => api<{ data: T[]; meta: Meta }>(`/api/v1/admin/${resource}?${params}`),
  });

  const del = useMutation({
    mutationFn: (id: string) => api(`/api/v1/admin/${resource}/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    meta: { success: "Deleted" },
  });

  const withActions: Column<T>[] = [
    ...columns,
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
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
      <DataTable
        columns={withActions}
        rows={data?.data ?? []}
        meta={data?.meta}
        loading={isLoading}
        error={error ? (error as Error).message : null}
        search={q}
        onSearch={(v) => {
          setQ(v);
          setPage(1); // a new search must reset the page or you land out of range
        }}
        sort={sort}
        onSort={setSort}
        onPage={setPage}
        rowKey={(r) => r._id}
        emptyMessage={emptyMessage}
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

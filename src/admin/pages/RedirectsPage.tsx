import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Plus, ExternalLink, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";
import { DataTable, type Column, type Meta } from "../components/DataTable";

type RedirectItem = {
  _id: string;
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302;
  reason: string;
  hits: number;
  createdAt: string;
};

export default function RedirectsPage() {
  const { canEdit } = useAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [createOpen, setCreateOpen] = useState(false);

  // Form states
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [statusCode, setStatusCode] = useState<"301" | "302">("301");
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const params = new URLSearchParams({ page: String(page), limit: "20", sort });
  if (q) params.set("q", q);

  const { data, isLoading, error } = useQuery({
    queryKey: ["redirects", page, q, sort],
    queryFn: () => api<{ data: RedirectItem[]; meta: Meta }>(`/api/v1/admin/redirects?${params}`),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["redirects"] });

  const createMut = useMutation({
    mutationFn: (body: any) => api("/api/v1/admin/redirects", { method: "POST", body }),
    onSuccess: () => {
      invalidate();
      setCreateOpen(false);
      setFromPath("");
      setToPath("");
      setReason("");
      setErrorMsg("");
    },
    onError: (e: any) => setErrorMsg(e.message || "Failed to create redirect"),
    meta: { success: "Redirect rule created" },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api(`/api/v1/admin/redirects/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
    meta: { success: "Redirect deleted" },
  });

  const columns: Column<RedirectItem>[] = [
    {
      key: "fromPath",
      header: "From URL",
      sortable: true,
      render: (r) => (
        <div className="font-mono text-xs font-semibold text-foreground flex items-center gap-1.5">
          <span>{r.fromPath}</span>
          <a
            href={r.fromPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/60 hover:text-primary"
            title="Test source link"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      ),
    },
    {
      key: "toPath",
      header: "Destination URL",
      render: (r) => (
        <div className="flex items-center gap-2">
          <ArrowRight size={13} className="text-muted-foreground" />
          <span className="font-mono text-xs text-foreground/90">{r.toPath}</span>
        </div>
      ),
    },
    {
      key: "statusCode",
      header: "Type",
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
            r.statusCode === 301
              ? "bg-primary/15 text-primary border border-primary/20"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
          }`}
        >
          {r.statusCode} {r.statusCode === 301 ? "Permanent" : "Temporary"}
        </span>
      ),
    },
    {
      key: "hits",
      header: "Hits",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs text-muted-foreground font-semibold">
          {r.hits.toLocaleString()}
        </span>
      ),
    },
    {
      key: "reason",
      header: "Reason / Notes",
      render: (r) => (
        <span className="text-xs text-muted-foreground max-w-xs truncate block" title={r.reason}>
          {r.reason || "Manual"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (r) =>
        canEdit && (
          <button
            onClick={() => confirm(`Delete redirect "${r.fromPath}"?`) && deleteMut.mutate(r._id)}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            title="Delete rule"
          >
            <Trash2 size={15} />
          </button>
        ),
    },
  ];

  return (
    <AdminLayout
      title="301 URL Redirects"
      actions={
        canEdit && (
          <button
            onClick={() => {
              setErrorMsg("");
              setCreateOpen(true);
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={15} /> Add Redirect
          </button>
        )
      }
    >
      <div className="mb-4">
        <DataTable
          columns={columns}
          rows={data?.data ?? []}
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
          emptyMessage="No redirect rules configured."
        />
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
              <RefreshCw size={18} className="text-primary" /> New Redirect Rule
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Forward legacy URLs to protect search engine rankings and fix inbound broken links.
            </p>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {errorMsg}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMut.mutate({
                  fromPath: fromPath.startsWith("/") ? fromPath : `/${fromPath}`,
                  toPath: toPath.startsWith("/") || toPath.startsWith("http") ? toPath : `/${toPath}`,
                  statusCode: Number(statusCode),
                  reason,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold mb-1">From Path (must start with /)</label>
                <input
                  required
                  placeholder="/old-service-link"
                  value={fromPath}
                  onChange={(e) => setFromPath(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">To Destination Path or URL</label>
                <input
                  required
                  placeholder="/services/new-service-link"
                  value={toPath}
                  onChange={(e) => setToPath(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Redirect Type</label>
                  <select
                    value={statusCode}
                    onChange={(e) => setStatusCode(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="301">301 - Permanent (Transfers SEO)</option>
                    <option value="302">302 - Temporary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Reason / Note</label>
                  <input
                    placeholder="e.g. Migration from old site"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMut.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {createMut.isPending ? "Creating..." : "Save Redirect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

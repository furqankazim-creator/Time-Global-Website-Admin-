import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { History, Shield, CheckCircle, XCircle, Info, X } from "lucide-react";
import { api } from "../lib/api";
import { AdminLayout } from "../components/AdminLayout";
import { DataTable, type Column, type Meta } from "../components/DataTable";

type AuditEntry = {
  _id: string;
  actor: { name: string; email: string } | null;
  actorEmail: string | null;
  action: string;
  model: string | null;
  docId: string | null;
  diff: any;
  ip: string | null;
  userAgent: string | null;
  success: boolean;
  createdAt: string;
};

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [modelFilter, setModelFilter] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const params = new URLSearchParams({ page: String(page), limit: "30", sort });
  if (q) params.set("q", q);
  if (modelFilter) params.set("model", modelFilter);

  const { data, isLoading, error } = useQuery({
    queryKey: ["audit-logs", page, q, modelFilter, sort],
    queryFn: () => api<{ data: AuditEntry[]; meta: Meta }>(`/api/v1/admin/audit-logs?${params}`),
  });

  const columns: Column<AuditEntry>[] = [
    {
      key: "action",
      header: "Action",
      sortable: true,
      render: (a) => (
        <div className="flex items-center gap-2">
          {a.success ? (
            <CheckCircle size={14} className="text-primary shrink-0" />
          ) : (
            <XCircle size={14} className="text-destructive shrink-0" />
          )}
          <span className="font-mono text-xs font-semibold text-foreground">{a.action}</span>
        </div>
      ),
    },
    {
      key: "actorEmail",
      header: "Actor",
      render: (a) => (
        <span className="text-xs text-muted-foreground">
          {a.actor?.name ? `${a.actor.name} (${a.actorEmail})` : a.actorEmail ?? "system"}
        </span>
      ),
    },
    {
      key: "model",
      header: "Resource",
      render: (a) =>
        a.model ? (
          <span className="px-2 py-0.5 rounded bg-muted text-[11px] font-mono text-foreground capitalize">
            {a.model}
          </span>
        ) : (
          <span className="text-muted-foreground/40 text-xs">—</span>
        ),
    },
    {
      key: "ip",
      header: "IP Address",
      render: (a) => <span className="font-mono text-xs text-muted-foreground">{a.ip || "—"}</span>,
    },
    {
      key: "createdAt",
      header: "Timestamp",
      sortable: true,
      render: (a) => (
        <span className="text-xs text-muted-foreground">
          {new Date(a.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (a) => (
        <button
          onClick={() => setSelectedEntry(a)}
          className="px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <AdminLayout title="Audit Log Explorer">
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
          rowKey={(a) => a._id}
          emptyMessage="No audit records found."
          toolbar={
            <select
              value={modelFilter}
              onChange={(e) => {
                setModelFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary capitalize"
            >
              <option value="">All Resources</option>
              <option value="auth">Auth & Login</option>
              <option value="post">Blog Posts</option>
              <option value="project">Projects</option>
              <option value="service">Services</option>
              <option value="lead">Leads</option>
              <option value="user">Users</option>
              <option value="settings">Settings</option>
            </select>
          }
        />
      </div>

      {/* Details Drawer */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSelectedEntry(null)} />
          <aside className="relative w-full max-w-lg bg-card border-l border-border h-full overflow-y-auto p-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <History size={18} className="text-primary" />
                <h3 className="font-bold text-base">Audit Event Details</h3>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 py-4 flex-1 overflow-y-auto text-sm">
              <div className="grid grid-cols-2 gap-3 text-xs bg-muted/30 p-3 rounded-lg border border-border">
                <div>
                  <span className="text-muted-foreground block">Action:</span>
                  <span className="font-mono font-semibold text-foreground">{selectedEntry.action}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Status:</span>
                  <span className={selectedEntry.success ? "text-primary font-bold" : "text-destructive font-bold"}>
                    {selectedEntry.success ? "SUCCESS" : "FAILED"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Actor:</span>
                  <span className="font-semibold text-foreground">{selectedEntry.actorEmail || "system"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Timestamp:</span>
                  <span>{new Date(selectedEntry.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Client IP:</span>
                  <span className="font-mono">{selectedEntry.ip || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Resource:</span>
                  <span className="font-mono">{selectedEntry.model || "None"}</span>
                </div>
              </div>

              {selectedEntry.userAgent && (
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">User Agent</span>
                  <p className="text-xs font-mono bg-muted p-2 rounded-md break-all border border-border">
                    {selectedEntry.userAgent}
                  </p>
                </div>
              )}

              <div>
                <span className="text-xs text-muted-foreground block mb-1">Payload / Diff Inspection</span>
                <pre className="text-xs font-mono bg-muted/60 p-3 rounded-lg border border-border overflow-x-auto max-h-80">
                  {selectedEntry.diff
                    ? JSON.stringify(selectedEntry.diff, null, 2)
                    : "// No mutation payload diff recorded for this event"}
                </pre>
              </div>
            </div>
          </aside>
        </div>
      )}
    </AdminLayout>
  );
}

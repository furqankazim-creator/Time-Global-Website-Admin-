import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Trash2, ShieldOff, X, Send } from "lucide-react";
import { API_BASE, ApiError, api, getAccessToken } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";
import { DataTable, type Column, type Meta } from "../components/DataTable";
import { StatusPill } from "../components/ResourceList";

const STATUSES = ["new", "contacted", "qualified", "converted", "closed"] as const;

type Note = { body: string; author: { name: string } | null; createdAt: string };
type Lead = {
  _id: string; name: string; email: string; phone: string; company: string;
  industry: string; budgetRange: string; preferredContact: string;
  message: string; sourcePage: string; status: string; createdAt: string;
  notes: Note[]; anonymizedAt: string | null;
};

function Drawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { canEdit } = useAuth();
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: lead } = useQuery({
    queryKey: ["lead", id],
    queryFn: () => api<{ data: Lead }>(`/api/v1/admin/leads/${id}`).then((r) => r.data),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["lead", id] });
    qc.invalidateQueries({ queryKey: ["leads"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const setStatus = useMutation({
    mutationFn: (status: string) => api(`/api/v1/admin/leads/${id}`, { method: "PATCH", body: { status } }),
    onSuccess: invalidate,
    meta: { success: "Status updated" },
  });

  const addNote = useMutation({
    mutationFn: (body: string) => api(`/api/v1/admin/leads/${id}/notes`, { method: "POST", body: { body } }),
    onSuccess: () => {
      setNote("");
      invalidate();
    },
    meta: { success: "Note added" },
  });

  const erase = useMutation({
    mutationFn: () => api(`/api/v1/admin/leads/${id}/pii`, { method: "DELETE" }),
    onSuccess: invalidate,
    onError: (e) => setError(e instanceof ApiError ? e.message : "Erase failed"),
    meta: { success: "Personal data erased" },
  });

  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="relative w-full max-w-md bg-card border-l border-border h-full overflow-y-auto">
        <header className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="font-bold truncate">{lead.name}</h2>
            <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="p-5 space-y-5">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
              {error}
            </div>
          )}
          {lead.anonymizedAt && (
            <div className="px-3 py-2 rounded-lg bg-muted border border-border text-xs text-muted-foreground">
              Personal data was erased on {new Date(lead.anonymizedAt).toLocaleDateString()}.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Phone", lead.phone],
              ["Company", lead.company],
              ["Industry", lead.industry],
              ["Budget", lead.budgetRange],
              ["Preferred contact", lead.preferredContact],
              ["Source", lead.sourcePage],
              ["Received", new Date(lead.createdAt).toLocaleString()],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-muted-foreground">{k}</div>
                <div className="truncate">{v || "—"}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">Message</div>
            <p className="text-sm whitespace-pre-wrap rounded-lg bg-muted/50 border border-border p-3">
              {lead.message || "—"}
            </p>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Status</label>
            <select
              value={lead.status}
              disabled={!canEdit || setStatus.isPending}
              onChange={(e) => setStatus.mutate(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary disabled:opacity-60"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Follow-up notes</div>
            <div className="space-y-2 mb-3">
              {lead.notes.length === 0 && <p className="text-xs text-muted-foreground">No notes yet.</p>}
              {lead.notes.map((n, i) => (
                <div key={i} className="rounded-lg bg-muted/50 border border-border p-3">
                  <p className="text-sm whitespace-pre-wrap">{n.body}</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    {n.author?.name ?? "—"} · {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            {canEdit && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (note.trim()) addNote.mutate(note.trim());
                }}
                className="flex gap-2"
              >
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note…"
                  className="flex-1 h-9 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={!note.trim() || addNote.isPending}
                  className="w-9 h-9 shrink-0 rounded-lg bg-primary text-primary-foreground grid place-items-center disabled:opacity-40"
                  aria-label="Add note"
                >
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>

          {canEdit && !lead.anonymizedAt && (
            <div className="pt-4 border-t border-border">
              <button
                onClick={() =>
                  confirm(
                    "Permanently erase this person's personal data?\n\nThis satisfies a GDPR erasure request and CANNOT be undone."
                  ) && erase.mutate()
                }
                disabled={erase.isPending}
                className="inline-flex items-center gap-1.5 text-xs text-destructive hover:underline disabled:opacity-50"
              >
                <ShieldOff size={13} /> Erase personal data (GDPR)
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function LeadsPage() {
  const { canEdit } = useAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [status, setStatus] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const params = new URLSearchParams({ page: String(page), limit: "20", sort });
  if (q) params.set("q", q);
  if (status) params.set("status", status);

  const { data, isLoading, error } = useQuery({
    queryKey: ["leads", page, q, sort, status],
    queryFn: () => api<{ data: Lead[]; meta: Meta }>(`/api/v1/admin/leads?${params}`),
  });

  const del = useMutation({
    mutationFn: (id: string) => api(`/api/v1/admin/leads/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    meta: { success: "Lead deleted" },
  });

  /**
   * CSV lives behind auth, so a plain <a href> would 401 — the bearer token
   * isn't on a normal navigation. Fetch with the header, then save the blob.
   */
  const exportCsv = async () => {
    const res = await fetch(`${API_BASE}/api/v1/admin/leads/export.csv`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
      credentials: "include",
    });
    if (!res.ok) return alert("Export failed.");
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (l) => (
        <button onClick={() => setOpenId(l._id)} className="text-left min-w-0">
          <div className="font-medium hover:text-primary">{l.name}</div>
          <div className="text-xs text-muted-foreground truncate">{l.email}</div>
        </button>
      ),
    },
    { key: "company", header: "Company", render: (l) => l.company || <span className="text-muted-foreground/40">—</span> },
    { key: "sourcePage", header: "Source", render: (l) => <span className="text-xs font-mono text-muted-foreground">{l.sourcePage || "—"}</span> },
    { key: "status", header: "Status", sortable: true, render: (l) => <StatusPill status={l.status} /> },
    { key: "createdAt", header: "Received", sortable: true, render: (l) => <span className="text-xs text-muted-foreground">{new Date(l.createdAt).toLocaleDateString()}</span> },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (l) =>
        canEdit && (
          <button
            onClick={() => confirm(`Move lead "${l.name}" to trash?`) && del.mutate(l._id)}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            aria-label={`Delete ${l.name}`}
          >
            <Trash2 size={15} />
          </button>
        ),
    },
  ];

  return (
    <AdminLayout
      title="Contact Submissions"
      actions={
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm hover:bg-muted"
        >
          <Download size={15} /> Export CSV
        </button>
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
          setPage(1);
        }}
        sort={sort}
        onSort={setSort}
        onPage={setPage}
        rowKey={(l) => l._id}
        emptyMessage="No submissions yet."
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
            {STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        }
      />

      {openId && <Drawer id={openId} onClose={() => setOpenId(null)} />}
    </AdminLayout>
  );
}

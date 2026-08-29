import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Bell, BellOff, Check, Inbox as InboxIcon } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { AdminLayout } from "../components/AdminLayout";
import { ResourceList, StatusPill } from "../components/ResourceList";
import type { Column } from "../components/DataTable";

/* -------------------------------- Jobs -------------------------------- */

type Job = {
  _id: string; title: string; slug: string; department: string;
  location: string; type: string; status: string; closesAt: string | null;
};

const filterCls =
  "h-9 px-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary";

export function JobsListPage() {
  const [department, setDepartment] = useState("");

  const columns: Column<Job>[] = [
    {
      key: "title", header: "Role", sortable: true,
      render: (j) => (
        <div className="min-w-0">
          <Link href={`/admin/jobs/${j._id}`} className="font-medium hover:text-primary">{j.title}</Link>
          <div className="text-xs text-muted-foreground">{j.location}</div>
        </div>
      ),
    },
    { key: "department", header: "Department", sortable: true, render: (j) => <span className="text-xs capitalize">{j.department}</span> },
    { key: "type", header: "Type", render: (j) => <span className="text-xs capitalize">{j.type.replace("-", " ")}</span> },
    { key: "status", header: "Status", sortable: true, render: (j) => <StatusPill status={j.status} /> },
    {
      key: "closesAt", header: "Closes", sortable: true,
      render: (j) =>
        j.closesAt ? (
          <span className={`text-xs ${new Date(j.closesAt) < new Date() ? "text-destructive" : "text-muted-foreground"}`}>
            {new Date(j.closesAt).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-muted-foreground/40">open</span>
        ),
    },
  ];

  return (
    <ResourceList<Job>
      title="Careers"
      resource="jobs"
      newLabel="New posting"
      defaultSort="order"
      columns={columns}
      labelOf={(j) => j.title}
      emptyMessage="No job postings yet."
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

/* ---------------------------- Notifications ---------------------------- */

type Notification = {
  _id: string; type: string; title: string; body: string;
  link: string; readAt: string | null; createdAt: string;
};

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export function NotificationsPage() {
  const { canEdit } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api<{ data: Notification[]; meta: { unread: number } }>("/api/v1/admin/notifications"),
    refetchInterval: 60_000, // the bell should stay fresh without a reload
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["notifications"] });

  const readOne = useMutation({
    mutationFn: (id: string) => api(`/api/v1/admin/notifications/${id}/read`, { method: "POST" }),
    onSuccess: invalidate,
    meta: { silent: true },
  });
  const readAll = useMutation({
    mutationFn: () => api("/api/v1/admin/notifications/read-all", { method: "POST" }),
    onSuccess: invalidate,
    meta: { success: "All notifications marked read" },
  });

  const unread = data?.meta.unread ?? 0;

  return (
    <AdminLayout
      title="Notifications"
      actions={
        canEdit && unread > 0 && (
          <button
            onClick={() => readAll.mutate()}
            disabled={readAll.isPending}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-50"
          >
            <Check size={15} /> Mark all read
          </button>
        )
      }
    >
      <p className="text-sm text-muted-foreground mb-4">
        {unread > 0 ? `${unread} unread` : "All caught up."}
      </p>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {isLoading && <p className="px-4 py-8 text-center text-muted-foreground text-sm">Loading…</p>}
        {!isLoading && !data?.data.length && (
          <div className="px-4 py-12 text-center">
            <BellOff size={28} className="mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-muted-foreground text-sm">
              Nothing yet. New leads and submissions will appear here.
            </p>
          </div>
        )}
        {data?.data.map((n) => (
          <div
            key={n._id}
            className={`flex items-start gap-3 px-4 py-3.5 ${n.readAt ? "opacity-60" : ""}`}
          >
            <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.readAt ? "bg-muted-foreground/30" : "bg-primary"}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                {n.link ? (
                  <Link href={n.link} className="font-medium text-sm hover:text-primary truncate">
                    {n.title}
                  </Link>
                ) : (
                  <span className="font-medium text-sm truncate">{n.title}</span>
                )}
                <span className="text-[10px] font-mono uppercase text-muted-foreground shrink-0">{n.type}</span>
              </div>
              {n.body && <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.body}</p>}
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{timeAgo(n.createdAt)}</span>
            {canEdit && !n.readAt && (
              <button
                onClick={() => readOne.mutate(n._id)}
                className="p-1 rounded text-muted-foreground hover:text-primary shrink-0"
                title="Mark read"
              >
                <Check size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export { Bell, InboxIcon };
